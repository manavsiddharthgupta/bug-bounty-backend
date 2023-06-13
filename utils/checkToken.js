const axios = require("axios");

async function checkToken(token) {
  const url = "https://api.github.com/user";

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Access the user information from the response
    const userInfo = await response.data;
    return userInfo;
  } catch (error) {
    console.error("Error fetching GitHub user info:", error);
    return null;
  }
}

exports.checkToken = checkToken;
