import { configureStore } from '@reduxjs/toolkit';

import ui from './reducers/ui/slice';
import user from './reducers/user/slice';
import topic from './reducers/topic/slice';

const store = configureStore({
  reducer: { ui, user, topic },
});

export default store;
