export const validators = {
  username: (value) => {
    if (!value || !value.trim()) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 30) return 'Username must be less than 30 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  },

  email: (value) => {
    if (!value || !value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  },

  firstName: (value) => {
    if (!value || !value.trim()) return 'First name is required';
    if (value.length < 2) return 'First name must be at least 2 characters';
    if (value.length > 50) return 'First name must be less than 50 characters';
    if (!/^[A-Za-z]+$/.test(value)) return 'First name must contain letters only';
    return '';
  },

  lastName: (value) => {
    if (!value || !value.trim()) return 'Last name is required';
    if (value.length < 2) return 'Last name must be at least 2 characters';
    if (value.length > 50) return 'Last name must be less than 50 characters';
    if (!/^[A-Za-z]+$/.test(value)) return 'Last name must contain letters only';
    return '';
  },

  phone: (value) => {
    if (!value || !value.trim()) return 'Phone number is required';
    if (!/^(?:\+20|20|0)(1[0125])[0-9]{8}$/.test(value)) {
      return 'Invalid Egyptian phone number format';
    }
    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (value.length > 64) return 'Password must be less than 64 characters';
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return '';
  },

  passwordConfirmation: (value, password) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  },

  userRole: (value) => {
    if (!value) return 'Please select an account type';
    if (!['CUSTOMER', 'ADMIN'].includes(value)) return 'Invalid account type';
    return '';
  },

  otp: (value) => {
    if (!value) return 'OTP is required';
    if (!/^\d{6}$/.test(value)) return 'OTP must be 6 digits';
    return '';
  },

  creditCard: (value) => {
    if (!value) return 'Card number is required';
    if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) {
      return 'Card number must be 16 digits';
    }
    return '';
  },

  cvv: (value) => {
    if (!value) return 'CVV is required';
    if (!/^\d{3}$/.test(value)) return 'CVV must be 3 digits';
    return '';
  },

  expirationDate: (value) => {
    if (!value) return 'Expiration date is required';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      return 'Format must be MM/YY';
    }
    return '';
  }
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
  if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
  if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
  return { strength, label: 'Strong', color: 'bg-green-500' };
};

export const getPasswordRequirements = (password) => [
  { text: 'At least 8 characters', met: password.length >= 8 },
  { text: 'One lowercase letter', met: /[a-z]/.test(password) },
  { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
  { text: 'One number', met: /\d/.test(password) },
  { text: 'One special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) },
];