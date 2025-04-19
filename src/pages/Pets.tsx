
import React from "react";
import PetForm from "@/components/pets/PetForm";

const Pets = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <PetForm onSuccess={() => {}} />
    </div>
  );
};

export default Pets;
