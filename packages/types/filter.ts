export interface Filter {
  id: string;
  enabled: boolean;
  user_id: string;
  filter: {
    Feeds: string[]; // Ids of feeds to filter out, filters all feeds if left blank
    Content: "Anywhere" | "Title" | "Summary" | "Content" | "Link";
    Logic?:
      | "Contain"
      | "Does Not Contain"
      | "Equals"
      | "Does not Equal"
      | "Begins With"
      | "Ends With";
    Keywords?: string[];
  };
}
