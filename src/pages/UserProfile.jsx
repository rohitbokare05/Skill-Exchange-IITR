import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import RatingModal from '../components/RatingModal';
import { ArrowLeft, Mail, Star, Loader } from 'lucide-react';

const UserProfile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [uid]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser({ 
          uid: userSnap.id, 
          ...userData,
          skills: userData.skills || [], // Ensure skills is always an array
          ratingSum: userData.ratingSum || 0,
          ratingCount: userData.ratingCount || 0
        });
      } else {
        alert('User not found');
        navigate('/home');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  const getPhotoUrl = () => {
    if (!user) return '';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=256&background=4F46E5&color=fff&bold=true&format=png`;
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const avgRating = user.ratingCount > 0 
    ? (user.ratingSum / user.ratingCount).toFixed(1) 
    : 0;

  // Sort skills by addedAt (newest first) - with safety check
  const sortedSkills = user.skills && Array.isArray(user.skills)
    ? [...user.skills].sort((a, b) => {
        const dateA = a.addedAt ? new Date(a.addedAt) : new Date(0);
        const dateB = b.addedAt ? new Date(b.addedAt) : new Date(0);
        return dateB - dateA;
      })
    : [];

  const badgeColors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-6"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <img
              src={getPhotoUrl()}
              alt={user.name}
              className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-xl mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <Mail size={18} />
              <span>{user.email}</span>
            </div>

            {/* Rating Display */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`${
                      star <= Math.round(avgRating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {avgRating} / 5.0
              </p>
              <p className="text-sm text-gray-600">
                {user.ratingCount > 0 
                  ? `Based on ${user.ratingCount} rating${user.ratingCount > 1 ? 's' : ''}`
                  : 'No ratings yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📚 SKILLS OFFERED
          </h2>

          {sortedSkills.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>This user hasn't added any skills yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${badgeColors[idx % badgeColors.length]}`}>
                      {skill.skillTag || 'Untitled Skill'}
                    </span>
                  </div>
                  
                  {skill.customMessage && (
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      "{skill.customMessage}"
                    </p>
                  )}
                  
                  {skill.addedAt && (
                    <p className="text-xs text-gray-500">
                      Added on {new Date(skill.addedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <a
            href={`mailto:${user.email}?subject=Skill Exchange @ IITR - Learning ${sortedSkills[0]?.skillTag || 'a skill'}`}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Mail size={20} />
            Message via Email
          </a>
          
          <button
            onClick={() => setShowRatingModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Star size={20} />
            Rate This User
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          user={user}
          onClose={() => setShowRatingModal(false)}
          onSuccess={loadUserProfile}
        />
      )}
    </div>
  );
};

export default UserProfile;