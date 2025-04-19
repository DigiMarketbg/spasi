
import React from "react";
import PetForm from "@/components/pets/PetForm";

const Pets = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Добави домашен любимец</h1>
        <PetForm onSuccess={() => {}} />
      </div>
    </div>
  );
};

export default Pets;
