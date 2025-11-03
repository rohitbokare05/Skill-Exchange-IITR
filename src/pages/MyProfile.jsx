import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Edit3, Star, ArrowLeft } from "lucide-react";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.error("User data not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#6B21A8] text-lg font-medium">
        Loading...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600 bg-[#F5F3FF]">
        <p className="text-gray-700 text-lg mb-2">User data not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-5 py-2 bg-[#A78BFA] text-white rounded-xl font-semibold hover:bg-[#6B21A8] transition-all"
        >
          Go Home
        </button>
      </div>
    );
  }

  const skillsArray = Array.isArray(userData.skills) ? userData.skills : [];
  const sortedSkills = [...skillsArray].sort(
    (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
  );
  const avgRating =
    userData.ratingCount > 0
      ? (userData.ratingSum / userData.ratingCount).toFixed(1)
      : "N/A";

  return (
    <div className="min-h-screen bg-[#F5F3FF] py-10 px-4">
      {/* Profile Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-[#EDE9FE] p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6B21A8] hover:text-[#4C1D95] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#EDE9FE] flex items-center justify-center text-4xl font-bold text-[#6B21A8] shadow-inner">
            {userData.name?.[0]?.toUpperCase() || "?"}
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-[#111827]">
            {userData.name || "Unnamed User"}
          </h1>
          <p className="text-gray-500">{userData.email}</p>

          {/* Rating */}
          <div className="flex justify-center items-center gap-2 mt-3">
            <Star size={18} fill="#FCD34D" className="text-yellow-400" />
            <span className="text-[#6B21A8] font-medium">{avgRating}</span>
          </div>
        </div>

        {/* Skills Section
        <h2 className="text-lg font-semibold text-[#6B21A8] mb-3">
          My Skills
        </h2>

        {skillsArray.length === 0 ? (
          <p className="text-gray-500 text-sm mb-6">
            No skills added yet. Click below to add your skills!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {sortedSkills.map((skill, index) => (
              <div
                key={index}
                className="bg-[#F5F3FF] border border-[#A78BFA] text-[#6B21A8] font-medium py-2 px-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {skill.name}
              </div>
            ))}
          </div>
        )} */}
        {/* Skills Section */}
{/* Skills Section */}
<h2 className="text-lg font-semibold text-[#6B21A8] mb-3">My Skills</h2>

{skillsArray.length === 0 ? (
  <p className="text-gray-500 text-sm mb-6">
    No skills added yet. Click below to add your skills!
  </p>
) : (
  <div className="flex flex-wrap justify-center gap-3 mb-6">
    {sortedSkills.map((skill, index) => (
      <div
        key={index}
        className="bg-gradient-to-r from-[#EDE9FE] to-[#DDD6FE] text-[#4C1D95] font-medium px-5 py-2 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 border border-[#C4B5FD]"
      >
        {skill.skillTag || "Unnamed Skill"}
      </div>
    ))}
  </div>
)}


        {/* Edit Skills Button */}
        <button
          onClick={() => navigate("/edit-skills")}
          className="w-full flex items-center justify-center gap-2 bg-[#A78BFA] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#6B21A8] transition-colors"
        >
          <Edit3 size={20} />
          {skillsArray.length === 0 ? "Add Skills" : "Edit Skills"}
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
