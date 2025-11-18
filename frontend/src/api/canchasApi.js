import axiosClient from "./axiosClient";

export const getCanchas = async () => {
  const response = await axiosClient.get("/api/canchas");
  return response.data; // array de canchas
};
