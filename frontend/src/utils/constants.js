export const BOOK_CATEGORIES = [
  'Science',
  'Art',
  'Religion',
  'History',
  'Geography',
];

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Customer routes
  CUSTOMER_HOME: '/customer',
  CUSTOMER_BOOKS: '/customer/books',
  CUSTOMER_CART: '/customer/cart',
  CUSTOMER_CHECKOUT: '/customer/checkout',
  CUSTOMER_ORDERS: '/customer/orders',
  CUSTOMER_PROFILE: '/customer/profile',
  
  // Admin routes
  ADMIN_HOME: '/admin',
  ADMIN_BOOKS: '/admin/books',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_REPORTS: '/admin/reports',
};