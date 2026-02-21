/**
 * FuzzyPeanut Mail Module
 *
 * Exports the FPModule interface: { mount, unmount }.
 * The shell calls mount(targetElement) to render this module.
 */
import { mount, unmount } from 'svelte';
import MailApp from './MailApp.svelte';
import type { FPModule } from './types';

const fpModule: FPModule = {
	mount(target: HTMLElement, props: Record<string, unknown> = {}) {
		return mount(MailApp, { target, props });
	},
	unmount(instance: unknown) {
		unmount(instance as object);
	}
};

export default fpModule;
