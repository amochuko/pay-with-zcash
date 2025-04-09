"use client";

import { deleteById } from "@/app/actions/privacy-policy.action";
import PrivacyPolicy from "@/app/lib/models/PrivacyPolicy";
import { formatDateToHumanReadable } from "@/app/lib/utils/string";
import { Suspense, useState } from "react";
import CreatePrivayPolicyModal from "./CreatePrivacyPolicyModal";

type PrivacyPolicyListProps = {
  policyObj: { data: PrivacyPolicy[]; message: string | undefined };
};

const PrivacyPolicyList = (props: PrivacyPolicyListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenModal = () => {
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="privacy-policy-list max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between my-12 md:my-24">
        <h1 className="text-3xl mb-4"> List of Privacy Policy</h1>
        <Suspense fallback={<p>Failed to create Policy</p>}>
          <button
            className="policy-btn uppercase text-xl font-semibold text-white cursor-pointer border-amber-300 border-1 p-4 w-50 sm:h-16"
            onClick={onOpenModal}
          >
            Add Policy
          </button>
          <CreatePrivayPolicyModal
            isOpen={isModalOpen}
            onClose={onCloseModal}
          />
        </Suspense>
      </div>
      <div className="search mb-8 text-lg"></div>
      <div className="bg-slate-700 rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-900">
                <th className="px-4 py-2 text-left">S/N</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Date Created</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Edit</th>
                <th className="px-4 py-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {props.policyObj.data &&
                props.policyObj.data.length > 0 &&
                props.policyObj.data.map((p, i) => (
                  <tr key={p.policy_id}>
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{p.title}</td>
                    <td className="px-4 py-2">{p.description}</td>
                    <td className="px-4 py-2">
                      {formatDateToHumanReadable(p.created_at.toString())}
                    </td>
                    <td className="px-4 py-2">{"NIL"}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => {}}>Update</button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="text-slate-900 border-2 p-2 rounded-md bg-red-300 cursor-pointer"
                        onClick={async () => {
                          const response = window.confirm(
                            `Do you want to delete this policy?`
                          );

                          if (response) {
                            await deleteById(p.policy_id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {props.policyObj.data.length === 0 && props.policyObj.message && (
            <p className="text-base font-medium text-white text-center mt-12">
              {props.policyObj.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyList;
