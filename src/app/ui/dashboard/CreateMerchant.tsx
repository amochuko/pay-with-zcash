"use client";

import { useState } from "react";
import CreateButton from "../CreateButton";
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
      <CreateButton label="Create Merchant" openModal={openModal} />
      <CreateMerchantModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
