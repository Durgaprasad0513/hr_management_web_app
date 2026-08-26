import apiClient from './client';
import { ApiResponse, Employee } from '../types';

export const employeesApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; departmentId?: string; status?: string }) => {
    const { data } = await apiClient.get<ApiResponse<Employee[]>>('/employees', { params });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
    return data;
  },
  create: async (employeeData: Partial<Employee>) => {
    const { data } = await apiClient.post<ApiResponse<Employee>>('/employees', employeeData);
    return data;
  },
  update: async ({ id, ...employeeData }: Partial<Employee> & { id: string }) => {
    const { data } = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, employeeData);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/employees/${id}`);
    return data;
  },
  getDashboardStats: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>('/employees/dashboard-stats');
    return data;
  },
};
