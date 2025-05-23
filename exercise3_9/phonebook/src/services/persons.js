import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";
//const baseUrl = "https://backend-divine-snow-4097.fly.dev/api/persons";
//const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  console.log(newObject);
  const request = axios.post(baseUrl, newObject);
  return request
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const f_delete = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  f_delete,
  update,
};
