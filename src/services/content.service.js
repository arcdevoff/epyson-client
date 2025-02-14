import axios from '@/axios';

export const ContentSerivce = {
  async complaint({ content, reason }) {
    const res = await axios.post('/content/complaint', { content, reason });
    return res;
  },
};
