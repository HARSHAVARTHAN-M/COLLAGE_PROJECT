import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

const initialState = {
  users: [],
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchAllUsersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
    },
    fetchAllUsersFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addNewAdminRequest(state) {
      state.loading = true;
    },
    addNewAdminSuccess(state) {
      state.loading = false;
    },
    addNewAdminFailed(state) {
      state.loading = false;
    },
  },
});

export const fetchAllUsers = () => async (dispatch) => {
  try {
    dispatch(userSlice.actions.fetchAllUsersRequest());
    const { data } = await axios.get("http://localhost:4000/api/v1/user/all", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    
    if (data.success) {
      dispatch(userSlice.actions.fetchAllUsersSuccess(data.users));
    } else {
      dispatch(userSlice.actions.fetchAllUsersFailed(data.message || "Failed to fetch users"));
    }
  } catch (error) {
    dispatch(userSlice.actions.fetchAllUsersFailed(
      error.response?.data?.message || "Failed to fetch users"
    ));
  }
};

export const addNewAdmin = (data) => async (dispatch) => {
  dispatch(userSlice.actions.addNewAdminRequest());
  await axios.post("http://localhost:4000/api/v1/user/add/new-admin", data, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => {
    dispatch(userSlice.actions.addNewAdminSuccess(res.data));
    toast.success(res.data.message);
    dispatch(toggleAddNewAdminPopup());
  }).catch((err) => {
    dispatch(userSlice.actions.addNewAdminFailed(err.response.data.message));
    // toast.error(err.response.data.message);
  });
};

export default userSlice.reducer;
