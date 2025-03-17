import toast from "react-hot-toast";

export const AxiosToastError = (error) => {
  toast.error(error?.response?.data?.message);
};

export const AxiosToastSuccess = (success) => {
  toast.success(success?.response?.data?.message);
};

export default AxiosToastError;
