import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Hash,
  Type,
} from 'lucide-react';
import type { Platform } from '../types';
import { PLATFORMS, extractHashtags } from '../lib/constants';
import { PlatformMockup } from './PlatformMockup';

interface PlatformStudioProps {
  variants: {
    x: string;
    linkedin: string;
    instagram: string;
  };
  originalVariants: {
    x: string;
    linkedin: string;
    instagram: string;
  };
  onChangeVariant: (platform: Platform, newContent: string) => void;
  onResetVariant: (platform: Platform) => void;
  onCopyText: (text: string, label: string) => void;
  sourceUrl?: string | null;
  onRegenerateAll?: () => void;
  isRegenerating?: boolean;
}

export const PlatformStudio: React.FC<PlatformStudioProps> = ({
  variants,
  originalVariants,
  onChangeVariant,
  onResetVariant,
  onCopyText,
  sourceUrl,
  onRegenerateAll,
  isRegenerating,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('x');
  const [copied, setCopied] = useState(false);

  const config = PLATFORMS[selectedPlatform];
  const currentText = variants[selectedPlatform] || '';
  const originalText = originalVariants[selectedPlatform] || '';
  const isModified = currentText !== originalText;

  const charCount = currentText.length;
  const maxChars = config.maxLength;
  const charPct = Math.min(100, Math.round((charCount / maxChars) * 100));
  const isOverCharLimit = charCount > maxChars;
  const isNearCharLimit = charCount > maxChars * 0.85 && !isOverCharLimit;

  const hashtags = extractHashtags(currentText);
  const hashtagCount = hashtags.length;
  const maxHashtags = config.maxHashtags;
  const isOverHashtagLimit = hashtagCount > maxHashtags;

  const handleCopy = () => {
    onCopyText(currentText, config.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Studio Navigation & Platform Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Step 3 • Platform Studio
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Multi-Platform Polish & Constraint Validation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Edit and fine-tune your AI-generated copy. Every variant is checked against platform character limits and hashtag budgets.
          </p>
        </div>

        {/* Global Regenerate Button */}
        {onRegenerateAll && (
          <button
            type="button"
            onClick={onRegenerateAll}
            disabled={isRegenerating}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted/50 text-foreground transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-primary ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate All'}</span>
          </button>
        )}
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 p-1.5 bg-muted/40 rounded-2xl border border-border/70 overflow-x-auto mb-6">
        {(Object.keys(PLATFORMS) as Platform[]).map((platformKey) => {
          const p = PLATFORMS[platformKey];
          const isSelected = selectedPlatform === platformKey;
          const textLength = (variants[platformKey] || '').length;
          const isOver = textLength > p.maxLength;

          return (
            <button
              key={platformKey}
              type="button"
              onClick={() => setSelectedPlatform(platformKey)}
              className={`flex-1 min-w-[140px] flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-card text-foreground shadow-md border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    platformKey === 'x'
                      ? 'bg-foreground'
                      : platformKey === 'linkedin'
                      ? 'bg-[#0a66c2]'
                      : 'bg-[#e1306c]'
                  }`}
                />
                <span>{p.displayName}</span>
              </div>

              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                  isOver
                    ? 'bg-destructive/10 text-destructive border border-destructive/20'
                    : isSelected
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {textLength}/{p.maxLength}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Grid: Editor vs Live Mockup Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: INTERACTIVE EDITOR */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <span>{config.name} Content Editor</span>
                {isModified && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                    Modified
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{config.tone}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              {isModified && (
                <button
                  type="button"
                  onClick={() => onResetVariant(selectedPlatform)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
                  title="Reset to initial AI generation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                title="Copy variant to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1">
            <textarea
              rows={9}
              value={currentText}
              onChange={(e) => onChangeVariant(selectedPlatform, e.target.value)}
              placeholder={config.placeholder}
              className="w-full p-4 rounded-xl border border-border bg-background text-foreground text-sm font-sans placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-y leading-relaxed"
            />
          </div>

          {/* Real-Time Constraint Validation Meters */}
          <div className="space-y-3 pt-2">
            {/* Character Limit Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-muted-foreground" />
                  Character Length
                </span>
                <span
                  className={`font-mono font-bold ${
                    isOverCharLimit
                      ? 'text-destructive'
                      : isNearCharLimit
                      ? 'text-amber-500'
                      : 'text-foreground'
                  }`}
                >
                  {charCount} / {maxChars}{' '}
                  <span className="text-[11px] font-normal text-muted-foreground">
                    ({maxChars - charCount >= 0 ? `${maxChars - charCount} left` : `${charCount - maxChars} over limit`})
                  </span>
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverCharLimit
                      ? 'bg-destructive'
                      : isNearCharLimit
                      ? 'bg-amber-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${charPct}%` }}
                />
              </div>

              {isOverCharLimit && (
                <div className="flex items-center gap-1.5 text-xs text-destructive mt-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Variant exceeds {config.displayName}'s {maxChars} character limit. Trim copy before publishing.</span>
                </div>
              )}
            </div>

            {/* Hashtag Budget Badge */}
            <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Hashtag Budget:</span>
                <span
                  className={`font-mono px-2 py-0.5 rounded-md ${
                    isOverHashtagLimit
                      ? 'bg-destructive/10 text-destructive font-bold'
                      : 'bg-muted/70 text-foreground font-medium'
                  }`}
                >
                  {hashtagCount} / {maxHashtags}
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex items-center gap-1 flex-wrap">
                {hashtags.length > 0 ? (
                  hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-[11px] italic">No hashtags added</span>
                )}
              </div>
            </div>

            {isOverHashtagLimit && (
              <div className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Exceeds recommended {maxHashtags} hashtags for {config.displayName}.</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE AUTHENTIC MOCKUP */}
        <div className="space-y-4">
          <PlatformMockup
            platform={selectedPlatform}
            content={currentText}
            sourceUrl={sourceUrl}
          />
        </div>
      </div>
    </div>
  );
};
