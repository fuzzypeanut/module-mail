// Mirror of FPModule from the shell — defined here to avoid circular deps
export interface FPModule {
	mount(target: HTMLElement, props?: Record<string, unknown>): unknown;
	unmount(instance: unknown): void;
}

export interface MailThread {
	id: string;
	subject: string;
	from: string;
	date: string;
	preview: string;
	unread: boolean;
}
