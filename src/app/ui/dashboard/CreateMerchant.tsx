"use client";

import { useState } from "react";
import CreateMerchantModal from "./CreateMerchantModal";

export default function CreateMerchant() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <h2
        className="text-xl font-semibold text-white cursor-pointer border-amber-300 border-1 p-4 w-50"
        onClick={openModal}
      >
        Create Merchant
      </h2>

      <CreateMerchantModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
