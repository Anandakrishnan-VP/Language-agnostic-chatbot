import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GraduationCap, DollarSign, Award, Calendar, FileText, Trash2, Sun, Moon } from "lucide-react";
import { translations } from "@/utils/translations";

interface Props {
  language: string;
  onLanguageChange: (lang: string) => void;
  onQuickAction: (query: string) => void;
  onClearChat: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const AppSidebar = ({ language, onLanguageChange, onQuickAction, onClearChat, isDark, onToggleTheme }: Props) => {
  const t = translations[language] || translations.en;

  const quickActions = [
    { label: t.feesInfo, query: "Tell me about the fee structure", icon: DollarSign },
    { label: t.scholarships, query: "What scholarships are available?", icon: Award },
    { label: t.calendar, query: "Show me the academic calendar", icon: Calendar },
    { label: t.policies, query: "What are the campus policies?", icon: FileText },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिन्दी (Hindi)" },
    { value: "mr", label: "मराठी (Marathi)" },
    { value: "bn", label: "বাংলা (Bengali)" },
    { value: "ta", label: "தமிழ் (Tamil)" },
    { value: "te", label: "తెలుగు (Telugu)" },
    { value: "ml", label: "മലയാളം (Malayalam)" },
    { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { value: "gu", label: "ગુજરાતી (Gujarati)" },
    { value: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
    { value: "ur", label: "اردو (Urdu)" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">{t.appName}</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.quickActions}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.label}>
                  <SidebarMenuButton onClick={() => onQuickAction(action.query)} tooltip={action.label}>
                    <action.icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t.language}</SidebarGroupLabel>
          <SidebarGroupContent className="px-2 group-data-[collapsible=icon]:hidden">
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 group-data-[collapsible=icon]:hidden">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onToggleTheme} className="flex-1">
            {isDark ? <Sun className="mr-1 h-4 w-4" /> : <Moon className="mr-1 h-4 w-4" />}
            {isDark ? t.light : t.dark}
          </Button>
          <Button variant="outline" size="sm" onClick={onClearChat} className="flex-1">
            <Trash2 className="mr-1 h-4 w-4" />
            {t.clear}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
