import { ChatMessage } from "@/hooks/useChatMessages";
import { format } from "date-fns";
import { Bot, User } from "lucide-react";

interface Props {
  message: ChatMessage;
}

const MessageBubble = ({ message }: Props) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-2 px-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex max-w-[75%] flex-col gap-1">
        <div
          className={`rounded-2xl px-4 py-2.5 shadow-sm ${
            isUser
              ? "bg-chat-user text-chat-user-foreground rounded-tr-sm"
              : "bg-chat-bot text-chat-bot-foreground rounded-tl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className={`text-[10px] text-muted-foreground ${isUser ? "text-right" : "text-left"}`}>
          {format(message.timestamp, "h:mm a")}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
