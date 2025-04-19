
import React from "react";

interface GoodDeedItemProps {
  description?: string;
  authorName?: string | null;
  createdAt?: string;
}

const GoodDeedItem = ({ description, authorName, createdAt }: GoodDeedItemProps) => {
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString("bg-BG") : "";

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {description && <p className="mb-2 text-gray-700 whitespace-pre-line">{description}</p>}
      <div className="text-sm text-gray-500 flex justify-between">
        <span>{authorName || "Анонимен"}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default GoodDeedItem;
