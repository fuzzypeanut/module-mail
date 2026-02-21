<script lang="ts">
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import { getSDK } from '@fuzzypeanut/sdk';
	import {
		getMailboxes,
		getEmails,
		getThreadEmails,
		markAsRead,
		saveDraft,
		deleteDraft,
		sendEmail,
		clearSession,
		type Mailbox,
		type EmailSummary,
		type EmailFull,
	} from './jmap';

	// ─── State ─────────────────────────────────────────────────────────────────

	type View = 'inbox' | 'thread' | 'compose';

	let mailboxes = $state<Mailbox[]>([]);
	let emails = $state<EmailSummary[]>([]);
	let activeMailboxId = $state<string | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let view = $state<View>('inbox');

	// Thread read view
	let activeThreadId = $state<string | null>(null);
	let threadEmails = $state<EmailFull[]>([]);
	let threadLoading = $state(false);
	let expandedEmailIds = $state<Set<string>>(new Set());

	// Compose
	let composeTo = $state('');
	let composeSubject = $state('');
	let composeBody = $state('');
	let composeSending = $state(false);
	let composeSendError = $state<string | null>(null);
	let attachedFiles = $state<{ id: string; name: string }[]>([]);

	// Draft autosave
	let draftId = $state<string | null>(null);
	let autosaveTimer: ReturnType<typeof setInterval> | null = null;

	// ─── Derived ───────────────────────────────────────────────────────────────

	// Group emails by threadId — first occurrence per thread is the newest (emails sorted desc)
	let threads = $derived((): EmailSummary[] => {
		const seen = new Set<string>();
		const result: EmailSummary[] = [];
		for (const email of emails) {
			if (!seen.has(email.threadId)) {
				seen.add(email.threadId);
				result.push(email);
			}
		}
		return result;
	});

	// Count of emails per threadId in the current mailbox view
	let threadCounts = $derived((): Map<string, number> => {
		const counts = new Map<string, number>();
		for (const email of emails) {
			counts.set(email.threadId, (counts.get(email.threadId) ?? 0) + 1);
		}
		return counts;
	});

	let draftsMailboxId = $derived(
		(): string => mailboxes.find((m) => m.role === 'drafts')?.id ?? ''
	);

	let hasFilesModule = $derived((): boolean =>
		getSDK().registry.getModules().some((m) => m.id === 'fuzzypeanut-files')
	);

	let hasContactsModule = $derived((): boolean =>
		getSDK().registry.getModules().some((m) => m.id === 'fuzzypeanut-contacts')
	);

	let hasCalendarModule = $derived((): boolean =>
		getSDK().registry.getModules().some((m) => m.id === 'fuzzypeanut-calendar')
	);

	// ─── Init ──────────────────────────────────────────────────────────────────

	onMount(async () => {
		await loadMailboxes();

		const sdk = getSDK();

		// Cross-module: open compose pre-filled
		sdk.events.on('mail:compose', (payload) => {
			const p = payload as { to?: string; subject?: string; body?: string } | undefined;
			openCompose(p?.to ?? '', p?.subject ?? '', p?.body ?? '');
		});

		// Cross-module: open compose with file references
		sdk.events.on('mail:compose-with-files', (payload) => {
			const p = payload as { to?: string; subject?: string; fileIds?: string[] } | undefined;
			attachedFiles = (p?.fileIds ?? []).map((id) => ({ id, name: id }));
			openCompose(p?.to ?? '', p?.subject ?? '', '');
		});

		// Cross-module: files picked for attachment
		sdk.events.on('mail:files-picked', (payload) => {
			const p = payload as { files?: { id: string; name: string }[] } | undefined;
			if (p?.files) {
				attachedFiles = [...attachedFiles, ...p.files];
			}
		});

		// Refresh on token change (clears JMAP session cache)
		sdk.auth.onAuthChange(() => {
			clearSession();
		});
	});

	async function loadMailboxes() {
		loading = true;
		error = null;
		try {
			mailboxes = await getMailboxes();
			mailboxes.sort((a, b) => a.sortOrder - b.sortOrder);
			const inbox = mailboxes.find((m) => m.role === 'inbox') ?? mailboxes[0];
			if (inbox) {
				activeMailboxId = inbox.id;
				await loadEmails(inbox.id);
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load mail';
		}
		loading = false;
	}

	async function loadEmails(mailboxId: string) {
		loading = true;
		error = null;
		try {
			emails = await getEmails(mailboxId);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load emails';
		}
		loading = false;
	}

	// ─── Thread view ───────────────────────────────────────────────────────────

	async function openThread(email: EmailSummary) {
		view = 'thread';
		activeThreadId = email.threadId;
		threadEmails = [];
		threadLoading = true;
		expandedEmailIds = new Set();

		try {
			const fetched = await getThreadEmails(email.threadId);
			// Sort oldest-to-newest for reading; pre-expand the last (newest)
			threadEmails = fetched.sort(
				(a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
			);
			if (threadEmails.length) {
				expandedEmailIds = new Set([threadEmails[threadEmails.length - 1].id]);
			}
			// Mark unread emails as read
			const unreadIds = fetched.filter((e) => !e.keywords['$seen']).map((e) => e.id);
			if (unreadIds.length) {
				await markAsRead(unreadIds);
				// Optimistically update local state
				for (const email of emails) {
					if (unreadIds.includes(email.id)) {
						email.keywords = { ...email.keywords, $seen: true };
					}
				}
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load thread';
		}
		threadLoading = false;
	}

	function toggleEmail(id: string) {
		const next = new Set(expandedEmailIds);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		expandedEmailIds = next;
	}

	// ─── Compose ───────────────────────────────────────────────────────────────

	function openCompose(to = '', subject = '', body = '') {
		composeTo = to;
		composeSubject = subject;
		composeBody = body;
		composeSendError = null;
		attachedFiles = [];
		draftId = null;
		view = 'compose';
		startAutosave();
	}

	function discardCompose() {
		stopAutosave();
		if (draftId) {
			deleteDraft(draftId).catch(() => {});
			draftId = null;
		}
		view = 'inbox';
	}

	async function handleSend() {
		if (!composeTo.trim()) {
			composeSendError = 'Please enter a recipient.';
			return;
		}
		composeSending = true;
		composeSendError = null;
		try {
			await sendEmail(composeTo.trim(), composeSubject, composeBody);
			stopAutosave();
			// Delete draft if one was saved
			if (draftId) {
				deleteDraft(draftId).catch(() => {});
				draftId = null;
			}
			view = 'inbox';
			await loadEmails(activeMailboxId!);
		} catch (e) {
			composeSendError = e instanceof Error ? e.message : 'Send failed';
		}
		composeSending = false;
	}

	// ─── Draft autosave ────────────────────────────────────────────────────────

	function startAutosave() {
		stopAutosave();
		autosaveTimer = setInterval(async () => {
			if (!draftsMailboxId || (!composeTo && !composeSubject && !composeBody)) return;
			try {
				draftId = await saveDraft(
					draftsMailboxId,
					composeTo,
					composeSubject,
					composeBody,
					draftId ?? undefined
				);
			} catch {
				// Autosave failure is silent — user can still send manually
			}
		}, 30_000);
	}

	export function stopAutosave() {
		if (autosaveTimer !== null) {
			clearInterval(autosaveTimer);
			autosaveTimer = null;
		}
	}

	// ─── Files / Contacts pickers ──────────────────────────────────────────────

	function pickFiles() {
		getSDK().events.emit('files:pick', { returnEvent: 'mail:files-picked', multiple: true });
	}

	function pickContact() {
		getSDK().events.emit('contacts:pick', {
			returnEvent: 'mail:contact-picked',
			multiple: false,
		});
		// Listen once for the response
		const unsub = getSDK().events.on('mail:contact-picked', (payload) => {
			const p = payload as { contacts?: { email: string; name?: string }[] } | undefined;
			if (p?.contacts?.[0]) {
				composeTo = p.contacts[0].email;
			}
			unsub();
		});
	}

	// ─── Calendar invite ───────────────────────────────────────────────────────

	function handleAddToCalendar(email: EmailFull) {
		getSDK().events.emit('calendar:add-event', {
			summary: email.subject,
			description: email.textBody ?? undefined,
			icsData: undefined, // full ICS parsing is a future enhancement
		});
	}

	// ─── Helpers ───────────────────────────────────────────────────────────────

	function formatDate(iso: string) {
		const d = new Date(iso);
		const now = new Date();
		if (d.toDateString() === now.toDateString()) {
			return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}
		return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
	}

	function senderDisplay(from: { email: string; name?: string }[]) {
		const f = from[0];
		if (!f) return '?';
		return f.name || f.email;
	}

	function sanitize(html: string): string {
		return DOMPurify.sanitize(html, {
			FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
			FORBID_ATTR: ['onerror', 'onload', 'onclick'],
		});
	}
</script>

<div class="mail-app">
	<!-- ── Mailbox sidebar ────────────────────────────────────────────────── -->
	<aside class="mailbox-list">
		<div class="mailbox-header">
			<button class="compose-btn" onclick={() => openCompose()}>+ Compose</button>
		</div>
		<ul>
			{#each mailboxes as mb (mb.id)}
				<li>
					<button
						class="mailbox-item"
						class:active={activeMailboxId === mb.id}
						onclick={async () => {
							activeMailboxId = mb.id;
							view = 'inbox';
							await loadEmails(mb.id);
						}}
					>
						<span class="mailbox-name">{mb.name}</span>
						{#if mb.unreadEmails > 0}
							<span class="unread-badge">{mb.unreadEmails}</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	</aside>

	<!-- ── Main content ──────────────────────────────────────────────────── -->
	<main class="mail-main">
		{#if error}
			<div class="error-banner">{error}</div>
		{/if}

		<!-- ── Compose ──────────────────────────────────────────────────── -->
		{#if view === 'compose'}
			<div class="compose-pane">
				<div class="compose-header">
					<h2>New Message</h2>
					<button class="close-btn" onclick={discardCompose} aria-label="Discard">✕</button>
				</div>

				<div class="compose-field">
					<label for="compose-to">To</label>
					<input
						id="compose-to"
						type="email"
						bind:value={composeTo}
						placeholder="recipient@example.com"
					/>
					{#if hasContactsModule}
						<button class="picker-btn" onclick={pickContact} aria-label="Pick contact">👤</button>
					{/if}
				</div>

				<div class="compose-field">
					<label for="compose-subject">Subject</label>
					<input
						id="compose-subject"
						type="text"
						bind:value={composeSubject}
						placeholder="Subject"
					/>
				</div>

				<textarea bind:value={composeBody} placeholder="Write your message…"></textarea>

				{#if attachedFiles.length > 0}
					<div class="attachment-list">
						{#each attachedFiles as file (file.id)}
							<span class="attachment-chip">
								📎 {file.name}
								<button
									class="attachment-remove"
									onclick={() => {
										attachedFiles = attachedFiles.filter((f) => f.id !== file.id);
									}}
									aria-label="Remove attachment"
								>✕</button>
							</span>
						{/each}
					</div>
				{/if}

				{#if composeSendError}
					<div class="send-error">{composeSendError}</div>
				{/if}

				<div class="compose-actions">
					<button class="send-btn" onclick={handleSend} disabled={composeSending}>
						{composeSending ? 'Sending…' : 'Send'}
					</button>
					{#if hasFilesModule}
						<button class="attach-btn" onclick={pickFiles}>📎 Attach from Files</button>
					{/if}
					<button class="discard-btn" onclick={discardCompose}>Discard</button>
				</div>
			</div>

		<!-- ── Thread read view ──────────────────────────────────────────── -->
		{:else if view === 'thread'}
			<div class="thread-pane">
				<div class="thread-header">
					<button class="back-btn" onclick={() => { view = 'inbox'; }}>← Back</button>
					<h2 class="thread-subject">{threadEmails[0]?.subject ?? ''}</h2>
				</div>

				{#if threadLoading}
					<div class="loading-state"><span class="spinner"></span></div>
				{:else}
					<div class="thread-emails">
						{#each threadEmails as email (email.id)}
							{@const expanded = expandedEmailIds.has(email.id)}
							{@const unread = !email.keywords['$seen']}
							{@const hasIcs = email.attachments.some((a) => a.type === 'text/calendar')}
							<div class="thread-email" class:unread>
								<!-- Email header (always visible, click to toggle body) -->
								<button class="thread-email-header" onclick={() => toggleEmail(email.id)}>
									<span class="email-from">{senderDisplay(email.from)}</span>
									<span class="email-date">{formatDate(email.receivedAt)}</span>
									<span class="expand-icon">{expanded ? '▲' : '▼'}</span>
								</button>

								{#if expanded}
									<div class="thread-email-body">
										{#if hasIcs && hasCalendarModule}
											<button
												class="calendar-action"
												onclick={() => handleAddToCalendar(email)}
											>
												📅 Add to Calendar
											</button>
										{/if}

										{#if email.htmlBody}
											<div class="email-html-body">
												<!-- eslint-disable-next-line svelte/no-at-html-tags -->
												{@html sanitize(email.htmlBody)}
											</div>
										{:else if email.textBody}
											<pre class="email-text-body">{email.textBody}</pre>
										{:else}
											<p class="empty-body">(no body)</p>
										{/if}

										{#if email.attachments.length > 0}
											<div class="attachment-list">
												{#each email.attachments as att}
													<span class="attachment-chip">📎 {att.name}</span>
												{/each}
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

		<!-- ── Inbox / thread list ───────────────────────────────────────── -->
		{:else if loading}
			<div class="loading-state"><span class="spinner"></span></div>
		{:else if threads().length === 0}
			<div class="empty-state">No messages</div>
		{:else}
			<ul class="email-list">
				{#each threads() as email (email.threadId)}
					{@const unread = !email.keywords['$seen']}
					{@const count = threadCounts().get(email.threadId) ?? 1}
					<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
					<li
						class="email-item"
						class:unread
						role="button"
						tabindex="0"
						onclick={() => openThread(email)}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openThread(email); }}
					>
						<div class="email-from">{senderDisplay(email.from)}</div>
						<div class="email-meta">
							<span class="email-subject">
								{email.subject}
								{#if count > 1}
									<span class="thread-count">{count}</span>
								{/if}
							</span>
							<span class="email-preview">{email.preview}</span>
						</div>
						<div class="email-date">{formatDate(email.receivedAt)}</div>
					</li>
				{/each}
			</ul>
		{/if}
	</main>
</div>

<style>
	.mail-app {
		display: flex;
		height: 100%;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: var(--fp-surface, #fff);
		color: var(--fp-text, #1a1a2e);
	}

	/* ── Sidebar ─────────────────────────────────────────────────────────────── */

	.mailbox-list {
		width: 200px;
		flex-shrink: 0;
		border-right: 1px solid var(--fp-border, #e0e0ef);
		display: flex;
		flex-direction: column;
		padding: 0.75rem 0;
	}

	.mailbox-header { padding: 0 0.75rem 0.75rem; }

	.compose-btn {
		width: 100%;
		padding: 0.5rem;
		background: var(--fp-primary, #5b4fcf);
		color: #fff;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 600;
	}

	ul { list-style: none; padding: 0; margin: 0; }

	.mailbox-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.5rem 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--fp-text, #1a1a2e);
		font-size: 0.85rem;
		text-align: left;
	}

	.mailbox-item:hover { background: var(--fp-border, #e0e0ef); }
	.mailbox-item.active { background: var(--fp-border, #e0e0ef); font-weight: 600; }

	.unread-badge {
		background: var(--fp-primary, #5b4fcf);
		color: #fff;
		border-radius: 10px;
		padding: 1px 6px;
		font-size: 0.7rem;
	}

	/* ── Main ────────────────────────────────────────────────────────────────── */

	.mail-main {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.error-banner {
		padding: 0.75rem 1rem;
		background: #fed7d7;
		color: #c53030;
		font-size: 0.85rem;
		flex-shrink: 0;
	}

	.loading-state, .empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		color: var(--fp-text, #1a1a2e);
		opacity: 0.5;
	}

	.spinner {
		width: 28px;
		height: 28px;
		border: 3px solid var(--fp-border, #e0e0ef);
		border-top-color: var(--fp-primary, #5b4fcf);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	/* ── Thread list ─────────────────────────────────────────────────────────── */

	.email-list { flex: 1; }

	.email-item {
		display: grid;
		grid-template-columns: 160px 1fr auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--fp-border, #e0e0ef);
		cursor: pointer;
		font-size: 0.85rem;
	}

	.email-item:hover { background: var(--fp-surface-2, #f5f5fb); }
	.email-item.unread .email-subject { font-weight: 700; }
	.email-item.unread .email-from { font-weight: 700; }

	.email-from { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

	.email-meta {
		display: flex;
		gap: 0.5rem;
		overflow: hidden;
		align-items: baseline;
	}

	.email-subject {
		flex-shrink: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 220px;
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.thread-count {
		background: var(--fp-border, #e0e0ef);
		color: var(--fp-text, #1a1a2e);
		border-radius: 10px;
		padding: 0 5px;
		font-size: 0.7rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	.email-preview {
		color: var(--fp-text, #1a1a2e);
		opacity: 0.5;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.email-date { white-space: nowrap; opacity: 0.6; font-size: 0.8rem; }

	/* ── Thread read pane ────────────────────────────────────────────────────── */

	.thread-pane {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.thread-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--fp-border, #e0e0ef);
		flex-shrink: 0;
	}

	.back-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--fp-primary, #5b4fcf);
		font-size: 0.9rem;
		padding: 0;
		flex-shrink: 0;
	}

	.thread-subject {
		font-size: 1rem;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.thread-emails {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.thread-email {
		border: 1px solid var(--fp-border, #e0e0ef);
		border-radius: 8px;
		overflow: hidden;
	}

	.thread-email.unread { border-left: 3px solid var(--fp-primary, #5b4fcf); }

	.thread-email-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 0.75rem;
		width: 100%;
		background: var(--fp-surface-2, #f5f5fb);
		border: none;
		cursor: pointer;
		color: var(--fp-text, #1a1a2e);
		font-size: 0.85rem;
		text-align: left;
	}

	.thread-email-header .email-from { flex: 1; font-weight: 600; }
	.thread-email-header .email-date { opacity: 0.6; font-size: 0.8rem; flex-shrink: 0; }
	.expand-icon { opacity: 0.4; font-size: 0.7rem; flex-shrink: 0; }

	.thread-email-body {
		padding: 1rem;
		background: var(--fp-surface, #fff);
	}

	.email-html-body {
		font-size: 0.9rem;
		line-height: 1.6;
		max-width: 100%;
		overflow-x: auto;
		word-break: break-word;
	}

	:global(.email-html-body img) { max-width: 100%; height: auto; }

	.email-text-body {
		font-size: 0.875rem;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		font-family: inherit;
		margin: 0;
	}

	.empty-body { opacity: 0.4; font-size: 0.85rem; }

	.calendar-action {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.75rem;
		background: var(--fp-surface-2, #f5f5fb);
		border: 1px solid var(--fp-border, #e0e0ef);
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.8rem;
		color: var(--fp-primary, #5b4fcf);
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	/* ── Compose ─────────────────────────────────────────────────────────────── */

	.compose-pane {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1rem;
		gap: 0.75rem;
	}

	.compose-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.compose-header h2 { font-size: 1rem; font-weight: 600; }

	.close-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		opacity: 0.5;
	}

	.compose-field {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-bottom: 1px solid var(--fp-border, #e0e0ef);
		padding-bottom: 0.5rem;
	}

	.compose-field label { width: 60px; font-size: 0.8rem; opacity: 0.6; flex-shrink: 0; }

	.compose-field input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		color: var(--fp-text, #1a1a2e);
		font-size: 0.9rem;
	}

	.picker-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		opacity: 0.6;
		padding: 0;
	}

	textarea {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		color: var(--fp-text, #1a1a2e);
		font-size: 0.9rem;
		resize: none;
		font-family: inherit;
		min-height: 200px;
	}

	.attachment-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.attachment-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.2rem 0.5rem;
		background: var(--fp-surface-2, #f5f5fb);
		border: 1px solid var(--fp-border, #e0e0ef);
		border-radius: 4px;
		font-size: 0.8rem;
	}

	.attachment-remove {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.75rem;
		opacity: 0.5;
		padding: 0;
	}

	.send-error {
		padding: 0.5rem 0.75rem;
		background: #fed7d7;
		color: #c53030;
		border-radius: 4px;
		font-size: 0.85rem;
	}

	.compose-actions { display: flex; gap: 0.5rem; align-items: center; }

	.send-btn {
		padding: 0.5rem 1.25rem;
		background: var(--fp-primary, #5b4fcf);
		color: #fff;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.send-btn:disabled { opacity: 0.6; cursor: not-allowed; }

	.attach-btn {
		padding: 0.5rem 0.9rem;
		background: none;
		border: 1px solid var(--fp-border, #e0e0ef);
		border-radius: 6px;
		cursor: pointer;
		color: var(--fp-text, #1a1a2e);
		font-size: 0.85rem;
	}

	.discard-btn {
		padding: 0.5rem 1rem;
		background: none;
		border: 1px solid var(--fp-border, #e0e0ef);
		border-radius: 6px;
		cursor: pointer;
		color: var(--fp-text, #1a1a2e);
		font-size: 0.9rem;
	}
</style>
