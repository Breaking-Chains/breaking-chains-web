import React, { useState } from 'react';
import { Send, UserCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { MentorshipChatMessage, CounselNote } from '../../types/partner';

interface MentorshipChatProps {
  partnerName?: string;
  inviteCode?: string;
  notes?: CounselNote[];
  messages?: MentorshipChatMessage[];
  onSendMessage?: (text: string) => void;
  currentUserId?: string;
}

export const MentorshipChat: React.FC<MentorshipChatProps> = ({
  partnerName = 'No Active Mentor',
  notes = [],
  messages = [],
  onSendMessage,
  currentUserId,
}) => {
  const [inputText, setInputText] = useState('');

  const safeNotes = Array.isArray(notes) ? notes : [];
  const safeMessages = Array.isArray(messages) ? messages : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (onSendMessage) onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="space-y-5">
      <Card variant="glass" className="p-3.5 flex items-center justify-start">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold select-none">✵</span>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Confidential Guidance</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Private & Confidential</p>
          </div>
        </div>
      </Card>

      {safeNotes.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <span className="text-amber-500 dark:text-amber-450 select-none">✵</span> Mentor Counsel Note
          </div>
          {safeNotes.map((note) => (
            <Card key={note.id} variant="gold" className="p-4 rounded-2xl shadow-xs border-none">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-850 dark:text-amber-200">{note.mentorFullName}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Today</span>
              </div>
              <p className="text-sm text-amber-900/90 dark:text-amber-100/90 leading-relaxed italic font-serif">"{note.counselText}"</p>
            </Card>
          ))}
        </div>
      )}

      <Card variant="dark" className="p-4 space-y-4 rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{partnerName}</span>
          </div>
          <span className="text-[9px] text-emerald-700 dark:text-emerald-450 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-transparent uppercase tracking-wider">
            Active Mentor
          </span>
        </div>

        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {safeMessages.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-6 font-medium italic">
              No confidential messages exchanged yet. Send a message to connect.
            </p>
          ) : (
            safeMessages.map((msg) => {
              const isMe = currentUserId 
                ? msg.senderId === currentUserId 
                : (msg.senderId === 'user1' || msg.senderId === 'me');
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-xs border-none'
                    }`}
                  >
                    <p>{msg.messageContent}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1 font-sans">
                    {msg.senderFullName ? msg.senderFullName.split(' ')[0] : 'You'} • {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-1">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send private message to mentor..."
            className="text-xs min-h-[40px] py-2 rounded-xl"
          />
          <Button type="submit" variant="emerald" size="sm" className="shrink-0 min-h-[40px] px-3.5 rounded-xl">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
