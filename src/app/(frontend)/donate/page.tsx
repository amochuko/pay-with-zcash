import Donation from "@/app/ui/donation";

export default function DonatePage() {
  return (
    <>
      <Donation donationAddress={process.env.DONATION_ADDRESS!} />
    </>
  );
}
