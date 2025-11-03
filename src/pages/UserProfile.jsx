import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import RatingModal from '../components/RatingModal';
import { ArrowLeft, Mail, Star, Loader, Copy, Check } from 'lucide-react';

const UserProfile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copied, setCopied] = useState(false);

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
          skills: userData.skills || [],
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
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=256&background=A78BFA&color=fff&bold=true&format=png`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-[#A78BFA] mx-auto" />
          <p className="mt-4 text-[#6B21A8] font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const avgRating = user.ratingCount > 0 
    ? (user.ratingSum / user.ratingCount).toFixed(1) 
    : 0;

  const sortedSkills = user.skills && Array.isArray(user.skills)
    ? [...user.skills].sort((a, b) => {
        const dateA = a.addedAt ? new Date(a.addedAt) : new Date(0);
        const dateB = b.addedAt ? new Date(b.addedAt) : new Date(0);
        return dateB - dateA;
      })
    : [];

  const badgeColors = [
    'bg-[#E0E7FF] text-[#4338CA]',
    'bg-[#FCE7F3] text-[#A21CAF]',
    'bg-[#EDE9FE] text-[#6B21A8]',
    'bg-[#F3E8FF] text-[#581C87]',
    'bg-[#FEF9C3] text-[#92400E]'
  ];

  return (
    <div className="min-h-screen bg-[#F5F3FF] text-[#111827]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-[#6B21A8] hover:text-[#A78BFA] font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Profile Header */}
        <div className="bg-white border border-[#A78BFA]/40 rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <img
              src={getPhotoUrl()}
              alt={user.name}
              className="w-32 h-32 rounded-full mx-auto border-4 border-[#A78BFA] shadow-xl mb-4"
            />
            <h1 className="text-3xl font-bold text-[#111827] mb-2">
              {user.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <Mail size={18} className="text-[#6B21A8]" />
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
                        ? 'text-[#FCD34D] fill-[#FCD34D]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-lg font-semibold text-[#6B21A8]">
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
        <div className="bg-white border border-[#A78BFA]/40 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#6B21A8] mb-6 flex items-center gap-2">
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
                  className="border border-[#A78BFA]/30 rounded-xl p-6 bg-[#F9F8FF] hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${badgeColors[idx % badgeColors.length]}`}>
                      {skill.skillTag || 'Untitled Skill'}
                    </span>
                  </div>
                  
                  {skill.customMessage && (
                    <p className="text-gray-700 mb-3 leading-relaxed italic">
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
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#6B21A8] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#A78BFA] transition-colors shadow-md"
          >
            <Mail size={20} />
            Message via Email
          </button>
          
          <button
            onClick={() => setShowRatingModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#A78BFA] text-[#6B21A8] font-semibold py-3 px-6 rounded-lg hover:bg-[#F5F3FF] transition-colors shadow-sm"
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

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-[#A78BFA]/40 w-96 p-6 text-center">
            <h2 className="text-2xl font-bold text-[#6B21A8] mb-4">📧 Contact via Email</h2>
            <p className="text-gray-700 mb-6">
              You can reach <span className="font-semibold">{user.name}</span> at:
            </p>

            <div className="flex items-center justify-between bg-[#F5F3FF] border border-[#A78BFA]/40 rounded-lg px-4 py-3 mb-4">
              <span className="text-[#111827] font-medium truncate">{user.email}</span>
              <button onClick={handleCopyEmail} className="text-[#6B21A8] hover:text-[#A78BFA] transition">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            {copied && <p className="text-sm text-green-600 font-medium mb-2">Copied to clipboard ✅</p>}

            <button
              onClick={() => setShowEmailModal(false)}
              className="mt-2 bg-[#6B21A8] hover:bg-[#A78BFA] text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
