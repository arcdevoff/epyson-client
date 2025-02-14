import axios from '@/axios';
import { queryClient } from '@/components/providers/MainProvider';

export const AuthService = {
  async login(values) {
    const res = await axios.post('/auth/login', { ...values });
    return res;
  },

  async signup(values) {
    const res = await axios.post('/auth/signup', { ...values });
    return res;
  },

  async refreshToken() {
    const res = await axios.get('/auth/refresh');
    return res;
  },

  async logout() {
    const res = await axios.post('/auth/logout');
    queryClient.refetchQueries({ queryKey: ['topics'] });
    return res;
  },
};
