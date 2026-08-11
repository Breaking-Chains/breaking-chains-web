import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, Video, Plus, CheckCircle, ArrowRight } from 'lucide-react';

interface MeetingsPageProps {
  onOpenGuidance: () => void;
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

export const MeetingsPage: React.FC<MeetingsPageProps> = ({ onOpenGuidance }) => {
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
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Page Header */}
      <Card variant="emerald" className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Counsel & Advisory Meetings
            </h2>
            <p className="text-[11px] text-slate-700 dark:text-emerald-250 font-medium">
              Schedule and join face-to-face video counsel with verified spiritual advisors.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Scheduling actions */}
        <div className="md:col-span-1 space-y-4">
          <Card variant="glass" className="p-5 space-y-4 text-center">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              Request a Session
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Facing urge waves or need private spiritual counsel? Request a one-on-one session.
            </p>

            {!isBooking ? (
              <Button
                variant="primary"
                size="sm"
                className="w-full flex items-center justify-center gap-1.5 font-bold text-xs"
                onClick={() => setIsBooking(true)}
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Meeting</span>
              </Button>
            ) : (
              <form onSubmit={handleBookMeeting} className="text-left space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">
                    Counsel Topic
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary"
                  >
                    <option value="SPIRITUAL_URGES">Urge Reset & Tazkiyah</option>
                    <option value="ACCOUNTABILITY">Weekly Accountability Check</option>
                    <option value="GENERAL_ADVICE">General Counselling</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">
                    Preferred Time / Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aug 14, Afternoon"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    required
                    className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary font-bold"
                  />
                </div>

                {bookingSuccess ? (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250 text-emerald-700 dark:text-emerald-350 text-[10px] font-bold text-center rounded-lg">
                    Request submitted!
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="flex-1 text-[10px] font-bold"
                      onClick={() => setIsBooking(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      className="flex-1 text-[10px] font-bold"
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </form>
            )}
          </Card>

          <Card variant="glass" className="p-4 space-y-3">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              Need Instant Help?
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              Direct text counsel is encrypted and active 24/7. Connect instantly with active mentors.
            </p>
            <button
              onClick={onOpenGuidance}
              className="w-full flex items-center justify-between text-[11px] font-bold text-primary dark:text-emerald-400 group cursor-pointer hover:underline"
            >
              <span>Open Counsel Chat</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </Card>
        </div>

        {/* Right column: Meeting lists */}
        <div className="md:col-span-2 space-y-4">
          <Card variant="dark" className="p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              Your Meetings Schedule
            </h3>

            <div className="space-y-3">
              {meetings.map((meet) => (
                <div
                  key={meet.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                    meet.status === 'SCHEDULED'
                      ? 'bg-white dark:bg-slate-900 border-primary/20 hover:border-primary/45 shadow-2xs'
                      : meet.status === 'PENDING'
                      ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-150 dark:border-slate-900/60 opacity-80'
                      : 'bg-slate-50/30 dark:bg-slate-950/20 border-slate-200 dark:border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2.5 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center ${
                      meet.status === 'SCHEDULED'
                        ? 'bg-primary/10 text-primary dark:text-emerald-400'
                        : meet.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {meet.status === 'COMPLETED' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Video className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                          {meet.mentorName}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          {meet.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-550 dark:text-slate-450 font-medium">
                        {meet.role}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[10px] font-bold text-slate-700 dark:text-slate-350">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {meet.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {meet.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {meet.status === 'SCHEDULED' && meet.meetingLink && (
                    <a
                      href={meet.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-secondary hover:bg-secondary/90 text-on-secondary font-manrope text-[11px] font-bold px-4 py-2 rounded-lg text-center flex items-center justify-center gap-1.5 shadow-sm shrink-0 active:scale-95 transition-transform"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
