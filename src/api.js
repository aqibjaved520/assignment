import axios from "axios";

const API_BASE_URL = "https://assignment-backend-virid.vercel.app";

export const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
};

export const getTasks = async () => {
  const response = await axios.get(`${API_BASE_URL}/tasks`, { headers: authHeader() });
  return response.data;
};

export const createTask = async (task) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, task, { headers: authHeader() });
  return response.data;
};

export const updateTask = async (taskId, updatedTask) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updatedTask, {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, { headers: authHeader() });
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`, { headers: authHeader() });
  return response.data;
};

export const addUser = async (user) => {
  const response = await axios.post(`${API_BASE_URL}/users`, user, { headers: authHeader() });
  return response.data;
};

export const updateUserRole = async (userId, updatedFields) => {
  const response = await axios.put(`${API_BASE_URL}/users/${userId}`, updatedFields, {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, { headers: authHeader() });
  return response.data;
};

export const getRoles = async () => {
  const response = await axios.get(`${API_BASE_URL}/roles`, { headers: authHeader() });
  return response.data;
};

export const addRole = async (role) => {
  const response = await axios.post(`${API_BASE_URL}/roles`, role, { headers: authHeader() });
  return response.data;
};

export const updateRole = async (roleId, updatedRole) => {
  const response = await axios.put(`${API_BASE_URL}/roles/${roleId}`, updatedRole, {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteRole = async (roleId) => {
  const response = await axios.delete(`${API_BASE_URL}/roles/${roleId}`, { headers: authHeader() });
  return response.data;
};

export const addCapabilitiesToRole = async (roleId, capabilities) => {
  const response = await axios.put(
    `${API_BASE_URL}/roles/${roleId}/capabilities`,
    { capabilities },
    { headers: authHeader() }
  );
  return response.data;
};
