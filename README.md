# module-mail

FuzzyPeanut Mail module — Svelte webmail client backed by [Stalwart](https://stalw.art), a modern Rust mail server (SMTP/IMAP/JMAP).

## What it does

- Full mailbox view with thread grouping (JMAP `Thread/get`)
- Read emails: HTML body with DOMPurify sanitization, plain text fallback
- Compose and send with draft autosave every 30s
- Cross-module integration: attach files from module-files, pick contacts from module-contacts, accept calendar invites into module-calendar
- Auto-provisioned mailboxes via the auth provisioning service

## Services

| Service | Port | Description |
|---|---|---|
| `mail-ui` | 3001 | Nginx serving the compiled `remoteEntry.js` |
| `mail-registrar` | — | One-shot: registers this module with the shell registry |
| `stalwart` | 8080 (JMAP), 25, 587, 993 | All-in-one mail server |

## Quick start

```bash
# Required environment variables (see docker-compose.yml)
REGISTRY_URL=http://shell-registry:3100
MODULE_UI_URL=http://localhost:3001
MAIL_DOMAIN=mail.fuzzypeanut.local
AUTHENTIK_JWKS_URL=https://auth.fuzzypeanut.local/application/o/fuzzypeanut/.well-known/jwks.json

docker compose up
```

## Stalwart OIDC configuration

Stalwart validates JMAP Bearer tokens using Authentik's JWKS endpoint. The starter config at `config/stalwart/config.toml` includes the OIDC section as a template — **verify the config key names against your Stalwart version's docs** before deploying:

- https://stalw.art/docs/auth/oauth

Set `AUTHENTIK_JWKS_URL` in your environment to the Authentik JWKS URL for your FuzzyPeanut application:

```
https://<authentik-host>/application/o/fuzzypeanut/.well-known/jwks.json
```

## Development

```bash
npm install
npm run build        # produces dist/remoteEntry.js
npm run dev          # watch mode
```

The module is a Vite library build (not a SvelteKit app). `src/index.ts` exports the `FPModule` default.

## Module events

| Event | Direction | Description |
|---|---|---|
| `mail:compose` | consumed | Open compose with optional to/subject/body pre-fill |
| `mail:compose-with-files` | consumed | Open compose with file references pre-loaded |
| `files:pick` | emitted | Request file picker (requires module-files) |
| `contacts:pick` | emitted | Request contact picker (requires module-contacts) |
| `calendar:add-event` | emitted | Accept calendar invite (requires module-calendar) |
