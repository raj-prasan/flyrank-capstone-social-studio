import React, { useEffect, useState } from 'react';
import { Sparkles, Check, BrainCircuit } from 'lucide-react';

interface GenerationLoaderProps {
  sourceTitle?: string;
}

export const GenerationLoader: React.FC<GenerationLoaderProps> = ({ sourceTitle }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: 'Parsing source content structure', desc: 'Sanitizing text and extracting key narrative hooks' },
    { title: 'Prompting Gemini 2.5 Flash', desc: 'Invoking multi-platform social media system engine' },
    { title: 'Tailoring platform tones', desc: 'Synthesizing punchy X post, insightful LinkedIn article, visual IG caption' },
    { title: 'Validating constraint profiles', desc: 'Verifying character limits and hashtag budgets' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 1200);
    const timer2 = setTimeout(() => setActiveStep(2), 2600);
    const timer3 = setTimeout(() => setActiveStep(3), 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      {/* Animated Glowing Orb */}
      <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent opacity-40 blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-card border border-border shadow-xl flex items-center justify-center text-primary">
          <BrainCircuit className="w-10 h-10 animate-bounce" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        AI Engine Active
      </div>

      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        Generating Social Media Variants
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {sourceTitle
          ? `Transforming "${sourceTitle.slice(0, 50)}${sourceTitle.length > 50 ? '...' : ''}"`
          : 'Processing ingested content with Gemini 2.5 Flash...'}
      </p>

      {/* Progressive Step Tracker */}
      <div className="mt-8 bg-card border border-border/70 rounded-2xl p-6 text-left space-y-4 shadow-sm">
        {steps.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div key={idx} className="flex items-start gap-3.5 transition-all duration-300">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground animate-pulse'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={`text-xs font-semibold ${
                    isDone
                      ? 'text-foreground'
                      : isCurrent
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
