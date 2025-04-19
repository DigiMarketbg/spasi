
import React from "react";
import PetForm from "@/components/pets/PetForm";

const Pets = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full rounded-lg p-8 shadow-lg border border-gray-700 bg-gray-900/80 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-gray-100 mb-6 text-center">Добави домашен любимец</h1>
        <PetForm onSuccess={() => {}} />
      </div>
    </div>
  );
};

export default Pets;
