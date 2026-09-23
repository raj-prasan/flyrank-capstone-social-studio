import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Calendar,
} from 'lucide-react';
import type { PostStatus } from '../types';

interface ReviewActionBarProps {
  status: PostStatus;
  postId?: string;
  onReview: (status: 'approved' | 'rejected') => Promise<void>;
  onOpenSchedule: () => void;
  isReviewing: boolean;
}

export const ReviewActionBar: React.FC<ReviewActionBarProps> = ({
  status,
  postId,
  onReview,
  onOpenSchedule,
  isReviewing,
}) => {
  if (!postId) return null;

  return (
    <div className="sticky bottom-0 z-30 w-full border-t border-border bg-background/95 backdrop-blur-md py-4 px-4 sm:px-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Current Workflow Status */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Review State:
          </span>

          {status === 'draft' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Draft • Awaiting Editorial Approval</span>
            </div>
          )}

          {status === 'approved' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved • Ready to Schedule or Publish</span>
            </div>
          )}

          {status === 'rejected' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
              <XCircle className="w-3.5 h-3.5" />
              <span>Rejected • Edit copy before re-approving</span>
            </div>
          )}

          {status === 'published' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Send className="w-3.5 h-3.5" />
              <span>Published / In Queue</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Reject button */}
          <button
            type="button"
            onClick={() => onReview('rejected')}
            disabled={isReviewing || status === 'rejected'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-destructive/30 text-destructive hover:bg-destructive/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject Draft</span>
          </button>

          {/* Approve button */}
          <button
            type="button"
            onClick={() => onReview('approved')}
            disabled={isReviewing || status === 'approved'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Post</span>
          </button>

          {/* Schedule / Publish CTA */}
          <button
            type="button"
            onClick={onOpenSchedule}
            disabled={status !== 'approved'}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title={status !== 'approved' ? 'Approve the post first to enable scheduling' : 'Open BullMQ scheduling modal'}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule / Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
