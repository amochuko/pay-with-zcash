"use client";

import { useState } from "react";
import CreateButton from "../CreateButton";
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
      <CreateButton openModal={openModal} label={"Create Category"} />
      <CreaateCategoryModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
