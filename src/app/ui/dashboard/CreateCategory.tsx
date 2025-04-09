"use client";

import { useState } from "react";
import CreaateCategoryModal from "./CreateCategoryModal";

export default function CreateCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="text-xl font-semibold text-white cursor-pointer border-amber-300 border-1 p-4 w-50 sm:h-16"
        onClick={openModal}
      >
        Create Category
      </button>

      <CreaateCategoryModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
