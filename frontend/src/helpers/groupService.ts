import { apiRequest } from "./api";
import { getToken } from "../utils/auth";

export const addColumnToGroup = async (
  projectId: string,
  groupId: string,
  name: string
) => {
  const token = getToken() ?? undefined;
  return apiRequest(`/project/${projectId}/groups/${groupId}/columns`, {
    method: "POST",
    token,
    body: { name },
  });
};

export const addTaskToColumn = async (
  projectId: string,
  groupId: string,
  columnId: string,
  title: string,
  description?: string
) => {
  const token = getToken() ?? undefined;

  return apiRequest(
    `/project/${projectId}/groups/${groupId}/columns/${columnId}/tasks`,
    {
      method: "POST",
      token,
      body: { title, description },
    }
  );
};

export const deleteTask = async (
  projectId: string,
  groupId: string,
  columnId: string,
  taskId: string
) => {
  const token = getToken() ?? undefined;
  return apiRequest(
    `/project/${projectId}/groups/${groupId}/columns/${columnId}/tasks/${taskId}`,
    { method: "DELETE", token }
  );
};

export const deleteColumn = async (
  projectId: string,
  groupId: string,
  columnId: string
) => {
  const token = getToken() ?? undefined;
  return apiRequest(
    `/project/${projectId}/groups/${groupId}/columns/${columnId}`,
    { method: "DELETE", token }
  );
};

export const deleteGroup = async (projectId: string, groupId: string) => {
  const token = getToken() ?? undefined;
  return apiRequest(`/project/${projectId}/groups/${groupId}`, {
    method: "DELETE",
    token,
  });
};
