import { useOpenItem } from "@refeed/features/item/useItemDataWeb";
import type { ItemType } from "@refeed/types/item";

export const useItemsBuffer = ({ items }: { items: ItemType[] }) => {
  const { openItem } = useOpenItem();

  const bufferRange = 20;

  const startIndex = Math.max(
    0,
    items.findIndex((item) => item.id === openItem?.id) - bufferRange,
  );
  const endIndex = Math.min(
    items.length,
    items.findIndex((item) => item.id === openItem?.id) + bufferRange + 1,
  );

  // Create a new array with placeholders for items outside the buffer range
  const newBufferedItems = items.map((item, index) =>
    index >= startIndex && index < endIndex ? item : { id: item.id },
  ) as ItemType[];

  return { newBufferedItems };
};
