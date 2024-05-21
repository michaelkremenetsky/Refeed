import { createRef, useEffect, useState } from "react";

export function useRefArray<T>(items: T[]) {
  const [elRefs, setElRefs] = useState([]);

  useEffect(() => {
    setElRefs(
      Array.from({ length: items.length }, (_, index) => {
        return elRefs[index] || createRef();
      }) as never[],
    );
  }, [items.length]);

  return { elRefs };
}
