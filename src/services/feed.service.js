import axios from '@/axios';

const FeedService = {
  async popular({ page, limit }) {
    const { data } = await axios.get(`/feed/popular?page=${page}&limit=${limit}`);
    return data;
  },

  async new({ page, limit }) {
    const { data } = await axios.get(`/feed/new?page=${page}&limit=${limit}`);
    return data;
  },

  async my({ page, limit }) {
    const { data } = await axios.get(`/feed/my?page=${page}&limit=${limit}`);
    return data;
  },
};

export default FeedService;
