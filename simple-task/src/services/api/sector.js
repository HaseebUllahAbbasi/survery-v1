import axios from "axios";
import { API_URL } from "../../constants";
export const getSectors = () => {
  return axios.get(`${API_URL}/sectors`).then((result) => result.data);
};
