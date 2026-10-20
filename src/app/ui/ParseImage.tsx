import Image from "next/image";
import { Merchant } from "../lib/types/merchant.types";

type ParsedImageProps = {
  merchant: Merchant;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
};

export default function ParsedImage(props: ParsedImageProps) {
  return (
    <Image
      src={props.merchant.logo_url}
      width={props.width ? props.width : 12}
      height={props.height ? props.height : 12}
      alt={`${props.merchant.merchant_name} Logo`}
      className={`w-${props.width} h-${props.height}  ${props.className}`}
      style={{ ...props.style }}
    />
  );
}
