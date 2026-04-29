'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { findFAQAnswer, QUICK_QUESTIONS } from '@/lib/faq';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  suggestions?: string[];
}

function getPageContext(pathname: string): string {
  if (pathname === '/') return 'landing page YUBOT';
  if (pathname.startsWith('/generate')) return 'page de génération de scripts';
  if (pathname.startsWith('/library')) return 'bibliothèque de patterns viraux';
  if (pathname.startsWith('/scripts')) return 'historique des scripts';
  return 'dashboard YUBOT';
}

function getWelcomeMessage(pathname: string): string {
  if (pathname.startsWith('/generate')) {
    return "Tu veux générer un script ? Je peux t'aider à choisir le bon ton, la bonne durée, ou expliquer les options.";
  }
  if (pathname.startsWith('/library')) {
    return "Tu consultes la bibliothèque ? Je peux t'expliquer comment lire et utiliser les patterns viraux.";
  }
  return "Salut. Je peux t'aider sur YUBOT, les scripts viraux, ou comment optimiser ta chaîne. Pose ta question.";
}

const CHAT_STYLES = `
  @keyframes yubotPulse {
    0%, 75%, 100% { box-shadow: 0 0 0 0 rgba(255,230,0,0); }
    85% { box-shadow: 0 0 0 10px rgba(255,230,0,0.2); }
    90% { box-shadow: 0 0 0 14px rgba(255,230,0,0); }
  }
  .yubot-btn-pulse { animation: yubotPulse 5s ease-in-out infinite; }

  @keyframes chatSlideIn {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  .chat-slide-in { animation: chatSlideIn 0.22s ease-out forwards; }

  @keyframes dotBounce {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.75); }
    40%           { opacity: 1;   transform: scale(1); }
  }
  .dot-1 { animation: dotBounce 1.2s ease-in-out infinite 0s; }
  .dot-2 { animation: dotBounce 1.2s ease-in-out infinite 0.2s; }
  .dot-3 { animation: dotBounce 1.2s ease-in-out infinite 0.4s; }
`;

export function ChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset conversation when page changes
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'bot',
      content: getWelcomeMessage(pathname),
      suggestions: QUICK_QUESTIONS.slice(0, 4),
    }]);
  }, [pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || isStreaming) return;

    setMessages(prev => [...prev, { id: `u${Date.now()}`, role: 'user', content: trimmed }]);
    setInput('');
    setIsStreaming(true);

    // Try FAQ first
    const faqMatch = findFAQAnswer(trimmed);
    if (faqMatch) {
      await new Promise(r => setTimeout(r, 250));
      setMessages(prev => [...prev, {
        id: `b${Date.now()}`,
        role: 'bot',
        content: faqMatch.answer,
        suggestions: faqMatch.suggestions,
      }]);
      setIsStreaming(false);
      return;
    }

    // Stream from API
    const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
    const botId = `b${Date.now()}`;
    setMessages(prev => [...prev, { id: botId, role: 'bot', content: '' }]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history, pageContext: getPageContext(pathname) }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error('api');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          content += decoder.decode(value, { stream: true });
          const snap = content;
          setMessages(prev => prev.map(m => m.id === botId ? { ...m, content: snap } : m));
        }
      }
    } catch (err: unknown) {
      if (!(err instanceof Error && err.name === 'AbortError')) {
        setMessages(prev => prev.map(m =>
          m.id === botId
            ? { ...m, content: "Une erreur s'est produite. Réessaie ou contacte hello@yubot.com." }
            : m
        ));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [isStreaming, messages, pathname]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  };

  return (
    <>
      <style>{CHAT_STYLES}</style>

      {/* Chat window */}
      {isOpen && (
        <div
          className="chat-slide-in fixed z-50 flex flex-col bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            bottom: '88px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
            height: 'min(600px, calc(100dvh - 120px))',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1E1E1E] bg-[#0A0A0A] shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#FFE600] flex items-center justify-center shrink-0">
              <span className="text-[#0A0A0A] font-bold text-sm font-mono">Y</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#F5F0E8] leading-none mb-1">YUBOT Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></span>
                <span className="text-[10px] text-[#6B6560]">En ligne</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#3A3A3A] hover:text-[#F5F0E8] transition-colors p-1 -mr-1"
              aria-label="Fermer"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'bot' && (
                  <div className="w-6 h-6 rounded bg-[#FFE600] flex items-center justify-center shrink-0 mt-1">
                    <span className="text-[#0A0A0A] font-bold text-[9px] font-mono">Y</span>
                  </div>
                )}
                <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[82%]`}>
                  <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#FFE600] text-[#0A0A0A] font-medium rounded-tr-sm'
                      : 'bg-[#1A1A1A] text-[#C4BFB7] border border-[#222] rounded-tl-sm'
                  }`}>
                    {msg.content ? msg.content : (
                      <span className="flex gap-1 items-center py-0.5 px-1">
                        <span className="dot-1 w-1.5 h-1.5 rounded-full bg-[#6B6560] inline-block"></span>
                        <span className="dot-2 w-1.5 h-1.5 rounded-full bg-[#6B6560] inline-block"></span>
                        <span className="dot-3 w-1.5 h-1.5 rounded-full bg-[#6B6560] inline-block"></span>
                      </span>
                    )}
                  </div>

                  {msg.suggestions && msg.suggestions.length > 0 && !isStreaming && (
                    <div className="space-y-1 w-full">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(s)}
                          className="block w-full text-left text-xs text-[#6B6560] hover:text-[#FFE600] border border-[#1E1E1E] hover:border-[#FFE600]/20 hover:bg-[#FFE600]/5 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          › {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-[#1E1E1E] px-3 py-3 shrink-0 bg-[#0A0A0A]">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Pose ta question..."
                rows={1}
                maxLength={500}
                disabled={isStreaming}
                className="flex-1 bg-[#111111] border border-[#1E1E1E] rounded-xl px-3 py-2 text-sm text-[#F5F0E8] placeholder-[#3A3A3A] focus:outline-none focus:border-[#FFE600]/30 focus:ring-1 focus:ring-[#FFE600]/10 resize-none transition-colors disabled:opacity-40 leading-relaxed"
                style={{ minHeight: '38px', maxHeight: '100px', overflowY: 'auto' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="w-9 h-9 rounded-xl bg-[#FFE600] text-[#0A0A0A] flex items-center justify-center hover:bg-[#FFE600]/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0 active:scale-95"
                aria-label="Envoyer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            {input.length > 400 && (
              <p className="text-[10px] text-[#3A3A3A] mt-1 text-right">{input.length}/500</p>
            )}
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className={`yubot-btn-pulse fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95 ${
          isOpen
            ? 'bg-[#1A1A1A] border border-[#2E2E2E] text-[#F5F0E8] hover:bg-[#222]'
            : 'bg-[#FFE600] text-[#0A0A0A] hover:scale-105 shadow-[0_0_24px_rgba(255,230,0,0.2)]'
        }`}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir YUBOT Assistant'}
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>
    </>
  );
}
