import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  resetMockUsers,
  updateUserById,
} from "../../../services/mockAuthService";
import { useAuth } from "../../auth/useAuth";
import "./UserManagementPage.css";

function formatDate(dateString) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function UserManagementPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => getAllUsers());
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const refreshUsers = () => {
    setUsers(getAllUsers());
  };

  const handleToggleStatus = (userId) => {
    if (currentUser?.id === userId) return;

    updateUserById(userId, (user) => ({ isActive: !user.isActive }));
    refreshUsers();
  };

  const handleToggleRole = (userId) => {
    updateUserById(userId, (user) => ({ role: user.role === "admin" ? "user" : "admin" }));
    refreshUsers();
  };

  const handleResetData = () => {
    resetMockUsers();
    refreshUsers();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="user-admin-page">
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/" className="secondary-link">← Về trang chủ</Link>
          <Link to="/admin/statistics" className="secondary-link">Xem thống kê</Link>
        </div>
        <button type="button" className="danger-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      <header className="user-admin-header">
        <div>
          <h1>Quản lý user</h1>
          <p>Quản trị tài khoản người dùng bằng dữ liệu mock trong localStorage.</p>
        </div>
        <div className="user-admin-header-actions">
          <button type="button" className="danger-btn" onClick={handleResetData}>
            Reset mock data
          </button>
        </div>
      </header>

      <section className="user-admin-panel">
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
            <option value="user">User</option>
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
              {filteredUsers.map((user) => {
                const isCurrentUser = currentUser?.id === user.id;

                return (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.fullName}</strong>
                      {isCurrentUser ? <span className="current-tag">Tài khoản của bạn</span> : null}
                    </td>
                    <td>{user.username || '-'}</td>
                    <td>{user.phone || '-'}</td>
                    <td>{user.email}</td>
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
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={isCurrentUser}
                          title={isCurrentUser ? "Không thể tự khóa chính mình" : "Đổi trạng thái"}
                        >
                          {user.isActive ? "Khóa" : "Mở"}
                        </button>
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => handleToggleRole(user.id)}
                        >
                          Đổi role
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 ? (
            <div className="empty-state">Không có user phù hợp với bộ lọc hiện tại.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
