"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Copy, Check, Heart, QrCode } from "lucide-react";

type DonationProps = {
  donationAddress: string;
};

export default function Donation(props: DonationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.donationAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Business Directory 
      </Link>

      {/* Introduction */}
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={22} className="text-[#FFB400]" />
          <span className="text-sm font-medium text-muted-foreground">
            Support PayWithZcash
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold">
          Support the Zcash ecosystem
        </h1>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          PayWithZcash helps connect Zcash users with businesses that accept ZEC
          payments. Your contribution helps us maintain and improve this
          directory and its supporting infrastructure.
        </p>
      </div>

      {/* Donation Card */}
      <div className="rounded-lg p-4 sm:p-6 md:p-8 shadow-lg bg-slate-600 dark:bg-slate-800">
        <h2 className="text-xl font-semibold text-slate-100">
          Make a ZEC donation
        </h2>

        <p className="mt-2 text-sm text-slate-200">
          Every contribution helps keep the project running. Donations are
          voluntary and appreciated.
        </p>

        {/* QR Code */}
        <div className="flex flex-col items-center my-8">
          <div className="flex items-center justify-center w-52 h-52 sm:w-60 sm:h-60 rounded-lg bg-white p-4">
            <div className="flex flex-col items-center justify-center text-slate-500">
              <QrCode size={64} />
              <span className="text-xs mt-3">Donation QR Code</span>
              <span className="text-[10px] mt-1">
                Replace with your actual QR code
              </span>
            </div>
          </div>

          <span className="mt-3 text-xs text-slate-300">
            Scan using your Zcash wallet
          </span>
        </div>

        {/* Donation Address */}
        <div>
          <label
            htmlFor="donation-address"
            className="block mb-2 text-sm font-medium text-slate-100"
          >
            Zcash Donation Address
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="donation-address"
              type="text"
              readOnly
              value={props.donationAddress}
              className="min-w-0 flex-1 rounded-md border p-3 text-xs sm:text-sm text-slate-800 bg-slate-200 outline-none"
            />

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 rounded px-4 py-3 text-sm font-medium text-black bg-[#FFB400] hover:bg-[#CF9B20] transition-colors"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Address
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-md bg-slate-700/60 p-3">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong>Important:</strong> Only send ZEC to this address. Always
            verify the address in your wallet before confirming a transaction.
          </p>
        </div>
      </div>

      {/* Transparency */}
      <div className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">What your donations support</h2>

        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <Heart size={17} className="shrink-0 text-[#FFB400]" />
            Maintaining the business directory.
          </li>

          <li className="flex gap-3">
            <Heart size={17} className="shrink-0 text-[#FFB400]" />
            Supporting Zcash payment infrastructure.
          </li>

          <li className="flex gap-3">
            <Heart size={17} className="shrink-0 text-[#FFB400]" />
            Improving the platform and adding new features.
          </li>
        </ul>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Thank you for supporting PayWithZcash and the broader Zcash ecosystem.
      </p>
    </div>
  );
}
