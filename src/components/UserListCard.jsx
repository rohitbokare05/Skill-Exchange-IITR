// import { Star } from 'lucide-react';

// const UserListCard = ({ user, onClick }) => {
//   // Calculate average rating
//   const avgRating = user.ratingCount > 0 
//     ? (user.ratingSum / user.ratingCount).toFixed(1) 
//     : null;

//   // Badge colors for skills
//   const badgeColors = [
//     'bg-blue-100 text-blue-700',
//     'bg-green-100 text-green-700',
//     'bg-purple-100 text-purple-700',
//     'bg-orange-100 text-orange-700',
//     'bg-pink-100 text-pink-700'
//   ];

//   // Get first 3 skills
//   const displaySkills = user.skills.slice(0, 3);
//   const remainingCount = user.skills.length - 3;

//   // Get first skill's custom message preview
//   const messagePreview = user.skills[0]?.customMessage 
//     ? user.skills[0].customMessage.substring(0, 80) + (user.skills[0].customMessage.length > 80 ? '...' : '')
//     : 'Tap to view details';
//   const getPhotoUrl = () => {
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=4F46E5&color=fff&bold=true&format=png`;
//   };
//   return (
//     <div
//       onClick={onClick}
//       className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-indigo-300 hover:scale-105"
//     >
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-4">
//         <img
//           src={getPhotoUrl()}
//           alt={user.name}
//           className="w-16 h-16 rounded-full border-2 border-indigo-200"
//         />
//         <div className="flex-1">
//           <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
//           <div className="flex items-center gap-1 text-sm">
//             {avgRating ? (
//               <>
//                 <Star size={16} className="text-yellow-500 fill-yellow-500" />
//                 <span className="font-semibold">{avgRating}</span>
//                 <span className="text-gray-600">({user.ratingCount} ratings)</span>
//               </>
//             ) : (
//               <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                 New
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Skills */}
//       <div className="mb-3">
//         <p className="text-xs text-gray-500 mb-2 font-semibold">SKILLS:</p>
//         <div className="flex flex-wrap gap-2">
//           {displaySkills.map((skill, idx) => (
//             <span
//               key={idx}
//               className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColors[idx % badgeColors.length]}`}
//             >
//               {skill.skillTag}
//             </span>
//           ))}
//           {remainingCount > 0 && (
//             <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
//               +{remainingCount} more
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Custom Message Preview */}
//       <p className="text-sm text-gray-600 italic line-clamp-2">
//         "{messagePreview}"
//       </p>

//       {/* View Profile Hint */}
//       <div className="mt-4 text-indigo-600 text-sm font-medium flex items-center justify-end">
//         Click to view full profile →
//       </div>
//     </div>
//   );
// };

// export default UserListCard;
import { Star } from 'lucide-react';

const UserListCard = ({ user, onClick }) => {
  // Calculate average rating
  const avgRating = user.ratingCount > 0 
    ? (user.ratingSum / user.ratingCount).toFixed(1) 
    : null;

  // Badge colors for skills
  const badgeColors = [
    'bg-purple-100 text-purple-700 border border-purple-200',
    'bg-violet-100 text-violet-700 border border-violet-200',
    'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200',
    'bg-indigo-100 text-indigo-700 border border-indigo-200',
    'bg-pink-100 text-pink-700 border border-pink-200'
  ];

  // Get first 3 skills
  const displaySkills = user.skills.slice(0, 3);
  const remainingCount = user.skills.length - 3;

  // Get first skill's custom message preview
  const messagePreview = user.skills[0]?.customMessage 
    ? user.skills[0].customMessage.substring(0, 80) + (user.skills[0].customMessage.length > 80 ? '...' : '')
    : 'Tap to view details';
    
  const getPhotoUrl = () => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=A78BFA&color=fff&bold=true&format=png`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-2 border-purple-100 hover:border-purple-300 hover:scale-105"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={getPhotoUrl()}
          alt={user.name}
          className="w-16 h-16 rounded-full border-2 border-purple-300"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
          <div className="flex items-center gap-1 text-sm">
            {avgRating ? (
              <>
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{avgRating}</span>
                <span className="text-gray-600">({user.ratingCount} ratings)</span>
              </>
            ) : (
              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200 font-medium">
                New
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-3">
        <p className="text-xs text-purple-600 mb-2 font-semibold">SKILLS:</p>
        <div className="flex flex-wrap gap-2">
          {displaySkills.map((skill, idx) => (
            <span
              key={idx}
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeColors[idx % badgeColors.length]}`}
            >
              {skill.skillTag}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              +{remainingCount} more
            </span>
          )}
        </div>
      </div>

      {/* Custom Message Preview */}
      <p className="text-sm text-gray-600 italic line-clamp-2">
        "{messagePreview}"
      </p>

      {/* View Profile Hint */}
      <div className="mt-4 text-purple-600 text-sm font-medium flex items-center justify-end">
        Click to view full profile →
      </div>
    </div>
  );
};

export default UserListCard;