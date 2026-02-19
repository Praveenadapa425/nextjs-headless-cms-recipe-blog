import { useState } from 'react';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous states
    setError('');
    setIsSuccess(false);
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Simulate form submission
    setIsSubmitting(true);
    
    // In a real app, you would send this to your backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail(''); // Clear the form
    }, 1000);
  };

  // Hide form on success
  if (isSuccess) {
    return (
      <div data-testid="newsletter-success" className="p-6 bg-green-50 rounded-lg text-center">
        <div className="text-green-800">
          <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h3 className="text-xl font-semibold mb-2">Thank you for subscribing!</h3>
          <p className="text-green-700">You'll receive our latest recipes and updates.</p>
        </div>
      </div>
    );
  }

  return (
    <form 
      data-testid="newsletter-form" 
      onSubmit={handleSubmit} 
      className="flex flex-col sm:flex-row gap-3"
    >
      <div className="flex-1">
        <input
          data-testid="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>
      
      <button
        data-testid="newsletter-submit"
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
      
      {error && (
        <div data-testid="newsletter-error" className="mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </form>
  );
};

export default NewsletterForm;