import axios from '@/axios';

const NotificationService = {
  async getAll({ page, limit }) {
    const { data } = await axios.get(`/notifications?limit=${limit}&page=${page}:authorized`);
    return data;
  },

  async getInfo() {
    const { data } = await axios.get(`/notifications/info:authorized`);
    return data;
  },
};

export default NotificationService;
