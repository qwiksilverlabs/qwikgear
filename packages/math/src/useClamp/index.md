# useClamp

Clamp a value between a minimum and maximum reactively.

## Usage

```tsx
import { useClamp } from '@lazyqwik/math';

const a = useSignal(1);
const b = useSignal(4);
const c = useSignal(3);

const x = useClamp(b, a, c); // Signal<3>
```
