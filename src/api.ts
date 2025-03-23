import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchInstitutes = async () => {
  const response = await axios.get(`${API_URL}/institutes`);
  return response.data;
};
