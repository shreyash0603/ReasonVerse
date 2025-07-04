'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  ThumbsUp,
  Trophy,
  Sparkles,
  ArrowRight,
  Search,
  BarChart2,
  FileText,
  BrainCircuit,
  User,
  CheckCircle,
  X,
  Target,
  Zap,
  Palette,
  Lightbulb,
  Smile,
  Turtle,
  WrapText,
  SearchX,
  Frown,
  CalendarClock,
  Waves,
  CircleDot,
  Triangle,
  Sun,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ScratchCard } from './scratch-card';
import { Label } from '@/components/ui/label';
import Sidebar from './Sidebar.jsx';
import { Header } from './header';

const REWARD_AMOUNT = 10;
const modelNames = ['Citadel-AI', 'Turing-Oracle'];
const suggestionPrompts = [
    {
        icon: Search,
        text: 'Research a topic',
    },
    {
        icon: BarChart2,
        text: 'Analyze data',
    },
    {
        icon: FileText,
        text: 'Draft a document',
    },
    {
        icon: BrainCircuit,
        text: 'Brainstorm ideas',
    },
    {
        icon: User,
        text: 'Create custom GPT',
    },
];
const positiveFeedbackOptions = [
  { text: 'On target!', icon: Target },
  { text: 'Fast', icon: Zap },
  { text: 'Style', icon: Palette },
  { text: 'Interesting', icon: Lightbulb },
  { text: 'Nice tone', icon: Smile },
];
const negativeFeedbackOptions = [
  { text: 'Slow', icon: Turtle },
  { text: 'Too long', icon: WrapText },
  { text: 'Not detailed', icon: SearchX },
  { text: 'Off course', icon: Frown },
  { text: 'Outdated', icon: CalendarClock },
];
const promptTypes = [
  {
    label: 'Standard Prompt',
    value: 'standard',
    icon: Sparkles,
  },
  {
    label: 'Reasoning Prompt',
    value: 'reasoning',
    icon: BrainCircuit,
  },
  {
    label: 'Deep Research Prompt',
    value: 'deep-research',
    icon: BarChart2,
  },
  {
    label: 'Build UI/Agent Prompt',
    value: 'custom',
    icon: FileText,
    description: 'Design your own website or ai agents',
  },
];

// Add a mapping from prompt type to background color
const promptBgColors: Record<string, string> = {
  standard: 'bg-[#fcf8f3]', // off-white
  reasoning: 'bg-[#fff7cc]', // light yellow
  'deep-research': 'bg-[#f0f8ff]', // light blue
  custom: 'bg-[#f6edff]', // light purple
};

