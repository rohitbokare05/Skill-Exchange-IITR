// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { collection, getDocs } from 'firebase/firestore';
// import { db, auth } from '../firebase';
// import UserListCard from '../components/UserListCard';
// import { Search, Filter, Loader } from 'lucide-react';

// const Home = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedSkillFilter, setSelectedSkillFilter] = useState('All Skills');
//   const [availableSkills, setAvailableSkills] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [searchQuery, selectedSkillFilter, allUsers]);

//   const loadUsers = async () => {
//     try {
//       const usersRef = collection(db, 'users');
//       const snapshot = await getDocs(usersRef);
      
//       let users = snapshot.docs.map(doc => ({
//         uid: doc.id,
//         ...doc.data(),
//         skills: doc.data().skills || [] // Ensure skills is always an array
//       }));

//       // Filter out current user
//       const currentUser = auth.currentUser;
//       if (currentUser) {
//         users = users.filter(u => u.uid !== currentUser.uid);
//       }

//       // Sort: Users with skills first, then by rating
//       users.sort((a, b) => {
//         const aSkills = a.skills?.length || 0;
//         const bSkills = b.skills?.length || 0;
        
//         if (aSkills === 0 && bSkills > 0) return 1;
//         if (aSkills > 0 && bSkills === 0) return -1;
        
//         const avgA = (a.ratingCount || 0) > 0 ? (a.ratingSum || 0) / a.ratingCount : 0;
//         const avgB = (b.ratingCount || 0) > 0 ? (b.ratingSum || 0) / b.ratingCount : 0;
//         return avgB - avgA;
//       });

//       setAllUsers(users);
      
//       // Extract unique skills for filter dropdown
//       const skills = new Set();
//       users.forEach(user => {
//         if (user.skills && Array.isArray(user.skills)) {
//           user.skills.forEach(skill => {
//             if (skill?.skillTag) {
//               skills.add(skill.skillTag);
//             }
//           });
//         }
//       });
//       setAvailableSkills(['All Skills', ...Array.from(skills).sort()]);
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Error loading users:', error);
//       alert('Failed to load users. Please refresh the page.');
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...allUsers];

//     // Name search filter
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(user =>
//         user.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Skill filter
//     if (selectedSkillFilter !== 'All Skills') {
//       filtered = filtered.filter(user =>
//         user.skills?.some(skill => skill?.skillTag === selectedSkillFilter)
//       );
//     }

//     setFilteredUsers(filtered);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
//           <p className="mt-4 text-gray-600">Loading students...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Discover Skills
//           </h1>
//           <p className="text-gray-600">
//             Find students who can teach you something new
//           </p>
//         </div>

//         {/* Search and Filter Section */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//           <div className="grid md:grid-cols-2 gap-4">
//             {/* Name Search */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Search size={16} className="inline mr-2" />
//                 Search by Name
//               </label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search by name..."
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//               />
//             </div>

//             {/* Skill Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Filter size={16} className="inline mr-2" />
//                 Filter by Skill
//               </label>
//               <select
//                 value={selectedSkillFilter}
//                 onChange={(e) => setSelectedSkillFilter(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//               >
//                 {availableSkills.map(skill => (
//                   <option key={skill} value={skill}>
//                     {skill}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Results Count */}
//         <div className="mb-6">
//           <p className="text-gray-600">
//             Showing <span className="font-semibold text-indigo-600">{filteredUsers.length}</span> student{filteredUsers.length !== 1 ? 's' : ''}
//           </p>
//         </div>

//         {/* User Cards Grid */}
//         {filteredUsers.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-md p-12 text-center">
//             <div className="text-6xl mb-4">🔍</div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               No students found
//             </h3>
//             <p className="text-gray-600">
//               Try adjusting your filters or search query
//             </p>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredUsers.map(user => (
//               <UserListCard
//                 key={user.uid}
//                 user={user}
//                 onClick={() => navigate(`/user/${user.uid}`)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import UserListCard from '../components/UserListCard';
import { Search, Filter, Loader } from 'lucide-react';

const Home = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All Skills');
  const [availableSkills, setAvailableSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedSkillFilter, allUsers]);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      let users = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        skills: doc.data().skills || [] // Ensure skills is always an array
      }));

      // Filter out current user
      const currentUser = auth.currentUser;
      if (currentUser) {
        users = users.filter(u => u.uid !== currentUser.uid);
      }

      // Sort: Users with skills first, then by rating
      users.sort((a, b) => {
        const aSkills = a.skills?.length || 0;
        const bSkills = b.skills?.length || 0;
        
        if (aSkills === 0 && bSkills > 0) return 1;
        if (aSkills > 0 && bSkills === 0) return -1;
        
        const avgA = (a.ratingCount || 0) > 0 ? (a.ratingSum || 0) / a.ratingCount : 0;
        const avgB = (b.ratingCount || 0) > 0 ? (b.ratingSum || 0) / b.ratingCount : 0;
        return avgB - avgA;
      });

      setAllUsers(users);
      
      // Extract unique skills for filter dropdown
      const skills = new Set();
      users.forEach(user => {
        if (user.skills && Array.isArray(user.skills)) {
          user.skills.forEach(skill => {
            if (skill?.skillTag) {
              skills.add(skill.skillTag);
            }
          });
        }
      });
      setAvailableSkills(['All Skills', ...Array.from(skills).sort()]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users. Please refresh the page.');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allUsers];

    // Name search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Skill filter
    if (selectedSkillFilter !== 'All Skills') {
      filtered = filtered.filter(user =>
        user.skills?.some(skill => skill?.skillTag === selectedSkillFilter)
      );
    }

    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-[#A78BFA] mx-auto" />
          <p className="mt-4 text-[#111827]">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Discover Skills
          </h1>
          <p className="text-gray-600">
            Find students who can teach you something new
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[#A78BFA]/20">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Name Search */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                <Search size={16} className="inline mr-2 text-[#6B21A8]" />
                Search by Name
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full px-4 py-2 bg-white border border-[#A78BFA]/30 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] outline-none text-[#111827] placeholder-gray-400"
              />
            </div>

            {/* Skill Filter */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                <Filter size={16} className="inline mr-2 text-[#6B21A8]" />
                Filter by Skill
              </label>
              <select
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-[#A78BFA]/30 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] outline-none text-[#111827]"
              >
                {availableSkills.map(skill => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-[#6B21A8]">{filteredUsers.length}</span> student{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* User Cards Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-[#A78BFA]/20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[#111827] mb-2">
              No students found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserListCard
                key={user.uid}
                user={user}
                onClick={() => navigate(`/user/${user.uid}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;