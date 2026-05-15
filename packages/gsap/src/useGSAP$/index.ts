import {
	implicit$FirstArg,
	type NoSerialize,
	noSerialize,
	type QRL,
	type Signal,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import gsap from 'gsap';

type UseGSAPConfig = {
	revertOnUpdate?: boolean;
	dependencies?: Signal<any>[];
	scope?: Signal<Element | undefined>; // The component setup phase happens on server-side
};

type ContextSafeFn = <T extends (...args: any) => any>(func: T) => T;

let _gsap = gsap;

function invokeResolvedQrl(qrl: QRL<(...args: any[]) => void>): void {
	// the function
	const fn = qrl.resolved;

	const captured = qrl.getCaptured() || [];

	if (fn) fn(...captured);
}

function useGSAP(callback?: QRL<() => void>, config?: UseGSAPConfig) {
	const resolvedConfig = config ?? {};
	const { scope, revertOnUpdate, dependencies = [] } = resolvedConfig;

	const mounted = useSignal(false);
	const context = useSignal<NoSerialize<gsap.Context>>();
	const contextSafe = useSignal<NoSerialize<ContextSafeFn>>();

	const deferCleanup = dependencies.length > 0 && !revertOnUpdate;

	useVisibleTask$((ctx) => {
		mounted.value = true;

		// this will be invoked when component get unmounted
		if (deferCleanup) ctx.cleanup(() => context.value?.revert());
	});

	useVisibleTask$(async (ctx) => {
		dependencies.forEach(ctx.track);

		if (scope) ctx.track(scope);

		// fetch code
		if (callback) await callback.resolve();

		const scopeElement = scope?.value;
		const isMounted = mounted.value;

		if (deferCleanup && context.value) {
			// add to existing context
			if (callback) context.value.add(() => invokeResolvedQrl(callback), scopeElement);
		} else {
			// create context
			const ctx = noSerialize(_gsap.context(() => {}, scopeElement));

			context.value = ctx;

			// ctx is available
			const makeContextSafe: ContextSafeFn = (fn) => {
				// @ts-ignore
				return ctx!.add(null, fn) as typeof fn;
			};

			contextSafe.value = noSerialize(makeContextSafe);

			if (callback && ctx) ctx.add(() => invokeResolvedQrl(callback), scopeElement);
		}

		if (!deferCleanup || !isMounted) ctx.cleanup(() => context.value?.revert());
	});

	return { context, contextSafe };
}

useGSAP.register = (core: typeof gsap) => {
	_gsap = core;
};
useGSAP.headless = true;

export const useGSAP$ = implicit$FirstArg(useGSAP);
