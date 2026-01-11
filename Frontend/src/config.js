const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
console.log("API Base URL:", API_BASE_URL);

export { API_BASE_URL };
export default API_BASE_URL;
