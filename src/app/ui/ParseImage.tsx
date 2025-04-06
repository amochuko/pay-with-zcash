import Image from "next/image";
import { Merchant } from "../lib/models/Merchant";

type ParsedImageProps = {
  merchant: Merchant;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
};

export default function ParsedImage(props: ParsedImageProps) {

  return (
    <>
      {props.merchant.logo_url ? (
        <Image
          src={props.merchant.logo_url}
          width={props.width ? props.width : 12}
          height={props.height ? props.height : 12}
          alt={`${props.merchant.merchant_name} Logo`}
          className={`w-${props.width} h-${props.height}  ${props.className}`}
          style={{ ...props.style }}
        />
      ) : (
        <Image
          src={`data:image/png;base64,${props.merchant.img_bin_data_url}`}
          alt={`${props.merchant.merchant_name} Logo`}
          className={`w-${props.width} h-${props.height}  ${props.className}`}
          width={props.width ? props.width : 12}
          height={props.height ? props.height : 12}
          style={{ ...props.style }}
        />
      )}
    </>
  );
}
