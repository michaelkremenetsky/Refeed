import type { ReactNode } from "react";
import { createContext } from "react";

// Since theirs no way to pass the width of the tree to the node component we need to use a context
export const TreeWidthContext = createContext<{
  width: number | undefined;
}>({
  width: undefined,
});

export const TreeWidthProvider = ({
  children,
  width,
}: {
  children: ReactNode;
  width: number | undefined;
}) => {
  return (
    <TreeWidthContext.Provider value={{ width }}>
      {children}
    </TreeWidthContext.Provider>
  );
};
