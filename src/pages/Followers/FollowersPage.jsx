import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Users } from "lucide-react";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";

const FollowersPage = () => {
  const { sellerId, teacherId } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");

  // Determine if this is a seller or teacher followers page
  const isSeller = !!sellerId;
  const id = sellerId || teacherId;

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const endpoint = isSeller
          ? `${API.GET_SELLER_FOLLOWERS}?seller_id=${id}`
          : `${API.GET_TEACHER_FOLLOWERS}?teacher_id=${id}`;

        const response = await fetch(endpoint, {
          credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
          setFollowers(data.followers || []);
          setProfileName(data.name || (isSeller ? "Seller" : "Teacher"));
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFollowers();
    }
  }, [id, isSeller]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Followers</h1>
                <p className="text-xs text-gray-500">{profileName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Stats Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">
                {followers.length}
              </span>{" "}
              {followers.length === 1 ? "follower" : "followers"}
            </p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading followers...</p>
            </div>
          ) : followers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <User size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-1">
                No followers yet
              </p>
              <p className="text-sm text-gray-500 max-w-xs">
                When people follow this {isSeller ? "seller" : "teacher"},
                they'll appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {followers.map((follower) => (
                <div
                  key={follower.user_id}
                  className="flex items-center px-4 py-4 hover:bg-gray-50 transition-colors gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {follower.profile_pic ? (
                      <img
                        src={`${BASE_URL}/uploads/profile_pics/${follower.profile_pic}`}
                        alt={follower.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                        onError={(e) => {
                          e.target.src =
                            "https://ui-avatars.com/api/?name=" +
                            follower.username +
                            "&background=random";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg border-2 border-gray-100 shadow-sm">
                        {follower.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {follower.username}
                    </p>
                    <p className="text-xs text-gray-500">Follower</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FollowersPage;
