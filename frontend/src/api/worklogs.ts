
import axios from 'axios';
import { WorkLogCreate, WorkLogUpdate, WorkLogResponse, WorkLogSubmit } from '@/types/worklog';

const API_URL = '/worklogs';

export const worklogService = {
  async submitLog(worklog: WorkLogSubmit): Promise<void> {
    const response = await axios.post(`${API_URL}/submit`, worklog);
    return response.data;
  },

  async addLogs(): Promise<WorkLogResponse[]> {
    const response = await axios.get(`${API_URL}/add`);
    return response.data;
  },

  async showWorklogs(): Promise<WorkLogResponse[]> {
    const response = await axios.get(`${API_URL}/show`);
    return response.data;
  },

  async searchWorklogs(query: string): Promise<WorkLogResponse[]> {
    const response = await axios.get(`${API_URL}/search`, { params: { q: query } });
    return response.data;
  },

  async createWorklog(worklog: WorkLogCreate): Promise<WorkLogResponse> {
    const response = await axios.post(API_URL, worklog);
    return response.data;
  },

  async getWorklogById(worklogId: number): Promise<WorkLogResponse> {
    const response = await axios.get(`${API_URL}/by-id/${worklogId}`);
    return response.data;
  },

  async getWorklogByUuid(worklogUuid: string): Promise<WorkLogResponse> {
    const response = await axios.get(`${API_URL}/by-uuid/${worklogUuid}`);
    return response.data;
  },

  async editWorklogByUuid(worklogUuid: string, updateData: WorkLogUpdate): Promise<WorkLogResponse> {
    const response = await axios.put(`${API_URL}/by-uuid/${worklogUuid}`, updateData);
    return response.data;
  },

  async getAllWorklogs(): Promise<WorkLogResponse[]> {
    const response = await axios.get(API_URL);
    return response.data;
  }
};
