import type { ForwardedRef } from "react";
import { useState } from "react";
import type { TreeApi } from "react-arborist";

export function useTreeVisibleNodesCount<Node>() {
  const [count, setCount] = useState(0);

  const ref: ForwardedRef<TreeApi<Node> | undefined> = (node) => {
    if (node) setCount(node.visibleNodes.length);
  };

  return { ref, count };
}
