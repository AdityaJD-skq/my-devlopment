import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter code and new password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if in development mode
    if (window.location.hostname === 'localhost') {
      setIsDevelopment(true);
    }
  }, []);

  // Auto-fetch code in development mode when moving to step 2
  useEffect(() => {
    if (isDevelopment && step === 2 && email) {
      fetchLatestCode();
    }
  }, [isDevelopment, step, email]);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const fetchLatestCode = async () => {
    if (!email) return;
    
    try {
      const res = await fetch(`/api/auth/latestCode?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.code) {
          setDevCode(data.code);
          // Auto-fill the code input in development
          setCode(data.code);
        }
      }
    } catch (err) {
      console.error('Failed to fetch code:', err);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to request password reset');
      
      if (isDevelopment) {
        setSuccess('Password reset code sent. In development mode, the code will be auto-filled.');
      } else {
        setSuccess('Password reset code sent to your email');
      }
      
      setStep(2);
      
      // In development mode, fetch the code after a short delay
      if (isDevelopment) {
        setTimeout(() => fetchLatestCode(), 500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!code || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      
      setSuccess('Password reset successful. You will be redirected to login page.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-center mb-6">
        {step === 1 ? 'Forgot Password' : 'Reset Password'}
      </h3>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-md p-3 text-sm">
          {success}
        </div>
      )}
      
      {isDevelopment && devCode && step === 2 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-md p-3 text-sm">
          Development Mode: Your reset code is <strong>{devCode}</strong> (auto-filled below)
        </div>
      )}
      
      {step === 1 ? (
        <form className="space-y-4" onSubmit={handleRequestReset}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center btn btn-primary"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Send Reset Code
            </button>
          </div>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Reset Code
            </label>
            <div className="mt-1">
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input"
                placeholder="Enter the code from your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input pr-10"
                placeholder="Create a new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pr-10"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center btn btn-primary"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Reset Password
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link to="/login" className="text-primary-600 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 