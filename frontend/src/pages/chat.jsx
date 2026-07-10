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
  const [showSecond, setShowSecond] = useState(false); // 🔥 toggle

  const messagesEndRef = useRef(null);
  const user = auth.currentUser;

  // Load rooms
  useEffect(() => {
    const roomsRef = collection(db, "chats");
    const roomsQuery = query(roomsRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
      const loadedRooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRooms(loadedRooms);

      if (loadedRooms.length > 0 && !selectedRoom) {
        setSelectedRoom(loadedRooms[0]);
      }

      setLoadingRooms(false);
    });

    return () => unsubscribe();
  }, []);

  // Load messages
  useEffect(() => {
    if (!selectedRoom?.id) return;

    setLoadingMessages(true);

    const messagesRef = collection(db, "chats", selectedRoom.id, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(loadedMessages);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!user || !selectedRoom) return;

    const trimmed = newMessage.trim();
    if (!trimmed) return;

    try {
      setSending(true);

      await addDoc(collection(db, "chats", selectedRoom.id, "messages"), {
        text: trimmed,
        senderId: user.uid,
        senderName:
          user.displayName || user.email?.split("@")[0] || "User",
        createdAt: serverTimestamp(),
      });

      setNewMessage("");
    } catch (err) {
      console.error(err);
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

  const visibleRooms = showSecond
    ? rooms.slice(13, 25)
    : rooms.slice(0, 13);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">

        {/* 🔥 FIXED LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-[85vh]">

          {/* SIDEBAR */}
          <aside className="hidden md:flex flex-col border-r bg-gray-50 h-full">
            
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div>
                <h2 className="font-bold flex items-center gap-2">
                  <MessageCircle size={18} />
                  Community Rooms
                </h2>
                <p className="text-sm text-gray-500">
                  Join district-based chats
                </p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => setShowSecond(!showSecond)}
                className="text-xl px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                {showSecond ? "⬆" : "⬇"}
              </button>
            </div>

            {/* Room list */}
            <div className="flex-1 overflow-y-auto p-3">
              {loadingRooms ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : (
                <>
                  <p className="text-sm font-semibold mb-3 px-1">
                    {showSecond ? "Rooms 14 - 25" : "Rooms 1 - 13"}
                  </p>

                  <div className="space-y-2">
                    {visibleRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition ${
                          selectedRoom?.id === room.id
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {room.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </aside>

          {/* CHAT AREA */}
          <section className="flex flex-col min-h-0">

            {/* Header */}
            <div className="border-b px-6 py-4 bg-white">
              <h1 className="text-xl font-bold">
                {selectedRoom?.name
                  ? `${selectedRoom.name} Community Chat`
                  : "Select a Room"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Ask about places, travel tips, food, routes, and local help
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 px-4 py-4">
              {loadingMessages ? (
                <p className="text-gray-500 text-sm">Loading messages...</p>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div>
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm mt-1">
                      Be the first useful person in this room.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const own = user?.uid === msg.senderId;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        own ? "justify-end" : "justify-start"
                      } mb-2`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-xl ${
                          own
                            ? "bg-blue-600 text-white"
                            : "bg-white border"
                        }`}
                      >
                        {!own && (
                          <p className="text-xs text-blue-600">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <form
              onSubmit={handleSendMessage}
              className="border-t p-4 bg-white"
            >
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border rounded-xl px-4 py-2"
                  placeholder={
                    user
                      ? `Message ${selectedRoom?.name || ""}...`
                      : "Login to chat"
                  }
                />

                <button
                  disabled={!newMessage.trim() || sending}
                  className="bg-blue-400 text-white px-4 rounded-xl flex items-center"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>

          </section>
        </div>
      </div> 
    </div>
  );
};

export default Chat;