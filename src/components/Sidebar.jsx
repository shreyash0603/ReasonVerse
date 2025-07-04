import React, { useEffect, useState } from "react";

export default function Sidebar({ open, onClose, onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch('http://localhost:3000/api/chat/history')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setChats(data.chats);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-transform duration-300 ease-in-out w-72 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-bold text-lg">Chat History</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-56px)]">
        {loading ? (
          <div className="p-4 text-gray-500">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-gray-400">No history yet.</div>
        ) : (
          <ul>
            {chats.map((chat) => (
              <li
                key={chat._id}
                className="px-4 py-3 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectChat(chat)}
              >
                <div className="truncate font-medium text-gray-800">
                  {chat.userMessage.slice(0, 40)}{chat.userMessage.length > 40 ? '...' : ''}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(chat.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 