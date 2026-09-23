import React, { useState } from 'react';
import {
  Globe,
  FileText,
  Sparkles,
  Link2,
  ArrowRight,
  BookOpen,
  User,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { SAMPLE_ARTICLES } from '../lib/constants';

interface SourceIngestionProps {
  userId: string;
  onChangeUserId: (newId: string) => void;
  onSubmit: (data: {
    content?: string;
    post_url?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const SourceIngestion: React.FC<SourceIngestionProps> = ({
  userId,
  onChangeUserId,
  onSubmit,
  isLoading,
}) => {
  const [tab, setTab] = useState<'url' | 'content'>('content');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState(SAMPLE_ARTICLES[0].content);
  const [editingUserId, setEditingUserId] = useState(false);
  const [tempUserId, setTempUserId] = useState(userId);

  const handleSelectSample = (sample: (typeof SAMPLE_ARTICLES)[0]) => {
    setContent(sample.content);
    setUrl(sample.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'url') {
      if (!url.trim()) return;
      await onSubmit({ post_url: url.trim() });
    } else {
      if (!content.trim()) return;
      await onSubmit({ content: content.trim() });
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Step 1 • Ingestion Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Ingest Long-Form Content
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Provide a published blog URL or paste your raw draft. Our AI engine parses the core narrative and crafts high-conversion variants for X, LinkedIn, and Instagram.
        </p>
      </div>

      {/* Main Ingestion Box */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm text-card-foreground">
        {/* User Identity & Config Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/60 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">User Session:</span>
            {editingUserId ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempUserId}
                  onChange={(e) => setTempUserId(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-border bg-background text-foreground font-mono text-xs w-36"
                />
                <button
                  type="button"
                  onClick={() => {
                    onChangeUserId(tempUserId.trim() || 'user_anon');
                    setEditingUserId(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-primary text-primary-foreground font-medium"
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="font-mono font-medium text-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                {userId}
              </span>
            )}
            {!editingUserId && (
              <button
                type="button"
                onClick={() => {
                  setTempUserId(userId);
                  setEditingUserId(true);
                }}
                className="text-primary hover:underline ml-1"
              >
                Change
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <KeyRound className="w-3.5 h-3.5 text-secondary" />
            <span>Auto Idempotency Key:</span>
            <span className="font-mono text-[11px] text-foreground bg-muted/60 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>

        {/* Input Mode Tabs */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-muted/40 rounded-xl border border-border/60 w-fit">
          <button
            type="button"
            onClick={() => setTab('content')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              tab === 'content'
                ? 'bg-card text-foreground shadow-sm border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4 text-primary" />
            Direct Content / Markdown
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              tab === 'url'
                ? 'bg-card text-foreground shadow-sm border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Globe className="w-4 h-4 text-secondary" />
            Import from URL
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {tab === 'url' ? (
            <div className="space-y-3">
              <label htmlFor="blogUrl" className="block text-xs font-semibold text-foreground">
                Article / Blog Post URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Link2 className="w-4 h-4" />
                </div>
                <input
                  id="blogUrl"
                  type="url"
                  placeholder="https://example.com/blog/your-great-article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                The backend server will use <code className="text-primary font-mono">cheerio</code> and <code className="text-primary font-mono">axios</code> to scrape and sanitize the article body text automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="blogContent" className="block text-xs font-semibold text-foreground">
                  Article Content / Document Draft
                </label>
                <div className="text-xs text-muted-foreground font-mono space-x-2">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{charCount} chars</span>
                </div>
              </div>

              <textarea
                id="blogContent"
                rows={10}
                placeholder="Paste your long-form article, company announcement, newsletter, or release notes here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full p-4 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans leading-relaxed resize-y"
              />
            </div>
          )}

          {/* Quick Sample Presets */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                Or load a sample topic to test:
              </span>
              <button
                type="button"
                onClick={() => {
                  setContent('');
                  setUrl('');
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_ARTICLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="p-2.5 rounded-xl border border-border/70 hover:border-primary/50 bg-background/50 hover:bg-muted/50 text-left text-xs transition-all group"
                >
                  <div className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {sample.content}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground hidden sm:block">
              Engine ready • Ready to generate 3 platform variants
            </div>

            <button
              type="submit"
              disabled={isLoading || (tab === 'url' ? !url.trim() : !content.trim())}
              className="ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-95 active:scale-[0.98] shadow-md shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Ingesting Content...</span>
                </>
              ) : (
                <>
                  <span>Ingest & Generate Variants</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
