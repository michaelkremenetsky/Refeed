import { JaroWinklerDistance } from "@refeed/lib/JaroWinklerDistance";
import type { ItemType } from "@refeed/types/item";

export const checkDuplicates = (items: ItemType[]) => {
  const seenItems = new Map();
  const duplicates = new Set<ItemType>();

  items.forEach((item) => {
    items.forEach((item2) => {
      if (item.id !== item2.id) {
        const jaroWinklerDistance = JaroWinklerDistance(
          item.title,
          item2.title,
        );

        if (jaroWinklerDistance > 0.85) {
          seenItems.set(item.id, true);
          if (seenItems.get(item2.id)) {
            duplicates.add(item);
          }
        } else {
          const image_hash1 = item.image_url
            ? item.image_url.split("-").pop()
            : "";
          const image_hash2 = item2.image_url
            ? item2.image_url.split("-").pop()
            : "";

          if (
            image_hash1 == image_hash2 &&
            item.url == item2.url &&
            jaroWinklerDistance > 0.75
          ) {
            seenItems.set(item.id, true);
            if (seenItems.get(item2.id)) {
              duplicates.add(item);
            }
          }
        }
      }
    });
  });

  return duplicates;
};
