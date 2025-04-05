import { POST_STATUS_ENUM } from "../typings";

export interface Merchant {
  readonly merchant_id?: string;
  merchant_name: string;
  category_id: string;
  logo_img_id: string;
  website_url: string;
  email_address: string;
  tags: string[];
  subtitle: string;
  description: string;
  logo_url: string;
  upvote_count: number;
  post_status: POST_STATUS_ENUM;
  created_at?: Date;
  updated_at?: Date;
}

export interface MerchantWithImgBinData extends Merchant {
  img_id: string;
  img_name: string;
  img_bin_data_url: string;
  img_bin_data?: Buffer;
}
