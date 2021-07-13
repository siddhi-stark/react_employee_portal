const init = {
  isLoggedIn: true,
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: action.value,
      };
    default:
      return state;
  }
};

export default reducer;
