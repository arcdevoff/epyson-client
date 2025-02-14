import axios from '@/axios';
import { setTopics } from '@/redux/reducers/topic/slice';
import store from '@/redux/store';

export const TopicService = {
  async getAllSidebar({ limit, page }) {
    const { data } = await axios.get(`/topics?limit=${limit}&page=${page}`);
    return data;
  },

  async getAll() {
    const { data } = await axios.get('/topics/all');
    return data;
  },

  async getBySlug(slug) {
    const { data } = await axios.get(`/topics/${slug}`);
    return data;
  },

  async getInfoById({ id }) {
    const { data } = await axios.get(`/topics/${id}/info`, { id });
    return data;
  },

  async getSubscribersById({ id, page, limit }) {
    const { data } = await axios.get(`/topics/${id}/info/subscribers?page=${page}&limit=${limit}`);
    return data;
  },

  async subscription({ target_id, action }) {
    const res = await axios.post('/topics/subscription:authorized', { target_id, action });
    return res.status === 200;
  },

  async getFeed({ id, page, limit, filter }) {
    const { data } = await axios.get(
      `/topics/${id}/feed?page=${page}&limit=${limit}&filter=${filter}`,
    );
    return data;
  },
};
