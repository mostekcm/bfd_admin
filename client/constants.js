/*
 * Auth.
 */

// Token.
export const LOADED_TOKEN = 'LOADED_TOKEN';
export const RECIEVED_TOKEN = 'RECIEVED_TOKEN';

// Login.
export const SHOW_LOGIN = 'SHOW_LOGIN';
export const REDIRECT_LOGIN = 'REDIRECT_LOGIN';
export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

// Logout.
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

/*
 * Cases.
 */
// Fetch all.
export const FETCH_CASES = 'FETCH_CASES';
export const FETCH_CASES_PENDING = 'FETCH_CASES_PENDING';
export const FETCH_CASES_REJECTED = 'FETCH_CASES_REJECTED';
export const FETCH_CASES_FULFILLED = 'FETCH_CASES_FULFILLED';

/*
 * Packages.
 */
// Fetch all.
export const FETCH_PACKAGES = 'FETCH_PACKAGES';
export const FETCH_PACKAGES_PENDING = 'FETCH_PACKAGES_PENDING';
export const FETCH_PACKAGES_REJECTED = 'FETCH_PACKAGES_REJECTED';
export const FETCH_PACKAGES_FULFILLED = 'FETCH_PACKAGES_FULFILLED';

/*
 * Companies.
 */
// Fetch all.
export const FETCH_COMPANIES = 'FETCH_COMPANIES';
export const FETCH_COMPANIES_PENDING = 'FETCH_COMPANIES_PENDING';
export const FETCH_COMPANIES_REJECTED = 'FETCH_COMPANIES_REJECTED';
export const FETCH_COMPANIES_FULFILLED = 'FETCH_COMPANIES_FULFILLED';

/*
 * Displays.
 */
// Fetch all.
export const FETCH_DISPLAYS = 'FETCH_DISPLAYS';
export const FETCH_DISPLAYS_PENDING = 'FETCH_DISPLAYS_PENDING';
export const FETCH_DISPLAYS_REJECTED = 'FETCH_DISPLAYS_REJECTED';
export const FETCH_DISPLAYS_FULFILLED = 'FETCH_DISPLAYS_FULFILLED';

/*
 * Orders.
 */

// Create order.
export const REQUEST_CREATE_ORDER = 'REQUEST_CREATE_ORDER';
export const CANCEL_CREATE_ORDER = 'CANCEL_CREATE_ORDER';
export const CREATE_ORDER = 'CREATE_ORDER';
export const CREATE_ORDER_PENDING = 'CREATE_ORDER_PENDING';
export const CREATE_ORDER_REJECTED = 'CREATE_ORDER_REJECTED';
export const CREATE_ORDER_FULFILLED = 'CREATE_ORDER_FULFILLED';

// Delete order.
export const REQUEST_DELETE_ORDER = 'REQUEST_DELETE_ORDER';
export const CANCEL_DELETE_ORDER = 'CANCEL_DELETE_ORDER';
export const DELETE_ORDER = 'DELETE_ORDER';
export const DELETE_ORDER_PENDING = 'DELETE_ORDER_PENDING';
export const DELETE_ORDER_REJECTED = 'DELETE_ORDER_REJECTED';
export const DELETE_ORDER_FULFILLED = 'DELETE_ORDER_FULFILLED';

// Fetch all.
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const FETCH_ORDERS_PENDING = 'FETCH_ORDERS_PENDING';
export const FETCH_ORDERS_REJECTED = 'FETCH_ORDERS_REJECTED';
export const FETCH_ORDERS_FULFILLED = 'FETCH_ORDERS_FULFILLED';

// Fetch single.
export const FETCH_ORDER = 'FETCH_ORDER';
export const FETCH_ORDER_PENDING = 'FETCH_ORDER_PENDING';
export const FETCH_ORDER_REJECTED = 'FETCH_ORDER_REJECTED';
export const FETCH_ORDER_FULFILLED = 'FETCH_ORDER_FULFILLED';

// Update Shipping
export const REQUEST_UPDATE_SHIPPING = 'REQUEST_UPDATE_SHIPPING';
export const CANCEL_UPDATE_SHIPPING = 'CANCEL_UPDATE_SHIPPING';
export const UPDATE_SHIPPING = 'UPDATE_SHIPPING';
export const UPDATE_SHIPPING_PENDING = 'UPDATE_SHIPPING_PENDING';
export const UPDATE_SHIPPING_REJECTED = 'UPDATE_SHIPPING_REJECTED';
export const UPDATE_SHIPPING_FULFILLED = 'UPDATE_SHIPPING_FULFILLED';

// Update Discount
export const REQUEST_UPDATE_DISCOUNT = 'REQUEST_UPDATE_DISCOUNT';
export const CANCEL_UPDATE_DISCOUNT = 'CANCEL_UPDATE_DISCOUNT';
export const UPDATE_DISCOUNT = 'UPDATE_DISCOUNT';
export const UPDATE_DISCOUNT_PENDING = 'UPDATE_DISCOUNT_PENDING';
export const UPDATE_DISCOUNT_REJECTED = 'UPDATE_DISCOUNT_REJECTED';
export const UPDATE_DISCOUNT_FULFILLED = 'UPDATE_DISCOUNT_FULFILLED';

