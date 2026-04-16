import { isSignal, Signal } from '@builder.io/qwik';

export type MaybeSignal<T> = Signal<T> | T;

export function toValue<T>(source: T | Signal<T>) {
	if (isSignal(source)) return source.value;

	return source;
}

export function getSignalValue<T>(imposter: MaybeSignal<T>): T {
	if (isSignal(imposter)) return imposter.value;

	return imposter;
}

export type MaybeSignalArgs<T> = MaybeSignal<T>[] | [MaybeSignal<T>[]];

export function toValueArgs<T>(args: MaybeSignalArgs<T>) {
	return args.flatMap((v) => {
		const value = toValue(v);
		return Array.isArray(value) ? value.map((i) => toValue(i)) : [value];
	});
}
