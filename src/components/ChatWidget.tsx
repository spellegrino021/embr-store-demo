import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ChatWidget.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    // Add an empty assistant message that we'll stream into
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(threadId ? { threadId } : {}),
          messages: updatedMessages
            .filter((m) => m.content.trim() !== '')
            .map((m) => ({
              role: m.role,
              content: m.content,
            })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);

          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === 'token' && parsed.content) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.content,
                  };
                }
                return updated;
              });
            } else if (parsed.type === 'thread' && parsed.threadId) {
              setThreadId(parsed.threadId);
            } else if (parsed.type === 'error') {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    content: `⚠️ ${parsed.error || 'An error occurred'}`,
                  };
                }
                return updated;
              });
            }
          } catch {
            // Skip unparseable SSE lines
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === 'assistant' && !last.content) {
          updated[updated.length - 1] = {
            ...last,
            content: `⚠️ Failed to connect. Check your config.`,
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, isStreaming, messages, threadId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          className={styles.fab}
          onClick={() => setIsOpen(true)}
          aria-label="Chat with our agent"
        >
          <span className={styles.fabIcon}>💬</span>
          <span className={styles.fabLabel}>Chat with an agent</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.headerInfo}>
              <span className={styles.headerDot} />
              <span className={styles.headerTitle}>Ember Roast Agent</span>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className={styles.messageArea}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>☕</span>
                <p>Hi! Ask me about our coffee, brewing tips, or your order.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${
                  msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div className={styles.messageBubble}>{msg.content}</div>
              </div>
            ))}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={`${styles.messageBubble} ${styles.typing}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
            />
            <button
              className={styles.sendBtn}
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
