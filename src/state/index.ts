import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";
import {appReducer} from './app'
import { signReducer } from './sign'
const PERSISTED_KEYS: string[] = ["sign"];
const store = configureStore({
  reducer: {
    app: appReducer,
    sign:signReducer
  },
  middleware: [
    ...getDefaultMiddleware(),
    save({ states: PERSISTED_KEYS })
  ],
  preloadedState: load({ states: PERSISTED_KEYS })
});
export type AppState = ReturnType<typeof store.getState>;
export default store;
