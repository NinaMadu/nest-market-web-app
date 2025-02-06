import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Chat() {
  const { currentUser } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Fetch conversations for the logged-in user
  const fetchConversations = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/message/user/${currentUser._id}`);
      const data = await res.json();

      if (res.ok) {
        setConversations(data.conversations);
      } else {
        setError("Failed to fetch conversations.");
      }
    } catch (err) {
      setError("Error fetching conversations.");
    }
  };

  // Fetch messages for a selected conversation
  const fetchConversationMessages = async (conversationId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/message/conversation/${conversationId}`);
      const data = await res.json();

      if (res.ok) {
        setSelectedConversation({ id: conversationId, participant: data.participant });
        setMessages(data.messages);
      } else {
        setError("Failed to fetch messages.");
      }
    } catch (err) {
      setError("Error fetching messages.");
    }
  };

  // Handle sending a reply
  const handleReplySubmit = async () => {
    if (!replyText || !selectedConversation || !selectedConversation.participant) {
      console.error("Invalid conversation or missing participant.");
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:3000/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyText,
          sender: currentUser._id,
          receiver: selectedConversation.participant._id, 
          conversationId: selectedConversation.id,
          itemId: selectedConversation.itemId || null, 
        }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        console.error("Reply failed:", data);
        setError("Failed to send the reply.");
        return;
      }
  
      setReplyText("");
      fetchConversationMessages(selectedConversation.id); // Reload messages
    } catch (err) {
      console.error("Error sending reply:", err);
      setError("Error sending reply.");
    }
  };
  
  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  return (
    <div className="container mx-auto shadow-lg rounded-lg">
      <div className="flex flex-row bg-white">
        {/* Conversations List */}
        <div className="w-2/5 border-r-2 overflow-y-auto">
          <div className="border-b-2 py-4 px-2">
            <input type="text" placeholder="Search conversations" className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full" />
          </div>
          {conversations.map((conv) => {
            const otherParticipant = conv.participants?.find(
              (p) => p && p._id !== currentUser._id);

            return (
              <div key={conv.conversationId} className="flex py-4 px-2 cursor-pointer border-b-2" onClick={() => fetchConversationMessages(conv.conversationId)}>
                <div className="w-1/4">
                  <img src={otherParticipant?.avatar || "https://source.unsplash.com/random/600x600"} className="h-12 w-12 rounded-full" alt="Avatar" />
                </div>
                <div className="w-full">
                  <div className="text-lg font-semibold">{otherParticipant?.username || "Unknown"}</div>
                  <div className="text-gray-500">{conv.lastMessage?.message || "No messages yet"}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Messages */}
        <div className="w-full px-5 flex flex-col justify-between">
          <div className="flex flex-col mt-5">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === currentUser._id ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`py-3 px-4 ${msg.sender === currentUser._id ? "bg-blue-400 text-white" : "bg-gray-300"} rounded-lg`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          {selectedConversation && (
            <div className="py-5">
              <input
                className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                type="text"
                placeholder="Type your message here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2" onClick={handleReplySubmit}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
