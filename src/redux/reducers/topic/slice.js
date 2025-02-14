import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  topics: [],
};

const topic = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    setTopics: (state, action) => {
      state.topics = action.payload;
    },
  },
});

export const { setTopics } = topic.actions;
export default topic.reducer;
