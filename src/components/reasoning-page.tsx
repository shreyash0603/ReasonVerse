'use client';

import { useState } from 'react';
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
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      if (data.success) {
        setResponses({ response1: data.response1, response2: data.response2 });
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

  const handleSelectChat = (chat: any) => {
    setQuery(chat.userMessage);
    setResponses({ response1: chat.aiMessage, response2: '' });
    setSidebarOpen(false);
  };

  const selectedModelName = selectedCard !== null ? modelNames[selectedCard] : '';
  const unselectedModelName = selectedCard !== null ? modelNames[selectedCard === 0 ? 1 : 0] : '';


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
            <form onSubmit={handleSubmitQuery} className="mx-auto max-w-3xl">
              <div className="relative rounded-2xl border bg-card text-card-foreground shadow-sm focus-within:ring-2 focus-within:ring-ring/80">
                <Textarea
                  placeholder="I want a prompt that will..."
                  className="min-h-[120px] w-full resize-none border-0 bg-transparent p-4 pb-14 text-base focus-visible:ring-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <Button variant="ghost" size="sm" type="button" className="text-muted-foreground">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Standard Prompt
                  </Button>
                  <Button type="submit" size="icon" variant="secondary" className="rounded-lg" disabled={isLoading}>
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
          </section>

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
                  title={`Response from ${modelNames[0]}`}
                  content={responses.response1}
                  selectedCard={selectedCard}
                  onSelect={handleSelectResponse}
                  contentClassName="font-body"
                />
                <ResponseCard
                  index={1}
                  title={`Response from ${modelNames[1]}`}
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
                          <p className="text-sm font-medium">Why was {selectedModelName} better?</p>
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
                          <p className="text-sm font-medium">Why was {unselectedModelName} not as good?</p>
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
