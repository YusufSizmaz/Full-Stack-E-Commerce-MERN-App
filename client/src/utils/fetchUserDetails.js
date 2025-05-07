import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const fetchUserDetails = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.userDetails,
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired, the interceptor will handle it
      throw error;
    }
    console.error(
      "Error fetching user details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default fetchUserDetails;
