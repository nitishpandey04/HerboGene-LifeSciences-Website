import { create } from 'zustand';

const initialCustomerState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: ''
};

const useCheckoutStore = create((set, get) => ({
  // Customer information
  customer: { ...initialCustomerState },

  // Coupon state
  coupon: null,
  discountAmount: 0,

  // Payment method
  paymentMethod: 'razorpay', // 'razorpay' or 'cod'

  // Order state
  currentOrder: null,
  isLoading: false,
  error: null,

  // Step tracking
  currentStep: 1, // 1: Customer Details, 2: Review & Pay

  // Actions
  setCustomerField: (field, value) => {
    set((state) => ({
      customer: {
        ...state.customer,
        [field]: value
      },
      error: null
    }));
  },

  setCustomer: (customer) => {
    set({ customer, error: null });
  },

  setCoupon: (coupon, discountAmount) => {
    set({ coupon, discountAmount });
  },

  clearCoupon: () => {
    set({ coupon: null, discountAmount: 0 });
  },

  setPaymentMethod: (method) => {
    set({ paymentMethod: method });
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  setCurrentOrder: (order) => {
    set({ currentOrder: order });
  },

  // Validation
  validateCustomer: () => {
    const { customer } = get();
    const errors = {};

    if (!customer.first_name.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!customer.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    if (!customer.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errors.email = 'Invalid email address';
    }

    if (!customer.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(customer.phone)) {
      errors.phone = 'Invalid phone number (10 digits starting with 6-9)';
    }

    if (!customer.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!customer.city.trim()) {
      errors.city = 'City is required';
    }

    if (!customer.state.trim()) {
      errors.state = 'State is required';
    }

    if (!customer.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(customer.pincode)) {
      errors.pincode = 'Invalid pincode (6 digits)';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Reset checkout state
  reset: () => {
    set({
      customer: { ...initialCustomerState },
      coupon: null,
      discountAmount: 0,
      paymentMethod: 'razorpay',
      currentOrder: null,
      isLoading: false,
      error: null,
      currentStep: 1
    });
  }
}));

export default useCheckoutStore;
