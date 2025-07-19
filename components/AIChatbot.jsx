"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send, User, ChevronUp } from "lucide-react";
import chatBotIcon from "../public/chatbot-icon.png"
import chatIcon from "../public/chaticon.png"
import Image from "next/image";
const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI Career Coach at AIspire. I can help you with:\n\n• Resume building and ATS optimization\n• Cover letter writing and templates\n• Interview preparation and mock interviews\n• Industry insights and career guidance\n• Professional development strategies\n• Platform features and navigation\n\nI'm here to support students and professionals at all levels. What would you like to know about?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Remove all auto-scroll-to-bottom logic for natural manual scrolling
  // (Remove useEffect that calls scrollToBottom or messagesEndRef.current?.scrollIntoView)

  // Drag-to-scroll state
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Mouse events
    const onMouseDown = (e) => {
      isDragging.current = true;
      startY.current = e.clientY;
      startScrollTop.current = container.scrollTop;
      container.classList.add("select-none", "cursor-grabbing");
    };
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const dy = e.clientY - startY.current;
      container.scrollTop = startScrollTop.current - dy;
    };
    const onMouseUp = () => {
      isDragging.current = false;
      container.classList.remove("select-none", "cursor-grabbing");
    };
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch events
    let touchStartY = 0;
    let touchStartScroll = 0;
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchStartScroll = container.scrollTop;
    };
    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      const dy = e.touches[0].clientY - touchStartY;
      container.scrollTop = touchStartScroll - dy;
    };
    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      const isScrolledUp = scrollTop < scrollHeight - clientHeight - 100;
      setShowScrollButton(isScrolledUp);
    };
    messagesContainer.addEventListener('scroll', handleScroll);
    return () => messagesContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll and movement when chatbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-y-hidden", "fixed", "w-full");
    } else {
      document.body.classList.remove("overflow-y-hidden", "fixed", "w-full");
    }
    return () => {
      document.body.classList.remove("overflow-y-hidden", "fixed", "w-full");
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage.trim() }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: data.response,
        timestamp: data.timestamp,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  return (
    <>
      {/* Floating Chat Button - Right bottom with gap from scroll-to-top */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          onClick={toggleChat}
          className="h-12 w-12 rounded-full flex items-center justify-center p-0 bg-blue-950 shadow-none border-none hover:bg-black focus:bg-black active:bg-black overflow-hidden"
          aria-label="Open AI Career Coach"
        >
          <Image 
            src={chatBotIcon}
            alt="aichatbot-icon"
            className="rounded-full cursor-pointer"
            height={50}
            width={50}
            priority
          />
        </Button>
      </div>

      {/* Chatbox Modal - Ultra Professional Black & White */}
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in overflow-hidden">
          <div className="relative w-full max-w-2xl h-[550px] bg-black/90 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-100 rounded-t-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04)]">
             
              <div className="flex items-center justify-center space-x-2"> 
              <Image 
            src={chatIcon}
            alt="aichatbot-icon"
            className="rounded-full cursor-pointer"
            height={40}
            width={40}
            priority
          />
              <span className="font-bold text-xl text-black tracking-tight">AI Career Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="rounded-full border border-black/10 hover:bg-black/10"
                aria-label="Close chat"
              >
                <X className="h-6 w-6 text-black" />
              </Button>
            </div>
            {/* Messages */}
            <div
              ref={messagesContainerRef}
              data-lenis-prevent
              className="relative flex-1 min-h-0 px-6 py-5 space-y-4 overflow-y-auto touch-auto scrollbar scrollbar-thumb-white/50 scrollbar-track-black/30 scroll-smooth transition-all duration-300"
              style={{ scrollbarWidth: 'thin' }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-5 py-3 rounded-2xl text-base shadow-lg whitespace-pre-line transition-all duration-300 ${
                      msg.type === "user"
                        ? "bg-white text-black rounded-br-2xl border border-white/30 shadow-md"
                        : "bg-black/80 text-white rounded-bl-2xl border border-white/20 shadow-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div className="p-6 border-t border-white/10 bg-white">
              <form className="flex gap-3 items-center" onSubmit={e => { e.preventDefault(); handleSendMessage(); }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about career advice, resume tips, or platform features..."
                  className="flex-1 px-5 py-3 bg-white border border-black/10 rounded-full text-base text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black shadow-sm h-12 transition-all duration-300"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="h-12 w-12 flex items-center justify-center bg-black text-white border border-white/20 rounded-full hover:bg-black/80 transition-all duration-300"
                  type="submit"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot; 