/**
 * Minimal JMAP client (RFC 8620 / RFC 8621)
 * Talks to the Stalwart mail server's JMAP endpoint.
 */
import { getSDK } from '@fuzzypeanut/sdk';

const JMAP_URL = (import.meta as { env: Record<string, string> }).env.VITE_JMAP_URL ?? 'http://localhost:8080/jmap';

async function request(calls: unknown[][]) {
	const token = await getSDK().auth.getToken();
	const res = await fetch(JMAP_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			using: ['urn:ietf:params:jmap:core', 'urn:ietf:params:jmap:mail'],
			methodCalls: calls
		})
	});
	if (!res.ok) throw new Error(`JMAP ${res.status}`);
	const data = await res.json();
	return data.methodResponses as unknown[][];
}

export async function getMailboxes() {
	const [[, result]] = await request([
		['Mailbox/get', { accountId: null, ids: null }, 'a']
	]);
	return (result as { list: unknown[] }).list;
}

export async function getEmails(mailboxId: string, limit = 50) {
	const [, [, queryResult]] = await request([
		[
			'Email/query',
			{
				accountId: null,
				filter: { inMailbox: mailboxId },
				sort: [{ property: 'receivedAt', isAscending: false }],
				limit
			},
			'a'
		],
		[
			'Email/get',
			{
				accountId: null,
				'#ids': { resultOf: 'a', name: 'Email/query', path: '/ids' },
				properties: ['id', 'subject', 'from', 'receivedAt', 'preview', 'keywords']
			},
			'b'
		]
	]);
	return (queryResult as { list: unknown[] }).list;
}

export async function sendEmail(to: string, subject: string, body: string) {
	await request([
		[
			'Email/set',
			{
				accountId: null,
				create: {
					draft: {
						mailboxIds: {},
						to: [{ email: to }],
						subject,
						textBody: [{ partId: '1', type: 'text/plain' }],
						bodyValues: { '1': { value: body } }
					}
				}
			},
			'a'
		],
		[
			'EmailSubmission/set',
			{
				accountId: null,
				create: {
					sub: {
						emailId: '#draft',
						envelope: { mailFrom: { email: '' }, rcptTo: [{ email: to }] }
					}
				},
				onSuccessDestroyEmail: ['#sub']
			},
			'b'
		]
	]);
}