// Update Company
export const UPDATE_COMPANY = 'UPDATE_COMPANY';
export const UPDATE_COMPANY_PENDING = 'UPDATE_COMPANY_PENDING';
export const UPDATE_COMPANY_REJECTED = 'UPDATE_COMPANY_REJECTED';
export const UPDATE_COMPANY_FULFILLED = 'UPDATE_COMPANY_FULFILLED';

// Patch Order
export const REQUEST_UPDATE_LINE_ITEMS = 'REQUEST_UPDATE_LINE_ITEMS';
export const CANCEL_UPDATE_LINE_ITEMS = 'CANCEL_UPDATE_LINE_ITEMS';
export const UPDATE_LINE_ITEMS = 'UPDATE_LINE_ITEMS';
export const UPDATE_LINE_ITEMS_PENDING = 'UPDATE_LINE_ITEMS_PENDING';
export const UPDATE_LINE_ITEMS_REJECTED = 'UPDATE_LINE_ITEMS_REJECTED';
export const UPDATE_LINE_ITEMS_FULFILLED = 'UPDATE_LINE_ITEMS_FULFILLED';

// Patch Order
export const REQUEST_UPDATE_DISPLAY_ITEMS = 'REQUEST_UPDATE_DISPLAY_ITEMS';
export const CANCEL_UPDATE_DISPLAY_ITEMS = 'CANCEL_UPDATE_DISPLAY_ITEMS';
export const UPDATE_DISPLAY_ITEMS = 'UPDATE_DISPLAY_ITEMS';
export const UPDATE_DISPLAY_ITEMS_PENDING = 'UPDATE_DISPLAY_ITEMS_PENDING';
export const UPDATE_DISPLAY_ITEMS_REJECTED = 'UPDATE_DISPLAY_ITEMS_REJECTED';
export const UPDATE_DISPLAY_ITEMS_FULFILLED = 'UPDATE_DISPLAY_ITEMS_FULFILLED';

// Fetch all.
export const FETCH_SHOW_REPORT = 'FETCH_SHOW_REPORT';
export const FETCH_SHOW_REPORT_PENDING = 'FETCH_SHOW_REPORT_PENDING';
export const FETCH_SHOW_REPORT_REJECTED = 'FETCH_SHOW_REPORT_REJECTED';
export const FETCH_SHOW_REPORT_FULFILLED = 'FETCH_SHOW_REPORT_FULFILLED';

// Fetch all.
export const FETCH_MONTH_REPORT = 'FETCH_MONTH_REPORT';
export const FETCH_MONTH_REPORT_PENDING = 'FETCH_MONTH_REPORT_PENDING';
export const FETCH_MONTH_REPORT_REJECTED = 'FETCH_MONTH_REPORT_REJECTED';
export const FETCH_MONTH_REPORT_FULFILLED = 'FETCH_MONTH_REPORT_FULFILLED';

// Fetch all.
export const FETCH_COMMISSION_DUE_REPORT = 'FETCH_COMMISSION_DUE_REPORT';
export const FETCH_COMMISSION_DUE_REPORT_PENDING = 'FETCH_COMMISSION_DUE_REPORT_PENDING';
export const FETCH_COMMISSION_DUE_REPORT_REJECTED = 'FETCH_COMMISSION_DUE_REPORT_REJECTED';
export const FETCH_COMMISSION_DUE_REPORT_FULFILLED = 'FETCH_COMMISSION_DUE_REPORT_FULFILLED';

// Fetch all.
export const FETCH_SHIPMENTS_REPORT = 'FETCH_SHIPMENTS_REPORT';
export const FETCH_SHIPMENTS_REPORT_PENDING = 'FETCH_SHIPMENTS_REPORT_PENDING';
export const FETCH_SHIPMENTS_REPORT_REJECTED = 'FETCH_SHIPMENTS_REPORT_REJECTED';
export const FETCH_SHIPMENTS_REPORT_FULFILLED = 'FETCH_SHIPMENTS_REPORT_FULFILLED';
export const REQUEST_SHIPMENTS_FORM = 'REQUEST_SHIPMENTS_FORM';

// Fetch all.
export const FETCH_PAYMENTS_REPORT = 'FETCH_PAYMENTS_REPORT';
export const FETCH_PAYMENTS_REPORT_PENDING = 'FETCH_PAYMENTS_REPORT_PENDING';
export const FETCH_PAYMENTS_REPORT_REJECTED = 'FETCH_PAYMENTS_REPORT_REJECTED';
export const FETCH_PAYMENTS_REPORT_FULFILLED = 'FETCH_PAYMENTS_REPORT_FULFILLED';
export const REQUEST_PAYMENTS_FORM = 'REQUEST_PAYMENTS_FORM';

// Pay Commissions.
export const PAY_COMMISSIONS = 'PAY_COMMISSIONS';
export const PAY_COMMISSIONS_PENDING = 'PAY_COMMISSIONS_PENDING';
export const PAY_COMMISSIONS_REJECTED = 'PAY_COMMISSIONS_REJECTED';
export const PAY_COMMISSIONS_FULFILLED = 'PAY_COMMISSIONS_FULFILLED';
