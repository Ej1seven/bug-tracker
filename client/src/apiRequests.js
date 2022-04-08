const axios = require('axios').default;

export const loginRequest = async (email, password) => {
  const loginData = {
    email: email,
    password: password,
  };
  try {
    const response = await axios.post(
      'https://murmuring-mountain-40437.herokuapp.com/login',
      loginData
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
