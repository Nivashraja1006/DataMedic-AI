"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageSquareText, Send, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const suggestions = [
  "Detected missing values in email column",
  "Flagged duplicate customer IDs",
  "Recommended schema normalization",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "I reviewed the latest dataset and found 3 suspicious outliers." },
  ]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setIsTyping(true), 550);
    return () => window.clearTimeout(timer);
  }, [open]);

  const handleQuickReply = (text: string) => {
    setMessages((current) => [...current, { from: "user", text }]);
    setIsTyping(true);

    window.setTimeout(() => {
      const reply = suggestions[Math.floor(Math.random() * suggestions.length)];
      setMessages((current) => [...current, { from: "bot", text: reply }]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 w-[340px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0f1b]/80 shadow-[0_18px_56px_rgba(76,95,224,0.4)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7b91ff] via-[#9a6bff] to-[#2fd9c4] text-white shadow-[0_0_20px_rgba(123,145,255,0.5)]">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">DataMedic Copilot</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#8ea3d5]">Online</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 bg-white/[0.02] p-1.5 text-slate-300 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 bg-[#0c1321]/60 p-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.text}-${index}`}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    message.from === "bot"
                      ? "border border-white/10 bg-white/[0.02] text-slate-200"
                      : "ml-auto bg-gradient-to-r from-[#7b91ff] to-[#9a6bff] text-white"
                  }`}
                >
                  {message.text}
                </div>
              ))}

              {isTyping && (
                <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-slate-300">
                  <div className="flex gap-1.5 pt-1">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="h-2 w-2 animate-pulse rounded-full bg-[#7b91ff]"
                        style={{ animationDelay: `${dot * 0.12}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-white/10 bg-[#0a101a]/80 p-3">
              {suggestions.slice(0, 2).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleQuickReply(suggestion)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-xs text-slate-200 transition hover:border-[#7b91ff]/40 hover:text-white"
                >
                  {suggestion}
                </button>
              ))}

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d1426] p-2">
                <input
                  type="text"
                  defaultValue="Ask DataMedic AI"
                  className="w-full border-0 bg-transparent px-1 text-xs text-slate-300 outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#7b91ff] to-[#9a6bff] text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((current) => !current)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#7b91ff] via-[#9a6bff] to-[#2fd9c4] text-white shadow-[0_0_28px_rgba(123,145,255,0.8)]"
        transition={{ duration: 0.2 }}
      >
        <MessageSquareText className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#34d399] text-[10px] text-[#062d20]">
          <Sparkles className="h-2.5 w-2.5" />
        </span>
      </motion.button>
    </div>
  );
}
