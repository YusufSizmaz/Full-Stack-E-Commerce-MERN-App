import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import ConfirmBox from "../components/ConfirmBox";
import { IoLocationOutline, IoAddOutline, IoClose } from "react-icons/io5";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";
import toast from "react-hot-toast";

const Address = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState("");
  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAddresses,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setAddresses(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for mobile field - only allow numbers and common phone characters
    if (name === "mobile") {
      // Allow digits, spaces, dashes, parentheses, and plus sign
      const cleanedValue = value.replace(/[^\d\s\-\(\)\+]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    // Validate required fields
    if (!formData.city || formData.city.trim() === "") {
      toast.error("Şehir alanı zorunludur");
      return false;
    }

    if (!formData.state || formData.state.trim() === "") {
      toast.error("İlçe alanı zorunludur");
      return false;
    }

    // Validate mobile if provided
    if (formData.mobile && formData.mobile.trim() !== "") {
      const cleanedMobile = formData.mobile.replace(/[\s\-\(\)\+]/g, "");
      if (!/^\d+$/.test(cleanedMobile)) {
        toast.error("Telefon numarası sadece rakamlardan oluşmalıdır");
        return false;
      }
      if (cleanedMobile.length < 10) {
        toast.error("Telefon numarası en az 10 haneli olmalıdır");
        return false;
      }
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      address_line: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      mobile: "",
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addAddress,
        data: formData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message || "Adres başarıyla eklendi");
        setOpenAddModal(false);
        resetForm();
        fetchAddresses();
        // Update user details to refresh address list
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateAddress,
        data: formData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message || "Adres başarıyla güncellendi");
        setOpenEditModal(false);
        resetForm();
        fetchAddresses();
        // Update user details
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data: { _id: deleteAddressId },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message || "Adres başarıyla silindi");
        setOpenDeleteConfirm(false);
        setDeleteAddressId("");
        fetchAddresses();
        // Update user details
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (address) => {
    setFormData({
      _id: address._id,
      address_line: address.address_line || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "",
      mobile: address.mobile || "",
    });
    setOpenEditModal(true);
  };

  const openDelete = (addressId) => {
    setDeleteAddressId(addressId);
    setOpenDeleteConfirm(true);
  };

  return (
    <div className="p-4">
      <div className="mb-4 bg-white shadow-md flex items-center justify-between p-4 rounded">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <IoLocationOutline size={24} />
          Adreslerim
        </h2>
        <button
          onClick={() => {
            resetForm();
            setOpenAddModal(true);
          }}
          className="text-sm border border-amber-300 hover:bg-amber-400 hover:text-white px-3 py-1 rounded flex items-center gap-2"
        >
          <IoAddOutline size={18} />
          Yeni Adres Ekle
        </button>
      </div>

      {loading && addresses.length === 0 && <Loading />}

      {!loading && addresses.length === 0 && <NoData />}

      {!loading && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex flex-col"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IoLocationOutline size={20} className="text-amber-500" />
                    <h3 className="font-semibold text-gray-800">Adres</h3>
                  </div>
                  {address.status && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      Aktif
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {address.address_line && (
                    <p className="text-gray-700">
                      <span className="font-medium">Adres:</span>{" "}
                      {address.address_line}
                    </p>
                  )}
                  <p className="text-gray-700">
                    <span className="font-medium">Şehir:</span> {address.city}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">İlçe:</span> {address.state}
                  </p>
                  {address.pincode && (
                    <p className="text-gray-700">
                      <span className="font-medium">Posta Kodu:</span>{" "}
                      {address.pincode}
                    </p>
                  )}
                  {address.country && (
                    <p className="text-gray-700">
                      <span className="font-medium">Ülke:</span>{" "}
                      {address.country}
                    </p>
                  )}
                  {address.mobile && (
                    <p className="text-gray-700">
                      <span className="font-medium">Telefon:</span>{" "}
                      {address.mobile}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => openEdit(address)}
                  className="flex-1 bg-amber-100 text-amber-600 hover:bg-amber-200 font-medium py-2 rounded cursor-pointer text-sm"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => openDelete(address._id)}
                  className="flex-1 bg-red-100 text-red-600 hover:bg-red-200 font-medium py-2 rounded cursor-pointer text-sm"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {openAddModal && (
        <div className="fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800/70 p-4 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-md p-4 rounded relative">
            <div className="flex justify-between items-center gap-3 mb-4">
              <h1 className="font-semibold text-lg">Yeni Adres Ekle</h1>
              <button onClick={() => setOpenAddModal(false)}>
                <IoClose
                  size={25}
                  className="cursor-pointer hover:text-red-500"
                />
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Adres Satırı
                </label>
                <input
                  type="text"
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Sokak, Mahalle, Bina No"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Şehir</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Şehir"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">İlçe</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="İlçe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Posta Kodu
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Posta Kodu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ülke</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Ülke"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefon <span className="text-gray-500 text-xs">(Opsiyonel)</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Örn: 5551234567 veya +90 555 123 45 67"
                  pattern="[\d\s\-\(\)\+]*"
                  maxLength="20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sadece rakam, boşluk, tire, parantez ve + işareti kullanılabilir
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-red-500 text-red-500 hover:text-white hover:bg-red-500 rounded"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 border border-amber-300 hover:bg-amber-400 hover:text-white rounded font-medium"
                  disabled={loading}
                >
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {openEditModal && (
        <div className="fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800/70 p-4 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-md p-4 rounded relative">
            <div className="flex justify-between items-center gap-3 mb-4">
              <h1 className="font-semibold text-lg">Adres Düzenle</h1>
              <button onClick={() => setOpenEditModal(false)}>
                <IoClose
                  size={25}
                  className="cursor-pointer hover:text-red-500"
                />
              </button>
            </div>
            <form onSubmit={handleEditAddress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Adres Satırı
                </label>
                <input
                  type="text"
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Sokak, Mahalle, Bina No"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Şehir</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Şehir"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">İlçe</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="İlçe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Posta Kodu
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Posta Kodu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ülke</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Ülke"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefon <span className="text-gray-500 text-xs">(Opsiyonel)</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-100 border rounded border-amber-300 focus-within:outline-amber-400"
                  placeholder="Örn: 5551234567 veya +90 555 123 45 67"
                  pattern="[\d\s\-\(\)\+]*"
                  maxLength="20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sadece rakam, boşluk, tire, parantez ve + işareti kullanılabilir
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenEditModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-red-500 text-red-500 hover:text-white hover:bg-red-500 rounded"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 border border-amber-300 hover:bg-amber-400 hover:text-white rounded font-medium"
                  disabled={loading}
                >
                  {loading ? "Güncelleniyor..." : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Box */}
      {openDeleteConfirm && (
        <ConfirmBox
          close={() => {
            setOpenDeleteConfirm(false);
            setDeleteAddressId("");
          }}
          cancel={() => {
            setOpenDeleteConfirm(false);
            setDeleteAddressId("");
          }}
          confirm={handleDeleteAddress}
        />
      )}
    </div>
  );
};

export default Address;
