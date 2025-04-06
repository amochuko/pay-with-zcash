import Image from "next/image";
import { Merchant } from "../lib/models/Merchant";

type ParsedImageProps = {
  merchant: Merchant;
};

export default function ParsedImage(props: ParsedImageProps) {
  return (
    <>
      {props.merchant.logo_url ? (
        <Image
          src={props.merchant.logo_url}
          width={12}
          height={12}
          alt={`${props.merchant.merchant_name} Logo`}
          className="w-12 h-12"
        />
      ) : (
        <Image
          src={`data:image/png;base64,${props.merchant.img_bin_data_url}`}
          width={12}
          height={12}
          alt={`${props.merchant.merchant_name} Logo`}
          className="w-12 h-12"
        />
      )}
    </>
  );
}
