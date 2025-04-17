import { apiRequest } from './api';
import { getToken } from '../utils/auth';

export const addColumnToGroup = async (
  projectId: string,
  groupId: string,
  name: string
) => {
  const token = getToken() ?? undefined;
  return apiRequest(
    `/project/${projectId}/groups/${groupId}/columns`,
    { method: 'POST', token, body: { name } }
  );
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
        method: 'POST',
        token,
        body: { title, description },
      }
    );
  };
