import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { SKILLS_LIST } from '../data/skillsList';
import SkillTagSelector from '../components/SkillTagSelector';
import { Save, Edit3, X, Loader } from 'lucide-react';

const EditSkills = () => {
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    // Update available skills whenever skills change
    const usedSkills = skills.map(s => s.skillTag);
    setAvailableSkills(SKILLS_LIST.filter(skill => !usedSkills.includes(skill)));
  }, [skills]);

  const loadSkills = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/');
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setSkills(userData.skills || []);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
      alert('Failed to load your skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!selectedSkill) {
      alert('Please select a skill before adding.');
      return;
    }

    if (skills.some(s => s.skillTag === selectedSkill)) {
      alert('You have already added this skill.');
      return;
    }

    const newSkill = {
      skillTag: selectedSkill,
      customMessage: customMessage.trim(),
      addedAt: new Date().toISOString()
    };

    setSkills([newSkill, ...skills]); // Prepend to show newest first
    setSelectedSkill('');
    setCustomMessage('');
  };

  const handleEditSkill = (index) => {
    setEditingIndex(index);
    setEditMessage(skills[index].customMessage);
  };

  const handleSaveEdit = (index) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      customMessage: editMessage.trim()
    };
    setSkills(updatedSkills);
    setEditingIndex(null);
    setEditMessage('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditMessage('');
  };

  const handleDeleteSkill = (index) => {
    if (window.confirm('Are you sure you want to remove this skill?')) {
      const updatedSkills = [...skills];
      updatedSkills.splice(index, 1);
      setSkills(updatedSkills);
    }
  };

  const handleSaveAll = async () => {
    if (skills.length === 0) {
      alert('You must have at least one skill.');
      return;
    }

    setSaving(true);
    try {
      const currentUser = auth.currentUser;
      const userRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        skills: skills,
        updatedAt: new Date().toISOString()
      });

      alert('Skills updated successfully!');
      navigate('/my-profile');
    } catch (error) {
      console.error('Error saving skills:', error);
      alert('Failed to save skills. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your skills...</p>
        </div>
      </div>
    );
  }

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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            ✏️ EDIT YOUR SKILLS
          </h1>
          <p className="text-gray-600">
            Add skills you can teach to other students. You can add multiple skills with custom descriptions.
          </p>
        </div>

        {/* Add New Skill Section */}
        <SkillTagSelector
          availableSkills={availableSkills}
          selectedSkill={selectedSkill}
          customMessage={customMessage}
          onSkillChange={setSelectedSkill}
          onMessageChange={setCustomMessage}
          onAdd={handleAddSkill}
          maxMessageLength={200}
          placeholder="Describe your expertise, experience, or what you can teach..."
        />

        {/* Current Skills Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📚 YOUR CURRENT SKILLS ({skills.length})
          </h2>

          {skills.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                NO SKILLS ADDED YET
              </h3>
              <p className="text-gray-600">
                You haven't added any skills to your profile.<br />
                Start by selecting a skill from the dropdown above!
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Other students will be able to find you based on the skills you add here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  {editingIndex === idx ? (
                    // Edit Mode
                    <div>
                      <div className="mb-3">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${badgeColors[idx % badgeColors.length]}`}>
                          {skill.skillTag}
                        </span>
                        <span className="text-xs text-gray-500 ml-3">(cannot change skill)</span>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Message:
                        </label>
                        <textarea
                          value={editMessage}
                          onChange={(e) => {
                            if (e.target.value.length <= 200) {
                              setEditMessage(e.target.value);
                            }
                          }}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                        />
                        <p className={`text-sm mt-1 ${
                          200 - editMessage.length > 50 ? 'text-green-600' : 
                          200 - editMessage.length > 20 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {200 - editMessage.length} characters remaining
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(idx)}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Save size={18} />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${badgeColors[idx % badgeColors.length]}`}>
                          {skill.skillTag}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSkill(idx)}
                            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit skill"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(idx)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete skill"
                          >
                            <X size={18} />
                          </button>
                        </div>
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save All Changes Button */}
        {skills.length > 0 && (
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {saving ? (
              <>
                <Loader className="animate-spin" size={24} />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>💾 Save All Changes</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditSkills;