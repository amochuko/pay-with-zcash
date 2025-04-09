import { getPolicies } from "@/app/actions/privacy-policy.action";
import PrivacyPolicyList from "@/app/ui/dashboard/privacy-policy/PrivatePolicyList";

export default async function PrivacyPolicyPage() {
  const result = await getPolicies();

  return (
    <div className="privacy-policy-dashboard">
      <PrivacyPolicyList policyObj={result} />
    </div>
  );
}
