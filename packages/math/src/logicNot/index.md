# logicNot

`NOT` logic for signals.

## Usage

```tsx
import { logicAnd } from '@lazyqwik/math';
import { useSignal } from '@builder.io/qwik';

const a = useSignal(false);
const b = logicAnd(a); // Signal<true>
```
