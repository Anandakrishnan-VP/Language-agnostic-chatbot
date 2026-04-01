

# Multilingual Campus Chatbot UI

## Layout
- **Sidebar** (left, collapsible): "Campus Assistant" title, quick-action buttons (Fees Info, Scholarships, Academic Calendar, Policies), language selector dropdown (English/Hindi/Malayalam/Tamil), dark/light mode toggle, clear chat button
- **Main Chat Area** (right): centered chat window with message bubbles, typing indicator, auto-scroll, input bar at bottom

## Components
1. **AppSidebar** — branding, quick buttons, language picker, theme toggle, clear chat
2. **ChatWindow** — scrollable message list with user (right) and bot (left) bubbles, timestamps, typing indicator ("Bot is typing…")
3. **ChatInput** — text input + send button, Enter to send, placeholder "Ask about fees, scholarships, schedules…"
4. **MessageBubble** — styled differently for user vs bot, with timestamp
5. **TypingIndicator** — animated dots shown while awaiting response

## API Integration
- POST to `http://localhost:8000/chat` with `{ message, language }`
- Fallback: if API unavailable, return a dummy response after 1s delay
- Error state: "Server unavailable. Please try again later." shown as a bot message
- Loading spinner / typing indicator while waiting

## Chat State (React context/hook)
- `useChatMessages` hook: manages messages array, selected language, send function, clear function
- Each message: `{ id, role, content, timestamp }`

## Design
- Primary color: Blue (`hsl(217, 91%, 60%)`)
- Soft shadows, rounded corners, clean ChatGPT-like aesthetic
- Dark/light mode via Tailwind dark class toggle
- Fully responsive: sidebar collapses on mobile with hamburger trigger

## Pages
- Single page (`/`) with SidebarProvider wrapping sidebar + chat area

