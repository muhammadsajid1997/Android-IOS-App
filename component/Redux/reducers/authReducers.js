const intialState = {
  token: "",
  resStatus: false,
};
const authReducers = (state = intialState, action) => {
  const payload = action.payload;
  console.log("sdkkkfdf", payload);
  switch (action.type) {
    case "TOKENSTORE": {
      return {
        ...state,
        token: payload.data,
      };
    }
    case "GETUSER": {
      return {
        ...state,
        token: payload.data,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        token: payload.data,
      };
    }
    default:
      return state;
  }
};

export default authReducers;
