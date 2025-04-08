import { getPolicies } from "@/app/actions/privayc-policy.action";
import PrivacyPolicy from "@/app/lib/models/PrivacyPolicy";
import PrivacyPolicyList from "@/app/ui/dashboard/privacy-policy/PrivatePolicyList";

export default async function PrivacyPolicyPage() {
  const policies = await getPolicies();

  return (
    <div className="privacy-policy-dashboard">
      <PrivacyPolicyList policies={policies.data as PrivacyPolicy[]} />
    </div>
  );
}
