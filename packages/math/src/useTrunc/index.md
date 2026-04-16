# useTrunc

Reactive `Math.trunc`.

## Usage

```ts
import { useTrunc } from '@lazyqwik/math';

const a = useSignal(1.5);

const b = useTrunc(a); // Signal<1>
```
