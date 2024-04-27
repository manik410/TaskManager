import { configureStore, combineReducers } from "@reduxjs/toolkit";
import TasksReducer from "./slice/addTaskSlice";
import ConfigReducer from "./slice/systemConfig";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  tasks: TasksReducer,
  config: ConfigReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["tasks"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
