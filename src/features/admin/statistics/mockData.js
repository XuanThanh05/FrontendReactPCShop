// ============================================================
// MOCK DATA - Dữ liệu từ Database (sẽ thay bằng API call)
// ============================================================

// --- Products (từ SQLData.sql) ---
export const products = [
  { id: 1, name: "ASUS ROG Strix G15", category: "Laptop", stockQuantity: 10, price: 25000000 },
  { id: 2, name: "Dell XPS 13", category: "Laptop", stockQuantity: 5, price: 30000000 },
  { id: 3, name: "Intel Core i5 12400F", category: "CPU", stockQuantity: 20, price: 4500000 },
  { id: 4, name: "AMD Ryzen 7 5800X", category: "CPU", stockQuantity: 15, price: 8500000 },
  { id: 5, name: "NVIDIA RTX 3060", category: "GPU", stockQuantity: 8, price: 12000000 },
  { id: 6, name: "Corsair 16GB DDR4", category: "RAM", stockQuantity: 25, price: 1500000 },
  { id: 7, name: "Samsung SSD 512GB", category: "SSD", stockQuantity: 30, price: 1200000 },
];

// --- Users (từ SQLData.sql) ---
export const users = [
  { id: 1, username: "admin", role: "ADMIN", createdAt: "2025-01-01T00:00:00" },
  { id: 2, username: "user1", role: "CUSTOMER", createdAt: "2025-01-15T00:00:00" },
  { id: 3, username: "user2", role: "CUSTOMER", createdAt: "2025-02-01T00:00:00" },
];

// --- Orders (từ SQLData.sql) ---
export const orders = [
  { id: 1, userId: 2, totalAmount: 29500000, status: "PAID", createdAt: "2025-03-01T10:30:00" },
  { id: 2, userId: 3, totalAmount: 15000000, status: "PENDING", createdAt: "2025-03-15T14:20:00" },
];

// --- Order Items (từ SQLData.sql) ---
export const orderItems = [
  { id: 1, orderId: 1, productId: 1, quantity: 1, priceAtPurchase: 25000000 },
  { id: 2, orderId: 1, productId: 3, quantity: 1, priceAtPurchase: 4500000 },
  { id: 3, orderId: 2, productId: 5, quantity: 1, priceAtPurchase: 12000000 },
  { id: 4, orderId: 2, productId: 6, quantity: 2, priceAtPurchase: 1500000 },
];

// --- Inventory Logs (từ SQLData.sql) ---
export const inventoryLogs = [
  { id: 1, productId: 1, changeQuantity: 10, reason: "import", createdAt: "2025-01-01T00:00:00" },
  { id: 2, productId: 2, changeQuantity: 5, reason: "import", createdAt: "2025-01-05T00:00:00" },
  { id: 3, productId: 3, changeQuantity: 20, reason: "import", createdAt: "2025-01-10T00:00:00" },
  { id: 4, productId: 4, changeQuantity: 15, reason: "import", createdAt: "2025-01-12T00:00:00" },
  { id: 5, productId: 5, changeQuantity: 8, reason: "import", createdAt: "2025-01-15T00:00:00" },
  { id: 6, productId: 6, changeQuantity: 25, reason: "import", createdAt: "2025-01-18T00:00:00" },
  { id: 7, productId: 7, changeQuantity: 30, reason: "import", createdAt: "2025-01-20T00:00:00" },
  { id: 8, productId: 1, changeQuantity: -1, reason: "order", createdAt: "2025-03-01T10:30:00" },
  { id: 9, productId: 3, changeQuantity: -1, reason: "order", createdAt: "2025-03-01T10:30:00" },
  { id: 10, productId: 5, changeQuantity: -1, reason: "order", createdAt: "2025-03-15T14:20:00" },
  { id: 11, productId: 6, changeQuantity: -2, reason: "order", createdAt: "2025-03-15T14:20:00" },
  { id: 12, productId: 2, changeQuantity: 2, reason: "adjust", createdAt: "2025-02-20T00:00:00" },
  { id: 13, productId: 4, changeQuantity: -1, reason: "adjust", createdAt: "2025-02-25T00:00:00" },
];
