import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@lazyqwik/shared';

export function logicAnd(...args: MaybeSignal<any>[]) {
	// oxlint-disable-next-line qwik/use-method-usage this is a hook but not start with "use"
	return useComputed$(() => args.every((arg) => toValue(arg)));
}
