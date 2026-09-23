import React, { useState } from 'react';
import {
  Calendar,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Database,
  Timer,
  Zap,
} from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onPublish: (scheduledTime: string) => Promise<void>;
  isPublishing: boolean;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  postId,
  onPublish,
  isPublishing,
}) => {
  // Default to 1 hour from now
  const getInitialDateTime = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [datetime, setDatetime] = useState(getInitialDateTime());
  const [scheduledSuccess, setScheduledSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const setPreset = (offsetMinutes: number) => {
    const d = new Date(Date.now() + offsetMinutes * 60 * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    setDatetime(`${year}-${month}-${day}T${hours}:${minutes}`);
    setErrorMsg(null);
  };

  const setTomorrowAt = (hour: number) => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(hour, 0, 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    setDatetime(`${year}-${month}-${day}T${hours}:${minutes}`);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const targetDate = new Date(datetime);
    if (isNaN(targetDate.getTime())) {
      setErrorMsg('Please select a valid date and time.');
      return;
    }

    if (targetDate.getTime() <= Date.now()) {
      setErrorMsg('Scheduled publication time must be in the future.');
      return;
    }

    try {
      await onPublish(targetDate.toISOString());
      setScheduledSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule post.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 text-card-foreground">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                Schedule Campaign Publication
              </h3>
              <p className="text-xs text-muted-foreground">
                BullMQ Queue Orchestrator • Redis Worker
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {scheduledSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-foreground">
                Successfully Enqueued!
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Your post variants have been queued on BullMQ (<code className="font-mono text-primary">post publish</code> queue). When the queue fires, subscribers and channels will receive the broadcast.
              </p>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl border border-border/50 text-xs font-mono text-foreground flex items-center justify-center gap-2">
              <Timer className="w-4 h-4 text-secondary" />
              <span>Target Time: {new Date(datetime).toLocaleString()}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Done & Return to Studio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Quick Preset Buttons */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-accent" />
                Quick Schedule Presets:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPreset(15)}
                  className="px-2.5 py-2 rounded-xl border border-border/70 bg-background/50 hover:bg-muted/60 text-xs font-medium text-foreground transition-colors"
                >
                  +15 Mins
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(60)}
                  className="px-2.5 py-2 rounded-xl border border-border/70 bg-background/50 hover:bg-muted/60 text-xs font-medium text-foreground transition-colors"
                >
                  +1 Hour
                </button>
                <button
                  type="button"
                  onClick={() => setTomorrowAt(9)}
                  className="px-2.5 py-2 rounded-xl border border-border/70 bg-background/50 hover:bg-muted/60 text-xs font-medium text-foreground transition-colors"
                >
                  Tmrw 9 AM
                </button>
                <button
                  type="button"
                  onClick={() => setTomorrowAt(17)}
                  className="px-2.5 py-2 rounded-xl border border-border/70 bg-background/50 hover:bg-muted/60 text-xs font-medium text-foreground transition-colors"
                >
                  Tmrw 5 PM
                </button>
              </div>
            </div>

            {/* Custom Date Time Picker */}
            <div className="space-y-1.5">
              <label htmlFor="scheduledTimeInput" className="block text-xs font-semibold text-foreground">
                Custom Publish Date & Time (Local)
              </label>
              <div className="relative">
                <input
                  id="scheduledTimeInput"
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => {
                    setDatetime(e.target.value);
                    setErrorMsg(null);
                  }}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Queue Info Card */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground flex items-start gap-2.5">
              <Database className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                Post ID <code className="font-mono text-foreground font-semibold">{postId}</code> will be passed to BullMQ. The Redis worker calculates delay delta and runs the publish job when due.
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPublishing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20 disabled:opacity-50 transition-all"
              >
                {isPublishing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Adding to Queue...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm & Schedule</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
