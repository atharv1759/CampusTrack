import React, { useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import { faqData } from "./faqData";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome! How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const reply = getBotResponse(input);
    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const getBotResponse = (query) => {
    const text = query.toLowerCase().trim();

    // Greetings
    const greetings = ["hi", "hello", "hey", "hii"];
    if (greetings.includes(text)) {
      return "Hello! 👋 How can I help you today?";
    }

    for (const faq of faqData) {
      const key = faq.question.toLowerCase();
      if (text.includes(key)) return faq.answer;
    }

    if (text.includes("lost") && text.includes("report")) return faqData[0].answer;
    if (text.includes("found") && text.includes("report")) return faqData[1].answer;
    if (text.includes("notification") || text.includes("notify")) return faqData[3].answer;
    if (text.includes("contact") || text.includes("admin")) return faqData[4].answer;
    if (text.includes("days") || text.includes("long")) return faqData[2].answer;

    if (
      text.includes("not matched") ||
      text.includes("item not matched") ||
      text.includes("not found yet") ||
      text.includes("cant find") ||
      text.includes("cannot find")
    ) {
      return "If your item is not matched immediately, it remains in our system and the AI keeps checking new reports. You can also contact the admin for help.";
    }

    return "I’m not sure about that, but you can ask me about reporting items, AI matching, notifications, or contacting admin.";
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black border-2 border-orange-500 text-orange-400 px-5 py-3 
          rounded-full shadow-[0_0_15px_#f97316] hover:shadow-[0_0_25px_#f97316] transition"
        >
          <FaComments size={24} />
          <span className="font-bold text-base md:text-lg">AI Support</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="
            fixed bottom-20 right-4 
            w-[92%] max-w-sm 
            h-[65vh] 
            bg-zinc-900 rounded-xl border border-orange-500 
            shadow-xl flex flex-col z-50
          "
        >
          {/* Header */}
          <div className="bg-black border-b border-orange-500 p-4 flex justify-between items-center rounded-t-xl">
            <h3 className="text-orange-400 font-semibold text-lg">Chat with us</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setMessages([
                  { sender: "bot", text: "Welcome! How can I assist you today?" },
                ]);
              }}
            >
              <FaTimes className="text-orange-400 text-xl" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto text-white space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] text-sm md:text-base ${
                  msg.sender === "bot"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-blue-500/20 text-blue-300 ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-orange-500 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-zinc-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
            />
            <button
              onClick={handleSend}
              className="bg-orange-500 px-4 md:px-5 py-2 rounded-lg text-black font-semibold hover:bg-orange-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
