import axios from '@/axios';

export const UploadService = {
  async image(formData) {
    const res = await axios.post('/upload/image:upload', formData);
    return res;
  },

  async video(formData) {
    const res = await axios.post('/upload/video:upload', formData);
    return res;
  },
};
