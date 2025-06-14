import axiosLib from "axios";

const axios = axiosLib.create({
  baseURL: "http://localhost:8080",
});

// Adding user id to every request
axios.interceptors.request.use((request) => {
  const userDataStr = localStorage.getItem("user");
  const reqData = { ...request.data };

  if (userDataStr && userDataStr.length > 0) {
    const userDetails = JSON.parse(userDataStr);

    reqData.userId = userDetails.user.id;
  }

  request.data = reqData;

  return request;
});

export default axios;
