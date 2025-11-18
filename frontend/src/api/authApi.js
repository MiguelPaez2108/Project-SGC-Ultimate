import axiosClient from "./axiosClient";

export const loginApi = async (email, password) => {
  const response = await axiosClient.post("/api/auth/login", {
    email,
    password,
  });
  return response.data; // { token, usuarioId, rol }
};

export const registerApi = async (payload) => {
  const response = await axiosClient.post("/api/auth/register", payload);
  return response.data; // Usuario creado
};
