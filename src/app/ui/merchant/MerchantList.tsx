"use client";

import { Merchant } from "@/app/lib/models/Merchant";
import MerchantItem from "./MerchantItem";

interface MerchantListProps {
  merchants: Merchant[];
}
export default function MerchantList(props: MerchantListProps) {
  return (
    <>
      {props.merchants?.map((m, i) => (
        <MerchantItem key={m.merchant_id + "_" + i} merchant={m} />
      ))}
    </>
  );
}
