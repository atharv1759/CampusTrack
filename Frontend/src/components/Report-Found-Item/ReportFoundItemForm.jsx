import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../config";
import CategoryDropdown from "./CategoryDropdown";

const ReportFoundItemForm = ({ user }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    placeFound: "",
    timeFound: "",
    category: "", 
  });

  const [dateFound, setDateFound] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const { itemName, itemDescription, placeFound, timeFound, category } =
      formData;

    if (
      !itemName ||
      !itemDescription ||
      !placeFound ||
      !timeFound ||
      !dateFound ||
      !image ||
      !category
    ) {
      toast.error("Please fill all required fields including category.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("itemName", itemName);
      data.append("itemDescription", itemDescription);
      data.append("placeFound", placeFound);
      data.append("timeFound", timeFound);
      data.append("dateFound", dateFound.toISOString().split("T")[0]);
      data.append("category", category);
      data.append("image", image);

      const response = await axios.post(`${API_BASE_URL}/found-items`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);

      setFormData({
        itemName: "",
        itemDescription: "",
        placeFound: "",
        timeFound: "",
        category: "",
      });

      setDateFound(null);
      setImage(null);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to report found item"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-black text-gray-200 placeholder-gray-400 border border-orange-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition";

  return (
    <form className="space-y-5 bg-black p-6 rounded-xl shadow-lg">
      {/* Item Name */}
      <div>
        <label className="block mb-1 font-medium text-orange-400">
          Item Name *
        </label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="Enter item name"
          className={inputClasses}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium text-orange-400">
          Category *
        </label>
        <CategoryDropdown
          value={formData.category}
          onChange={(cat) => setFormData({ ...formData, category: cat })}
          dark
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium text-orange-400">
          Description *
        </label>
        <textarea
          name="itemDescription"
          value={formData.itemDescription}
          onChange={handleChange}
          placeholder="Describe the found item"
          className={inputClasses + " h-24 resize-none"}
        />
      </div>

      {/* Date & Time Found */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-orange-400">
            Date Found *
          </label>
          <DatePicker
            selected={dateFound}
            onChange={(date) => setDateFound(date)}
            className={inputClasses}
            placeholderText="Select date"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-orange-400">
            Time Found *
          </label>
          <input
            type="text"
            name="timeFound"
            value={formData.timeFound}
            onChange={handleChange}
            placeholder="e.g., 11:30 AM"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Place Found */}
      <div>
        <label className="block mb-1 font-medium text-orange-400">
          Place Found *
        </label>
        <input
          type="text"
          name="placeFound"
          value={formData.placeFound}
          onChange={handleChange}
          placeholder="Where did you find it?"
          className={inputClasses}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-1 font-medium text-orange-400">
          Upload Image *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={inputClasses + " cursor-pointer"}
        />
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="cursor-pointer w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white py-2.5 rounded-xl font-semibold shadow-lg  hover:scale-105 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Reporting..." : "Report Found Item"}
      </button>
    </form>
  );
};

export default ReportFoundItemForm;
