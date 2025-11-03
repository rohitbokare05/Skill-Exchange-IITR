import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

const RatingModal = ({ user, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ratingSum: increment(rating),
        ratingCount: increment(1),
        updatedAt: new Date().toISOString()
      });

      alert(`Thank you! You rated ${user.name} ${rating} star${rating > 1 ? 's' : ''}.`);
      onSuccess(); // Refresh parent component data
      onClose(); // Close modal
    } catch (error) {
      console.error('Rating submission error:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Rate Learning Experience
        </h2>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <img
            src={user.photo}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-indigo-200"
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">How was your experience?</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
                disabled={submitting}
              >
                <Star
                  size={40}
                  className={`${
                    star <= displayRating
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            {rating > 0 ? (
              <span className="font-semibold text-indigo-600">
                Your Rating: {rating} star{rating > 1 ? 's' : ''}
              </span>
            ) : (
              'Click a star to rate'
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="flex-1 px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;