import Image from "next/image";
import { MerchantRecord } from "../lib/types/map.types";

type ParsedImageProps = {
  merchant: MerchantRecord;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
};

export default function ParsedImage(props: ParsedImageProps) {
  return (
    <Image
      src={props.merchant.logoUrl!}
      width={props.width ? props.width : 12}
      height={props.height ? props.height : 12}
      alt={`${props.merchant.name} Logo`}
      className={`w-${props.width} h-${props.height}  ${props.className}`}
      style={{ ...props.style }}
    />
  );
}
