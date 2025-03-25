import { POST_STATUS_ENUM } from "../typings";

export interface Merchant {
  readonly id?: string;
  name: string;
  category_id: string;
  website_url: string;
  email_address: string;
  tags: string[];
  subtitle: string;
  description: string;
  logo_url: string;
  upvote_count: number;
  post_status: POST_STATUS_ENUM;
  created_at: Date;
  updated_at: Date;
}
