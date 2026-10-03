import React, { useState, useRef, useEffect } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Minimize2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  ticketCard?: {
    id: string;
    location: string;
    status: string;
    severity: string;
    assignedSquad?: string;
    eta?: string;
  };
}

interface CivicChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CivicChatbot: React.FC<CivicChatbotProps> = ({ isOpen, onClose }) => {
  const { incidents } = useIncidents();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Namaste! I am your automated CivicRoad Assistant for Hyderabad & Telangana Road Infrastructure. How can I assist you with road damage reports, ticket tracking, or municipal repair guidelines today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPills = [
    'Track Ticket CR-2048',
    'How are Telangana roads fixed?',
    'Why are YouTube links rejected?',
    'Report an urgent accident spot'
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      generateBotResponse(text);
      setIsTyping(false);
    }, 750);
  };

  const generateBotResponse = (query: string) => {
    const q = query.toLowerCase();
    let replyText = '';
    let ticketCard: ChatMessage['ticketCard'] | undefined = undefined;

    // Check if user is asking for a ticket status
    const ticketMatch = query.match(/(CR-\d{4}|TS-[A-Z0-9-]+)/i);
    if (ticketMatch || q.includes('track') || q.includes('status')) {
      const idToFind = ticketMatch ? ticketMatch[0].toUpperCase() : 'CR-2048';
      const inc = incidents.find(i => i.id === idToFind) || incidents[0];

      replyText = `Found official record for Ticket ${inc.id}. The problem has been registered and is currently under active municipal handling by Telangana R&B / GHMC.`;
      ticketCard = {
        id: inc.id,
        location: inc.location,
        status: inc.status.replace('_', ' '),
        severity: inc.severity,
        assignedSquad: inc.assignedTeam?.name || 'GHMC Jetpatcher Unit #04',
        eta: inc.assignedTeam ? `${inc.assignedTeam.etaMinutes} mins` : 'Within 24 Hours'
      };
    } else if (q.includes('telangana') || q.includes('fixed') || q.includes('repair') || q.includes('jetpatcher')) {
      replyText = 'Telangana State R&B and GHMC utilize high-speed mechanized Jetpatchers. The process involves: 1) High-velocity air jet cavity cleaning, 2) Hot PMB bitumen emulsion coating at 140°C, 3) Pneumatic aggregate injection, and 4) Vibratory roller compaction. Roads are reopened to traffic in under 15 minutes!';
    } else if (q.includes('youtube') || q.includes('whatsapp') || q.includes('link') || q.includes('url') || q.includes('social')) {
      replyText = 'To ensure evidence authenticity and protect against internet hoaxes, social media links (YouTube, WhatsApp, Instagram, Facebook, TikTok) are strictly blocked. Please upload the raw photo/video file directly from your camera, or provide a direct storage CDN URL (e.g. .mp4, .jpg).';
    } else if (q.includes('accident') || q.includes('crash') || q.includes('danger') || q.includes('emergency')) {
      replyText = 'Emergency safety priority: Potholes linked to vehicular skids or accident hazards receive immediate red-tier dispatch. Click "Report Damage" above or use the "Log Accident" button in the Authority Command Center to trigger rapid triage.';
    } else if (q.includes('fake') || q.includes('ai image') || q.includes('authentic')) {
      replyText = 'Our AI Image Authenticity Engine inspects optical Bayer sensor noise and light consistency. If someone attempts to submit a synthetic AI-generated image (e.g., from Midjourney), it is automatically flagged and rejected.';
    } else {
      replyText = `Thank you for reaching out. You can report road damage directly using the "Report Damage" button in the navigation, track municipal repair units, or ask me for status on any complaint reference code (e.g., CR-2048).`;
    }

    const botMsg: ChatMessage = {
      id: 'bot_' + Date.now(),
      sender: 'bot',
      text: replyText,
      timestamp: 'Just now',
      ticketCard
    };

    setMessages(prev => [...prev, botMsg]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9990] w-full max-w-sm sm:max-w-md h-[560px] max-h-[85vh] rounded-3xl bg-[#0A111B] border border-emerald-500/30 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
      {/* Chatbot Header */}
      <div className="p-4 border-b border-white/10 bg-[#0F1926] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">CivicRoad Assistant</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-emerald-300">
              Telangana Municipal Automated AI
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Question Pills */}
      <div className="p-2.5 bg-black/40 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPills.map((pill) => (
          <button
            key={pill}
            onClick={() => handleSend(pill)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/5 text-[10px] font-mono transition-all cursor-pointer"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[82%] space-y-2`}>
              <div
                className={`p-3.5 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-[#0F1926] border border-white/10 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                {msg.text}
              </div>

              {/* Status Ticket Card if generated */}
              {msg.ticketCard && (
                <div className="p-3.5 rounded-2xl bg-black/70 border border-emerald-500/30 text-xs font-mono space-y-2 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="font-bold text-emerald-400">{msg.ticketCard.id}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                      {msg.ticketCard.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">{msg.ticketCard.location}</div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>Assigned Unit:</span>
                    <span className="text-white">{msg.ticketCard.assignedSquad}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Target Rectification:</span>
                    <span className="text-emerald-300 font-bold">{msg.ticketCard.eta}</span>
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 items-center">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-[#0F1926] border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#0F1926] border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask a question or enter ticket ID (e.g. CR-2048)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-sans"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
          aria-label="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
