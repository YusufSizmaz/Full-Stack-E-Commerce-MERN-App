import { useCallback } from "react";
import { debounce } from "lodash";

// Custom hook olarak debounce edilmiş fonksiyonu tanımlıyoruz
const useDelayedHandleChange = (setData) => {
  // Debounce edilmiş fonksiyon (500ms bekler)
  const delayedHandleChange = useCallback(
    debounce((name, value) => {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }, 80000), // 500ms bekler
    [setData]
  );

  return delayedHandleChange;
};

export default useDelayedHandleChange;
