/**
 * JMAP client (RFC 8620 / RFC 8621)
 *
 * Discovers the account ID and API URL from the server's session document
 * (GET /.well-known/jmap) on first use, then caches for the session lifetime.
 */
import { getSDK } from '@fuzzypeanut/sdk';

// VITE_JMAP_URL is the Stalwart server origin (no path), e.g. http://localhost:8080
const JMAP_ORIGIN =
	(import.meta as { env: Record<string, string> }).env.VITE_JMAP_URL ?? 'http://localhost:8080';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Mailbox {
	id: string;
	name: string;
	role: string | null;
	unreadEmails: number;
	totalEmails: number;
	sortOrder: number;
}

export interface EmailSummary {
	id: string;
	threadId: string;
	subject: string;
	from: { email: string; name?: string }[];
	receivedAt: string;
	preview: string;
	keywords: Record<string, boolean>;
}

export interface EmailFull extends EmailSummary {
	to: { email: string; name?: string }[];
	cc: { email: string; name?: string }[];
	htmlBody: string | null;
	textBody: string | null;
	hasAttachment: boolean;
	attachments: { name: string; type: string; size: number; blobId: string }[];
}

// ─── Session ──────────────────────────────────────────────────────────────────

interface JMAPSession {
	apiUrl: string;
	primaryAccounts: Record<string, string>;
}

let _session: JMAPSession | null = null;

async function getSession(): Promise<JMAPSession> {
	if (_session) return _session;
	const token = await getSDK().auth.getToken();
	const res = await fetch(`${JMAP_ORIGIN}/.well-known/jmap`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error(`JMAP session error: ${res.status}`);
	_session = (await res.json()) as JMAPSession;
	return _session;
}

export function clearSession(): void {
	_session = null;
}

// ─── Request ──────────────────────────────────────────────────────────────────

async function request(
	calls: [string, Record<string, unknown>, string][]
): Promise<[string, unknown, string][]> {
	const [token, session] = await Promise.all([getSDK().auth.getToken(), getSession()]);
	const accountId = session.primaryAccounts['urn:ietf:params:jmap:mail'];
	if (!accountId) throw new Error('No JMAP mail account in session');

	const res = await fetch(session.apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			using: ['urn:ietf:params:jmap:core', 'urn:ietf:params:jmap:mail'],
			methodCalls: calls.map(([method, args, tag]) => [method, { accountId, ...args }, tag]),
		}),
	});
	if (!res.ok) throw new Error(`JMAP request failed: ${res.status}`);
	const data = (await res.json()) as { methodResponses: [string, unknown, string][] };
	return data.methodResponses;
}

// ─── Mailboxes ────────────────────────────────────────────────────────────────

export async function getMailboxes(): Promise<Mailbox[]> {
	const [[, result]] = await request([['Mailbox/get', { ids: null }, 'a']]);
	return (result as { list: Mailbox[] }).list;
}

// ─── Email list (with threadId for grouping) ──────────────────────────────────

export async function getEmails(mailboxId: string, limit = 100): Promise<EmailSummary[]> {
	const responses = await request([
		[
			'Email/query',
			{
				filter: { inMailbox: mailboxId },
				sort: [{ property: 'receivedAt', isAscending: false }],
				limit,
			},
			'q',
		],
		[
			'Email/get',
			{
				'#ids': { resultOf: 'q', name: 'Email/query', path: '/ids' },
				properties: ['id', 'threadId', 'subject', 'from', 'receivedAt', 'preview', 'keywords'],
			},
			'g',
		],
	]);
	const [, getResult] = responses[1];
	return (getResult as { list: EmailSummary[] }).list;
}

// ─── Thread ───────────────────────────────────────────────────────────────────

export async function getThreadEmails(threadId: string): Promise<EmailFull[]> {
	const responses = await request([
		['Thread/get', { ids: [threadId] }, 't'],
		[
			'Email/get',
			{
				'#ids': { resultOf: 't', name: 'Thread/get', path: '/list/0/emailIds' },
				properties: [
					'id',
					'threadId',
					'subject',
					'from',
					'to',
					'cc',
					'receivedAt',
					'preview',
					'keywords',
					'htmlBody',
					'textBody',
					'bodyValues',
					'hasAttachment',
					'attachments',
				],
				fetchAllBodyValues: true,
			},
			'g',
		],
	]);
	const [, getResult] = responses[1];
	return ((getResult as { list: unknown[] }).list as RawEmailFull[]).map(processEmailFull);
}

