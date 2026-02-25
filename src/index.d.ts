declare module 'sveltext' {
	import type { Component, Snippet } from 'svelte';

	export function t(descriptor: TemplateStringsArray, ...args: (string | number)[]): string;
	export function t(descriptor: string, args?: Record<string, unknown>): string;

	export const c: (context: string) => {
		t: (descriptor: TemplateStringsArray, ...args: (string | number)[]) => string;
		msg;
	};

	export type Msg = string & { __brand: 'msg' };

	export const msg: (descriptor: string | TemplateStringsArray | MessageDescriptor) => Msg;

	export const plural: (count: number, selectors: Record<string, string>) => string;

	export const T: Component<{ msg: Msg; [key: string]: Msg | Snippet }>;

	export type Config = {
		locales: string[];
		sourceLocale: string;
		catalog: {
			path: string;
			include: string[];
		};
	};

	export const setLocale: (locale: string, messages: Record<string, unknown[]>) => void;

	export const locale: string;
}

declare module 'sveltext/vite' {
	import type { PluginOption } from 'vite';

	export function sveltext(): PluginOption;
}
