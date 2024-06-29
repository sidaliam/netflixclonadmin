import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";



export const login = async (user, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("https://backendnetflix-paxc.onrender.com/api/auth/login", user);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE" });
  }
};
