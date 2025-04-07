'use client'
import PrivacyPolicyForm from "./PrivacyPolicyForm";

export default function PrivacyPolicy() {
  const handleAddPolicy = () => {};
  return (
    <div className="privacy-policy">
      <h1>Privacy Policy</h1>

      <div>
        <button onClick={handleAddPolicy}>Add</button>
      </div>

      <PrivacyPolicyForm/>
    </div>
  );
}
