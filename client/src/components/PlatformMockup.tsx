import React, { useState } from 'react';
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Send,
  Globe,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { Platform } from '../types';

interface PlatformMockupProps {
  platform: Platform;
  content: string;
  sourceUrl?: string | null;
}

export const PlatformMockup: React.FC<PlatformMockupProps> = ({
  platform,
  content,
  sourceUrl,
}) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [expandedLinkedIn, setExpandedLinkedIn] = useState(false);

  // Formatter to highlight hashtags
  const renderFormattedText = (text: string) => {
    if (!text) {
      return (
        <span className="italic text-muted-foreground/60">
          No copy generated yet. Click "Generate" to create a variant.
        </span>
      );
    }

    const words = text.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.startsWith('#')) {
        return (
          <span key={i} className="text-primary font-medium hover:underline cursor-pointer">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  // 1. X (TWITTER) PREVIEW
  if (platform === 'x') {
    return (
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm text-card-foreground">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-2 border-b border-border/50">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-foreground" />
            Live Preview • X Feed
          </span>
          <span>Feed View</span>
        </div>

        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
            FR
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-foreground hover:underline cursor-pointer">
                  Flyrank
                </span>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sky-500 text-white text-[10px]">
                  ✓
                </span>
                <span className="text-xs text-muted-foreground">@flyrank</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">Just now</span>
              </div>
              <button type="button" className="text-muted-foreground hover:text-foreground p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Tweet Body */}
            <div className="mt-2 text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground font-sans">
              {renderFormattedText(content)}
            </div>

            {/* Optional URL Card */}
            {sourceUrl && (
              <div className="mt-3 p-3 rounded-xl border border-border/70 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">
                    Read original article
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono truncate">
                    {sourceUrl}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-muted-foreground text-xs max-w-md">
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-sky-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>12</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
              >
                <Repeat2 className="w-4 h-4" />
                <span>38</span>
              </button>
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1.5 transition-colors ${
                  liked ? 'text-rose-500 font-medium' : 'hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
                <span>{liked ? 143 : 142}</span>
              </button>
              <button
                type="button"
                onClick={() => setBookmarked(!bookmarked)}
                className={`flex items-center gap-1.5 transition-colors ${
                  bookmarked ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-primary' : ''}`} />
              </button>
              <button type="button" className="hover:text-foreground transition-colors">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. LINKEDIN PREVIEW
  if (platform === 'linkedin') {
    return (
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm text-card-foreground">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-2 border-b border-border/50">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0a66c2]" />
            Live Preview • LinkedIn Feed
          </span>
          <span>Article View</span>
        </div>

        {/* Profile Card */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#0a66c2] to-sky-700 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
              FR
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-foreground hover:text-[#0a66c2] cursor-pointer">
                  Flyrank Studio
                </span>
                <span className="text-xs text-muted-foreground">• 1st</span>
              </div>
              <div className="text-[11px] text-muted-foreground line-clamp-1">
                Engineering Next-Gen Social Growth Tools • 14,200 followers
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <span>Just now</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
              </div>
            </div>
          </div>

          <button type="button" className="text-muted-foreground hover:text-foreground p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* LinkedIn Body */}
        <div className="mt-3.5 text-sm leading-relaxed text-foreground font-sans whitespace-pre-wrap break-words">
          {content.length > 320 && !expandedLinkedIn ? (
            <>
              {renderFormattedText(content.slice(0, 320))}...
              <button
                type="button"
                onClick={() => setExpandedLinkedIn(true)}
                className="text-[#0a66c2] hover:underline font-semibold ml-1 cursor-pointer"
              >
                see more
              </button>
            </>
          ) : (
            renderFormattedText(content)
          )}
        </div>

        {/* LinkedIn Reactions Bar */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px]">
              👍
            </span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] -ml-1">
              💡
            </span>
            <span className="ml-1 text-[11px]">89 • 14 comments</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-border/40 grid grid-cols-4 gap-1 text-center text-xs font-semibold text-muted-foreground">
          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-muted/50 transition-colors ${
              liked ? 'text-[#0a66c2]' : ''
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-[#0a66c2]' : ''}`} />
            <span>Like</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Comment</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Repeat2 className="w-3.5 h-3.5" />
            <span>Repost</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. INSTAGRAM PREVIEW
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm text-card-foreground">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-2 border-b border-border/50">
        <span className="font-semibold text-foreground flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#e1306c]" />
          Live Preview • Instagram Mobile Feed
        </span>
        <span>Post Card</span>
      </div>

      <div className="max-w-sm mx-auto border border-border/60 rounded-2xl overflow-hidden bg-background">
        {/* Profile Header */}
        <div className="p-3 flex items-center justify-between border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-[10px] font-bold text-foreground">
                FR
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-foreground flex items-center gap-1">
                flyrank.studio
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <div className="text-[10px] text-muted-foreground">Original Audio</div>
            </div>
          </div>
          <button type="button" className="text-muted-foreground p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Media Frame Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-primary/20 via-muted to-secondary/20 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <Sparkles className="w-8 h-8 text-primary mb-2 opacity-80" />
          <div className="font-bold text-sm text-foreground line-clamp-3 px-4">
            {content.split('\n')[0] || 'Social Post Media'}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground mt-2 px-3 py-1 rounded-full bg-card/60 backdrop-blur-sm border border-border/50">
            Swipe for insights →
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className={`transition-colors ${liked ? 'text-rose-500' : 'text-foreground'}`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500' : ''}`} />
              </button>
              <button type="button" className="text-foreground">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button type="button" className="text-foreground">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setBookmarked(!bookmarked)}
              className={`transition-colors ${bookmarked ? 'text-foreground' : 'text-foreground'}`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-foreground' : ''}`} />
            </button>
          </div>

          <div className="mt-2 text-xs font-bold text-foreground">
            {liked ? '432 likes' : '431 likes'}
          </div>

          {/* Caption */}
          <div className="mt-1.5 text-xs text-foreground leading-relaxed whitespace-pre-wrap break-words">
            <span className="font-bold mr-1.5">flyrank.studio</span>
            {renderFormattedText(content)}
          </div>

          <div className="mt-2 text-[10px] text-muted-foreground uppercase tracking-wide">
            2 minutes ago
          </div>
        </div>
      </div>
    </div>
  );
};
