import axios from "axios";

export const getSectors = () => {
  return axios
    .get("http://localhost:5000/sectors")
    .then((result) => result.data);
};
