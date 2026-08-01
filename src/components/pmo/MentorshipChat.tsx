import React, { useState } from 'react';
import { Send, UserCheck, Lock, Sparkles } from 'lucide-react';
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
}

export const MentorshipChat: React.FC<MentorshipChatProps> = ({
  partnerName = 'No Active Mentor',
  inviteCode = '',
  notes = [],
  messages = [],
  onSendMessage,
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
    <div className="space-y-4">
      <Card variant="glass" className="p-3 border-emerald-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <div>
            <h4 className="text-xs font-bold text-slate-100">Confidential Guidance (Suhbah)</h4>
            <p className="text-[10px] text-slate-400">100% Encrypted & Privacy Protected </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 block">Invite Code</span>
          <span className="text-xs font-mono font-bold text-amber-400">{inviteCode}</span>
        </div>
      </Card>

      {safeNotes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> Mentor Counsel Note (Nasiha)
          </div>
          {safeNotes.map((note) => (
            <Card key={note.id} variant="gold" className="p-3 border-amber-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-200">{note.mentorFullName}</span>
                <span className="text-[10px] text-amber-400 font-mono">Today</span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed italic">"{note.noteContent}"</p>
            </Card>
          ))}
        </div>
      )}

      <Card variant="dark" className="p-3 space-y-3 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">{partnerName}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full">
            Active Mentor
          </span>
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {safeMessages.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-6 font-medium italic">
              No confidential messages exchanged yet. Send a message to connect.
            </p>
          ) : (
            safeMessages.map((msg) => {
              const isMe = msg.senderId === 'user1' || msg.senderId === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50'
                    }`}
                  >
                    <p>{msg.messageContent}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">
                    {msg.senderFullName ? msg.senderFullName.split(' ')[0] : 'You'} • {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-800">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send encrypted message to mentor..."
            className="text-xs min-h-[40px] py-2"
          />
          <Button type="submit" variant="emerald" size="sm" className="shrink-0 min-h-[40px] px-3">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
