"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Loader2, Send, X, Volume2, Play } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getChatResponse, getTextToSpeech } from "@/app/dashboard/chat/actions";
import { cn } from "@/lib/utils";
import type { MessageData } from "genkit/generate";

type ChatMessage = MessageData & {
    audio?: string;
    isPlaying?: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: [{ text: input }] };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput("");
    setIsLoading(true);

    const historyForAPI = currentMessages.map(({ isPlaying, audio, ...rest }) => {
        // Genkit expects role and content, where content is an array of parts.
        return {
            role: rest.role,
            content: rest.content,
        };
    });

    // Remove the latest message from history, as it is the current prompt
    const history = historyForAPI.slice(0, -1);


    const result = await getChatResponse(
      history,
      input
    );

    setIsLoading(false);

    if (result.success) {
      const modelMessage: ChatMessage = { role: "model", content: [{ text: result.message }] };
      setMessages((prev) => [...prev, modelMessage]);
    } else {
       const errorMessage: ChatMessage = { role: "model", content: [{ text: result.error ?? 'Sorry, something went wrong.' }] };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handlePlayAudio = async (messageIndex: number) => {
    const message = messages[messageIndex];
    if (!message || message.role !== 'model') return;

    if (message.isPlaying) {
      audioRef.current?.pause();
      setMessages(prev => prev.map((m, i) => i === messageIndex ? { ...m, isPlaying: false } : m));
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      setMessages(prev => prev.map(m => ({ ...m, isPlaying: false })));
    }

    if (message.audio) {
      playAudio(message.audio, messageIndex);
    } else {
      const textContent = message.content.find(c => c.text)?.text;
      if (!textContent) return;
      const result = await getTextToSpeech(textContent);
      if (result.success && result.audioData) {
        setMessages(prev => prev.map((m, i) => i === messageIndex ? { ...m, audio: result.audioData } : m));
        playAudio(result.audioData, messageIndex);
      }
    }
  };

  const playAudio = (audioData: string, messageIndex: number) => {
    if(audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current = null;
    }
    const audio = new Audio(audioData);
    audioRef.current = audio;
    audio.play();
    setMessages(prev => prev.map((m, i) => i === messageIndex ? { ...m, isPlaying: true } : { ...m, isPlaying: false }));
    audio.onended = () => {
      setMessages(prev => prev.map((m, i) => i === messageIndex ? { ...m, isPlaying: false } : m));
    };
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
          >
            {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
            <span className="sr-only">Toggle Chat</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-[400px] h-[500px] flex flex-col p-0 mr-4 mb-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <h3 className="text-lg font-semibold">AI Assistant</h3>
          </div>
          <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
            <div className="space-y-4 p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "model" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[80%]",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <div className="prose prose-sm">
                      <ReactMarkdown>{msg.content[0].text}</ReactMarkdown>
                    </div>
                    {msg.role === 'model' && (
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 mt-1"
                        onClick={() => handlePlayAudio(index)}
                        >
                        {msg.isPlaying ? <Volume2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        <span className="sr-only">Read aloud</span>
                        </Button>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask anything..."
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
