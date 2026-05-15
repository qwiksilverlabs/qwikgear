import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@qwikgear/shared';

export function logicOr(...args: MaybeSignal<any>[]) {
	return useComputed$(() => args.some((arg) => toValue(arg)));
}
