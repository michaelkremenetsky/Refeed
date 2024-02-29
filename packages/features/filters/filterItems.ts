import type { Filter } from "@refeed/types/filter";
import type { ItemType } from "@refeed/types/item";

import { trpc } from "../trpc";

export const filterItems = (items: ItemType[]) => {
  const Filters = trpc.pro.getFilters.useQuery().data as unknown as
    | Filter[]
    | undefined;

  const filterdItems = items.filter((item) => !shouldFilter(Filters, item));

  return filterdItems;
};

const shouldFilter = (Filters: Filter[] | undefined, item: ItemType) => {
  return Filters?.some((data) => {
    if (!data.enabled) {
      return false;
    }
    const filter = data.filter;

    if (filter.Feeds.includes(item.feed_id)) {
      if (filter.Logic == "Contain") {
        return checkIfContains(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Does Not Contain") {
        return !checkIfContains(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Equals") {
        return checkIfEquals(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Does not Equal") {
        return !checkIfEquals(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Begins With") {
        return checkIfBeginsWith(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Ends With") {
        return checkIfEndsWith(item, filter.Content, filter.Keywords!);
      }
    }

    if (filter.Feeds.length == 0) {
      if (filter.Logic == "Contain") {
        return checkIfContains(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Does Not Contain") {
        return !checkIfContains(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Equals") {
        return checkIfEquals(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Does not Equal") {
        return !checkIfEquals(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Begins With") {
        return checkIfBeginsWith(item, filter.Content, filter.Keywords!);
      }
      if (filter.Logic == "Ends With") {
        return checkIfEndsWith(item, filter.Content, filter.Keywords!);
      }
    }
  });
};

const checkIfContains = (
  item: ItemType,
  ContentType: Filter["filter"]["Content"],
  Keywords: string[],
): boolean => {
  return Keywords.some((keyword) => {
    if (ContentType == "Content") {
      return item?.website_content?.includes(keyword) && keyword.length > 0;
    }
    if (ContentType == "Link") {
      return item.url?.includes(keyword) && keyword.length > 0;
    }
    if (ContentType == "Title") {
      return item.title?.includes(keyword) && keyword.length > 0;
    }
    if (ContentType == "Anywhere") {
      return (
        (item?.website_content?.includes(keyword) ??
          item.url?.includes(keyword) ??
          item.title?.includes(keyword)) &&
        keyword.length > 0
      );
    }
  });
};

const checkIfEquals = (
  item: ItemType,
  ContentType: Filter["filter"]["Content"],
  Keywords: string[],
): boolean => {
  return Keywords.some((keyword) => {
    if (ContentType == "Content") {
      return item?.website_content == keyword && keyword.length > 0;
    }
    if (ContentType == "Link") {
      return item.url == keyword && keyword.length > 0;
    }
    if (ContentType == "Title") {
      return item.title == keyword && keyword.length > 0;
    }
    if (ContentType == "Anywhere") {
      return (
        (item?.website_content == keyword ??
          item.url == keyword ??
          item.title == keyword) &&
        keyword.length > 0
      );
    }
  });
};

const checkIfEndsWith = (
  item: ItemType,
  ContentType: Filter["filter"]["Content"],
  Keywords: string[],
): boolean => {
  return Keywords.some((keyword) => {
    if (ContentType == "Content") {
      return item?.website_content?.endsWith(keyword) && keyword.length > 0;
    }
    if (ContentType == "Link") {
      return item.url?.endsWith(keyword) && keyword.length > 0;
    }
    if (ContentType == "Title") {
      return item.title?.endsWith(keyword) && keyword.length > 0;
    }
    if (ContentType == "Anywhere") {
      return (
        (item?.website_content?.endsWith(keyword) ??
          item.url?.endsWith(keyword) ??
          item.title?.endsWith(keyword)) &&
        keyword.length > 0
      );
    }
  });
};

const checkIfBeginsWith = (
  item: ItemType,
  ContentType: Filter["filter"]["Content"],
  Keywords: string[],
): boolean => {
  return Keywords.some((keyword) => {
    if (ContentType == "Content") {
      return item?.website_content?.startsWith(keyword) && keyword.length > 0;
    }
    if (ContentType == "Link") {
      return item.url?.startsWith(keyword) && keyword.length > 0;
    }
    if (ContentType == "Title") {
      return item.title?.startsWith(keyword) && keyword.length > 0;
    }
    if (ContentType == "Anywhere") {
      return (
        (item?.website_content?.startsWith(keyword) ??
          item.url?.startsWith(keyword) ??
          item.title?.startsWith(keyword)) &&
        keyword.length > 0
      );
    }
  });
};
