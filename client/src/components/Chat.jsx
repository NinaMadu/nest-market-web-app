import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Chat() {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [sentbox, setSentbox] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox");
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null); // State to store selected message
  const [replyText, setReplyText] = useState(""); // State to store reply text

  const fetchMessages = async () => {
    try {
      const inboxRes = await fetch(`http://localhost:3000/api/message/receiver/${currentUser._id}`);
      const sentRes = await fetch(`http://localhost:3000/api/message/sender/${currentUser._id}`);
      
      const inboxData = await inboxRes.json();
      const sentData = await sentRes.json();
      
      if (inboxRes.ok && sentRes.ok) {
        // Combine and sort messages by newest first
        const allMessages = [...inboxData.messages, ...sentData.messages].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(allMessages);
      } else {
        setError("Failed to fetch messages.");
      }
    } catch (err) {
      setError("Error fetching messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentUser]);

  // Fetch Inbox Messages
  const fetchInboxMessages = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/message/receiver/${currentUser._id}`);
      const data = await res.json();
      if (res.ok) setInbox(data.messages);
      else setError(data.error || "Failed to fetch inbox messages.");
    } catch (err) {
      setError("Error fetching inbox messages.");
    }
  };

  // Fetch Sent Messages
  const fetchSentMessages = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/message/sender/${currentUser._id}`);
      const data = await res.json();
      if (res.ok) setSentbox(data.messages);
      else setError(data.error || "Failed to fetch sentbox messages.");
    } catch (err) {
      setError("Error fetching sentbox messages.");
    }
  };

  // Fetch Message Details
  const fetchMessageDetails = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/message/${id}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedMessage(data.data); // Set the selected message
      } else {
        setError(data.error || "Failed to fetch message details.");
      }
    } catch (err) {
      setError("Error fetching message details.");
    }
  };

  // Handle sending reply
  const handleReplySubmit = async () => {
    if (!replyText) return; // Don't allow sending empty messages

    try {
      const res = await fetch(`http://localhost:3000/api/message/${selectedMessage._id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: replyText, // Use replyText here
          sender: currentUser._id, // The sender's ID (currentUser)
          receiver: selectedMessage.sender, // Use sender's ID for the receiver
          itemId: selectedMessage.itemId, // Ensure itemId is correctly referenced
        }),
      });

      const data = await res.json(); // Get response data

      if (res.ok) {
        setReplyText(""); // Clear the reply form after successful submission
        setSelectedMessage(null); // Close the reply form
        fetchInboxMessages(); // Refresh inbox messages
        fetchSentMessages(); // Refresh sentbox messages
      } else {
        console.error("Error response from backend:", data);
        setError(data.error || "Failed to send the reply.");
      }
    } catch (err) {
      console.error("Catch block error:", err);
      setError("Error sending reply.");
    }
  };

  // Initial fetch for messages
  useEffect(() => {
    fetchInboxMessages();
    fetchSentMessages();
  }, [currentUser]);

  return (
   
<div className="container mx-auto shadow-lg rounded-lg">
      {/* Chat List Section */}
      <div className="flex flex-row justify-between bg-white">
        {/* Messages List */}
        <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
          <div className="border-b-2 py-4 px-2">
            <input
              type="text"
              placeholder="Search messages"
              className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
            />
          </div>
          {/* Message List */}
          {messages.map((msg) => (
  <div 
    key={msg._id} 
    className="flex flex-row py-4 px-2 justify-start items-center border-b-2 cursor-pointer"
    onClick={() => fetchMessageDetails(msg._id)}
  >
    <div className="w-1/4">
      <img
        src="https://source.unsplash.com/random/600x600"
        className="object-cover h-12 w-12 rounded-full"
        alt="User Avatar"
      />
    </div>
    <div className="w-full">
      <div className="text-lg font-semibold">{msg.senderName || "Unknown"}</div>
      <span className="text-gray-500">
        {msg.text ? (msg.text.length > 30 ? msg.text.substring(0, 30) + "..." : msg.text) : "No message content"}
      </span>
    </div>
  </div>
))}
        </div>
        {/* End Messages List */}

        {/* Chat Messages Section */}
        <div className="w-full px-5 flex flex-col justify-between">
          <div className="flex flex-col mt-5">
            {/* Chat Messages */}
            <div className="flex justify-end mb-4">
              <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                Welcome to the chat!
              </div>
              <img
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="object-cover h-8 w-8 rounded-full"
                alt="User Avatar"
              />
            </div>
          </div>
          {/* Message Input Field */}
          <div className="py-5">
            <input
              className="w-full bg-gray-300 py-5 px-3 rounded-xl"
              type="text"
              placeholder="Type your message here..."
            />
          </div>
        </div>
        {/* End Chat Messages Section */}

        {/* Group Info Section */}
        <div className="w-2/5 border-l-2 px-5">
          <div className="flex flex-col">
            <div className="font-semibold text-xl py-4">MERN Stack Group</div>
            <img
              src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
              className="object-cover rounded-xl h-64"
              alt="Group Avatar"
            />
            <div className="font-semibold py-4">Created 22 Sep 2021</div>
            <div className="font-light">Welcome to the group chat!</div>
          </div>
        </div>
        {/* End Group Info Section */}
      </div>
    </div>
    
);
}
