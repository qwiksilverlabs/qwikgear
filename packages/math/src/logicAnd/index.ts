import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@qwikgear/shared';

export function logicAnd(...args: MaybeSignal<any>[]) {
	return useComputed$(() => args.every((arg) => toValue(arg)));
}
