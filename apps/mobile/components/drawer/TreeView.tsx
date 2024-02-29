import type { FC } from "react";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

/* Modifed version of https://github.com/zaguiini/react-native-final-tree-view/blob/master/index.js
 that uses FlashList instead of what they were using, this is not finished yet */

interface BaseNode {
  id: string;
  children?: BaseNode[];
}

const TreeView = <T extends BaseNode>({
  data,
  renderNode,
  initialExpanded = false,
  idKey = "id",
  childrenKey = "children",
  activeOpacityNode = 0.2,
  onNodePress,
  onNodeLongPress,
  isNodeExpanded,
  shouldDisableTouchOnLeaf,
}: {
  data: T[];
  renderNode: (args: {
    node: T;
    level: number;
    isExpanded: boolean;
    hasChildrenNodes: boolean;
  }) => JSX.Element;
  initialExpanded?: boolean;
  idKey?: keyof T;
  childrenKey?: keyof T;
  activeOpacityNode?: number;
  onNodePress?: (args: {
    node: T;
    level: number;
  }) => Promise<boolean> | boolean;
  onNodeLongPress?: (args: { node: T; level: number }) => void;
  isNodeExpanded?: (id: string) => boolean;
  shouldDisableTouchOnLeaf?: (args: { node: T; level: number }) => boolean;
}) => {
  const [expandedNodeKeys, setExpandedNodeKeys] = useState<
    Record<string, boolean>
  >({});

  const hasChildrenNodes = (node: T) =>
    node[childrenKey] && (node[childrenKey] as T[]).length > 0;

  const isExpanded = (id: string) => {
    return isNodeExpanded
      ? isNodeExpanded(id)
      : expandedNodeKeys[id] ?? initialExpanded;
  };

  const updateNodeKeyById = (id: string, expanded: boolean) => {
    setExpandedNodeKeys((prevKeys) => ({
      ...prevKeys,
      [id]: expanded,
    }));
  };

  const toggleCollapse = (id: string) => {
    const method = isExpanded(id) ? "collapseNode" : "expandNode";
    method === "collapseNode"
      ? updateNodeKeyById(id, false)
      : updateNodeKeyById(id, true);
  };

  const handleNodePressed = async (node: T, level: number) => {
    const nodePressResult = onNodePress
      ? await onNodePress({ node, level })
      : true;

    if (nodePressResult !== false && hasChildrenNodes(node)) {
      toggleCollapse(node[idKey] as string);
    }
  };

  const NodeComponent: FC<{ nodes: T[]; level: number }> = ({
    nodes,
    level,
  }) => (
    <FlashList
      data={nodes}
      renderItem={({ item: node }) => {
        const isNodeExpanded = isExpanded(node[idKey] as string);
        const hasNodes = hasChildrenNodes(node);
        const shouldRenderLevel = hasNodes && isNodeExpanded;

        return (
          <View style={{ flex: 1 }} key={node[idKey] as string}>
            <TouchableOpacity
              activeOpacity={activeOpacityNode}
              disabled={
                shouldDisableTouchOnLeaf
                  ? shouldDisableTouchOnLeaf({ node, level })
                  : false
              }
              onPress={() => {
                handleNodePressed(node, level);
              }}
              onLongPress={() =>
                onNodeLongPress ? onNodeLongPress({ node, level }) : undefined
              }
            >
              {React.createElement(renderNode, {
                node,
                level,
                isExpanded: isNodeExpanded,
                hasChildrenNodes: hasNodes,
              })}
            </TouchableOpacity>
            {shouldRenderLevel && (
              <NodeComponent
                nodes={node[childrenKey] as T[]}
                level={level + 1}
              />
            )}
          </View>
        );
      }}
      keyExtractor={(item) => item[idKey] as string}
      estimatedItemSize={nodes.length}
    />
  );

  return <NodeComponent nodes={data} level={0} />;
};

export default TreeView;
