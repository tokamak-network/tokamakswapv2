import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../reducers";

type UserBalnace = {
  wton: string;
  wtonOrigin: string;
  ton: string;
  tonOrigin: string;
};

export type User = {
  account: string;
  library: any;
  balance: UserBalnace;
  // tosBalance: string;
};

interface IUser {
  data: User;
  loading: "idle" | "pending";
  error: any;
  currentRequestId?: string;
}

const initialState = {
  loading: "idle",
  error: null,
  currentRequestId: undefined,
} as IUser;

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

// @ts-ignore
export const selectUser = (state: RootState) => state.user;
// @ts-ignore
export const selectBalance = (state: RootState) => state.user.data.balance;
