export const validation = {
  // Username validation: 3-30 chars, alphanumeric + underscore only
  username: (value) => {
    if (!value || value.trim() === '') return 'Username is required';
    const trimmed = value.trim();
    if (trimmed.length < 3 || trimmed.length > 30) {
      return 'Username must be between 3 and 30 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  },

  // Password validation: 8-64 chars, uppercase, lowercase, digit, special char
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8 || value.length > 64) {
      return 'Password must be between 8 and 64 characters';
    }
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
    return null;
  },

  // Password confirmation
  passwordMatch: (password, confirmation) => {
    if (!confirmation) return 'Password confirmation is required';
    if (password !== confirmation) return 'Passwords do not match';
    return null;
  },

  // Email validation
  email: (value) => {
    if (!value || value.trim() === '') return 'Email is required';
    const trimmed = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return 'Invalid email format';
    return null;
  },

  // Name validation: 2-50 chars, letters only
  name: (value, fieldName = 'Name') => {
    if (!value || value.trim() === '') return `${fieldName} is required`;
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      return `${fieldName} must be between 2 and 50 characters`;
    }
    if (!/^[A-Za-z]+$/.test(trimmed)) {
      return `${fieldName} must contain letters only`;
    }
    return null;
  },

  // Egyptian phone number: 01012345678 format
  phone: (value) => {
    if (!value || value.trim() === '') return 'Phone number is required';
    const trimmed = value.trim();
    const phoneRegex = /^(?:\+20|20|0)(1[0125])[0-9]{8}$/;
    if (!phoneRegex.test(trimmed)) {
      return 'Phone must be a valid Egyptian number (e.g., 01012345678)';
    }
    return null;
  },

  // Card number: 16 digits
  cardNumber: (value) => {
    if (!value || value.trim() === '') return 'Card number is required';
    const digits = value.replace(/\s/g, '');
    if (digits.length !== 16) return 'Card number must be exactly 16 digits';
    if (!/^\d{16}$/.test(digits)) return 'Card number must contain only digits';
    return null;
  },

  // Card holder name
  cardHolderName: (value) => {
    if (!value || value.trim() === '') return 'Card holder name is required';
    const trimmed = value.trim();
    if (trimmed.length < 2) return 'Card holder name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
      return 'Card holder name must contain only letters and spaces';
    }
    return null;
  },

  // Expiration date: MM/YY format
  expirationDate: (value) => {
    if (!value || value.trim() === '') return 'Expiration date is required';
    const trimmed = value.trim();
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(trimmed)) {
      return 'Expiration date must be in MM/YY format';
    }
    
    // Check if card is expired
    const [month, year] = trimmed.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    now.setDate(1); // Set to first day of current month for comparison
    
    if (expiry < now) return 'Card has expired';
    return null;
  },

  // CVV: 3 digits
  cvv: (value) => {
    if (!value || value.trim() === '') return 'CVV is required';
    const trimmed = value.trim();
    if (!/^\d{3}$/.test(trimmed)) return 'CVV must be exactly 3 digits';
    return null;
  },

  // ISBN validation
  isbn: (value) => {
    if (!value || value.trim() === '') return 'ISBN is required';
    const trimmed = value.trim();
    if (trimmed.length < 10 || trimmed.length > 17) {
      return 'ISBN must be between 10 and 17 characters';
    }
    return null;
  },

  // Book title validation
  bookTitle: (value) => {
    if (!value || value.trim() === '') return 'Book title is required';
    const trimmed = value.trim();
    if (trimmed.length < 1 || trimmed.length > 255) {
      return 'Book title must be between 1 and 255 characters';
    }
    return null;
  },

  // Price validation
  price: (value) => {
    if (!value && value !== 0) return 'Price is required';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Price must be a valid number';
    if (numValue < 0) return 'Price cannot be negative';
    if (numValue > 999999.99) return 'Price is too large';
    return null;
  },

  // Quantity validation
  quantity: (value, fieldName = 'Quantity') => {
    if (value === '' || value === null || value === undefined) {
      return `${fieldName} is required`;
    }
    const numValue = parseInt(value);
    if (isNaN(numValue)) return `${fieldName} must be a valid number`;
    if (numValue < 0) return `${fieldName} cannot be negative`;
    if (numValue > 999999) return `${fieldName} is too large`;
    return null;
  },

  // Year validation
  year: (value) => {
    if (!value) return null; // Optional field
    const numValue = parseInt(value);
    if (isNaN(numValue)) return 'Year must be a valid number';
    if (numValue < 1000 || numValue > 9999) return 'Year must be 4 digits';
    const currentYear = new Date().getFullYear();
    if (numValue > currentYear + 10) return 'Year cannot be more than 10 years in the future';
    return null;
  },

  // OTP validation: 6 digits
  otp: (value) => {
    if (!value || value.trim() === '') return 'Verification code is required';
    const trimmed = value.trim();
    if (!/^\d{6}$/.test(trimmed)) return 'Verification code must be exactly 6 digits';
    return null;
  },

  // Publisher ID validation
  publisherId: (value) => {
    if (!value && value !== 0) return 'Publisher ID is required';
    const numValue = parseInt(value);
    if (isNaN(numValue)) return 'Publisher ID must be a valid number';
    if (numValue < 1) return 'Publisher ID must be a positive number';
    return null;
  },

  // Generic required field
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  }
};

// Helper function to format card number with spaces
export const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})/g, '$1 ').trim();
};

// Helper function to format expiry date
export const formatExpiryDate = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 2) {
    return digits.slice(0, 2) + '/' + digits.slice(2, 4);
  }
  return digits;
};

// Helper function to validate entire form
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const rule = validationRules[field];
    const value = formData[field];
    
    if (typeof rule === 'function') {
      const error = rule(value);
      if (error) errors[field] = error;
    } else if (Array.isArray(rule)) {
      // Multiple validation rules for one field
      for (const validationFn of rule) {
        const error = validationFn(value);
        if (error) {
          errors[field] = error;
          break; // Stop at first error
        }
      }
    }
  });
  
  return errors;
};