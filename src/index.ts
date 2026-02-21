/**
 * FuzzyPeanut Mail Module
 *
 * Exports the FPModule interface implemented by MailApp.svelte.
 * The shell calls mount(), then onActive()/onInactive() on navigation.
 */
import { mount, unmount } from 'svelte';
import MailApp from './MailApp.svelte';
import type { FPModule } from '@fuzzypeanut/sdk';

type MailInstance = { stopAutosave: () => void };

const fpModule: FPModule = {
	mount(target: HTMLElement, props: Record<string, unknown> = {}) {
		return mount(MailApp, { target, props });
	},
	unmount(instance: unknown) {
		unmount(instance as object);
	},
	onInactive(instance: unknown) {
		// Stop draft autosave when the user navigates away from Mail
		(instance as MailInstance).stopAutosave?.();
	},
};

export default fpModule;
