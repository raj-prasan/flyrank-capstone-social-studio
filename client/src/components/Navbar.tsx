import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  History,
  CheckCircle2,
  Bot as BotIcon,
} from 'lucide-react';

interface NavbarProps {
  serverStatus: 'connected' | 'checking' | 'disconnected';
  onRefreshHealth: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  serverStatus,
  onRefreshHealth,
  isDark,
  onToggleTheme,
  onOpenHistory,
  historyCount,
}) => {
  const [showBotModal, setShowBotModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & App Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
                  Flyrank
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Social Studio
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI Cross-Platform Content Engine
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Server Connection Status Pill */}
            <button
              type="button"
              onClick={onRefreshHealth}
              title="Click to re-check API connection"
              className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border border-border/80 bg-card hover:bg-muted/60 transition-all duration-150"
            >
              {serverStatus === 'connected' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-foreground/80 hidden md:inline">API:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Online
                  </span>
                </>
              ) : serverStatus === 'checking' ? (
                <>
                  <span className="inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse"></span>
                  <span className="text-muted-foreground">Checking...</span>
                </>
              ) : (
                <>
                  <span className="inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                  <span className="text-destructive font-medium">Offline</span>
                </>
              )}
            </button>

            {/* Telegram Bot Helper Button */}
            <button
              type="button"
              onClick={() => setShowBotModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/80 bg-card hover:bg-muted/60 text-foreground transition-colors"
              title="Telegram Broadcast Bot status"
            >
              <BotIcon className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Bot Broadcast</span>
            </button>

            {/* History Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenHistory}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/80 bg-card hover:bg-muted/60 text-foreground transition-colors"
              title="View past campaigns & drafts"
            >
              <History className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Campaigns</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-lg border border-border/80 bg-card hover:bg-muted/60 text-foreground transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Telegram Bot Modal */}
      {showBotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 text-card-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BotIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Telegram Broadcast Bot</h3>
                  <p className="text-xs text-muted-foreground">Automated publish subscriber alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBotModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                Your backend includes a Telegram bot service (<code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">server/src/utils/bot.ts</code>) capable of broadcasting published campaign notifications.
              </p>
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50 space-y-1.5">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Bot Subscriber Registration
                </div>
                <p>
                  Subscribers register by sending <code className="font-mono text-foreground font-semibold">/start</code> to the bot. Their chat ID is stored in <code className="font-mono">telegram_users</code> table.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowBotModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
