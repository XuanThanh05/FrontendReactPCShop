import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminUserApi,
  getAdminUsersApi,
  updateAdminUserStatusApi,
} from "../../../services/adminUserService";
import { useAuth } from "../../auth/useAuth";
import "./UserManagementPage.css";

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function UserManagementPage() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [updatingStatusUserId, setUpdatingStatusUserId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    mode: null,
    user: null,
    nextEnabled: null,
  });

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await getAdminUsersApi();
        if (!active) return;
        setUsers(data);
      } catch (error) {
        if (!active) return;
        setErrorMessage(error?.message || "Không thể tải danh sách người dùng.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchedQuery =
        !normalizedQuery ||
        user.fullName.toLowerCase().includes(normalizedQuery) ||
        user.username?.toLowerCase().includes(normalizedQuery) ||
        user.phone?.includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery);

      const matchedRole = roleFilter === "all" || user.role === roleFilter;

      const matchedStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "blocked" && !user.isActive);

      return matchedQuery && matchedRole && matchedStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  const handleDeleteUser = async (user) => {
    if (!user?.id) return;

    const isSelf = currentUser?.username === user.username;
    if (isSelf) {
      setErrorMessage("Không thể xóa chính tài khoản admin đang đăng nhập.");
      return;
    }

    setConfirmDialog({ open: true, mode: "delete", user, nextEnabled: null });
  };

  const handleConfirmDeleteUser = async (user) => {
    if (!user?.id) return;

    try {
      setDeletingUserId(user.id);
      setErrorMessage("");
      await deleteAdminUserApi(user.id);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
    } catch (error) {
      setErrorMessage(error?.message || "Xóa tài khoản thất bại.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleToggleStatus = async (user) => {
    if (!user?.id) return;

    const isSelf = currentUser?.username === user.username;
    if (isSelf) {
      setErrorMessage("Không thể tự khóa/mở tài khoản đang đăng nhập.");
      return;
    }

    const nextEnabled = !user.isActive;
    setConfirmDialog({ open: true, mode: "status", user, nextEnabled });
  };

  const handleConfirmToggleStatus = async (user, nextEnabled) => {
    if (!user?.id) return;

    try {
      setUpdatingStatusUserId(user.id);
      setErrorMessage("");
      await updateAdminUserStatusApi(user.id, nextEnabled);
      setUsers((prev) => prev.map((item) => {
        if (item.id !== user.id) return item;
        return { ...item, isActive: nextEnabled };
      }));
    } catch (error) {
      setErrorMessage(error?.message || "Cập nhật trạng thái thất bại.");
    } finally {
      setUpdatingStatusUserId(null);
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, mode: null, user: null, nextEnabled: null });
  };

  const confirmDialogTitle = (() => {
    if (!confirmDialog.open || !confirmDialog.user) return "";
    if (confirmDialog.mode === "delete") return "Xóa tài khoản";
    return confirmDialog.nextEnabled ? "Mở khóa tài khoản" : "Khóa tài khoản";
  })();

  const confirmDialogMessage = (() => {
    if (!confirmDialog.open || !confirmDialog.user) return "";
    if (confirmDialog.mode === "delete") {
      return `Bạn có chắc muốn xóa tài khoản ${confirmDialog.user.username}? Hành động này không thể hoàn tác.`;
    }
    const actionText = confirmDialog.nextEnabled ? "mở" : "khóa";
    return `Bạn có chắc muốn ${actionText} tài khoản ${confirmDialog.user.username}?`;
  })();

  const handleDialogConfirm = async () => {
    if (!confirmDialog.user) return;

    if (confirmDialog.mode === "delete") {
      await handleConfirmDeleteUser(confirmDialog.user);
      closeConfirmDialog();
      return;
    }

    await handleConfirmToggleStatus(confirmDialog.user, Boolean(confirmDialog.nextEnabled));
    closeConfirmDialog();
  };

  return (
    <div className="user-admin-page">
      {confirmDialog.open ? (
        <div className="confirm-modal-overlay" role="dialog" aria-modal="true" onClick={closeConfirmDialog}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <h3>{confirmDialogTitle}</h3>
            <p>{confirmDialogMessage}</p>
            <div className="confirm-modal-actions">
              <button type="button" className="action-btn" onClick={closeConfirmDialog}>
                Hủy
              </button>
              <button
                type="button"
                className="action-btn warning"
                onClick={handleDialogConfirm}
                disabled={
                  (confirmDialog.mode === "delete" && deletingUserId === confirmDialog.user?.id) ||
                  (confirmDialog.mode === "status" && updatingStatusUserId === confirmDialog.user?.id)
                }
              >
                {confirmDialog.mode === "delete"
                  ? deletingUserId === confirmDialog.user?.id
                    ? "Đang xóa..."
                    : "Xác nhận xóa"
                  : updatingStatusUserId === confirmDialog.user?.id
                    ? "Đang cập nhật..."
                    : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      ) : null}


      <h2 className="content-title">Quản lý User</h2>

      <section className="user-admin-panel">
        {errorMessage ? <div className="top-error">{errorMessage}</div> : null}

        <div className="user-filters">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên, username, số điện thoại, email"
          />
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="all">Tất cả quyền</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="blocked">Đang khóa</option>
          </select>
        </div>

        <div className="user-table-wrap">
          <table className="user-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Username</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8}>Đang tải dữ liệu...</td>
                </tr>
              ) : null}
              {filteredUsers.map((user) => {
                const isCurrentUser = currentUser?.username === user.username;

                return (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.fullName}</strong>
                      {isCurrentUser ? <span className="current-tag">Tài khoản của bạn</span> : null}
                    </td>
                    <td title={user.username?.length > 10 ? user.username : ""}>
                      {user.username?.length > 10 ? user.username.substring(0, 10) + '...' : (user.username || '-')}
                    </td>
                    <td>{user.phone || '-'}</td>
                    <td title={user.email?.length > 10 ? user.email : ""}>
                      {user.email?.length > 10 ? user.email.substring(0, 10) + '...' : user.email}
                    </td>
                    <td>
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? "active" : "blocked"}`}>
                        {user.isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="user-actions">
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => handleToggleStatus(user)}
                          disabled={isCurrentUser || updatingStatusUserId === user.id}
                          title={isCurrentUser ? "Không thể tự khóa/mở tài khoản" : "Đổi trạng thái"}
                        >
                          {updatingStatusUserId === user.id ? "Đang cập nhật..." : user.isActive ? "Khóa" : "Mở"}
                        </button>
                        <button
                          type="button"
                          className="action-btn warning"
                          onClick={() => handleDeleteUser(user)}
                          disabled={isCurrentUser || deletingUserId === user.id}
                          title={isCurrentUser ? "Không thể xóa chính mình" : "Xóa tài khoản"}
                        >
                          {deletingUserId === user.id ? "Đang xóa..." : "Xóa"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!isLoading && filteredUsers.length === 0 ? (
            <div className="empty-state">Không có user phù hợp với bộ lọc hiện tại.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
