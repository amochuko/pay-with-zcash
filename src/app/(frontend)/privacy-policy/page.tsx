import { getPolicies } from "@/app/actions/privacy-policy.action";
import PrivacyPolicyUI from "../../ui/dashboard/privacy-policy/PrivacyPolicyUI";

export default async function PrivacyPolicyPage() {
  const policies = await getPolicies();

  return (
    <>
      <PrivacyPolicyUI policies={policies} />
    </>
  );
}
