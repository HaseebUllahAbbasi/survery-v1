import axios from "axios";
import { API_URL } from "../../constants";
export const getUsers = () => {
  return axios.get(`${API_URL}/users`).then((result) => result.data);
};

export const createUser = (name, sectors, agreed) => {
  return axios
    .post(`${API_URL}/users`, {
      name,
      sectors,
      agreed,
    })
    .then((result) => result.data);
};
export const updateUser = (id, name, sectors, agreed) => {
  return axios
    .put(`${API_URL}/users`, {
      id,
      name,
      sectors,
      agreed,
    })
    .then((result) => result.data);
};
