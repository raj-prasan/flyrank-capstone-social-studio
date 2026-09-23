import { useEffect, useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { WorkflowStepper } from './components/WorkflowStepper';
import { SourceIngestion } from './components/SourceIngestion';
import { GenerationLoader } from './components/GenerationLoader';
import { PlatformStudio } from './components/PlatformStudio';
import { ReviewActionBar } from './components/ReviewActionBar';
import { ScheduleModal } from './components/ScheduleModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ToastContainer } from './components/Toast';
import {
  checkHealth,
  ingestBlog,
  generatePostVariants,
  reviewPost,
  publishPost,
  fetchAllPosts,
} from './lib/api';
import type {
  Platform,
  Post,
  PostStatus,
  ToastMessage,
  WorkflowStep,
} from './types';
import { ArrowLeft } from 'lucide-react';

function App() {
  // Theme state: default dark mode
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('flyrank-theme');
    if (saved) return saved === 'dark';
    return true; // Default to sleek dark mode
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flyrank-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flyrank-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // User ID persistence
  const [userId, setUserId] = useState(() => {
    const saved = localStorage.getItem('flyrank-user-id');
    if (saved) return saved;
    const generated = `usr_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('flyrank-user-id', generated);
    return generated;
  });

  const handleUpdateUserId = (newId: string) => {
    setUserId(newId);
    localStorage.setItem('flyrank-user-id', newId);
    addToast({
      type: 'info',
      title: 'User Profile Updated',
      message: `Active session user ID is now ${newId}`,
    });
  };

  // Server health state
  const [serverStatus, setServerStatus] = useState<'connected' | 'checking' | 'disconnected'>('checking');

  const verifyHealth = useCallback(async () => {
    setServerStatus('checking');
    try {
      await checkHealth();
      setServerStatus('connected');
    } catch {
      setServerStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    verifyHealth();
    const interval = setInterval(verifyHealth, 25000);
    return () => clearInterval(interval);
  }, [verifyHealth]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Studio Workflow State
  const [step, setStep] = useState<WorkflowStep>('ingest');
  const [blogId, setBlogId] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceContent, setSourceContent] = useState<string>('');
  const [status, setStatus] = useState<PostStatus>('draft');

  const [variants, setVariants] = useState<{ x: string; linkedin: string; instagram: string }>({
    x: '',
    linkedin: '',
    instagram: '',
  });

  const [originalVariants, setOriginalVariants] = useState<{ x: string; linkedin: string; instagram: string }>({
    x: '',
    linkedin: '',
    instagram: '',
  });

  // UI state
  const [isIngesting, setIsIngesting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyPosts, setHistoryPosts] = useState<Post[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load history campaigns from backend
  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetchAllPosts();
      if (res.posts) {
        setHistoryPosts(res.posts);
      }
    } catch {
      // Backend might not have posts or offline
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Step 1: Submit Ingestion -> Step 2: Auto Generate
  const handleIngest = async (data: { content?: string; post_url?: string }) => {
    setIsIngesting(true);
    const idempotency_key = crypto.randomUUID();

    try {
      const result = await ingestBlog({
        ...data,
        user_id: userId,
        idempotency_key,
      });

      setBlogId(result.blogId);
      setSourceContent(result.content);
      setSourceUrl(result.post_url || data.post_url || null);

      addToast({
        type: 'success',
        title: 'Source Ingested Successfully',
        message: data.post_url
          ? `Scraped content from ${new URL(data.post_url).hostname}`
          : 'Draft text stored in database',
      });

      // Move to step 2 & generate
      setStep('generate');
      await triggerGeneration(result.blogId);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Ingestion Failed',
        message: err.message || 'Could not parse or store content',
      });
    } finally {
      setIsIngesting(false);
    }
  };

  // Step 2: Generation Trigger
  const triggerGeneration = async (targetBlogId: string) => {
    setIsGenerating(true);
    try {
      const res = await generatePostVariants(targetBlogId);

      const generatedVariants = {
        x: res.x_post || '',
        linkedin: res.linkedin_post || '',
        instagram: res.instagram_post || '',
      };

      setPostId(res.postId);
      setVariants(generatedVariants);
      setOriginalVariants(generatedVariants);
      setStatus('draft');
      setStep('review');

      addToast({
        type: 'success',
        title: 'Social Variants Generated!',
        message: 'Crafted 3 tailored versions for X, LinkedIn, and Instagram.',
      });

      loadHistory();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: err.message || 'Google Gemini failed to generate post variants',
      });
      setStep('ingest');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate action inside Studio
  const handleRegenerateAll = async () => {
    if (!blogId) return;
    setStep('generate');
    await triggerGeneration(blogId);
  };

  // Variant editing in studio
  const handleUpdateVariant = (platform: Platform, newContent: string) => {
    setVariants((prev) => ({
      ...prev,
      [platform]: newContent,
    }));
  };

  const handleResetVariant = (platform: Platform) => {
    setVariants((prev) => ({
      ...prev,
      [platform]: originalVariants[platform] || '',
    }));
    addToast({
      type: 'info',
      title: 'Restored Initial AI Copy',
      message: `Reset ${platform.toUpperCase()} to the Gemini suggestion.`,
    });
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard!',
      message: `${label} variant is ready to paste anywhere.`,
    });
  };

  // Step 3: Review Post Status (Approve / Reject)
  const handleReviewStatus = async (newStatus: 'approved' | 'rejected') => {
    if (!postId) return;
    setIsReviewing(true);

    try {
      const res = await reviewPost(postId, newStatus);
      const updatedStatus = res.result?.status || newStatus;
      setStatus(updatedStatus);

      if (updatedStatus === 'approved') {
        addToast({
          type: 'success',
          title: 'Post Approved!',
          message: 'Post unlocked for BullMQ publication queue.',
        });
      } else {
        addToast({
          type: 'warning',
          title: 'Draft Rejected',
          message: 'Revise copy or parameters before approving.',
        });
      }

      loadHistory();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Review Action Failed',
        message: err.message || 'Unable to update status on server.',
      });
    } finally {
      setIsReviewing(false);
    }
  };

  // Step 4: BullMQ Publish / Queue
  const handlePublishPost = async (scheduledTime: string) => {
    if (!postId) return;
    setIsPublishing(true);

    try {
      const res = await publishPost(postId, scheduledTime);
      if (res.sucess) {
        setStatus('published');
        addToast({
          type: 'success',
          title: 'Task Enqueued on BullMQ!',
          message: res.message || 'Scheduled for automated publish.',
        });
        loadHistory();
      }
    } catch (err: any) {
      throw err;
    } finally {
      setIsPublishing(false);
    }
  };

  // Load a past campaign from history drawer into active studio
  const handleSelectHistoryPost = (post: Post) => {
    setPostId(post.id);
    setBlogId(post.blog_id);
    setStatus(post.status);
    setSourceUrl(post.post_url || null);
    setSourceContent(post.blog_content || '');

    const pastVariants = {
      x: post.x_post || '',
      linkedin: post.linkedin_post || '',
      instagram: post.instagram_post || '',
    };
    setVariants(pastVariants);
    setOriginalVariants(pastVariants);
    setStep('review');

    addToast({
      type: 'info',
      title: 'Loaded Campaign from History',
      message: `Opened campaign ${post.id.slice(0, 8)}... into Studio.`,
    });
  };

  // Reset to start a new campaign
  const handleStartNew = () => {
    setStep('ingest');
    setBlogId(null);
    setPostId(null);
    setStatus('draft');
    setSourceUrl(null);
    setSourceContent('');
    setVariants({ x: '', linkedin: '', instagram: '' });
    setOriginalVariants({ x: '', linkedin: '', instagram: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation */}
      <Navbar
        serverStatus={serverStatus}
        onRefreshHealth={verifyHealth}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyPosts.length}
      />

      {/* Workflow Stepper */}
      <WorkflowStepper
        currentStep={step}
        onSelectStep={(targetStep) => {
          if (targetStep === 'ingest') setStep('ingest');
          else if (targetStep === 'review' && postId) setStep('review');
        }}
        canNavigateToReview={Boolean(postId)}
        canNavigateToPublish={status === 'approved'}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 w-full pb-20">
        {step === 'ingest' && (
          <SourceIngestion
            userId={userId}
            onChangeUserId={handleUpdateUserId}
            onSubmit={handleIngest}
            isLoading={isIngesting}
          />
        )}

        {step === 'generate' && (
          <GenerationLoader
            sourceTitle={sourceUrl || sourceContent.slice(0, 45)}
          />
        )}

        {step === 'review' && (
          <div>
            {/* Quick Back & Start New Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleStartNew}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border/60 bg-card hover:bg-muted/50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>New Campaign</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">
                  Campaign ID: {postId?.slice(0, 8)}...
                </span>
              </div>
            </div>

            <PlatformStudio
              variants={variants}
              originalVariants={originalVariants}
              onChangeVariant={handleUpdateVariant}
              onResetVariant={handleResetVariant}
              onCopyText={handleCopyText}
              sourceUrl={sourceUrl}
              onRegenerateAll={handleRegenerateAll}
              isRegenerating={isGenerating}
            />

            <ReviewActionBar
              status={status}
              postId={postId || undefined}
              onReview={handleReviewStatus}
              onOpenSchedule={() => setIsScheduleOpen(true)}
              isReviewing={isReviewing}
            />
          </div>
        )}
      </main>

      {/* BullMQ Scheduling Modal */}
      {postId && (
        <ScheduleModal
          isOpen={isScheduleOpen}
          onClose={() => setIsScheduleOpen(false)}
          postId={postId}
          onPublish={handlePublishPost}
          isPublishing={isPublishing}
        />
      )}

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        posts={historyPosts}
        onSelectPost={handleSelectHistoryPost}
        isLoading={isLoadingHistory}
        onRefresh={loadHistory}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
