import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";
import {appReducer} from './app'
import { signReducer } from './sign'
import { create2Reducer } from './create2'
const PERSISTED_KEYS: string[] = ["sign.hashArr","app.theme"];
const store = configureStore({
  reducer: {
    app: appReducer,
    create2: create2Reducer,
    sign:signReducer
  },
  middleware: [
    ...getDefaultMiddleware(),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS })
});

export type AppState = ReturnType<typeof store.getState>;
export default store;
