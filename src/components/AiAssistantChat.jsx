/**
 * AiAssistant — Modern conversational weather assistant UI
 *
 * Features:
 *  - Always-open floating chat panel
 *  - Beautiful message bubbles with avatars
 *  - Typing indicator animation
 *  - Quick action chips
 *  - Smooth animations
 */

import React, { useState, useRef, useEffect } from "react";
import { askAssistant } from "../services/aiAssistant";
import { MdSend, MdDeleteOutline, MdSmartToy, MdPerson } from "react-icons/md";
import {
  WiDaySunny,
  WiUmbrella,
  WiStrongWind,
} from "react-icons/wi";
import { FaTshirt } from "react-icons/fa";

export default function AiAssistantChat({ insights, trends, current, forecast }) {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isTyping]);

  if (!insights || !current) return null;

  const handleAsk = async (q = question) => {
    if (!q.trim()) return;

    const userMsg = { role: "user", text: q, time: new Date() };
    setConversation((prev) => [...prev, userMsg]);
    setQuestion("");
    setIsTyping(true);

    // Simulate brief thinking delay for natural feel
    await new Promise((r) => setTimeout(r, 600));

    const answer = askAssistant(q, insights, trends, current, forecast);
    const assistantMsg = { role: "assistant", text: answer, time: new Date() };

    setIsTyping(false);
    setConversation((prev) => [...prev, assistantMsg]);
    inputRef.current?.focus();
  };

  const quickActions = [
    { text: "Should I go outside?", icon: <WiDaySunny size={16} /> },
    { text: "Do I need an umbrella?", icon: <WiUmbrella size={16} /> },
    { text: "What should I wear?", icon: <FaTshirt size={13} /> },
    { text: "Is it safe to travel?", icon: <WiStrongWind size={16} /> },
  ];

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar-sm">
            <MdSmartToy size={18} />
          </div>
          <div>
            <h3 className="chat-title">AI Weather Assistant</h3>
            <span className="chat-status">
              <span className="status-dot" />
              Online
            </span>
          </div>
        </div>
        {conversation.length > 0 && (
          <button
            className="chat-clear-btn"
            onClick={() => setConversation([])}
            title="Clear chat"
          >
            <MdDeleteOutline size={18} />
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="chat-quick-actions">
        {quickActions.map((action, i) => (
          <button
            key={i}
            className="chat-chip"
            onClick={() => handleAsk(action.text)}
          >
            <span className="chip-icon">{action.icon}</span>
            {action.text}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {conversation.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              <MdSmartToy size={40} />
            </div>
            <p className="chat-empty-title">Ask me anything!</p>
            <p className="chat-empty-sub">
              I can help with weather decisions, outfit suggestions, and travel
              advice for <strong>{current.city}</strong>.
            </p>
          </div>
        )}

        {conversation.map((msg, i) => (
          <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
            <div className="chat-msg-avatar">
              {msg.role === "user" ? (
                <MdPerson size={18} />
              ) : (
                <MdSmartToy size={18} />
              )}
            </div>
            <div className="chat-msg-content">
              <div className="chat-bubble">{msg.text}</div>
              <span className="chat-msg-time">{formatTime(msg.time)}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-msg chat-msg-assistant">
            <div className="chat-msg-avatar">
              <MdSmartToy size={18} />
            </div>
            <div className="chat-msg-content">
              <div className="chat-bubble typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Ask about the weather..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
        />
        <button
          className="chat-send-btn"
          onClick={() => handleAsk()}
          disabled={!question.trim() || isTyping}
          title="Send message"
        >
          <MdSend size={18} />
        </button>
      </div>
    </div>
  );
}
