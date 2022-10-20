import { combineReducers } from "@reduxjs/toolkit";
import { appReducer } from "./app/app.reducer";
import { toastReducer } from "./app/toast.reducer";
import { userReducer } from "./app/user.reducer";
import { txReducer } from "./tx.reducer";
import { refetchReducer } from "./refetch.reducer";

const rootReducer = combineReducers({
  appConfig: appReducer.reducer,
  user: userReducer.reducer,
  toast: toastReducer.reducer,
  tx: txReducer.reducer,
  refetch: refetchReducer.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
