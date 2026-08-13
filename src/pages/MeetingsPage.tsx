import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, Video, Plus, CheckCircle, ArrowRight } from 'lucide-react';

interface MeetingsPageProps {
  onOpenChat: () => void;
}

interface MockMeeting {
  id: string;
  mentorName: string;
  role: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'PENDING';
  meetingLink?: string;
}

export const MeetingsPage: React.FC<MeetingsPageProps> = ({ onOpenChat }) => {
  const [meetings, setMeetings] = useState<MockMeeting[]>([
    {
      id: 'meet-1',
      mentorName: 'Sheikh Ahmad Al-Taji',
      role: 'Spiritual Guide & Mentor',
      date: 'Tomorrow, August 12',
      time: '2:00 PM - 2:45 PM (GMT+3)',
      status: 'SCHEDULED',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
    },
    {
      id: 'meet-2',
      mentorName: 'Sheikh Ahmad Al-Taji',
      role: 'Spiritual Guide & Mentor',
      date: 'Friday, August 15',
      time: '4:30 PM - 5:15 PM (GMT+3)',
      status: 'PENDING',
    },
    {
      id: 'meet-3',
      mentorName: 'Sheikh Ahmad Al-Taji',
      role: 'Spiritual Guide & Mentor',
      date: 'August 8, 2026',
      time: '3:00 PM - 3:45 PM',
      status: 'COMPLETED',
    },
  ]);

  const [isBooking, setIsBooking] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('SPIRITUAL_URGES');
  const [preferredTime, setPreferredTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      const newMeet: MockMeeting = {
        id: `meet-${meetings.length + 1}`,
        mentorName: 'Sheikh Ahmad Al-Taji',
        role: 'Spiritual Guide & Mentor',
        date: 'Scheduled',
        time: preferredTime || 'TBD (Awaiting confirmation)',
        status: 'PENDING',
      };
      setMeetings([newMeet, ...meetings]);
      setIsBooking(false);
      setBookingSuccess(false);
      setPreferredTime('');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Premium Glass Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 select-none pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 block w-fit">
              ✵ Counsel hub
            </span>
            <h2 className="text-lg font-black font-manrope tracking-tight text-slate-900 dark:text-white uppercase pt-2">
              Counsel & Advisory Meetings
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
              Schedule and join face-to-face video counsel with verified spiritual advisors. Connect with coaches for private, confidential advice.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-inner">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Actions & Form (1 Col) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Scheduling Card */}
          <Card variant="glass" className="p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/50">
              <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Request a Session
              </h3>
            </div>

            {!isBooking ? (
              <div className="space-y-5">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Facing intense urges, recovery blockages, or need private counsel? Book a structured spiritual coaching session.
                </p>
                <Button
                  variant="emerald"
                  size="lg"
                  className="w-full flex items-center justify-center gap-1.5 font-black uppercase text-[10px] tracking-wider py-3 rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                  onClick={() => setIsBooking(true)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Request Session</span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBookMeeting} className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block">
                    Counsel Topic
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  >
                    <option value="SPIRITUAL_URGES">Urge Reset & Tazkiyah</option>
                    <option value="ACCOUNTABILITY">Weekly Accountability Check</option>
                    <option value="GENERAL_ADVICE">General Counselling</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block">
                    Preferred Time & Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aug 14, Afternoon"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    required
                    className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-bold"
                  />
                </div>

                {bookingSuccess ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-350 text-[10px] font-bold text-center rounded-xl flex items-center justify-center gap-1.5 animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Request Submitted!
                  </div>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="flex-1 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
                      onClick={() => setIsBooking(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="emerald"
                      size="sm"
                      type="submit"
                      className="flex-1 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl cursor-pointer shadow-sm"
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </form>
            )}
          </Card>

          {/* Urgent Support Card */}
          <Card variant="glass" className="p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none select-none" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Active Support Channel
              </h4>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                Need Instant Help?
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Counsel chat is private, confidential, and active 24/7. Connect instantly with online mentors for guidance.
              </p>
            </div>
            
            <button
              onClick={onOpenChat}
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 group cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-350 transition-colors pt-2"
            >
              <span>Open Counsel Chat</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </Card>

        </div>

        {/* Right Column: Schedule Timeline (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass" className="p-6 md:p-8 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Your Meetings Schedule
                </h3>
              </div>
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-850 px-2.5 py-1 rounded-full">
                {meetings.length} Total Sessions
              </span>
            </div>

            <div className="space-y-4">
              {meetings.map((meet) => {
                const isScheduled = meet.status === 'SCHEDULED';
                const isPending = meet.status === 'PENDING';
                const isCompleted = meet.status === 'COMPLETED';

                return (
                  <div
                    key={meet.id}
                    className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200 ${
                      isScheduled
                        ? 'bg-emerald-50/15 dark:bg-emerald-950/10 border-emerald-500/20 hover:border-emerald-500/35 shadow-2xs'
                        : isPending
                        ? 'bg-amber-50/10 dark:bg-amber-955/5 border-amber-500/15 hover:border-amber-500/25'
                        : 'bg-slate-50/40 dark:bg-slate-950/20 border-slate-200/60 dark:border-slate-800/60 opacity-70 hover:opacity-85'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Left Icon Panel */}
                      <div className={`p-3 rounded-xl shrink-0 h-11 w-11 flex items-center justify-center border shadow-3xs ${
                        isScheduled
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                          : isPending
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-500/20'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200/40 dark:border-slate-800/80'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Video className="w-5 h-5" />
                        )}
                      </div>

                      {/* Middle Details Text */}
                      <div className="space-y-1.5 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                            {meet.mentorName}
                          </span>
                          
                          {/* Status Badge */}
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                            isScheduled
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border-emerald-500/20'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-450 border-amber-500/20 animate-pulse'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-550 border-slate-200/60 dark:border-slate-700/60'
                          }`}>
                            {isScheduled ? '● Scheduled' : isPending ? '⏳ Pending' : '✓ Completed'}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-slate-550 dark:text-slate-450 font-bold uppercase tracking-wider">
                          {meet.role}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] font-bold text-slate-700 dark:text-slate-350">
                          <span className="flex items-center gap-1.5 bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-850">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {meet.date}
                          </span>
                          <span className="flex items-center gap-1.5 bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-850">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {meet.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Join Call Link for Scheduled Sessions */}
                    {isScheduled && meet.meetingLink && (
                      <a
                        href={meet.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-manrope text-[10px] font-black uppercase tracking-wider px-4 py-3 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-md shrink-0 active:scale-95 transition-all duration-200 hover:scale-[1.02] border border-emerald-500/20"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Call</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
