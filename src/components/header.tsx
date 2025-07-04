'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { ReasonVerseLogo } from './icons';
import { Coins, LogOut, User, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from "react";

function AuthButton() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium">
          <Coins className="h-4 w-4 text-accent" />
          <span>{user.tokens} Tokens</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button onClick={() => router.push('/login')}>
      Login / Sign Up
    </Button>
  );
}

const promptOptions = [
  {
    label: "Standard Prompt",
    description: "Recommended for most tasks",
    value: "standard",
  },
  {
    label: "Reasoning Prompt",
    description: "For reasoning tasks (OpenAI o3 model)",
    value: "reasoning",
  },
  {
    label: "Deep Research Prompt",
    description: "For web-based research",
    value: "deep-research",
  },
  {
    label: "Custom GPT/Agent Prompt",
    description: "Design your own Custom GPTs or AI Agents",
    value: "custom",
  },
];

export interface PromptDropdownProps {
  selected: string;
  onSelect: (value: string) => void;
}

export function PromptDropdown({ selected, onSelect }: PromptDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && event.target instanceof Node && ref.current.contains) {
        if (!ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = promptOptions.find((opt) => opt.value === selected) || promptOptions[0];

  return (
    <div className="relative w-72" ref={ref}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <div>
          <div className="font-semibold">{current.label}</div>
          <div className="text-xs text-gray-500">{current.description}</div>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {promptOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${
                option.value === selected ? "bg-gray-100" : ""
              }`}
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              type="button"
            >
              <div className="font-semibold">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header({ onHamburgerClick }: { onHamburgerClick?: () => void }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <button
          onClick={onHamburgerClick}
          className="mr-2 flex items-center justify-center h-10 w-10 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <ReasonVerseLogo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              ReasonVerse
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
