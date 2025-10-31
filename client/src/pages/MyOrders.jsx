import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { IoReceiptOutline } from "react-icons/io5";

const MyOrders = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getOrders,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setOrders(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4 bg-white shadow-md flex items-center justify-between p-4 rounded">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <IoReceiptOutline size={24} />
          Siparişlerim
        </h2>
      </div>

      {loading && <Loading />}

      {!loading && orders.length === 0 && <NoData />}

      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div>
                      <p className="text-sm text-gray-600">Sipariş ID</p>
                      <p className="font-semibold text-amber-600">
                        {order.orderId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tarih</p>
                      <p className="font-medium">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {order.product_details && (
                    <div className="flex items-start gap-3 mt-3">
                      {order.product_details.image &&
                        order.product_details.image[0] && (
                          <img
                            src={order.product_details.image[0]}
                            alt={order.product_details.name}
                            className="w-20 h-20 object-contain rounded border border-gray-200"
                          />
                        )}
                      <div>
                        <p className="font-semibold text-gray-800">
                          {order.product_details.name || "Ürün Adı"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Ödeme Durumu:{" "}
                          <span
                            className={`font-medium ${
                              order.payment_status === "success" ||
                              order.payment_status === "completed"
                                ? "text-green-600"
                                : order.payment_status === "pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {order.payment_status || "Beklemede"}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {order.delivery_address && (
                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600 mb-1">Teslimat Adresi</p>
                      <p className="text-sm">
                        {typeof order.delivery_address === "object"
                          ? `${order.delivery_address.address_line || ""}, ${
                              order.delivery_address.city || ""
                            }, ${order.delivery_address.state || ""}, ${
                              order.delivery_address.pincode || ""
                            }`
                          : "Adres bilgisi yükleniyor..."}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Toplam Tutar</p>
                    <p className="text-xl font-bold text-amber-600">
                      {DisplayPriceInRupees(order.totalAmt || 0)}
                    </p>
                  </div>
                  {order.invoice_receipt && (
                    <a
                      href={order.invoice_receipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Fatura Görüntüle
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
