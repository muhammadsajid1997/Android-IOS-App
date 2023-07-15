import AsyncStorage from "@react-native-async-storage/async-storage";
export const SET_REGISTER_DATA = "SET_REGISTER_DATA";
export const SET_LOGIN_DATA = "SET_LOGIN_DATA";
export const LOGIN_STATE_RESTORE_REQUEST = "LOGIN_STATE_RESTORE_REQUEST";
export const LOGIN_STATE_RESTORE = "LOGIN_STATE_RESTORE";
export const LOGOUT_STATE = "LOGOUT_STATE";
export const SECRATESTORE = "SECRATESTORE";
export const SECRATE_STATE_RESTORE_REQUEST = "SECRATE_STATE_RESTORE_REQUEST";
export const SECRATE_STATE_RESTORE = "SECRATE_STATE_RESTORE";
export const SECRATESTORECHCK = "SECRATESTORECHCK";
// export const loginUser = (token) => async (dispatch) => {
//   try {
//     await AsyncStorage.setItem("token", token);
//     dispatch({ type: "TOKENSTORE", payload: { data: token } });
//   } catch (error) {
//     console.log("tokenerror");
//   }
// };

export const setLogin = (data, number) => async (dispatch) => {
  try {
    await AsyncStorage.setItem("isLogin", JSON.stringify(true));
    await AsyncStorage.setItem("token", data);
    await AsyncStorage.setItem("number", number);
    dispatch({ type: SET_LOGIN_DATA });
  } catch (error) {
    console.log(error);
  }
};

export const setLogout = (data) => async (dispatch) => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.clear();

    await AsyncStorage.removeItem("isLogin", () => {
      dispatch({ type: LOGOUT_STATE });
      dispatch(restoreStatus());
    });
  } catch (error) {
    console.log(error);
  }
};

export const restoreSecrate = () => async (dispatch) => {
  let loginStatus;
  let secratecode;
  try {
    dispatch({ type: SECRATE_STATE_RESTORE_REQUEST });
    loginStatus = await AsyncStorage.getItem("isLogin").then((val) => {
      if (val === "true") return true;
      else return false;
    });
    secratecode = await AsyncStorage.getItem("isSecrateCode")
      .then((val) => {
        if (val === "true") return true;
        else return false;
      })
      .catch((err) => console.log(err));
    dispatch({
      type: SECRATE_STATE_RESTORE,
      payload: { isLogin: loginStatus, isSecrate: secratecode },
    });
  } catch (error) {
    console.log("status restoration failed: ", error);
  }
};

export const restoreStatus = () => async (dispatch) => {
  let loginStatus;
  let secratecode;
  try {
    dispatch({ type: LOGIN_STATE_RESTORE_REQUEST });
    dispatch({ type: SECRATE_STATE_RESTORE_REQUEST });
    loginStatus = await AsyncStorage.getItem("isLogin").then((val) => {
      if (val === "true") return true;
      else return false;
    });
    secratecode = await AsyncStorage.getItem("isSecrateCode")
      .then((val) => {
        if (val === "true") return true;
        else return false;
      })
      .catch((err) => console.log(err));
    dispatch({ type: LOGIN_STATE_RESTORE, payload: loginStatus });
    if (secratecode) {
      dispatch({ type: SECRATE_STATE_RESTORE, payload: secratecode });
    }
  } catch (error) {
    console.log("status restoration failed: ", error);
  }
};

// export const getuser = () => async (dispatch) => {
//   console.log("caalled");
//   try {
//     const token = await AsyncStorage.getItem("token");
//     if (token) {
//       dispatch({ type: "GETUSER", payload: { data: token } });
//     }
//   } catch (error) {
//     dispatch({ type: "GETUSER", payload: { data: "" || null } });
//     console.log("error");
//   }
// };

// export const logout = () => async (dispatch) => {
//   try {
//     const token = await AsyncStorage.removeItem("token");
//     const data = await AsyncStorage.removeItem("secrate");
//     dispatch({ type: "LOGOUT", payload: { data: "" || "" } });
//   } catch (error) {
//     dispatch({ type: "LOGOUT", payload: { data: "" || null } });
//     console.log("error");
//   }
// };

export const secratestore = (code) => async (dispatch) => {
  try {
    await AsyncStorage.setItem("isSecrateCode", JSON.stringify(true));
    await AsyncStorage.setItem("secrate", code);
    // console.log("TokenDtata", token);
    dispatch({ type: SECRATESTORE });
    // await AsyncStorage.setItem("secrate", code);
  } catch (error) {
    console.log("tokenerror");
  }
};

export const secratestore1 = (code) => async (dispatch) => {
  try {
    await AsyncStorage.setItem("isSecrateCode", JSON.stringify(true));
    await AsyncStorage.setItem("secrate", code);
    // console.log("TokenDtata", token);
    dispatch({
      type: SECRATESTORECHCK,
      payload: { isLogin: true, isSecrate: false },
    });
    // await AsyncStorage.setItem("secrate", code);
  } catch (error) {
    console.log("tokenerror");
  }
};

export const getsecratecode = () => async (dispatch) => {
  // console.log("caalled");
  try {
    const code = await AsyncStorage.getItem("secrate");

    if (code) {
      dispatch({ type: "GETSECRATECODE", payload: { data: code } });
    }
  } catch (error) {
    dispatch({ type: "GETSECRATECODE", payload: { data: "" || null } });
    console.log("error");
  }
};
