import React, { useEffect } from "react";

const FoundItemModal = ({ item, onClose }) => {
  // Disable scrolling when modal is open
  useEffect(() => {
    if (item) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [item]);

  if (!item) return null;

  const imageUrl = item.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-[#0d0d0d] w-11/12 md:w-2/3 lg:w-1/2 p-8 max-h-[90vh] overflow-y-auto z-10
        rounded-2xl shadow-[0_0_20px_rgba(255,115,0,0.4)] border border-orange-500/40"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold cursor-pointer"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold mb-6 text-orange-400 border-b border-orange-500/30 pb-2">
          {item.itemName}
        </h2>

        {/* Content */}
        <div className="space-y-3 text-gray-300">
          <p>
            <strong className="text-orange-400">Description:</strong>{" "}
            {item.itemDescription || "-"}
          </p>

          <p>
            <strong className="text-orange-400">Date Found:</strong>{" "}
            {new Date(item.dateFound).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

          <p>
            <strong className="text-orange-400">Time:</strong> {item.timeFound}
          </p>

          <p>
            <strong className="text-orange-400">Place:</strong>{" "}
            {item.placeFound}
          </p>

          <p>
            <strong className="text-orange-400">Reported By:</strong>{" "}
            {item.userName}
          </p>

          <p>
            <strong className="text-orange-400">Email:</strong>{" "}
            {item.userEmail}
          </p>

          {imageUrl && (
            <div>
              <strong className="text-orange-400">Image:</strong>
              <img
                src={imageUrl}
                alt={item.itemName}
                className="mt-2 w-54 h-54 rounded-xl object-cover border border-orange-500/40 shadow-[0_0_10px_rgba(255,115,0,0.3)]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoundItemModal;
