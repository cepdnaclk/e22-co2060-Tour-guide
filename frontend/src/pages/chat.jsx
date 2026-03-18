import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { Send, MessageCircle } from "lucide-react";
import { auth, db } from "../firebase";

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const user = auth.currentUser;

  // Load chat rooms
  useEffect(() => {
    const roomsRef = collection(db, "chats");
    const roomsQuery = query(roomsRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      roomsQuery,
      (snapshot) => {
        const loadedRooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRooms(loadedRooms);

        if (!selectedRoom && loadedRooms.length > 0) {
          setSelectedRoom(loadedRooms[0]);
        }

        setLoadingRooms(false);
      },
      (error) => {
        console.error("Error loading rooms:", error);
        setLoadingRooms(false);
      }
    );

    return () => unsubscribe();
  }, [selectedRoom]);

  // Load messages for selected room
  useEffect(() => {
    if (!selectedRoom?.id) return;

    setLoadingMessages(true);

    const messagesRef = collection(db, "chats", selectedRoom.id, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const loadedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(loadedMessages);
        setLoadingMessages(false);
      },
      (error) => {
        console.error("Error loading messages:", error);
        setLoadingMessages(false);
      }
    );

    return () => unsubscribe();
  }, [selectedRoom]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to send messages.");
      return;
    }

    if (!selectedRoom) {
      alert("Please select a room.");
      return;
    }

    const trimmedMessage = newMessage.trim();

    if (!trimmedMessage) return;

    try {
      setSending(true);

      await addDoc(collection(db, "chats", selectedRoom.id, "messages"), {
        text: trimmedMessage,
        senderId: user.uid,
        senderName: user.displayName || user.email?.split("@")[0] || "User",
        createdAt: serverTimestamp(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.seconds) return "";
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-[80vh]">
        {/* Left sidebar */}
        <aside className="border-r border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle size={20} />
              Community Rooms
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Join district-based chats
            </p>
          </div>

          <div className="p-2">
            {loadingRooms ? (
              <p className="text-sm text-gray-500 px-2 py-2">Loading rooms...</p>
            ) : rooms.length === 0 ? (
              <p className="text-sm text-gray-500 px-2 py-2">No rooms found.</p>
            ) : (
              rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition ${
                    selectedRoom?.id === room.id
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {room.name}
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Right chat area */}
        <section className="flex flex-col">
          <div className="border-b border-gray-200 px-6 py-4 bg-white">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedRoom?.name ? `${selectedRoom.name} Community Chat` : "Select a Room"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Ask about places, travel tips, food, routes, and local help
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-3">
            {!selectedRoom ? (
              <p className="text-gray-500 text-sm">Please select a room.</p>
            ) : loadingMessages ? (
              <p className="text-gray-500 text-sm">Loading messages...</p>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>No messages yet.</p>
                <p className="text-sm mt-1">Be the first useful person in the room.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = user?.uid === msg.senderId;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                        isOwnMessage
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      {!isOwnMessage && (
                        <p className="text-xs font-semibold mb-1 text-blue-600">
                          {msg.senderName}
                        </p>
                      )}

                      <p className="text-sm break-words">{msg.text}</p>

                      <p
                        className={`text-[11px] mt-2 ${
                          isOwnMessage ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-200 p-4 bg-white"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  user
                    ? selectedRoom
                      ? `Message ${selectedRoom.name} community...`
                      : "Select a room first"
                    : "Log in to send messages"
                }
                disabled={!user || !selectedRoom || sending}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <button
                type="submit"
                disabled={!user || !selectedRoom || sending || !newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl transition flex items-center gap-2"
              >
                <Send size={18} />
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Chat;