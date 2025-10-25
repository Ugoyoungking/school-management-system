"use client";

import { useState } from "react";
import { Bot, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getChatResponse } from "@/app/dashboard/chat/actions";
import { cn } from "@/lib/utils";
import type { MessageData } from "genkit/generate";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: MessageData = { role: "user", content: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const result = await getChatResponse(
      [...messages, userMessage],
      input
    );

    setIsLoading(false);

    if (result.success) {
      const modelMessage: MessageData = { role: "model", content: [{ text: result.message }] };
      setMessages((prev) => [...prev, modelMessage]);
    } else {
       const errorMessage: MessageData = { role: "model", content: [{ text: result.error ?? 'Sorry, something went wrong.' }] };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
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
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
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
                  <p className="text-sm">{msg.content[0].text}</p>
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
                    <Loader2 className="h-5 w-5 animate-spin"/>
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
  );
}
