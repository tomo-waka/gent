import { type Ref, ref, watch } from "vue";

// Learning note:
// Composable pattern = reusable stateful logic.
// Vue docs reference: "Reusability > Composables".
const parseStoredJson = <T>(rawValue: string | null, fallback: T): T => {
  if (rawValue === null) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

export const usePersistentState = <T>(
  storageKey: string,
  createInitialValue: () => T,
): Ref<T> => {
  // Learning note:
  // Initialize from factory first, then override with storage if available.
  const initialValue = createInitialValue();
  const parsedValue = parseStoredJson<T>(
    localStorage.getItem(storageKey),
    initialValue,
  );
  // Learning note:
  // `ref<T>(...)` with a generic can widen to `UnwrapRef<T>` in TypeScript.
  // Keep an explicit `Ref<T>` assertion so the composable API stays stable.
  const state = ref(parsedValue) as Ref<T>;

  watch(
    state,
    (nextValue) => {
      // Learning note:
      // Side-effect persistence is isolated in watcher for transparency.
      localStorage.setItem(storageKey, JSON.stringify(nextValue));
    },
    // Learning note:
    // Keep deep watch here because this composable is generic and should also
    // persist nested in-place mutations when callers use mutable patterns.
    { deep: true },
  );

  return state;
};
