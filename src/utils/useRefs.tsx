import { MutableRefObject, Ref, RefObject, useCallback } from "react";

export function useRefs<T>(outer: Ref<T> | undefined, inner: RefObject<T>) {
    return outer
        ? (ref: T | null) => {
              (inner as MutableRefObject<T | null>).current = ref;
              if (typeof outer === "function") {
                  outer(ref);
              } else {
                  (outer as MutableRefObject<T | null>).current = ref;
              }
          }
        : inner;
}

export function useMemoRefs<T>(outer: Ref<T> | undefined, inner: RefObject<T>) {
    return useCallback(
        (ref: T | null) => {
            (inner as MutableRefObject<T | null>).current = ref;
            if (outer) {
                if (typeof outer === "function") {
                    outer(ref);
                } else {
                    (outer as MutableRefObject<T | null>).current = ref;
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [outer],
    );
}
