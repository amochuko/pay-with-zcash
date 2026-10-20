import { POST_STATUS_ENUM } from "../typings";
import { Category } from "./Category";

export interface Merchant extends Partial<Category> {
  readonly merchant_id: string;
  merchant_name: string;
  website_url: string;
  email_address?: string;
  tags: string[];
  subtitle: string;
  description: string;
  country: string;
  state: string;
  city: string;
  logo_url: string;
  upvote_count: number;
  post_status: POST_STATUS_ENUM;
  created_at?: Date;
  updated_at?: Date;
}

export type MerchantProps = {
  data: Merchant[] | [];
  message: string | undefined;
};
