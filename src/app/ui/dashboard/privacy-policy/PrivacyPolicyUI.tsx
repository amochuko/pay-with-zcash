"use client";

import PrivacyPolicy from "@/app/lib/models/PrivacyPolicy";

type PrivacyPolicyProps = {
  policies: {
    data: PrivacyPolicy[];
    message: string;
  };
};

export default function PrivacyPolicyUI(props: PrivacyPolicyProps) {
  return (
    <div className="privacy-policy max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
      <header>
        <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-12">
          Privacy Policy
        </h1>

        <h2 className="text-2xl sm:text-3xl font-normal mb-6">
          Our website address is: https://paywithz.cash.
        </h2>
        <p className="text-lg mb-4 leading-relaxed">
          This privacy policy is used to inform website visitors regarding our
          policies with the collection, use, and disclosure of Personal
          Information if anyone decided to use our Service,
          https://paywithz.cash.
        </p>
        <p className="text-lg mb-4 leading-relaxed">
          If you choose to use our Service, then you agree to the collection and
          use of information in relation with this policy. We will not use or
          share your information with anyone except as described in this Privacy
          Policy.
        </p>
      </header>
      <div className="mt-18">
        <h3 className="text-1xl sm:text-2xl font-bold mb-12">
          Information Collection and Usage
        </h3>

        <ul>
          {props.policies.data &&
            props.policies.data.length > 0 &&
            props.policies.data.map((p, i) => (
              <li key={p.policy_id} className="not-last:mb-16">
                <h2 className="text-1xl sm:text-2xl font-normal mb-4">
                  {i + 1}. {p.title}
                </h2>
                {p.description.split(/\r?\n\s*\r?\n/).map((txt, idx) => (
                  <p
                    key={`${p.created_at.toString()}-${idx}`}
                    className="text-lg font-normal mb-4"
                  >
                    {txt}
                  </p>
                ))}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
