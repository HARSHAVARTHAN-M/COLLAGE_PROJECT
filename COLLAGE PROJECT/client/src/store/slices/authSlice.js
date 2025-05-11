import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleSettingPopup } from "./popUpSlice";

/* const initialState = {
    user: {
      name: "Test User",
      email: "test@example.com",
      role: "User", // or "Admin"
    },
    isAuthenticated: true,
    loading: false,
    error: null,
    message: null
  }; */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    /*     role: "Admin",  */
    isAuthenticated: false,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      (state.loading = false), (state.message = action.payload.message);
    },
    registerFailed(state, action) {
      (state.loading = false), (state.error = action.payload);
    },
    otpVerificationRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    otpVerificationSuccess(state, action) {
      (state.loading = false), (state.message = action.payload.message);
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    otpVerificationFailed(state, action) {
      (state.loading = false), (state.error = action.payload);
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      (state.loading = false), (state.message = action.payload.message);
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state, action) {
      (state.loading = false), (state.error = action.payload);
    },
    logoutRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess(state, action) {
      (state.loading = false), (state.message = action.payload);
      state.isAuthenticated = false;
      state.user = action.payload.user;
    },
    logoutFailed(state, action) {
      (state.loading = false), (state.error = action.payload);
      state.message = null;
    },
    getUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess(state, action) {
      /*       (state.loading = false), (state.message = action.payload.message);
      state.user = action.payload.user;
      state.isAuthenticated = true; */
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    getUserFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      /* 
      (state.loading = false)
       */
    },
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      (state.loading = false), (state.message = action.payload.message);
    },
    forgotPasswordFailed(state, action) {
      (state.loading = false), (state.error = action.payload);
    },
    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      (state.loading = false), (state.message = action.payload.message);
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    resetPasswordFailed(state, action) {
      (state.loading = false), (state.error = action.payload);
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess(state, action) {
      (state.loading = false), (state.message = action.payload);
    },
    updatePasswordFailed(state, action) {
      (state.loading = false), (state.error = action.payload);
    },

    resetAuthSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.user = state.user;
      state.isAuthenticated = state.isAuthenticated;
    },
  },
});

export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

export const register = (data) => async (dispatch) => {
  dispatch(authSlice.actions.registerRequest());
  await axios
    .post("http://localhost:4000/api/v1/auth/register", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(authSlice.actions.registerSuccess(res.data));
    })
    .catch((error) => {
      dispatch(authSlice.actions.registerFailed(error.response.data.message));
    });
};

export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(authSlice.actions.otpVerificationRequest());
  await axios
    .post(
      "http://localhost:4000/api/v1/auth/verify-otp",
      { email, otp },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(authSlice.actions.otpVerificationSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.otpVerificationFailed(error.response.data.message)
      );
    });
};

export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  await axios
    .post(
      "http://localhost:4000/api/v1/auth/login",
      //{ email, otp }, // This is wrong, should use data
      data, // Use the data parameter instead of {email, otp}
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(authSlice.actions.loginSuccess(res.data));
    })
    .catch((error) => {
      dispatch(authSlice.actions.loginFailed(error.response.data.message));
    });
};

export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  await axios
    .get("http://localhost:4000/api/v1/auth/logout", {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(authSlice.actions.logoutSuccess(res.data.message));
      dispatch(authSlice.actions.resetAuthSlice());
    })
    .catch((error) => {
      dispatch(authSlice.actions.logoutFailed(error.response.data.message));
    });
};

export const getUser = () => async (dispatch) => {
  try {

/*     dispatch(authSlice.actions.getUserRequest());
    await axios
      .get("http://localhost:4000/api/v1/auth/me", {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(authSlice.actions.getUserSuccess(res.data));
      })
      .catch((error) => {
        //dispatch(authSlice.actions.getUserFailed(error.response.data.message));
        // Only dispatch error for non-401 responses
        if (error.response?.status !== 401) {
          dispatch(
            authSlice.actions.getUserFailed(error.response?.data?.message) */

    dispatch(authSlice.actions.getUserRequest());
    const { data } = await axios.get("http://localhost:4000/api/v1/auth/me", {
      withCredentials: true,  // Make sure this is set to true
      headers: {
        "Content-Type": "application/json",
      }
    });
    dispatch(authSlice.actions.getUserSuccess(data));
  } catch (error) {
    dispatch(authSlice.actions.getUserFailed(error.response?.data?.message || "Authentication failed"));
  }
};

export const forgotPassword = (formdata) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());
  await axios
    .post("http://localhost:4000/api/v1/auth/password/forgot", formdata, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(authSlice.actions.forgotPasswordSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.forgotPasswordFailed(error.response.data.message)
      );
    });
};

export const resetPassword = (data, token) => async (dispatch) => {
  dispatch(authSlice.actions.resetPasswordRequest());
  await axios
    .put(`http://localhost:4000/api/v1/auth/password/reset/${token}`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(authSlice.actions.resetPasswordSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.resetPasswordFailed(error.response.data.message)
      );
    });
};

export const updatePassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  await axios
    .put("http://localhost:4000/api/v1/auth/password/update", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
      dispatch(toggleSettingPopup());
    })
    .catch((error) => {
      dispatch(authSlice.actions.updatePasswordFailed(error.response.data.message));
    });
};

export default authSlice.reducer;
