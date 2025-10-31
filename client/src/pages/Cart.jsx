import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { BsCart4 } from "react-icons/bs";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";

const Cart = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCart,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setCartItems(responseData.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user._id) {
      fetchCart();
    } else {
      navigate("/login");
    }
  }, [user._id]);

  const calculateItemTotal = (item) => {
    if (!item.productId) return 0;
    const price = item.productId.price || 0;
    const discount = item.productId.discount || 0;
    const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
    return discountedPrice * item.quantity;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    const subtotal = calculateSubtotal();
    if (appliedDiscount.type === "percentage") {
      return (subtotal * appliedDiscount.value) / 100;
    }
    return appliedDiscount.value;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    return Math.max(0, subtotal - discountAmount);
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateCartItem,
        data: {
          cartItemId,
          quantity: newQuantity,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success("Sepet güncellendi");
        fetchCart();
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

  const handleRemoveItem = async (cartItemId) => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.removeFromCart,
        data: { cartItemId },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success("Ürün sepetten kaldırıldı");
        fetchCart();
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

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountError("Lütfen bir indirim kodu giriniz");
      return;
    }

    // Demo discount codes - Bu kısım backend'e taşınabilir
    const discountCodes = {
      WELCOME10: { type: "percentage", value: 10, message: "Hoş geldiniz %10 indirimi uygulandı!" },
      SAVE20: { type: "percentage", value: 20, message: "Harika! %20 indirim uygulandı!" },
      FLAT500: { type: "fixed", value: 500, message: "500 TL indirim uygulandı!" },
    };

    const discount = discountCodes[discountCode.toUpperCase()];

    if (discount) {
      setAppliedDiscount(discount);
      setDiscountError("");
      toast.success(discount.message);
      setDiscountCode("");
    } else {
      setDiscountError("Geçersiz indirim kodu");
      toast.error("Geçersiz indirim kodu");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Sepeti temizlemek istediğinize emin misiniz?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.clearCart,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success("Sepet temizlendi");
        fetchCart();
        setAppliedDiscount(null);
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

  if (loading && cartItems.length === 0) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <BsCart4 size={32} className="text-green-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Sepetim
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <NoData />
            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Alışverişe Başla
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                if (!item.productId) return null;

                const product = item.productId;
                const price = product.price || 0;
                const discount = product.discount || 0;
                const discountedPrice =
                  discount > 0 ? price * (1 - discount / 100) : price;
                const itemTotal = discountedPrice * item.quantity;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {product.image && product.image[0] ? (
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <BsCart4 size={40} />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.unit}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                          {discount > 0 ? (
                            <>
                              <span className="text-lg font-bold text-green-600">
                                {DisplayPriceInRupees(discountedPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {DisplayPriceInRupees(price)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                %{discount} İndirim
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-800">
                              {DisplayPriceInRupees(price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                            disabled={loading}
                          >
                            <IoRemoveOutline size={20} />
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                            disabled={loading}
                          >
                            <IoAddOutline size={20} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Toplam</p>
                          <p className="text-lg font-bold text-gray-800">
                            {DisplayPriceInRupees(itemTotal)}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          disabled={loading}
                        >
                          <MdDeleteOutline size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg"
                  disabled={loading}
                >
                  Sepeti Temizle
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Sipariş Özeti
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam</span>
                    <span className="font-semibold">
                      {DisplayPriceInRupees(calculateSubtotal())}
                    </span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>İndirim</span>
                      <span className="font-semibold">
                        -{DisplayPriceInRupees(calculateDiscountAmount())}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                    <span>Toplam</span>
                    <span className="text-green-600">
                      {DisplayPriceInRupees(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* Discount Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İndirim Kodu
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value);
                        setDiscountError("");
                      }}
                      placeholder="Kod giriniz"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                      disabled={loading || !discountCode.trim()}
                    >
                      Uygula
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-red-600 text-xs mt-1">{discountError}</p>
                  )}
                  {appliedDiscount && (
                    <p className="text-green-600 text-xs mt-1">
                      İndirim uygulandı!
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Demo kodlar: WELCOME10, SAVE20, FLAT500
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors"
                  disabled={loading}
                >
                  Ödemeye Geç
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

