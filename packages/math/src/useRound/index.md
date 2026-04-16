# useRound

Reactive `Math.round`.

## Usage

```ts
import { useRound } from '@lazyqwik/math';

const a = useSignal(1.6);

const b = useRound(a); // Signal<2>
```

```ts
import { useRound } from '@lazyqwik/math';

const a = useSignal(1.4);

const b = useRound(a); // Signal<1>
```
