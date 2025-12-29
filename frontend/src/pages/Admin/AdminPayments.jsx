import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPayments.css";

const AdminPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3001/api/payments/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();
      
      // Filter payments
      let filtered = data.payments;
      if (filter !== "all") {
        filtered = data.payments.filter(p => p.status === filter);
      }
      
      setPayments(filtered);
    } catch (error) {
      console.error("Error fetching payments:", error);
      alert("Không thể tải danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId, status) => {
    if (!window.confirm(`Xác nhận ${status === "verified" ? "DUYỆT" : "TỪ CHỐI"} thanh toán này?`)) {
      return;
    }

    try {
      setProcessing(paymentId);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3001/api/payments/admin/verify/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify payment");
      }

      alert(status === "verified" ? "✅ Đã duyệt thanh toán!" : "❌ Đã từ chối thanh toán!");
      fetchPayments();
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Có lỗi xảy ra khi xử lý thanh toán");
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "Chờ xử lý", class: "status-pending" },
      verified: { text: "Đã duyệt", class: "status-verified" },
      rejected: { text: "Từ chối", class: "status-rejected" },
      expired: { text: "Hết hạn", class: "status-expired" },
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  return (
    <div className="admin-payments-container">
      <div className="admin-header">
        <h1>🔐 Quản lý thanh toán</h1>
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Quay lại
        </button>
      </div>

      <div className="filter-tabs">
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Chờ xử lý
        </button>
        <button
          className={filter === "verified" ? "active" : ""}
          onClick={() => setFilter("verified")}
        >
          Đã duyệt
        </button>
        <button
          className={filter === "rejected" ? "active" : ""}
          onClick={() => setFilter("rejected")}
        >
          Từ chối
        </button>
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : payments.length === 0 ? (
        <div className="no-data">Không có thanh toán nào</div>
      ) : (
        <div className="payments-table">
          <table>
            <thead>
              <tr>
                <th>Mã thanh toán</th>
                <th>Người dùng</th>
                <th>Gói</th>
                <th>Số tiền</th>
                <th>Ngày tạo</th>
                <th>Ngày submit</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="payment-code">{payment.paymentCode}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{payment.userName}</div>
                      <div className="user-email">{payment.userEmail}</div>
                    </div>
                  </td>
                  <td>{payment.planName}</td>
                  <td className="amount">{formatAmount(payment.amount)}₫</td>
                  <td>{formatDate(payment.createdAt)}</td>
                  <td>{payment.submittedAt ? formatDate(payment.submittedAt) : "-"}</td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    {payment.status === "pending" && payment.submittedAt && (
                      <div className="action-buttons">
                        <button
                          className="btn-verify"
                          onClick={() => handleVerifyPayment(payment._id, "verified")}
                          disabled={processing === payment._id}
                        >
                          ✓ Duyệt
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleVerifyPayment(payment._id, "rejected")}
                          disabled={processing === payment._id}
                        >
                          ✗ Từ chối
                        </button>
                      </div>
                    )}
                    {payment.status === "pending" && !payment.submittedAt && (
                      <span className="waiting">Chờ user xác nhận</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
