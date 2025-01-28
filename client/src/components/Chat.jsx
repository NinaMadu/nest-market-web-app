import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Chat() {
  const { currentUser } = useSelector((state) => state.user);
  const [inbox, setInbox] = useState([]);
  const [sentbox, setSentbox] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox");
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null); // State to store selected message
  const [replyText, setReplyText] = useState(""); // State to store reply text

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
    <div className="chat-component">
      <div className="tabs flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`p-2 ${activeTab === "inbox" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Inbox
        </button>
        <button
          onClick={() => setActiveTab("sentbox")}
          className={`p-2 ${activeTab === "sentbox" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Sentbox
        </button>
      </div>

      <div className="messages-list">
        {error && <p className="text-red-500">{error}</p>}

        {activeTab === "inbox" && (
          <div>
            {inbox.length > 0 ? (
              inbox.map((message) => (
                <div key={message._id} className="message-item border p-3 rounded-lg mb-2">
                  <p><strong>From:</strong> {message.sender.username}</p>
                  <p>{message.message}</p>
                  <p><small>{new Date(message.createdAt).toLocaleString()}</small></p>
                  <button
                    onClick={() => { fetchMessageDetails(message._id); }}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg mt-2"
                  >
                    View & Reply
                  </button>
                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No messages in your inbox.</p>
            )}
          </div>
        )}

        {activeTab === "sentbox" && (
          <div>
            {sentbox.length > 0 ? (
              sentbox.map((message) => (
                <div key={message._id} className="message-item border p-3 rounded-lg mb-2">
                  <p><strong>To:</strong> {message.receiver.username}</p>
                  <p>{message.message}</p>
                  <p><small>{new Date(message.createdAt).toLocaleString()}</small></p>
                  <button
                    onClick={() => { fetchMessageDetails(message._id); }}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg mt-2"
                  >
                    View & Reply
                  </button>
                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No messages in your sentbox.</p>
            )}
          </div>
        )}
      </div>

      {/* Show message details and reply */}
      {selectedMessage && (
        <div className="message-details border p-4 rounded-lg mt-4">
          <h3>Message Details</h3>
          <p><strong>From:</strong> {selectedMessage.sender.username}</p>
          <p><strong>To:</strong> {selectedMessage.receiver.username}</p>
          <p>{selectedMessage.message}</p>
          <p><small>{new Date(selectedMessage.createdAt).toLocaleString()}</small></p>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="border p-2 w-full mt-2"
          ></textarea>

          <button
            onClick={handleReplySubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
          >
            Send Reply
          </button>
        </div>
      )}
    </div>
  );
}
