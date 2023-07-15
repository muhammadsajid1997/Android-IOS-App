import {
  LOGIN_STATE_RESTORE,
  LOGIN_STATE_RESTORE_REQUEST,
  LOGOUT_STATE,
  SECRATESTORE,
  SECRATESTORECHCK,
  SECRATE_STATE_RESTORE,
  SECRATE_STATE_RESTORE_REQUEST,
  SET_LOGIN_DATA,
} from "../authActions";

const intialState = {
  token: "",
  resStatus: false,
  isSecrateCode: false,
  isLogin: false,
  loading: false,
};
const authReducers = (state = intialState, action) => {
  const payload = action.payload;

  switch (action.type) {
    case SET_LOGIN_DATA:
      return { ...state, isLogin: true, isSecrateCode: false };
    case LOGIN_STATE_RESTORE_REQUEST:
      return { loading: true, isLogin: false, isSecrateCode: false };
    case LOGIN_STATE_RESTORE:
      return { isLogin: action.payload, loading: false, isSecrateCode: false };
    case LOGOUT_STATE:
      return { isLogin: false, loading: false, isSecrateCode: false };
    case SECRATESTORE:
      return { ...state, isLogin: true, isSecrateCode: true };
    case SECRATE_STATE_RESTORE_REQUEST:
      return { loading: true, isLogin: true, isSecrateCode: false };
    case SECRATE_STATE_RESTORE:
      return {
        isLogin: payload.isLogin,
        isSecrateCode: payload.isSecrate,
        loading: false,
      };
    case SECRATESTORECHCK: {
      return {
        isLogin: true,
        isSecrateCode: false,
        loading: false,
      };
    }
    default:
      return state;
  }
};

export default authReducers;
