import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const OtpConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try to get email from location state
  const [email, setEmail] = useState(() => {
    return location.state?.email || '';
  });
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    // Check if in development mode - this is a simple check that might need adjustment
    if (window.location.hostname === 'localhost') {
      setIsDevelopment(true);
    }
  }, []);

  // Auto-fetch code in development mode
  useEffect(() => {
    if (isDevelopment && email) {
      fetchLatestCode();
    }
  }, [isDevelopment, email]);

  // Start countdown timer for code expiry
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [remainingTime]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !code) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/confirm-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      
      // Check if response is ok before trying to parse JSON
      if (!res.ok) {
        let errorMessage = 'Confirmation failed';
        try {
          const data = await res.json();
          errorMessage = data.message || errorMessage;
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError);
          errorMessage = `Server error (${res.status}): ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      // Parse response data with error handling
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('Failed to parse success response:', jsonError);
        throw new Error('Could not parse server response. Please try again.');
      }
      
      setSuccess('Email confirmed! You will be redirected to login page.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm email');
      console.error('Confirmation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend code');
      
      setSuccess('A new confirmation code has been sent to your email');
      setRemainingTime(300); // Reset timer to 5 minutes
      setResendDisabled(true);
      
      // In development mode, fetch the latest code
      if (isDevelopment) {
        // Wait a bit for the backend to process
        setTimeout(() => fetchLatestCode(), 500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation code');
    } finally {
      setLoading(false);
    }
  };

  // Format remaining time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-center mb-6">Confirm Your Email</h3>
      
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
      
      {isDevelopment && devCode && (
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-md p-3 text-sm">
          Development Mode: Your code is <strong>{devCode}</strong> (auto-filled below)
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
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
              readOnly={!!location.state?.email}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Confirmation Code
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
          {remainingTime > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Code expires in: {formatTime(remainingTime)}
            </p>
          )}
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
            Verify Email
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendDisabled || loading}
          className="text-primary-600 hover:underline disabled:text-gray-400 disabled:no-underline"
        >
          Resend confirmation code
        </button>
        {resendDisabled && remainingTime <= 0 && (
          <p className="mt-1 text-sm text-gray-500">
            Code expired. You can now request a new code.
          </p>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/login" className="text-primary-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default OtpConfirmationPage; 