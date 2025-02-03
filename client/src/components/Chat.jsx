import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Chat() {
  const { currentUser } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchConversations = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/conversations/${currentUser._id}`);
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

  const fetchConversationMessages = async (conversationId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/conversations/messages/${conversationId}`);
      const data = await res.json();

      if (res.ok) {
        setSelectedConversation(data);
      } else {
        setError("Failed to fetch messages.");
      }
    } catch (err) {
      setError("Error fetching messages.");
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText || !selectedConversation) return;

    try {
      const res = await fetch(`http://localhost:3000/api/message/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyText,
          sender: currentUser._id,
          receiver: selectedConversation.participantId,
          conversationId: selectedConversation._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReplyText("");
        fetchConversationMessages(selectedConversation._id);
      } else {
        setError(data.error || "Failed to send the reply.");
      }
    } catch (err) {
      setError("Error sending reply.");
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  return (
    <div className="container mx-auto shadow-lg rounded-lg">
      <div className="flex flex-row bg-white">
        <div className="w-2/5 border-r-2 overflow-y-auto">
          <div className="border-b-2 py-4 px-2">
            <input type="text" placeholder="Search conversations" className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full" />
          </div>
          {conversations.map((conv) => (
            <div key={conv._id} className="flex py-4 px-2 cursor-pointer border-b-2" onClick={() => fetchConversationMessages(conv._id)}>
              <div className="w-1/4">
                <img src="https://source.unsplash.com/random/600x600" className="h-12 w-12 rounded-full" alt="Avatar" />
              </div>
              <div className="w-full">
                <div className="text-lg font-semibold">{conv.participantName || "Unknown"}</div>
                <div className="text-gray-500">{conv.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full px-5 flex flex-col justify-between">
          <div className="flex flex-col mt-5">
            {selectedConversation && selectedConversation.messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === currentUser._id ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`py-3 px-4 ${msg.sender === currentUser._id ? "bg-blue-400 text-white" : "bg-gray-300"} rounded-lg`}>{msg.message}</div>
              </div>
            ))}
          </div>
          <div className="py-5">
            <input className="w-full bg-gray-300 py-5 px-3 rounded-xl" type="text" placeholder="Type your message here..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2" onClick={handleReplySubmit}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
