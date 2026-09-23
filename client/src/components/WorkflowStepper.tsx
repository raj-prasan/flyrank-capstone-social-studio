import React from 'react';
import { Check, FileText, Sparkles, Sliders, Send } from 'lucide-react';
import type { WorkflowStep } from '../types';

interface WorkflowStepperProps {
  currentStep: WorkflowStep;
  onSelectStep?: (step: WorkflowStep) => void;
  canNavigateToReview: boolean;
  canNavigateToPublish: boolean;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  onSelectStep,
  canNavigateToReview,
  canNavigateToPublish,
}) => {
  const steps: { id: WorkflowStep; label: string; description: string; icon: React.ReactNode; enabled: boolean }[] = [
    {
      id: 'ingest',
      label: '1. Ingest Content',
      description: 'URL or direct article',
      icon: <FileText className="w-4 h-4" />,
      enabled: true,
    },
    {
      id: 'generate',
      label: '2. AI Generation',
      description: 'Gemini 2.5 Flash',
      icon: <Sparkles className="w-4 h-4" />,
      enabled: true,
    },
    {
      id: 'review',
      label: '3. Review & Refine',
      description: 'Side-by-side editing',
      icon: <Sliders className="w-4 h-4" />,
      enabled: canNavigateToReview,
    },
    {
      id: 'publish',
      label: '4. Schedule & Publish',
      description: 'BullMQ Redis queue',
      icon: <Send className="w-4 h-4" />,
      enabled: canNavigateToPublish,
    },
  ];

  const stepOrder: WorkflowStep[] = ['ingest', 'generate', 'review', 'publish'];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="w-full py-4 border-b border-border/50 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {steps.map((step, idx) => {
              const isCurrent = step.id === currentStep;
              const isPast = idx < currentIndex;
              const isClickable = step.enabled && onSelectStep;

              return (
                <li key={step.id}>
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && onSelectStep(step.id)}
                    className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-150 ${
                      isCurrent
                        ? 'border-primary/60 bg-primary/10 shadow-sm shadow-primary/10'
                        : isPast
                        ? 'border-border/60 bg-card hover:bg-muted/40 cursor-pointer'
                        : 'border-border/40 bg-muted/20 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isPast ? <Check className="w-4 h-4" /> : step.icon}
                    </div>

                    <div className="min-w-0">
                      <div
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCurrent
                            ? 'text-primary'
                            : isPast
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
