import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaSync, FaComment, FaCheck } from "react-icons/fa";
import { API_BASE_URL } from "../../../config";
import ChatBox from "./ChatBox";

const MyMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, lost, found
  const [findingMatches, setFindingMatches] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    fetchMatches();
  }, []);

  // Check for chat parameter in URL and auto-open chat
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatMatchId = urlParams.get('chat');
    
    if (chatMatchId && matches.length > 0) {
      const match = matches.find(m => m.matchId === chatMatchId);
      if (match) {
        openChat(match);
        // Clear the URL parameter
        window.history.replaceState({}, '', '/user-dashboard/my-matches');
      }
    }
  }, [matches]);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE_URL}/user/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(data.matches);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const handleFindMatches = async () => {
    setFindingMatches(true);
    toast.loading("Searching for AI matches...");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE_URL}/user/matches/find-matches`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.dismiss();
      toast.success(`Found ${data.matchesFound} new matches!`);
      fetchMatches();
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to find matches");
    } finally {
      setFindingMatches(false);
    }
  };

  const handleConfirm = async (matchId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/user/matches/${matchId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Match confirmed! Admin will be notified.");
      fetchMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm match");
    }
  };

  const handleReject = async (matchId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/user/matches/${matchId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Match rejected");
      fetchMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject match");
    }
  };

  const handleMarkClaimed = async (matchId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/user/matches/${matchId}/claimed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item marked as claimed! ✅");
      fetchMatches();
    } catch (err) {
      toast.error("Failed to mark as claimed");
    }
  };

  const handleSubmitItem = async (matchId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/user/matches/${matchId}/submit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item marked as submitted! ✅");
      fetchMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark as submitted");
    }
  };

  const handleReceiveItem = async (matchId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/user/matches/${matchId}/receive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item marked as received! ✅");
      fetchMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark as received");
    }
  };

  const openChat = (match) => {
    setSelectedMatch(match);
    setChatOpen(true);
  };

  const toggleCardExpansion = (matchId) => {
    setExpandedCards(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true;
    return match.type === filter;
  });

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 75) return "bg-green-500 text-white";
    if (confidence >= 50) return "bg-yellow-500 text-black";
    return "bg-red-500 text-white";
  };

  const getStatusBadge = (status, handoverStatus) => {
    // If handover is complete, show completed status
    if (handoverStatus === "received_by_owner" || status === "completed") {
      return "bg-green-600 text-white";
    }
    
    switch (status) {
      case "claimed":
        return "bg-green-600 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-blue-600 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">My Matches</h1>
          
          {/* Manual AI Match Button */}
          <button
            onClick={handleFindMatches}
            disabled={findingMatches}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            <FaSync className={findingMatches ? "animate-spin" : ""} />
            {findingMatches ? "Finding Matches..." : "Find AI Matches"}
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "all"
                ? "bg-orange-500 text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            All ({matches.length})
          </button>
          <button
            onClick={() => setFilter("lost")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "lost"
                ? "bg-orange-500 text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            My Lost Items ({matches.filter((m) => m.type === "lost").length})
          </button>
          <button
            onClick={() => setFilter("found")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "found"
                ? "bg-orange-500 text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            My Found Items ({matches.filter((m) => m.type === "found").length})
          </button>
        </div>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <p className="text-xl text-gray-400">No matches found yet</p>
            <p className="text-gray-500 mt-2">We'll notify you when we find a match!</p>
            <button
              onClick={handleFindMatches}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Try Finding Matches Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMatches.map((match) => {
              const isExpanded = expandedCards[match.matchId];
              
              return (
              <div
                key={match.matchId}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-orange-500 transition cursor-pointer overflow-hidden"
              >
                {/* Collapsed Card - Always Visible */}
                <div 
                  onClick={() => toggleCardExpansion(match.matchId)}
                  className="p-4 flex items-center gap-4"
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    {(match.myItem.itemImage || match.myItem.image) ? (
                      <img
                        src={match.myItem.itemImage || match.myItem.image}
                        alt={match.myItem.itemName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-orange-500 truncate">
                      {match.myItem.itemName}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Matched with: <span className="text-white">{match.matchedItem.userName}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(match.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>

                  {/* Match Percentage */}
                  <div className="flex-shrink-0 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getConfidenceBadge(
                        match.confidence
                      )}`}
                    >
                      {match.confidence}%
                    </span>
                    <div className="mt-2 text-gray-400 text-xs">
                      {isExpanded ? "▼ Click to collapse" : "▶ Click to expand"}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-700/50 p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                  {/* Found Item - Always on Left */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                      Found Item
                    </h3>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      {(match.type === "found" ? (match.myItem.itemImage || match.myItem.image) : (match.matchedItem.itemImage || match.matchedItem.image)) && (
                        <img
                          src={match.type === "found" ? (match.myItem.itemImage || match.myItem.image) : (match.matchedItem.itemImage || match.matchedItem.image)}
                          alt={match.type === "found" ? match.myItem.itemName : match.matchedItem.itemName}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="text-xl font-bold text-green-500 mb-2">
                        {match.type === "found" ? match.myItem.itemName : match.matchedItem.itemName}
                      </h4>
                      
                      {/* Item Details */}
                      <div className="space-y-2 mb-3">
                        <p className="text-gray-300 text-sm">
                          <strong className="text-gray-400">Description:</strong> {match.type === "found" ? match.myItem.itemDescription : match.matchedItem.itemDescription}
                        </p>
                        {(match.type === "found" ? match.myItem.category : match.matchedItem.category) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Category:</strong> {match.type === "found" ? match.myItem.category : match.matchedItem.category}
                          </p>
                        )}
                        {(match.type === "found" ? match.myItem.placeFound : match.matchedItem.placeFound) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Found Location:</strong> {match.type === "found" ? match.myItem.placeFound : match.matchedItem.placeFound}
                          </p>
                        )}
                        {(match.type === "found" ? match.myItem.dateFound : match.matchedItem.dateFound) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Date Found:</strong> {new Date(match.type === "found" ? match.myItem.dateFound : match.matchedItem.dateFound).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        )}
                        {(match.type === "found" ? match.myItem.timeFound : match.matchedItem.timeFound) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Time Found:</strong> {match.type === "found" ? match.myItem.timeFound : match.matchedItem.timeFound}
                          </p>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="border-t border-gray-700 pt-3 mt-3">
                        <p className="text-sm font-semibold text-gray-400 mb-2">Finder Contact:</p>
                        <div className="space-y-1">
                          <p className="text-white flex items-center gap-2">
                            <FaEnvelope className="text-orange-500" />
                            {match.type === "found" ? match.myItem.userEmail : match.matchedItem.userEmail}
                          </p>
                          <p className="text-white">
                            <strong>Name:</strong> {match.type === "found" ? match.myItem.userName : match.matchedItem.userName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Arrow & Info */}
                  <div className="flex flex-col items-center justify-center px-4">
                    <div className="text-4xl text-orange-500 mb-2">⇄</div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceBadge(
                        match.confidence
                      )}`}
                    >
                      {match.confidence}% Match
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold mt-2 ${getStatusBadge(
                        match.status,
                        match.handoverStatus
                      )}`}
                    >
                      {match.handoverStatus === "received_by_owner" || match.status === "completed"
                        ? "COMPLETED"
                        : match.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Lost Item - Always on Right */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                      Lost Item
                    </h3>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      {(match.type === "lost" ? (match.myItem.itemImage || match.myItem.image) : (match.matchedItem.itemImage || match.matchedItem.image)) && (
                        <img
                          src={match.type === "lost" ? (match.myItem.itemImage || match.myItem.image) : (match.matchedItem.itemImage || match.matchedItem.image)}
                          alt={match.type === "lost" ? match.myItem.itemName : match.matchedItem.itemName}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="text-xl font-bold text-orange-500 mb-2">
                        {match.type === "lost" ? match.myItem.itemName : match.matchedItem.itemName}
                      </h4>
                      
                      {/* Item Details */}
                      <div className="space-y-2 mb-3">
                        <p className="text-gray-300 text-sm">
                          <strong className="text-gray-400">Description:</strong> {match.type === "lost" ? match.myItem.itemDescription : match.matchedItem.itemDescription}
                        </p>
                        {(match.type === "lost" ? match.myItem.itemCategory : match.matchedItem.itemCategory) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Category:</strong> {match.type === "lost" ? match.myItem.itemCategory : match.matchedItem.itemCategory}
                          </p>
                        )}
                        {(match.type === "lost" ? match.myItem.color : match.matchedItem.color) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Color:</strong> {match.type === "lost" ? match.myItem.color : match.matchedItem.color}
                          </p>
                        )}
                        {(match.type === "lost" ? match.myItem.location : match.matchedItem.location) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Lost Location:</strong> {match.type === "lost" ? match.myItem.location : match.matchedItem.location}
                          </p>
                        )}
                        {(match.type === "lost" ? match.myItem.dateLost : match.matchedItem.dateLost) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Date Lost:</strong> {new Date(match.type === "lost" ? match.myItem.dateLost : match.matchedItem.dateLost).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        )}
                        {(match.type === "lost" ? match.myItem.timeRange : match.matchedItem.timeRange) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Time Range:</strong> {match.type === "lost" ? match.myItem.timeRange : match.matchedItem.timeRange}
                          </p>
                        )}
                        {(match.type === "lost" ? match.myItem.identificationMark : match.matchedItem.identificationMark) && (
                          <p className="text-gray-300 text-sm">
                            <strong className="text-gray-400">Identification Mark:</strong> {match.type === "lost" ? match.myItem.identificationMark : match.matchedItem.identificationMark}
                          </p>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="border-t border-gray-700 pt-3 mt-3">
                        <p className="text-sm font-semibold text-gray-400 mb-2">Owner Contact:</p>
                        <div className="space-y-1">
                          <p className="text-white flex items-center gap-2">
                            <FaEnvelope className="text-orange-500" />
                            {match.type === "lost" ? match.myItem.userEmail : match.matchedItem.userEmail}
                          </p>
                          <p className="text-white">
                            <strong>Name:</strong> {match.type === "lost" ? match.myItem.userName : match.matchedItem.userName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                  {/* FOR FINDER (who found the item) */}
                  {match.type === "found" && (
                    <>
                      {/* Contact Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); openChat(match); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                      >
                        <FaComment /> Contact Owner
                      </button>
                      
                      {/* Mark as Submitted Button - Only if pending */}
                      {match.handoverStatus === "pending" && match.status !== "rejected" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSubmitItem(match.matchId); }}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                        >
                          <FaCheck /> Mark as Submitted
                        </button>
                      )}
                      
                      {/* Status: Item Submitted - Awaiting Confirmation */}
                      {match.handoverStatus === "submitted_by_finder" && (
                        <div className="flex items-center gap-2 bg-purple-900 text-purple-300 px-6 py-2 rounded-lg font-semibold">
                          <FaCheck /> Item Submitted - Awaiting Confirmation
                        </div>
                      )}
                      
                      {/* Status: Submitted to the Owner (after owner confirms) */}
                      {match.handoverStatus === "received_by_owner" && (
                        <div className="flex items-center gap-2 bg-green-900 text-green-300 px-6 py-2 rounded-lg font-semibold">
                          <FaCheck /> Submitted to the Owner ✓
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* FOR OWNER (who lost the item) */}
                  {match.type === "lost" && (
                    <>
                      {/* Contact Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); openChat(match); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                      >
                        <FaComment /> Contact Finder
                      </button>
                      
                      {/* Not My Item Button - Only if confidence < 50% */}
                      {match.confidence < 50 && match.status === "pending" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReject(match.matchId); }}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                        >
                          <FaTimesCircle /> Not My Item
                        </button>
                      )}
                      
                      {/* Mark as Received Button - Show when pending or after finder submits */}
                      {(match.handoverStatus === "pending" || match.handoverStatus === "submitted_by_finder") && match.status !== "rejected" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReceiveItem(match.matchId); }}
                          className={`flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition ${
                            match.handoverStatus === "submitted_by_finder" ? "animate-pulse" : ""
                          }`}
                        >
                          <FaCheck /> Mark as Received
                        </button>
                      )}
                      
                      {/* Status: Item Received */}
                      {match.handoverStatus === "received_by_owner" && (
                        <div className="flex items-center gap-2 bg-green-900 text-green-300 px-6 py-2 rounded-lg font-semibold">
                          <FaCheck /> Item Received ✓
                        </div>
                      )}
                    </>
                  )}
                </div>
                  </div>
                )}
              </div>
            );
            })}
          </div>
        )}
      </div>
      
      {/* Chat Modal */}
      {chatOpen && selectedMatch && (
        <ChatBox
          matchId={selectedMatch.matchId}
          matchedUser={{
            name: selectedMatch.matchedItem.userName,
            email: selectedMatch.matchedItem.userEmail,
          }}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
};

export default MyMatches;
