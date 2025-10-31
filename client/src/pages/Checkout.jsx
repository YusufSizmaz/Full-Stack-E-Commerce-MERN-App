import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";
import { IoArrowBack } from "react-icons/io5";

// Stripe public key - Environment variable'dan alınmalı
// .env dosyasına VITE_STRIPE_PUBLISHABLE_KEY ekleyin
// Test key için Stripe Dashboard'dan alabilirsiniz: https://dashboard.stripe.com/test/apikeys
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

const CheckoutForm = ({
  amount,
  subtotal,
  discountAmount,
  discountCode,
  deliveryAddressId,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.createPaymentIntent,
          data: {
            discountCode,
            deliveryAddressId,
          },
        });

        if (response.data.success) {
          setClientSecret(response.data.data.clientSecret);
        }
      } catch (error) {
        AxiosToastError(error);
      }
    };

    createPaymentIntent();
  }, [discountCode, deliveryAddressId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      toast.error(error.message || "Ödeme başarısız");
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Confirm payment on backend
      try {
        const response = await Axios({
          ...SummaryApi.confirmPayment,
          data: {
            paymentIntentId: paymentIntent.id,
            deliveryAddressId,
          },
        });

        if (response.data.success) {
          toast.success("Ödeme başarıyla tamamlandı!");
          onSuccess();
        }
      } catch (error) {
        AxiosToastError(error);
        setProcessing(false);
      }
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kart Bilgileri
        </label>
        <div className="p-3 border border-gray-300 rounded-lg">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Test kartları: 4242 4242 4242 4242 (herhangi bir CVV ve gelecek tarih)
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Ara Toplam</span>
            <span>{DisplayPriceInRupees(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>İndirim</span>
              <span>-{DisplayPriceInRupees(discountAmount)}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-800">
            <span>Toplam</span>
            <span className="text-green-600">
              {DisplayPriceInRupees(amount)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? "İşleniyor..." : `${DisplayPriceInRupees(amount)} Öde`}
        </button>
      </div>
    </form>
  );
};

const Checkout = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  useEffect(() => {
    if (!user._id) {
      navigate("/login");
      return;
    }

    fetchCart();
    fetchAddresses();
  }, [user._id]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCart,
      });

      if (response.data.success) {
        setCartItems(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddresses,
      });

      if (response.data.success) {
        setAddresses(response.data.data || []);
        if (response.data.data.length > 0) {
          setSelectedAddress(response.data.data[0]._id);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

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

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error("Lütfen bir indirim kodu giriniz");
      return;
    }

    const discountCodes = {
      WELCOME10: { type: "percentage", value: 10, message: "%10 indirim uygulandı!" },
      SAVE20: { type: "percentage", value: 20, message: "%20 indirim uygulandı!" },
      FLAT500: { type: "fixed", value: 500, message: "500 TL indirim uygulandı!" },
    };

    const discount = discountCodes[discountCode.toUpperCase()];

    if (discount) {
      setAppliedDiscount(discount);
      toast.success(discount.message);
      setDiscountCode("");
    } else {
      toast.error("Geçersiz indirim kodu");
    }
  };

  const handlePaymentSuccess = () => {
    // Update user details
    fetchUserDetails().then((userData) => {
      dispatch(setUserDetails(userData.data));
    });
    
    // Redirect to orders page
    setTimeout(() => {
      navigate("/dashboard/myorders");
    }, 2000);
  };

  if (loading && cartItems.length === 0) {
    return <Loading />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">Sepetiniz boş</p>
            <button
              onClick={() => navigate("/cart")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Sepete Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscountAmount();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <IoArrowBack size={20} />
          <span>Sepete Dön</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Sipariş Özeti
              </h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => {
                  if (!item.productId) return null;
                  return (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        {item.productId.image && item.productId.image[0] && (
                          <img
                            src={item.productId.image[0]}
                            alt={item.productId.name}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">
                          {item.productId.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.quantity} x {DisplayPriceInRupees(item.productId.price || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{DisplayPriceInRupees(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>İndirim</span>
                    <span>-{DisplayPriceInRupees(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Toplam</span>
                  <span className="text-green-600">
                    {DisplayPriceInRupees(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Address Selection */}
            {addresses.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Teslimat Adresi
                </h3>
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {addresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.city}, {address.state}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Discount Code */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                İndirim Kodu
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Kod giriniz"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleApplyDiscount}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Uygula
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Demo: WELCOME10, SAVE20, FLAT500
              </p>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Ödeme
              </h2>

              {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    amount={total}
                    subtotal={subtotal}
                    discountAmount={discountAmount}
                    discountCode={appliedDiscount ? discountCode : ""}
                    deliveryAddressId={selectedAddress}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium mb-2">
                    Stripe yapılandırması eksik
                  </p>
                  <p className="text-sm text-yellow-700">
                    Lütfen .env dosyasına VITE_STRIPE_PUBLISHABLE_KEY ekleyin.
                    Detaylar için STRIPE_SETUP.md dosyasına bakın.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

