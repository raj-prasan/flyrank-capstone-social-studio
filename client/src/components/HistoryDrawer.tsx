import React from 'react';
import {
  History,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Send,
} from 'lucide-react';
import type { Post } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onSelectPost: (post: Post) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
  isLoading,
  onRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/70 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col text-card-foreground animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  Saved Campaigns & Drafts
                </h3>
                <p className="text-xs text-muted-foreground">
                  Database history • {posts.length} {posts.length === 1 ? 'record' : 'records'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRefresh}
                className="text-xs text-primary hover:underline px-2 py-1 font-medium"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="py-16 text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Loading campaigns...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="py-16 text-center space-y-3 px-4">
                <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">No Campaigns Found</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ingest an article or draft to generate your first multi-platform social media campaign.
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/40 transition-all space-y-2.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[150px]">
                      ID: {post.id.slice(0, 8)}...
                    </span>

                    {/* Status Badge */}
                    {post.status === 'draft' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Draft
                      </span>
                    )}
                    {post.status === 'approved' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    )}
                    {post.status === 'rejected' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                    {post.status === 'published' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                        <Send className="w-3 h-3" /> Published
                      </span>
                    )}
                  </div>

                  {/* Snippet Preview */}
                  <div className="text-xs text-foreground font-sans line-clamp-2 leading-relaxed">
                    {post.x_post || post.linkedin_post || post.instagram_post || 'No preview available'}
                  </div>

                  {post.post_url && (
                    <div className="text-[11px] text-primary/80 font-mono truncate flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span>{post.post_url}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                      <span>X • LinkedIn • Instagram</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectPost(post);
                        onClose();
                      }}
                      className="flex items-center gap-1 font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Open Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
