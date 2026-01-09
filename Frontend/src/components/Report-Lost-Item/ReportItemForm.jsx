import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../config";
import CategoryDropdown from "../Report-Found-Item/CategoryDropdown";

const ReportItemForm = ({ user }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    timeRange: "",
    location: "",
    itemCategory: "",   
    identificationMark: "",
  });

  const [dateLost, setDateLost] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const { itemName, itemDescription, timeRange, location, itemCategory } = formData;

    if (!itemName || !itemDescription || !dateLost || !timeRange || !location || !itemCategory) {
      toast.error("Please fill all required fields including category.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();
      formDataToSend.append("itemName", formData.itemName);
      formDataToSend.append("itemDescription", formData.itemDescription);
      formDataToSend.append("dateLost", dateLost.toISOString().split("T")[0]);
      formDataToSend.append("timeRange", formData.timeRange);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("itemCategory", formData.itemCategory);
      formDataToSend.append("identificationMark", formData.identificationMark);
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await axios.post(`${API_BASE_URL}/lost-items`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);

      setFormData({
        itemName: "",
        itemDescription: "",
        timeRange: "",
        location: "",
        itemCategory: "",
        identificationMark: "",
      });
      setDateLost(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to report item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5">

      {/* Item Name */}
      <div>
        <label className="block mb-1 font-medium text-gray-200">Item Name *</label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="Enter item name"
          className="w-full bg-black border border-orange-500 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block mb-1 font-medium text-gray-200">Category *</label>
        <CategoryDropdown
          value={formData.itemCategory}
          onChange={(cat) => setFormData({ ...formData, itemCategory: cat })}
          dark
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium text-gray-200">Description *</label>
        <textarea
          name="itemDescription"
          value={formData.itemDescription}
          onChange={handleChange}
          placeholder="Describe your item"
          className="w-full bg-black border border-orange-500 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-200">Date Lost *</label>
          <DatePicker
            selected={dateLost}
            onChange={(date) => setDateLost(date)}
            className="w-full bg-black border border-orange-500 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholderText="Select date"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-200">Time Range *</label>
          <input
            type="text"
            name="timeRange"
            value={formData.timeRange}
            onChange={handleChange}
            placeholder="e.g., 10:00 AM - 12:00 PM"
            className="w-full bg-black border border-orange-500 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block mb-1 font-medium text-gray-200">Location *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Where did you lose it?"
          className="w-full bg-black border border-orange-500 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* Identification Mark */}
      <div>
        <label className="block mb-1 font-medium text-gray-200">Identification Mark</label>
        <input
          type="text"
          name="identificationMark"
          value={formData.identificationMark}
          onChange={handleChange}
          placeholder="Any unique marks?"
          className="w-full bg-black border border-orange-500 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-1 font-medium text-gray-200">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full bg-black border border-orange-500 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
        />
        {imagePreview && (
          <div className="mt-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-xs rounded-lg border-2 border-orange-500"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white py-2.5 rounded-xl font-semibold shadow hover:scale-105 transform transition duration-300 disabled:opacity-50"
      >
        {loading ? "Reporting..." : "Report Lost Item"}
      </button>
    </form>
  );
};

export default ReportItemForm;
