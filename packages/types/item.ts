export interface ItemType {
  id: string;
  title: string;
  url: string;
  created_at: Date;
  updated_at: Date;
  image_url: string | null;
  logo_url: string | null;
  from_search: boolean | undefined;
  marked_read: boolean | undefined;
  in_read_later: boolean | undefined;
  marked_read_time: Date | null | undefined;
  temp_added_time: Date | null | undefined;
  bookmark_folders: string[] | undefined;
  feed_id: string;
  feed_title: string | undefined;
  website_content: string | null;
  readibility_score: number | null;
  content_length: number | null;
  note: string | null | undefined;
}
