import axios from '@/axios';

export const UserService = {
  async getProfile() {
    const res = await axios.get('/users/profile:authorized');
    return res;
  },

  async changeProfile({ name, description }) {
    const res = await axios.patch('/users/profile:authorized', { name, description });
    return res;
  },

  async changeCover(cover) {
    const res = await axios.patch('/users/profile/cover:authorized', { cover });
    return res;
  },

  async changeAvatar(avatar) {
    const res = await axios.patch('/users/profile/avatar:authorized', { avatar });
    return res;
  },

  async getById(id) {
    const res = await axios.get(`/users/${id}`);
    return res;
  },

  async confirm(token) {
    const res = await axios.post('/users/confirm', { token });
    return res;
  },

  async subscription({ target_id, action }) {
    const res = await axios.post('/users/subscription:authorized', { target_id, action });

    return res.status === 200;
  },

  async getSubscribersById({ id, page, limit }) {
    const { data } = await axios.get(`/users/${id}/info/subscribers?page=${page}&limit=${limit}`);
    return data;
  },

  async getSubscriptionsById({ id, page, limit }) {
    const { data } = await axios.get(`/users/${id}/info/subscriptions?page=${page}&limit=${limit}`);
    return data;
  },

  async getInfoById({ id }) {
    const { data } = await axios.get(`/users/${id}/info`, { id });
    return data;
  },

  async getFeed({ id, page, limit, filter }) {
    const { data } = await axios.get(
      `/users/${id}/feed?page=${page}&limit=${limit}&filter=${filter}`,
    );
    return data;
  },

  async search({ limit, page, query }) {
    const { data } = await axios.get(`/users/search?limit=${limit}&page=${page}&query=${query}`);
    return data;
  },
};