// ─── Email parsing ────────────────────────────────────────────────────────────

type RawEmailFull = {
	id: string;
	threadId: string;
	subject: string;
	from: { email: string; name?: string }[];
	to?: { email: string; name?: string }[];
	cc?: { email: string; name?: string }[];
	receivedAt: string;
	preview: string;
	keywords: Record<string, boolean>;
	hasAttachment: boolean;
	attachments?: { name: string; type: string; size: number; blobId: string }[];
	htmlBody?: { partId: string }[];
	textBody?: { partId: string }[];
	bodyValues?: Record<string, { value: string }>;
};

function processEmailFull(raw: RawEmailFull): EmailFull {
	const htmlPartId = raw.htmlBody?.[0]?.partId;
	const textPartId = raw.textBody?.[0]?.partId;
	return {
		id: raw.id,
		threadId: raw.threadId,
		subject: raw.subject,
		from: raw.from,
		to: raw.to ?? [],
		cc: raw.cc ?? [],
		receivedAt: raw.receivedAt,
		preview: raw.preview,
		keywords: raw.keywords,
		hasAttachment: raw.hasAttachment,
		attachments: raw.attachments ?? [],
		htmlBody: htmlPartId ? (raw.bodyValues?.[htmlPartId]?.value ?? null) : null,
		textBody: textPartId ? (raw.bodyValues?.[textPartId]?.value ?? null) : null,
	};
}

// ─── Mark as read ─────────────────────────────────────────────────────────────

export async function markAsRead(emailIds: string[]): Promise<void> {
	if (!emailIds.length) return;
	const updates: Record<string, unknown> = {};
	for (const id of emailIds) {
		updates[id] = { 'keywords/$seen': true };
	}
	await request([['Email/set', { update: updates }, 'a']]);
}

// ─── Draft autosave ───────────────────────────────────────────────────────────

export async function saveDraft(
	draftsMailboxId: string,
	to: string,
	subject: string,
	body: string,
	existingDraftId?: string
): Promise<string> {
	if (existingDraftId) {
		await request([
			[
				'Email/set',
				{
					update: {
						[existingDraftId]: {
							to: to ? [{ email: to }] : [],
							subject: subject || '(no subject)',
							textBody: [{ partId: '1', type: 'text/plain' }],
							bodyValues: { '1': { value: body } },
						},
					},
				},
				'a',
			],
		]);
		return existingDraftId;
	}

	const [[, result]] = await request([
		[
			'Email/set',
			{
				create: {
					draft: {
						mailboxIds: { [draftsMailboxId]: true },
						keywords: { $draft: true },
						to: to ? [{ email: to }] : [],
						subject: subject || '(no subject)',
						textBody: [{ partId: '1', type: 'text/plain' }],
						bodyValues: { '1': { value: body } },
					},
				},
			},
			'a',
		],
	]);
	const r = result as { created: Record<string, { id: string }> | null };
	const created = r.created?.['draft'];
	if (!created) throw new Error('Draft creation failed');
	return created.id;
}

export async function deleteDraft(draftId: string): Promise<void> {
	await request([['Email/set', { destroy: [draftId] }, 'a']]);
}

// ─── Send ─────────────────────────────────────────────────────────────────────

export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
	await request([
		[
			'Email/set',
			{
				create: {
					outgoing: {
						mailboxIds: {},
						to: [{ email: to }],
						subject,
						textBody: [{ partId: '1', type: 'text/plain' }],
						bodyValues: { '1': { value: body } },
					},
				},
			},
			'e',
		],
		[
			'EmailSubmission/set',
			{
				create: {
					sub: {
						emailId: '#outgoing',
						envelope: { mailFrom: { email: '' }, rcptTo: [{ email: to }] },
					},
				},
			},
			's',
		],
	]);
}
