/* eslint-disable */

export const getTotalChildAmount = (node: { children: any[] }) => {
  if (node?.children) {
    return node.children
      .reduce((acc: number, child: { amount: number }) => {
        return acc + child.amount;
      }, 0)
      .toString();
  } else {
    return "0";
  }
};
