import { useState, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const DUMMY_RESPONSES: Record<string, string> = {
  en: "I'm currently in demo mode. Once the backend is connected, I'll be able to help you with campus-related queries about fees, scholarships, academic calendars, and more!",
  hi: "मैं वर्तमान में डेमो मोड में हूँ। बैकएंड कनेक्ट होने पर, मैं शुल्क, छात्रवृत्ति, शैक्षणिक कैलेंडर और अन्य परिसर संबंधित प्रश्नों में आपकी सहायता कर सकूँगा!",
  ml: "ഞാൻ ഇപ്പോൾ ഡെമോ മോഡിലാണ്. ബാക്കെൻഡ് കണക്റ്റ് ചെയ്തുകഴിഞ്ഞാൽ, ഫീസ്, സ്കോളർഷിപ്പ്, അക്കാദമിക് കലണ്ടർ എന്നിവയെക്കുറിച്ചുള്ള ചോദ്യങ്ങൾക്ക് ഞാൻ സഹായിക്കാം!",
  ta: "நான் தற்போது டெமோ பயன்முறையில் உள்ளேன். பின்னணி இணைக்கப்பட்டதும், கட்டணங்கள், உதவித்தொகைகள், கல்வி நாட்காட்டி போன்றவை குறித்த கேள்விகளுக்கு உதவ முடியும்!",
};

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      content: "👋 Hello! I'm your Campus Assistant. Ask me about fees, scholarships, academic calendar, policies, and more!",
      timestamp: new Date(),
    },
  ]);
  const [language, setLanguage] = useState("en");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const res = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, language }),
        });

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        const botMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "bot",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        // Fallback dummy response
        await new Promise((r) => setTimeout(r, 1000));
        const botMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "bot",
          content: DUMMY_RESPONSES[language] || DUMMY_RESPONSES.en,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [language]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "bot",
        content: "👋 Hello! I'm your Campus Assistant. Ask me about fees, scholarships, academic calendar, policies, and more!",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, language, setLanguage, sendMessage, clearChat, isTyping };
}
