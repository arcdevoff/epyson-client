import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: {
    text: null,
    status: null,
  },
  showSidebar: false,
  window: {
    user: {
      menu: {
        isOpen: false,
      },
    },
    notifications: {
      isOpen: false,
      data: {
        unread: null,
      },
    },
  },
  modal: {
    auth: {
      signup: { isOpen: false },
      login: { isOpen: false },
    },
    subscribers: { isOpen: false },
    subscriptions: { isOpen: false },
    post: {
      create: { isOpen: false },
      edit: {
        isOpen: false,
        data: null,
      },
    },
    content: {
      complain: {
        isOpen: false,
        data: null,
      },
    },
  },
};

const ui = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    setModal: (state, action) => {
      state.modal[action.payload.modal] = action.payload.data;
    },
    setWindow: (state, action) => {
      state.window[action.payload.window] = action.payload.data;
    },
  },
});

export const { setMessage, setShowSidebar, setModal, setWindow } = ui.actions;
export default ui.reducer;
