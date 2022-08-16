const getAccessToken = () => {
  const auth = JSON.parse(localStorage.getItem("persist:auth"));
  if (auth) {
    const user = JSON.parse(auth.user);
    if (user) {
      // console.log(user);
      // console.log(typeof user);
      return user.tokens?.access?.token;
      // console.log("access token: ", accessToken);
    }
    return null;
  }
  return null;
};

const getRefreshToken = () => {
  const auth = JSON.parse(localStorage.getItem("persist:auth"));
  if (auth) {
    const user = JSON.parse(auth.user);
    if (user) {
      // console.log(user);
      // console.log(typeof user);
      return user.tokens?.refresh?.token;
      // console.log("access token: ", accessToken);
    }
    return null;
  }
  return null;
};

const getUserId = () => {
  const auth = JSON.parse(localStorage.getItem("persist:auth"));
  if (auth) {
    const user = JSON.parse(auth.user);
    return user?.id;
  }
  return null;
};

const refreshTokens = (tokens) => {
  const auth = JSON.parse(localStorage.getItem("persist:auth"));
  if (auth.user !== "null") {
    const user = JSON.parse(auth.user);
    user.tokens = tokens;
    console.log(user);
    localStorage.setItem(
      "persist:auth",
      JSON.stringify({ ...auth, user: JSON.stringify(user) })
    );
  }
};

export { getAccessToken, getRefreshToken, getUserId, refreshTokens };
