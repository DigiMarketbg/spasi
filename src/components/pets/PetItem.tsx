
import React from "react";

interface PetItemProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  isApproved: boolean;
}

const PetItem: React.FC<PetItemProps> = ({ title, description, imageUrl, createdAt }) => {
  return (
    <div className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2 text-lime-700">{title}</h3>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title} className="mb-2 w-full max-h-64 object-cover rounded" />
      )}
      <p className="mb-2 text-gray-700">{description}</p>
      <p className="text-xs text-gray-500">Добавен на: {new Date(createdAt).toLocaleDateString('bg-BG')}</p>
    </div>
  );
};

export default PetItem;
