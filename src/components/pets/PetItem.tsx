
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
    <div className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-3 text-lime-700">{title}</h3>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title}
          className="mb-4 w-full max-h-64 object-cover rounded"
        />
      )}
      <div className="text-gray-800 text-sm space-y-1 mb-2">
        <p><span className="font-semibold">Вид:</span> {description.split('\n')[0] || '-'}</p>
        {description.split('\n').slice(1).map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Добавен на: {new Date(createdAt).toLocaleDateString("bg-BG")}
      </p>
    </div>
  );
};

export default PetItem;
