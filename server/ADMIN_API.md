# Admin Panel API Documentation

Complete API documentation for all admin panel endpoints.

## Table of Contents
- [Authentication](#authentication)
- [Product Management](#product-management)
- [Category Management](#category-management)
- [SubCategory Management](#subcategory-management)
- [Order Management](#order-management)
- [User Management](#user-management)
- [Dashboard & Analytics](#dashboard--analytics)

---

## Authentication

All admin endpoints require:
1. **Authentication**: Valid JWT access token in cookie or Authorization header
2. **Authorization**: User role must be `ADMIN`

### Headers
```
Authorization: Bearer <access_token>
Cookie: accessToken=<access_token>
```

---

## Product Management

### Create Product
**POST** `/api/product/create`

**Auth**: Admin only

**Request Body**:
```json
{
  "name": "Product Name",
  "image": ["https://image1.jpg", "https://image2.jpg"],
  "category": ["categoryId1", "categoryId2"],
  "subCategory": ["subCategoryId1"],
  "unit": "kg",
  "stock": 100,
  "price": 999.99,
  "discount": 10,
  "description": "Product description",
  "more_details": {}
}
```

**Response**:
```json
{
  "message": "Product Created Successfully",
  "data": { /* product object */ },
  "error": false,
  "success": true
}
```

---

### Update Product
**PUT** `/api/product/update`

**Auth**: Admin only

**Request Body**:
```json
{
  "_id": "productId",
  "name": "Updated Name",
  "price": 1099.99,
  // ... other fields to update
}
```

**Response**:
```json
{
  "message": "Product updated successfully",
  "data": { /* updated product */ },
  "error": false,
  "success": true
}
```

---

### Delete Product
**DELETE** `/api/product/delete`

**Auth**: Admin only

**Request Body**:
```json
{
  "_id": "productId"
}
```

**Response**:
```json
{
  "message": "Product deleted successfully",
  "data": { /* deleted product */ },
  "error": false,
  "success": true
}
```

---

### Toggle Product Publish Status
**PATCH** `/api/product/toggle-publish`

**Auth**: Admin only

**Request Body**:
```json
{
  "_id": "productId"
}
```

**Response**:
```json
{
  "message": "Product published successfully",
  "data": { /* product with updated publish status */ },
  "error": false,
  "success": true
}
```

---

### Get All Products
**GET** `/api/product/get?page=1&limit=10&search=query`

**Auth**: Public

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search query

**Response**:
```json
{
  "message": "Product data",
  "error": false,
  "success": true,
  "totalCount": 100,
  "totalNoPage": 10,
  "data": [/* array of products */]
}
```

---

### Get Single Product
**GET** `/api/product/:productId`

**Auth**: Public

**Response**:
```json
{
  "message": "Product details",
  "data": {
    "_id": "productId",
    "name": "Product Name",
    "price": 999.99,
    "category": [{ "_id": "catId", "name": "Category" }],
    // ... other fields
  },
  "error": false,
  "success": true
}
```

---

### Search Products
**GET** `/api/product/search?search=query&category=catId&minPrice=100&maxPrice=1000&inStock=true`

**Auth**: Public

**Query Parameters**:
- `search`: Text search
- `category`: Filter by category ID(s)
- `subCategory`: Filter by subcategory ID(s)
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `inStock`: true/false
- `page`: Page number
- `limit`: Items per page

---

## Category Management

### Create Category
**POST** `/api/category/add-category`

**Auth**: Admin only

**Request Body**:
```json
{
  "name": "Category Name",
  "image": "https://image.jpg"
}
```

**Response**:
```json
{
  "message": "Add category",
  "data": { /* category object */ },
  "success": true,
  "error": false
}
```

---

### Get All Categories
**GET** `/api/category/get`

**Auth**: Public

**Response**:
```json
{
  "data": [
    {
      "_id": "categoryId",
      "name": "Category Name",
      "image": "https://image.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "error": false,
  "success": true
}
```

---

### Update Category
**PUT** `/api/category/update`

**Auth**: Admin only

**Request Body**:
```json
{
  "_id": "categoryId",
  "name": "Updated Name",
  "image": "https://new-image.jpg"
}
```

**Response**:
```json
{
  "message": "updated category",
  "success": true,
  "error": false,
  "data": { /* updated count */ }
}
```

---

### Delete Category
**DELETE** `/api/category/delete`

**Auth**: Admin only

**Request Body**:
```json
{
  "_id": "categoryId"
}
```

**Response**:
```json
{
  "message": "Delete category successfully",
  "data": { /* delete result */ },
  "error": false,
  "success": true
}
```

**Note**: Cannot delete if category is in use by subcategories or products.

---

## SubCategory Management

### Create SubCategory
**POST** `/api/subcategory/create`

**Auth**: Admin only

**Request Body**:
```json
{
  "name": "SubCategory Name",
  "image": "https://image.jpg",
  "category": ["categoryId1", "categoryId2"]
}
```

---

### Get All SubCategories
**GET** `/api/subcategory/get`

**Auth**: Public

**Response**:
```json
{
  "message": "Sub category data",
  "data": [
    {
      "_id": "subCategoryId",
      "name": "SubCategory Name",
      "image": "https://image.jpg",
      "category": [{ /* populated category */ }]
    }
  ],
  "error": false,
  "success": true
}
```

---

### Update SubCategory
**PUT** `/api/subcategory/update`

**Auth**: Admin only

**Request Body**:
```json
{
  "_id": "subCategoryId",
  "name": "Updated Name",
  "image": "https://new-image.jpg",
  "category": ["categoryId"]
}
```

---

### Delete SubCategory
**DELETE** `/api/subcategory/delete`

**Auth**: Admin only

**Request Body**:
```json
{
  "_id": "subCategoryId"
}
```

---

## Order Management

### Get All Orders (Admin)
**GET** `/api/order/?page=1&limit=10&status=pending&search=ORD-123`

**Auth**: Admin only

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by payment status
- `search`: Search by order ID

**Response**:
```json
{
  "message": "All orders retrieved successfully",
  "data": [
    {
      "_id": "orderId",
      "orderId": "ORD-123456",
      "userId": { "name": "User Name", "email": "user@example.com" },
      "productId": { "name": "Product", "price": 999 },
      "payment_status": "completed",
      "totalAmt": 999,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalCount": 100,
  "totalPages": 10,
  "currentPage": 1,
  "error": false,
  "success": true
}
```

---

### Update Order Status
**PATCH** `/api/order/update-status`

**Auth**: Admin only

**Request Body**:
```json
{
  "orderId": "ORD-123456",
  "payment_status": "completed",
  "paymentId": "PAYMENT-123",
  "invoice_receipt": "https://invoice.pdf"
}
```

**Response**:
```json
{
  "message": "Order status updated successfully",
  "data": { /* updated order */ },
  "error": false,
  "success": true
}
```

---

### Delete Order
**DELETE** `/api/order/delete`

**Auth**: Admin only

**Request Body**:
```json
{
  "orderId": "ORD-123456"
}
```

---

### Get Order Statistics
**GET** `/api/order/stats/overview`

**Auth**: Admin only

**Response**:
```json
{
  "message": "Order statistics retrieved successfully",
  "data": {
    "totalOrders": 1000,
    "pendingOrders": 50,
    "completedOrders": 900,
    "totalRevenue": 150000
  },
  "error": false,
  "success": true
}
```

---

### Get Recent Orders
**GET** `/api/order/stats/recent?limit=10`

**Auth**: Admin only

**Response**:
```json
{
  "message": "Recent orders retrieved successfully",
  "data": [/* array of recent orders */],
  "error": false,
  "success": true
}
```

---

## User Management

### Get All Users
**GET** `/api/user/all-users?page=1&limit=10&search=query&role=ADMIN&status=Active`

**Auth**: Admin only

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `search`: Search by name, email, or username
- `role`: Filter by role (ADMIN/USER)
- `status`: Filter by status (Active/Inactive/Suspended)

**Response**:
```json
{
  "message": "All users retrieved successfully",
  "data": [
    {
      "_id": "userId",
      "name": "User Name",
      "email": "user@example.com",
      "username": "username",
      "role": "USER",
      "status": "Active",
      "verify_email": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalCount": 500,
  "totalPages": 50,
  "currentPage": 1,
  "error": false,
  "success": true
}
```

---

### Update User Status
**PATCH** `/api/user/update-status`

**Auth**: Admin only

**Request Body**:
```json
{
  "userId": "userId",
  "status": "Suspended"
}
```

**Valid Statuses**: Active, Inactive, Suspended

**Response**:
```json
{
  "message": "User status updated to Suspended",
  "data": { /* updated user */ },
  "error": false,
  "success": true
}
```

---

### Update User Role
**PATCH** `/api/user/update-role`

**Auth**: Admin only

**Request Body**:
```json
{
  "userId": "userId",
  "role": "ADMIN"
}
```

**Valid Roles**: ADMIN, USER

**Note**: Cannot change own role

**Response**:
```json
{
  "message": "User role updated to ADMIN",
  "data": { /* updated user */ },
  "error": false,
  "success": true
}
```

---

### Delete User
**DELETE** `/api/user/delete-user`

**Auth**: Admin only

**Request Body**:
```json
{
  "userId": "userId"
}
```

**Note**: Cannot delete own account

**Response**:
```json
{
  "message": "User deleted successfully",
  "data": { /* deleted user */ },
  "error": false,
  "success": true
}
```

---

### Get User Statistics
**GET** `/api/user/stats/overview`

**Auth**: Admin only

**Response**:
```json
{
  "message": "User statistics retrieved successfully",
  "data": {
    "totalUsers": 1000,
    "activeUsers": 800,
    "inactiveUsers": 150,
    "suspendedUsers": 50,
    "totalAdmins": 5,
    "verifiedUsers": 900,
    "unverifiedUsers": 100
  },
  "error": false,
  "success": true
}
```

---

### Get Recent Users
**GET** `/api/user/stats/recent?limit=10`

**Auth**: Admin only

**Response**:
```json
{
  "message": "Recent users retrieved successfully",
  "data": [/* array of recent users */],
  "error": false,
  "success": true
}
```

---

## Dashboard & Analytics

### Get Dashboard Statistics
**GET** `/api/dashboard/stats`

**Auth**: Admin only

**Response**:
```json
{
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "users": {
      "total": 1000,
      "active": 800,
      "verified": 900,
      "admins": 5,
      "newThisMonth": 50
    },
    "products": {
      "total": 500,
      "published": 450,
      "outOfStock": 20,
      "lowStock": 30
    },
    "orders": {
      "total": 2000,
      "pending": 50,
      "completed": 1900,
      "newThisMonth": 150
    },
    "revenue": {
      "total": 500000,
      "thisMonth": 50000
    },
    "categories": {
      "total": 20
    },
    "recentActivity": {
      "orders": [/* 5 recent orders */],
      "users": [/* 5 recent users */]
    }
  },
  "error": false,
  "success": true
}
```

---

### Get Sales Analytics
**GET** `/api/dashboard/sales-analytics?period=month`

**Auth**: Admin only

**Query Parameters**:
- `period`: week | month | year

**Response**:
```json
{
  "message": "Sales analytics retrieved successfully",
  "data": [
    {
      "_id": { "year": 2024, "month": 1, "day": 15 },
      "totalSales": 15000,
      "orderCount": 50
    }
  ],
  "period": "month",
  "error": false,
  "success": true
}
```

---

### Get Top Products
**GET** `/api/dashboard/top-products?limit=10`

**Auth**: Admin only

**Response**:
```json
{
  "message": "Top products retrieved successfully",
  "data": [
    {
      "_id": "productId",
      "name": "Product Name",
      "image": ["https://image.jpg"],
      "price": 999,
      "totalSales": 50000,
      "orderCount": 100
    }
  ],
  "error": false,
  "success": true
}
```

---

### Get Low Stock Products
**GET** `/api/dashboard/low-stock?threshold=10`

**Auth**: Admin only

**Response**:
```json
{
  "message": "Low stock products retrieved successfully",
  "data": [
    {
      "_id": "productId",
      "name": "Product Name",
      "stock": 5,
      "price": 999,
      "category": [{ "name": "Category" }]
    }
  ],
  "error": false,
  "success": true
}
```

---

### Get Revenue by Category
**GET** `/api/dashboard/revenue-by-category`

**Auth**: Admin only

**Response**:
```json
{
  "message": "Revenue by category retrieved successfully",
  "data": [
    {
      "_id": "categoryId",
      "categoryName": "Electronics",
      "categoryImage": "https://image.jpg",
      "totalRevenue": 100000,
      "orderCount": 500
    }
  ],
  "error": false,
  "success": true
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message",
  "error": true,
  "success": false
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication token required",
  "error": true,
  "success": false
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions",
  "error": true,
  "success": false
}
```

### 404 Not Found
```json
{
  "message": "Resource not found",
  "error": true,
  "success": false
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": true,
  "success": false
}
```

---

## Rate Limiting

- Auth endpoints (login, register, forgot-password): **5 requests per 15 minutes**
- File upload endpoints: **20 uploads per hour**
- General API endpoints: **100 requests per 15 minutes**

When rate limit is exceeded:
```json
{
  "success": false,
  "error": true,
  "message": "Too many requests from this IP, please try again later"
}
```

---

## Notes

1. All admin endpoints require both authentication and ADMIN role
2. Products, categories, and subcategories can be viewed by anyone (public)
3. Orders can be created by authenticated users but managed by admins only
4. Admins cannot delete themselves or change their own role
5. Categories/Subcategories cannot be deleted if in use by products
6. All timestamps are in ISO 8601 format
7. All amounts are in the base currency unit (e.g., cents for USD)

---

## Testing with cURL

### Login as Admin
```bash
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt
```

### Create Product
```bash
curl -X POST http://localhost:8080/api/product/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name":"Test Product",
    "image":["https://example.com/image.jpg"],
    "category":["categoryId"],
    "subCategory":["subCategoryId"],
    "unit":"pc",
    "stock":100,
    "price":99.99,
    "discount":10,
    "description":"Test product description"
  }'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:8080/api/dashboard/stats \
  -b cookies.txt
```

---

**Last Updated**: 2024
**API Version**: 1.0
