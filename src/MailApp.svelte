<script lang="ts">
	import { onMount } from 'svelte';
	import { getSDK } from '@fuzzypeanut/sdk';
	import { getMailboxes, getEmails } from './jmap';
	import type { MailThread } from './types';

	type Mailbox = { id: string; name: string; role: string | null; unreadEmails: number };
	type Email = { id: string; subject: string; from: { email: string; name?: string }[]; receivedAt: string; preview: string; keywords: Record<string, boolean> };
	type View = 'inbox' | 'compose';

	let mailboxes = $state<Mailbox[]>([]);
	let emails = $state<Email[]>([]);
	let activeMailboxId = $state<string | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let view = $state<View>('inbox');

	// Compose form
	let composeTo = $state('');
	let composeSubject = $state('');
	let composeBody = $state('');

	onMount(async () => {
		try {
			mailboxes = (await getMailboxes()) as Mailbox[];
			const inbox = mailboxes.find((m) => m.role === 'inbox') ?? mailboxes[0];
			if (inbox) {
				activeMailboxId = inbox.id;
				await loadEmails(inbox.id);
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load mail';
		}
		loading = false;

		// Listen for cross-module compose request
		const sdk = getSDK();
		sdk.events.on('mail:compose', (payload) => {
			const p = payload as { to?: string; subject?: string } | undefined;
			composeTo = p?.to ?? '';
			composeSubject = p?.subject ?? '';
			composeBody = '';
			view = 'compose';
		});
	});

	async function loadEmails(mailboxId: string) {
		loading = true;
		try {
			emails = (await getEmails(mailboxId)) as Email[];
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load emails';
		}
		loading = false;
	}

	async function handleSelectMailbox(id: string) {
		activeMailboxId = id;
		await loadEmails(id);
	}

	function formatDate(iso: string) {
		const d = new Date(iso);
		const now = new Date();
		if (d.toDateString() === now.toDateString()) {
			return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}
		return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
	}
</script>

<div class="mail-app">
	<!-- Mailbox sidebar -->
	<aside class="mailbox-list">
		<div class="mailbox-header">
			<button class="compose-btn" onclick={() => { view = 'compose'; }}>
				+ Compose
			</button>
		</div>
		<ul>
			{#each mailboxes as mb (mb.id)}
				<li>
					<button
						class="mailbox-item"
						class:active={activeMailboxId === mb.id}
						onclick={() => { handleSelectMailbox(mb.id); view = 'inbox'; }}
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

	<!-- Main content -->
	<main class="mail-main">
		{#if error}
			<div class="error-banner">{error}</div>
		{/if}

		{#if view === 'compose'}
			<div class="compose-pane">
				<div class="compose-header">
					<h2>New Message</h2>
					<button class="close-btn" onclick={() => { view = 'inbox'; }}>✕</button>
				</div>
				<div class="compose-field">
					<label for="compose-to">To</label>
					<input id="compose-to" type="email" bind:value={composeTo} placeholder="recipient@example.com" />
				</div>
				<div class="compose-field">
					<label for="compose-subject">Subject</label>
					<input id="compose-subject" type="text" bind:value={composeSubject} placeholder="Subject" />
				</div>
				<textarea bind:value={composeBody} placeholder="Write your message…"></textarea>
				<div class="compose-actions">
					<button class="send-btn" onclick={() => { view = 'inbox'; }}>Send</button>
					<button class="discard-btn" onclick={() => { view = 'inbox'; }}>Discard</button>
				</div>
			</div>
		{:else if loading}
			<div class="loading-state">
				<span class="spinner"></span>
			</div>
		{:else if emails.length === 0}
			<div class="empty-state">No messages</div>
		{:else}
			<ul class="email-list">
				{#each emails as email (email.id)}
					{@const unread = !email.keywords['$seen']}
					<li class="email-item" class:unread>
						<div class="email-from">
							{email.from[0]?.name ?? email.from[0]?.email ?? '?'}
						</div>
						<div class="email-meta">
							<span class="email-subject">{email.subject}</span>
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

	.mail-main {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.error-banner {
		padding: 0.75rem 1rem;
		background: #fed7d7;
		color: #c53030;
		font-size: 0.85rem;
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
	}

	.email-subject { flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
	.email-preview { color: var(--fp-text, #1a1a2e); opacity: 0.5; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.email-date { white-space: nowrap; opacity: 0.6; font-size: 0.8rem; }

	/* Compose pane */
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

	.compose-actions { display: flex; gap: 0.5rem; }

	.send-btn {
		padding: 0.5rem 1.25rem;
		background: var(--fp-primary, #5b4fcf);
		color: #fff;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
	}

	.discard-btn {
		padding: 0.5rem 1rem;
		background: none;
		border: 1px solid var(--fp-border, #e0e0ef);
		border-radius: 6px;
		cursor: pointer;
		color: var(--fp-text, #1a1a2e);
	}
</style>
