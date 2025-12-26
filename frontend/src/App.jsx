import React, { useState } from 'react';
import { useAuth } from './auth/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import OrderHistory from './pages/OrderHistory';
import UserProfile from './pages/UserProfile';
import { Book, ShoppingCart, LogOut, Menu, X, User, BarChart, Package } from 'lucide-react';

const App = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [currentPage, setCurrentPage] = useState('books');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const handleSignupSuccess = (email) => {
    setVerificationEmail(email);
    setShowSignup(false);
    setShowVerification(true);
  };

  const handleVerificationComplete = () => {
    setShowVerification(false);
    setShowSignup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    if (showVerification) {
      return (
        <VerifyEmailPage
          email={verificationEmail}
          onVerified={handleVerificationComplete}
          onBackToLogin={() => setShowVerification(false)}
        />
      );
    }

    return showSignup ? (
      <SignupPage
        onSwitchToLogin={() => setShowSignup(false)}
        onSignupSuccess={handleSignupSuccess}
      />
    ) : (
      <LoginPage
        onSwitchToSignup={() => setShowSignup(true)}
        onNeedVerification={(email) => {
          setVerificationEmail(email);
          setShowVerification(true);
        }}
      />
    );
  }

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Book className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Bookstore</h1>
                <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Customer'}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {!isAdmin ? (
                <>
                  <button
                    onClick={() => setCurrentPage('books')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                      currentPage === 'books' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Book className="w-5 h-5" />
                    Books
                  </button>

                  <button
                    onClick={() => setCurrentPage('cart')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                      currentPage === 'cart' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                  </button>

                  <button
                    onClick={() => setCurrentPage('orders')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                      currentPage === 'orders' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    Orders
                  </button>

                  <button
                    onClick={() => setCurrentPage('profile')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                      currentPage === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                      currentPage === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart className="w-5 h-5" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => setCurrentPage('books')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                      currentPage === 'books' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Book className="w-5 h-5" />
                    Books
                  </button>
                </>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t space-y-2">
              {!isAdmin ? (
                <>
                  <button
                    onClick={() => {
                      setCurrentPage('books');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <Book className="w-5 h-5" />
                    Books
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('cart');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('orders');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <Package className="w-5 h-5" />
                    Orders
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setCurrentPage('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <BarChart className="w-5 h-5" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('books');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <Book className="w-5 h-5" />
                    Books
                  </button>
                </>
              )}

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'books' && <BooksPage isAdmin={isAdmin} />}
        {currentPage === 'cart' && !isAdmin && <CartPage userId={user.userId} />}
        {currentPage === 'admin' && isAdmin && <AdminDashboard />}
        {currentPage === 'orders' && !isAdmin && <OrderHistory userId={user.userId} />}
        {currentPage === 'profile' && !isAdmin && <UserProfile />}
      </main>
    </div>
  );
};

export default App;