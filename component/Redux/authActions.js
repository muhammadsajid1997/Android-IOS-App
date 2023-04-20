import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = (token) => async (dispatch) => {
  try {
    dispatch({ type: "TOKENSTORE", payload: { data: token } });
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.log("tokenerror");
  }
};

export const getuser = () => async (dispatch) => {
  console.log("caalled");
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      dispatch({ type: "GETUSER", payload: { data: token } });
    }
  } catch (error) {
    dispatch({ type: "GETUSER", payload: { data: "" || null } });
    console.log("error");
  }
};

export const logout = () => async (dispatch) => {
  try {
    const token = await AsyncStorage.removeItem("token");
    const data = await AsyncStorage.removeItem("secrate");
    dispatch({ type: "LOGOUT", payload: { data: "" || "" } });
  } catch (error) {
    dispatch({ type: "LOGOUT", payload: { data: "" || null } });
    console.log("error");
  }
};

export const secratestore = (code) => async (dispatch) => {
  try {
    // console.log("TokenDtata", token);
    dispatch({ type: "SECRATESTORE", payload: { data: code } });
    await AsyncStorage.setItem("secrate", code);
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
