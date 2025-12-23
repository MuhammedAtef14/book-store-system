import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { validators } from '../../utils/validation';
import { formatCurrency, formatCardNumber, formatExpirationDate } from '../../utils/formatters';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import Alert from '../common/Alert';

export default function Checkout() {
  const { cart, totalPrice, checkout } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
  });

  const validateField = (name, value) => {
    return validators[name] ? validators[name](value) : '';
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Format card number
    if (name === 'cardNumber') {
      value = formatCardNumber(value);
    }

    // Format expiration date
    if (name === 'expirationDate') {
      value = formatExpirationDate(value);
    }

    // Only digits for CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) {
      setAlert({ type: 'error', message: 'Please fix all validation errors' });
      return;
    }

    setLoading(true);

    try {
      await checkout({
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardHolderName: formData.cardHolderName,
        expirationDate: formData.expirationDate,
        cvv: formData.cvv,
      });

      setAlert({ type: 'success', message: 'Order placed successfully!' });
      setTimeout(() => {
        navigate('/customer/orders');
      }, 2000);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.cartItems?.length === 0) {
    navigate('/customer/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div>
          <Card title="Payment Information">
            <div className="space-y-4">
              <Input
                icon={CreditCard}
                name="cardNumber"
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cardNumber && errors.cardNumber}
                maxLength={19}
                required
              />

              <Input
                name="cardHolderName"
                label="Cardholder Name"
                placeholder="JOHN DOE"
                value={formData.cardHolderName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cardHolderName && errors.cardHolderName}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="expirationDate"
                  label="Expiration Date"
                  placeholder="MM/YY"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.expirationDate && errors.expirationDate}
                  maxLength={5}
                  required
                />

                <Input
                  icon={Lock}
                  name="cvv"
                  label="CVV"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.cvv && errors.cvv}
                  maxLength={3}
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card title="Order Summary">
            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-2">
                {cart.cartItems?.map((item) => (
                  <div key={item.bookId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.bookTitle} × {item.quantity}
                    </span>
                    <span className="font-semibold">{formatCurrency(item.subTotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <Button
                fullWidth
                loading={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Processing...' : `Pay ${formatCurrency(totalPrice)}`}
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/customer/cart')}
              >
                Back to Cart
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}