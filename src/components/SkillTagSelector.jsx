import { Plus } from 'lucide-react';

const SkillTagSelector = ({
  availableSkills,
  selectedSkill,
  customMessage,
  onSkillChange,
  onMessageChange,
  onAdd,
  maxMessageLength = 200,
  placeholder = "Describe your expertise, experience, or what you can teach..."
}) => {
  const remaining = maxMessageLength - customMessage.length;
  
  const getRemainingColor = () => {
    if (remaining > 50) return 'text-green-600';
    if (remaining > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        📝 ADD NEW SKILL
      </h3>

      {/* Skill Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Skill:
        </label>
        <select
          value={selectedSkill}
          onChange={(e) => onSkillChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option value="">Choose a skill...</option>
          {availableSkills.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Message Textarea */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Message (Optional):
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => {
            if (e.target.value.length <= maxMessageLength) {
              onMessageChange(e.target.value);
            }
          }}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
        />
        <p className={`text-sm mt-1 ${getRemainingColor()}`}>
          {remaining} characters remaining
        </p>
      </div>

      {/* Add Button */}
      <button
        onClick={onAdd}
        disabled={!selectedSkill}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Plus size={20} />
        Add Skill
      </button>
    </div>
  );
};

export default SkillTagSelector;