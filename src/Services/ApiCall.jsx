import axios from "axios";
import { baseUrl } from "./baseUrl";
import { ShowToast } from "../utils/Toast";

export const apiCall = async (method, endPoint, data, params, isFormdata) => {
  var headers = {
    "Content-Type": isFormdata ? "multipart/form-data" : "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  var url = baseUrl + endPoint;

  try {
    const res = await axios({
      method,
      url,
      params,
      data,
      headers,
    });

    var response = {
      status: true,
      data: res.data.data,
      message: res.data.message,
    };

    return response;
  } catch (error) {
    ShowToast(
      error.response ? error.response.data.message : "Internal Server Error"
    );
    return;
  }
};