export default function ReasoningPage() {
  const { isAuthenticated, addTokens } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<{response1: string; response2: string} | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [positiveTags, setPositiveTags] = useState<string[]>([]);
  const [negativeTags, setNegativeTags] = useState<string[]>([]);
  const [detailedFeedback, setDetailedFeedback] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPromptType, setSelectedPromptType] = useState('standard');
  const [selectedModel, setSelectedModel] = useState('');
  const [quickTakePrompt, setQuickTakePrompt] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [refining, setRefining] = useState(false);
  const [refineValue, setRefineValue] = useState('');
  const [hasEnhancedOnce, setHasEnhancedOnce] = useState(false);
  const [showFollowupInput, setShowFollowupInput] = useState(false);
  const [lastUserPrompt, setLastUserPrompt] = useState('');

  const handleSelectResponse = (index: number) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit your preference.',
        variant: 'destructive',
      });
      return;
    }
    if (selectedCard === null) {
      setSelectedCard(index);
    }
  };

  const handlePositiveTagClick = (tag: string) => {
    setPositiveTags(prev => 
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleNegativeTagClick = (tag: string) => {
      setNegativeTags(prev => 
          prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      );
  };

  const handleFeedbackSubmit = () => {
    const feedbackSummary = `Positive: ${positiveTags.join(', ')}. Negative: ${negativeTags.join(', ')}. Details: ${detailedFeedback}`;
    setFeedback(feedbackSummary);
    toast({
      title: 'Feedback Received!',
      description: 'Thank you for helping us improve.',
    });
  };

  const handleCloseFeedback = () => {
    setSelectedCard(null);
    setPositiveTags([]);
    setNegativeTags([]);
    setDetailedFeedback('');
  };

  const handleRewardReveal = () => {
    addTokens(REWARD_AMOUNT);
    toast({
      title: 'Reward Revealed!',
      description: `You've been awarded ${REWARD_AMOUNT} tokens.`,
      className: 'bg-green-100 dark:bg-green-900',
    });
  };

  // Simulate prompt enhancement (replace with API call if needed)
  async function enhancePrompt(prompt: string, firstTime: boolean) {
    if (!firstTime) return prompt.trim();
    try {
      const res = await fetch('http://localhost:3000/api/enhance/enhance-prompt', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({
          prompt: prompt,
          
        }),
      });
      const data = await res.json();
      console.log('Enhance API response:', data.data);
      return (data.data && data.data.enhanced_prompt) || prompt.trim();
    } catch (err) {
      // fallback if backend fails
      return prompt.trim();
    }
  }

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: 'Query is empty',
        description: 'Please enter a topic or question.',
        variant: 'destructive',
      });
      return;
    }
    setEnhancing(true);
    setQuickTakePrompt(null);
    setResponses(null);
    setSelectedCard(null);
    setFeedback(null);
    setPositiveTags([]);
    setNegativeTags([]);
    setDetailedFeedback('');
    setLastUserPrompt(query);
    // Enhance the prompt first
    const enhanced = await enhancePrompt(query, true);
    setQuickTakePrompt(enhanced);
    setHasEnhancedOnce(true);
    setEnhancing(false);
    setQuery(''); // Clear input after enhancing
  };

  // Handler for Go Ahead (generate responses)
  const handleGoAhead = async () => {
    setIsLoading(true);
    setResponses(null);
    setSelectedCard(null);
    setFeedback(null);
    setPositiveTags([]);
    setNegativeTags([]);
    setDetailedFeedback('');
    try {
      const res = await fetch('http://localhost:3000/api/chat/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: quickTakePrompt }),
      });
      const data = await res.json();
      if (data.success) {
        setResponses({ response1: data.response1, response2: data.response2 });
        setShowFollowupInput(true); // Show follow-up input at bottom
        setQuery(''); // Clear input after generating responses
      } else {
        toast({
          title: 'AI Error',
          description: data.error || 'Failed to get AI responses.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Network Error',
        description: 'Failed to connect to the backend.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Refine (let user edit prompt)
  const handleRefine = () => {
    setRefining(true);
    setRefineValue(quickTakePrompt || '');
  };

  const handleCancelRefine = () => {
    setRefining(false);
  };

  const handleUpdateRefine = async () => {
    setEnhancing(true);
    setRefining(false);
    // Enhance the new prompt
    const enhanced = await enhancePrompt(refineValue, false);
    setQuickTakePrompt(enhanced);
    setEnhancing(false);
  };

  const handleSelectChat = (chat: any) => {
    setQuery(chat.userMessage);
    setResponses({ response1: chat.aiMessage, response2: '' });
    setSidebarOpen(false);
  };

  // Trending models for dropdown (each as a unique value)
  const trendingModels = [
    {
      value: 'OpenAI o1-mini|Groq Deepseek',
      color: 'text-[#d12b7c]',
      icon: <Waves className="w-5 h-5 text-[#d12b7c] mr-2" />, // MiniMax
      main: 'OpenAI o1-mini',
      sub: 'Groq Deepseek',
    },
    {
      value: 'Groq Deepseek|Nvidia A100',
      color: 'text-[#3b82f6]',
      icon: <CircleDot className="w-5 h-5 text-[#3b82f6] mr-2" />, // DeepSeek
      main: 'Groq Deepseek',
      sub: 'Nvidia A100',
    },
    {
      value: 'Nvidia A100|Google Gemini 2.0',
      color: 'text-[#b3a16c]',
      icon: <Triangle className="w-5 h-5 text-[#b3a16c] mr-2" />, // FLUX
      main: 'Nvidia A100',
      sub: 'Google Gemini 2.0',
    },
    {
      value: 'Google Gemini 2.0|OpenAi o1-mini',
      color: 'text-[#b37c5a]',
      icon: <Sun className="w-5 h-5 text-[#b37c5a] mr-2" />, // Arcee/Claude
      main: 'Google Gemini 2.0',
      sub: 'OpenAi o1-mini',
    },
  ];

  // Helper to get selected model names for response headers
  const selectedTrending = trendingModels.find(m => m.value === selectedModel) || null;
  const responseModelNames = selectedTrending
    ? [selectedTrending.main, selectedTrending.sub]
    : modelNames;

  return (
    <div className="relative flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelectChat={handleSelectChat} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : ''}`}>
        <Header onHamburgerClick={() => setSidebarOpen((open) => !open)} />
        <div className="container py-8">
          <section className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              The Frontier of AI-Powered Reasoning
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Enter a topic and compare two AI responses. Reward the one you find more insightful.
            </p>
          </section>

          <section className="mt-12">
            {!showFollowupInput && (
              <form onSubmit={handleSubmitQuery} className="mx-auto max-w-3xl transition-all duration-500">
                <div className={`relative rounded-2xl border text-card-foreground shadow-sm focus-within:ring-2 focus-within:ring-ring/80 ${promptBgColors[selectedPromptType] || ''}`}>
                  <Textarea
                    placeholder="I want a prompt that will..."
                    className="min-h-[120px] w-full resize-none border-0 bg-transparent p-4 pb-14 text-base focus-visible:ring-0"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading || enhancing || !!quickTakePrompt}
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <PromptTypeDropdown selected={selectedPromptType} onSelect={setSelectedPromptType} />
                      <ModelDropdown selected={selectedModel} onSelect={setSelectedModel} />
                    </div>
                    <Button type="submit" size="icon" variant="secondary" className="rounded-lg" disabled={isLoading || enhancing || !!quickTakePrompt}>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {suggestionPrompts.map((prompt, index) => (
                      <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          type="button" 
                          className="rounded-full"
                          onClick={() => setQuery(prompt.text)}
                      >
                          <prompt.icon className="mr-2 h-4 w-4" />
                          {prompt.text}
                      </Button>
                  ))}
                </div>
              </form>
            )}
            {showFollowupInput && (
              <form onSubmit={handleSubmitQuery} className="fixed left-0 right-0 bottom-8 z-50 flex justify-center pointer-events-none transition-all duration-500">
                <div className="relative flex items-center rounded-full border border-[#3a2415] bg-[#231916] shadow-2xl px-4 py-2 w-full max-w-2xl mx-auto pointer-events-auto">
                  {/* Model icons (optional, add logic if needed) */}
                  <div className="flex items-center gap-2 mr-2">
                    {/* Example icons, replace with selected model icons if desired */}
                  </div>
                  <input
                    type="text"
                    placeholder="Ask a follow-up"
                    className="flex-1 bg-transparent outline-none border-none text-[#e7d8ce] placeholder-[#bfa77a] text-lg px-2 py-2"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading || enhancing || !!quickTakePrompt}
                  />
                  {/* Attachments or other icons can go here */}
                  <Button type="submit" size="icon" variant="secondary" className="rounded-full ml-2 bg-[#bfa77a] hover:bg-[#e7b98a] text-[#231916]" disabled={isLoading || enhancing || !!quickTakePrompt}>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            )}
          </section>

          {/* QuickTake area */}
          {quickTakePrompt && (
            <>
              {/* User prompt bubble */}
              <div className="flex justify-end w-full">
                <div className="rounded-2xl bg-[#2a211d] text-[#e7d8ce] px-6 py-3 mb-4 max-w-xl shadow border border-[#3a2415] text-lg" style={{marginRight: '2.5rem'}}>
                  {lastUserPrompt}
                </div>
              </div>
              <div className="flex flex-col items-center mt-2">
                <div className="text-[#e7b98a] text-xl font-bold mb-2 flex items-center gap-2">QuickTake <Sparkles className="inline h-5 w-5 mb-1 text-[#e7b98a]" /></div>
                {refining ? (
                  <>
                    <textarea
                      className="w-full max-w-2xl min-h-[60px] rounded-md border border-[#e7b98a] p-3 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-[#e7b98a]"
                      value={refineValue}
                      onChange={e => setRefineValue(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-4">
                      <Button onClick={handleUpdateRefine} className="bg-[#e7b98a] text-[#3a2415] font-bold hover:bg-[#f3cfa1]">Update</Button>
                      <Button onClick={handleCancelRefine} variant="outline" className="border-[#e7b98a] text-[#e7b98a] hover:bg-[#2a211d]">Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center text-lg font-medium max-w-2xl mb-4" style={{ color: '#111' }}>{quickTakePrompt}</div>
                    {!responses ? (
                      <div className="flex gap-4">
                        <Button onClick={handleGoAhead} className="bg-[#e7b98a] text-[#3a2415] font-bold hover:bg-[#f3cfa1]">Go Ahead</Button>
                        <Button onClick={handleRefine} variant="outline" className="border-[#e7b98a] text-[#e7b98a] hover:bg-[#2a211d]">Edit</Button>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <Button disabled className="bg-[#e7b98a] text-[#3a2415] font-bold">Go Ahead</Button>
                        <Button disabled variant="outline" className="border-[#e7b98a] text-[#e7b98a]">Edit</Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {isLoading && (
            <section className="mt-12">
               <h2 className="mb-6 animate-pulse text-center text-2xl font-bold">Generating responses for: "{query}"...</h2>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <LoadingCard />
                <LoadingCard />
              </div>
            </section>
          )}

          {responses && !isLoading && (
            <section className="mt-12">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <ResponseCard
                  index={0}
                  title={`Response from ${responseModelNames[0]}`}
                  content={responses.response1}
                  selectedCard={selectedCard}
                  onSelect={handleSelectResponse}
                  contentClassName="font-body"
                />
                <ResponseCard
                  index={1}
                  title={`Response from ${responseModelNames[1]}`}
                  content={responses.response2}
                  selectedCard={selectedCard}
                  onSelect={handleSelectResponse}
                  contentClassName="font-code"
                />
              </div>

              {selectedCard !== null && feedback === null && (
                <div className="mt-8 flex justify-center data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-12 data-[state=open]:duration-500" data-state="open">
                    <Card className="w-full max-w-3xl">
                      <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                          <CardTitle>Feedback</CardTitle>
                          <CardDescription>Help us improve our AI models.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleCloseFeedback}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Why was {responseModelNames[0]} better?</p>
                          <div className="flex flex-wrap gap-2">
                            {positiveFeedbackOptions.map(option => (
                               <Button 
                                  key={option.text} 
                                  variant="outline"
                                  size="sm"
                                  className={cn("rounded-full", {
                                    "bg-primary text-primary-foreground hover:bg-primary/90": positiveTags.includes(option.text),
                                  })}
                                  onClick={() => handlePositiveTagClick(option.text)}
                              >
                                  <option.icon className="mr-2 h-4 w-4" />
                                  {option.text}
                              </Button>
                            ))}
                          </div>
                        </div>
                         <div className="space-y-2">
                          <p className="text-sm font-medium">Why was {responseModelNames[1]} not as good?</p>
                          <div className="flex flex-wrap gap-2">
                            {negativeFeedbackOptions.map(option => (
                               <Button 
                                  key={option.text} 
                                  variant="outline" 
                                  size="sm" 
                                  className={cn("rounded-full", {
                                    "bg-primary text-primary-foreground hover:bg-primary/90": negativeTags.includes(option.text),
                                  })}
                                  onClick={() => handleNegativeTagClick(option.text)}
                               >
                                  <option.icon className="mr-2 h-4 w-4" />
                                  {option.text}
                               </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="feedback-text" className="text-sm font-medium">Write more. Help the AIs get better!</Label>
                          <Textarea 
                              id="feedback-text"
                              placeholder="Provide additional details..."
                              value={detailedFeedback}
                              onChange={e => setDetailedFeedback(e.target.value)}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={handleFeedbackSubmit}>Send feedback</Button>
                      </CardFooter>
                    </Card>
                </div>
              )}

              {feedback !== null && selectedCard !== null && (
                <div className="mt-12">
                  <ScratchCard 
                    rewardAmount={REWARD_AMOUNT}
                    onReveal={handleRewardReveal}
                    width={400}
                    height={100}
                  />
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

interface ResponseCardProps {
  title: string;
  content: string;
  index: number;
  selectedCard: number | null;
  onSelect: (index: number) => void;
  contentClassName?: string;
}

function ResponseCard({ title, content, index, selectedCard, onSelect, contentClassName }: ResponseCardProps) {
  const isSelected = selectedCard === index;
  const selectionMade = selectedCard !== null;
  
  return (
    <Card className={cn("flex flex-col transition-all", isSelected ? "ring-2 ring-primary shadow-lg" : "shadow-sm")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className={cn("text-base leading-relaxed", contentClassName)}>{content}</p>
      </CardContent>
      <CardFooter className="flex-col items-center justify-center gap-4 pt-4">
        {!selectionMade && (
            <Button onClick={() => onSelect(index)} className="w-full">
                <Trophy className="mr-2 h-4 w-4" /> Select as Best Response
            </Button>
        )}
        {selectionMade && isSelected && (
           <Button disabled className="w-full" variant="secondary">
            <CheckCircle className="mr-2 h-4 w-4" /> Selected
          </Button>
        )}
        {selectionMade && !isSelected && (
           <Button disabled className="w-full" variant="secondary">
            <ThumbsUp className="mr-2 h-4 w-4" /> Another response was selected
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function LoadingCard() {
  return (
    <Card className="flex flex-col">
       <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
       <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

function PromptTypeDropdown({ selected, onSelect }: { selected: string; onSelect: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);
  const selectedPrompt = promptTypes.find(p => p.value === selected) || promptTypes[0];
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="flex items-center text-muted-foreground px-2 py-1 rounded-md hover:bg-gray-100 transition min-w-[200px]"
        onClick={() => setOpen(o => !o)}
      >
        <selectedPrompt.icon className="mr-2 h-5 w-5" />
        <span className="font-medium text-base">{selectedPrompt.label}</span>
        <svg className="ml-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-[320px] bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          {promptTypes.map(option => {
            const Icon = option.icon;
            const isSelected = option.value === selected;
            return (
              <button
                key={option.value}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition rounded-xl ${isSelected ? 'bg-gray-100 font-semibold' : ''}`}
                onClick={() => { onSelect(option.value); setOpen(false); }}
                type="button"
              >
                <Icon className="mt-1 h-5 w-5" />
                <div className="flex flex-col flex-1">
                  <span className="text-base">{option.label}</span>
                  <span className="text-xs text-gray-500">{
                    option.value === 'standard' ? 'Recommended for most tasks'
                    : option.value === 'reasoning' ? 'For reasoning tasks (OpenAI o3 model)'
                    : option.value === 'deep-research' ? 'For web-based research'
                    : option.value === 'custom' ? 'Design your own website or ai agents'
                    : ''
                  }</span>
                </div>
                {isSelected && <svg className="w-5 h-5 text-primary ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ModelDropdown({ selected, onSelect }: { selected: string; onSelect: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Trending models for dropdown (each as a unique value)
  const trendingModels = [
    {
      value: 'OpenAI o1-mini|Groq Deepseek',
      color: 'text-[#d12b7c]',
      icon: <Waves className="w-5 h-5 text-[#d12b7c] mr-2" />, // MiniMax
      main: 'OpenAI o1-mini',
      sub: 'Groq Deepseek',
    },
    {
      value: 'Groq Deepseek|Nvidia A100',
      color: 'text-[#3b82f6]',
      icon: <CircleDot className="w-5 h-5 text-[#3b82f6] mr-2" />, // DeepSeek
      main: 'Groq Deepseek',
      sub: 'Nvidia A100',
    },
    {
      value: 'Nvidia A100|Google Gemini 2.0',
      color: 'text-[#b3a16c]',
      icon: <Triangle className="w-5 h-5 text-[#b3a16c] mr-2" />, // FLUX
      main: 'Nvidia A100',
      sub: 'Google Gemini 2.0',
    },
    {
      value: 'Google Gemini 2.0|OpenAi o1-mini',
      color: 'text-[#b37c5a]',
      icon: <Sun className="w-5 h-5 text-[#b37c5a] mr-2" />, // Arcee/Claude
      main: 'Google Gemini 2.0',
      sub: 'OpenAi o1-mini',
    },
  ];
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);
  // Find the selected trending model for button label
  const selectedTrending = trendingModels.find(m => m.value === selected) || null;
  return (
    <div className="relative ml-2" ref={ref}>
      <button
        type="button"
        className="rounded-full border border-[#d6c7bc] bg-[#ede3db] text-[#3a2415] px-5 py-1.5 text-base font-medium shadow-sm hover:bg-[#e5d6c8] transition flex items-center min-w-[170px]"
        onClick={() => setOpen(o => !o)}
      >
        {selectedTrending ? (
          <span className="flex items-center">
            {selectedTrending.icon}
            <span className={`font-semibold ml-1 ${selectedTrending.color}`}>{selectedTrending.main}</span>
            <span className="ml-2 text-xs text-[#bfa77a]">{selectedTrending.sub}</span>
          </span>
        ) : 'Choose models'}
        <svg className="ml-2 w-4 h-4 text-[#3a2415]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-[340px] bg-[#ede3db] border border-[#d6c7bc] rounded-xl shadow-xl z-50 py-2">
          <div className="mb-2 px-2">
            <div className="text-xs font-bold text-[#bfa77a] mb-1 pl-1 tracking-wide">TRENDING MODEL PICKS</div>
            <div className="flex flex-col gap-2">
              {trendingModels.map((item, idx) => (
                <button
                  key={item.value}
                  className={`flex flex-col items-start w-full rounded-lg px-4 py-3 border transition ${selected === item.value ? 'bg-[#e5d6c8] border-[#bfa77a]' : 'bg-[#e7e1d7] border-transparent'} shadow`}
                  onClick={() => { onSelect(item.value); setOpen(false); }}
                  type="button"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <span className={`font-semibold text-base ${item.color}`}>{item.main}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-7">
                    <svg className="w-4 h-4 text-[#bfa77a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>
                    <span className="text-[#bfa77a] text-sm">{item.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
