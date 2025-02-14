import axios from '@/axios';

export const PostService = {
  async create({ title, text, attachments, topic_id, tags }) {
    const res = await axios.post('/posts:authorized', { title, text, attachments, topic_id, tags });
    return res;
  },

  async getById({ id, ip }) {
    const { data } = await axios.get(`/posts/${id}`, {
      headers: {
        ip,
      },
    });
    return data;
  },

  async getRecommendationsById({ page, limit, id }) {
    const { data } = await axios.get(`/posts/${id}/recommendations?page=${page}&limit=${limit}`);
    return data;
  },

  async deleteById(id) {
    const res = await axios.delete(`/posts/${id}:authorized`);
    return res;
  },

  async updateById({ id, title, text, topic_id, tags }) {
    const res = await axios.patch(`/posts/${id}:authorized`, { title, text, topic_id, tags });
    return res;
  },

  async getInfoById(id) {
    const { data } = await axios.get(`/posts/${id}/info`);
    return data;
  },

  async reaction({ action, id, author }) {
    const res = await axios.post(`/posts/reaction:authorized`, { post_id: id, action, author });
    return res;
  },

  async addComment({ post_id, parent_id, text, parent_user_id }) {
    const { data } = await axios.post(`/posts/${post_id}/comments:authorized`, {
      parent_id,
      text,
      parent_user_id,
    });
    return data;
  },

  async getComments({ id, page, limit, filter }) {
    const { data } = await axios.get(
      `/posts/${id}/comments?page=${page}&limit=${limit}&filter=${filter}`,
    );
    return data;
  },

  async getCommentById({ comment_id }) {
    const { data } = await axios.get(`/posts/comments/${comment_id}`);
    return data;
  },

  async deleteCommentById({ comment_id }) {
    const res = await axios.delete(`/posts/comments/${comment_id}:authorized`);
    return res;
  },

  async getRepliesComments(id) {
    const { data } = await axios.get(`/posts/${id}/comments/replies`);
    return data;
  },

  async search({ limit, page, query }) {
    const { data } = await axios.get(`/posts/search?limit=${limit}&page=${page}&query=${query}`);
    return data;
  },

  async getByTag({ limit, page, tag }) {
    const { data } = await axios.get(`/posts/tag?limit=${limit}&page=${page}&tag=${tag}`);
    return data;
  },
};
