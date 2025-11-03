import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Edit3, Mail, Star, Loader } from 'lucide-react';

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyProfile();
  }, []);

  const loadMyProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/');
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData({ uid: userSnap.id, ...userSnap.data() });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load your profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-purple-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  const avgRating = userData.ratingCount > 0 
    ? (userData.ratingSum / userData.ratingCount).toFixed(1) 
    : 0;

  // Sort skills by addedAt (newest first)
  const sortedSkills = [...userData.skills].sort((a, b) => 
    new Date(b.addedAt) - new Date(a.addedAt)
  );

  const badgeColors = [
    'bg-purple-100 text-purple-700 border border-purple-200',
    'bg-violet-100 text-violet-700 border border-violet-200',
    'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200',
    'bg-indigo-100 text-indigo-700 border border-indigo-200',
    'bg-pink-100 text-pink-700 border border-pink-200'
  ];
  
  const getPhotoUrl = () => {
    if (!userData) return '';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&size=256&background=A78BFA&color=fff&bold=true&format=png`;
  };

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-8 mb-8">
          <div className="text-center">
            <p className="text-sm text-purple-600 font-semibold mb-2 uppercase tracking-wide">
              Your Profile
            </p>
            <img
              src={getPhotoUrl()}
              alt={userData.name}
              className="w-32 h-32 rounded-full mx-auto border-4 border-purple-200 shadow-xl mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userData.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <Mail size={18} className="text-purple-600" />
              <span>{userData.email}</span>
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
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {avgRating} / 5.0
              </p>
              <p className="text-sm text-gray-600">
                {userData.ratingCount > 0 
                  ? `Based on ${userData.ratingCount} rating${userData.ratingCount > 1 ? 's' : ''}`
                  : 'No ratings yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-purple-600">📚</span> YOUR SKILLS
          </h2>

          {userData.skills.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                NO SKILLS ADDED YET
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't added any skills to your profile.<br />
                Add skills to help other students find you!
              </p>
              <button
                onClick={() => navigate('/edit-skills')}
                className="inline-flex items-center gap-2 bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors shadow-md hover:shadow-lg"
              >
                <Edit3 size={20} />
                Add Skills Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="border-2 border-purple-100 rounded-xl p-6 hover:shadow-md hover:border-purple-200 transition-all"
                >
                  <div className="mb-3">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${badgeColors[idx % badgeColors.length]}`}>
                      {skill.skillTag}
                    </span>
                  </div>
                  
                  {skill.customMessage && (
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      "{skill.customMessage}"
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Added on {new Date(skill.addedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Button */}
        {userData.skills.length > 0 && (
          <button
            onClick={() => navigate('/edit-skills')}
            className="w-full flex items-center justify-center gap-2 bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors shadow-md hover:shadow-lg"
          >
            <Edit3 size={20} />
            Edit Skills
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;