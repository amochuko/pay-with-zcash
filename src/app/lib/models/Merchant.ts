import { POST_STATUS_ENUM } from "../typings";
import { Category } from "./Category";

export interface Merchant extends Partial<Category>, LogoImage {
  readonly merchant_id: string;
  merchant_name: string;
  logo_img_id: string;
  website_url: string;
  tags: string[];
  subtitle: string;
  description: string;
  logo_url: string;
  upvote_count: number;
  post_status: POST_STATUS_ENUM;
  created_at?: Date;
  updated_at?: Date;
}

export interface LogoImage {
  img_id?: string;
  img_name?: string;
  img_bin_data_url?: string;
  img_bin_data?: Buffer;
}

export type MerchantProps = {
  data: Merchant[] | [];
  message: string | undefined;
};
