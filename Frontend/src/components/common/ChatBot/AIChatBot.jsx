import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

const AIChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "👋 Hi! I'm your Campus Track AI Assistant. How can I help you today?",
      options: [
        "How to use this website",
        "Frequently Asked Questions",
        "I can't find my lost item",
        "Troubleshooting help",
      ],
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    mode: null,
    itemSearch: {
      description: null,
      date: null,
      time: null,
      location: null,
      step: 0,
    },
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type, text, options = null, imageUrl = null, matchData = null) => {
    setMessages((prev) => [...prev, { type, text, options, imageUrl, matchData }]);
  };

  const handleOptionClick = async (option) => {
    addMessage("user", option);

    if (option === "How to use this website") {
      addMessage(
        "bot",
        `📚 **How to Use Campus Track:**

**For Lost Items:**
1. Click "Report Lost Item" in navigation
2. Fill in item details (name, category, description, date, location)
3. Submit - our AI will automatically search for matches
4. Check "My Matches" for potential matches
5. Contact the finder if you see your item

**For Found Items:**
1. Click "Report Found Item" in navigation
2. Upload item photo and fill details
3. Submit - AI will match with lost items
4. Check "My Matches" for potential owners
5. Coordinate handover when matched

**Handover Process:**
- Finder: Click "Mark as Submitted" after giving item
- Owner: Click "Mark as Received" after receiving
- Both get confirmation emails!

Need help with something specific?`,
        ["Report Lost Item", "Report Found Item", "Check My Matches", "Back to Menu"]
      );
    } else if (option === "Frequently Asked Questions") {
      addMessage(
        "bot",
        `❓ **Frequently Asked Questions:**

**Q: How does AI matching work?**
A: Our AI analyzes item descriptions, categories, locations, and dates to find potential matches automatically.

**Q: How long does it take to find a match?**
A: Matches are instant! Check "My Matches" after reporting.

**Q: What if I can't find my item in matches?**
A: Try our AI search! Just tell me about your item and I'll search the database for you.

**Q: Is my contact information safe?**
A: Yes! We only share contact info after a match is confirmed.

**Q: How do I confirm a match?**
A: Go to "My Matches" and click "Mark as Received" when you get your item.

**Q: Can I report multiple items?**
A: Yes! Report as many as you need in "My Lost Items" or "My Found Items".

What else would you like to know?`,
        ["Search for my item", "Report an issue", "Back to Menu"]
      );
    } else if (option === "I can't find my lost item") {
      setConversationContext({
        mode: "item_search",
        itemSearch: { step: 1 },
      });
      addMessage(
        "bot",
        "🔍 Let me help you search! Please describe your lost item in detail (color, brand, type, any unique features):"
      );
    } else if (option === "Troubleshooting help") {
      addMessage(
        "bot",
        `🔧 **Common Issues & Solutions:**

**Problem: Not receiving notifications**
- Check your notification settings in dashboard
- Ensure browser notifications are enabled
- Verify email in your profile

**Problem: Can't see my matches**
- Refresh the page
- Check "My Matches" section in sidebar
- Ensure you've reported the item

**Problem: Handover buttons not showing**
- Both users must be matched
- Check your handover status
- Try logging out and back in

**Problem: Wrong match shown**
- Click "Not My Item" to remove false matches
- Report with more specific details
- Use AI search for better results

**Problem: Can't upload image**
- Check file size (max 5MB)
- Use JPG, PNG, or WEBP format
- Try a different browser

Still having issues?`,
        ["Contact Support", "Try AI Search", "Back to Menu"]
      );
    } else if (option === "Report Lost Item" || option === "Report Found Item") {
      const path = option === "Report Lost Item" ? "/report-lost-item" : "/report-found-item";
      addMessage("bot", `Opening ${option} page...`);
      setTimeout(() => {
        window.location.href = path;
      }, 1000);
    } else if (option === "Check My Matches") {
      addMessage("bot", "Opening My Matches...");
      setTimeout(() => {
        window.location.href = "/user-dashboard/my-matches";
      }, 1000);
    } else if (option === "Contact Support") {
      addMessage("bot", "Opening Contact page...");
      setTimeout(() => {
        window.location.href = "/contact";
      }, 1000);
    } else if (option === "Back to Menu") {
      setConversationContext({ mode: null, itemSearch: { step: 0 } });
      addMessage(
        "bot",
        "How can I help you?",
        [
          "How to use this website",
          "Frequently Asked Questions",
          "I can't find my lost item",
          "Troubleshooting help",
        ]
      );
    } else if (option === "Try AI Search" || option === "Search for my item") {
      setConversationContext({
        mode: "item_search",
        itemSearch: { step: 1 },
      });
      addMessage(
        "bot",
        "🔍 Let me help you search! Please describe your lost item in detail (color, brand, type, any unique features):"
      );
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || loading) return;

    const message = userInput.trim();
    addMessage("user", message);
    setUserInput("");
    setLoading(true);

    try {
      // Check if we're in item search mode
      if (conversationContext.mode === "item_search") {
        await handleItemSearchFlow(message);
      } else {
        // General chat with Gemini
        await handleGeneralChat(message);
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage(
        "bot",
        "Sorry, I encountered an error. Please try again or contact support.",
        ["Back to Menu"]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleItemSearchFlow = async (message) => {
    const { step, description, date, time, location } = conversationContext.itemSearch;

    if (step === 1) {
      // User provided description
      setConversationContext({
        mode: "item_search",
        itemSearch: { ...conversationContext.itemSearch, description: message, step: 2 },
      });
      addMessage("bot", "📅 When did you lose it? (e.g., January 5, 2026 or yesterday)");
    } else if (step === 2) {
      // User provided date
      setConversationContext({
        mode: "item_search",
        itemSearch: { ...conversationContext.itemSearch, date: message, step: 3 },
      });
      addMessage("bot", "🕐 What time approximately? (e.g., 2 PM, morning, afternoon)");
    } else if (step === 3) {
      // User provided time
      setConversationContext({
        mode: "item_search",
        itemSearch: { ...conversationContext.itemSearch, time: message, step: 4 },
      });
      addMessage("bot", "📍 Where did you lose it? (e.g., library, canteen, parking lot)");
    } else if (step === 4) {
      // User provided location - now search
      addMessage("bot", "🔎 Searching database for matching items...");

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/ai/search-item`,
        {
          description,
          date,
          time,
          location: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.matches && response.data.matches.length > 0) {
        const match = response.data.matches[0]; // Show first match
        addMessage(
          "bot",
          `✅ I found a potential match!\n\n**Item:** ${match.itemName}\n**Description:** ${match.itemDescription}\n**Found at:** ${match.placeFound}\n**Date:** ${new Date(match.dateFound).toLocaleDateString()}\n\nIs this your item?`,
          ["Yes, that's mine!", "No, keep searching", "Back to Menu"],
          match.image,
          match
        );
        setConversationContext({
          mode: "item_search",
          itemSearch: { ...conversationContext.itemSearch, step: 5, matchData: match },
        });
      } else {
        addMessage(
          "bot",
          "❌ Sorry, I couldn't find any matching items in the database. You can:\n\n1. Report your lost item so we can match it when someone finds it\n2. Try searching with different details\n3. Check back later",
          ["Report Lost Item", "Try Again", "Back to Menu"]
        );
        setConversationContext({ mode: null, itemSearch: { step: 0 } });
      }
    } else if (step === 5) {
      // User confirmed match
      if (message === "Yes, that's mine!") {
        addMessage("bot", "🎉 Great! Creating match and sending notifications...");

        const token = localStorage.getItem("token");
        await axios.post(
          `${API_BASE_URL}/ai/create-match`,
          {
            foundItemId: conversationContext.itemSearch.matchData._id,
            description,
            date,
            time,
            location,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        addMessage(
          "bot",
          "✅ **Match Created Successfully!**\n\n- Added to your 'My Matches'\n- Finder notified via website & email\n- Tag: 'Added by AI - Please confirm strictly before returning'\n\nGo to 'My Matches' to contact the finder!",
          ["Go to My Matches", "Back to Menu"]
        );
        setConversationContext({ mode: null, itemSearch: { step: 0 } });
      }
    }
  };

  const handleGeneralChat = async (message) => {
    // Use Gemini API for general questions
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/ai/chat`,
      {
        message,
        context: "campus_track_support",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    addMessage("bot", response.data.response, ["Back to Menu"]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-zinc-900 border-2 border-orange-500 rounded-2xl shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full">
            <FaRobot className="text-orange-500 text-xl" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">AI Support</h3>
            <p className="text-orange-100 text-xs">Always here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-orange-600 p-2 rounded-full transition"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                msg.type === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-gray-200 border border-gray-700"
              }`}
            >
              <p className="whitespace-pre-line text-sm">{msg.text}</p>
              
              {/* Show image if exists */}
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Found item"
                  className="mt-2 rounded-lg w-full max-h-48 object-cover"
                />
              )}

              {/* Show options */}
              {msg.options && (
                <div className="mt-3 space-y-2">
                  {msg.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionClick(option)}
                      className="w-full bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500 rounded-lg py-2 px-3 text-sm font-medium transition text-left"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-gray-700 rounded-2xl p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-zinc-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-zinc-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !userInput.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
