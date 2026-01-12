import { Send, Phone, MessageSquare, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { EmergencyDamageDialog } from "./EmergencyDamageDialog";

export function SupportChat() {
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  const messages = [
    {
      id: 1,
      type: 'support',
      sender: 'Support Agent',
      content: 'Hello! How can I help you today?',
      time: '10:30 AM',
    },
    {
      id: 2,
      type: 'user',
      sender: 'You',
      content: 'Hi, I have a question about extending my rental period.',
      time: '10:31 AM',
    },
    {
      id: 3,
      type: 'support',
      sender: 'Support Agent',
      content: 'I\'d be happy to help you with that! Could you please provide your booking ID?',
      time: '10:32 AM',
    },
    {
      id: 4,
      type: 'user',
      sender: 'You',
      content: 'Sure, it\'s BK-2026-0015',
      time: '10:32 AM',
    },
    {
      id: 5,
      type: 'support',
      sender: 'Support Agent',
      content: 'Thank you! I can see your booking for the Tesla Model 3. How many additional days would you like to extend?',
      time: '10:33 AM',
    },
  ];

  return (
    <div className="container px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-muted-foreground">We're here to help 24/7</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary/20 bg-gradient-to-br from-[#7c3aed]/10 to-transparent cursor-pointer hover:border-primary/40 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#7c3aed]/20">
                <Phone className="h-6 w-6 text-[#7c3aed]" />
              </div>
              <div>
                <h4>Call Support</h4>
                <p className="text-sm text-muted-foreground">1-800-WHEELIO</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-[#ec4899]/10 to-transparent cursor-pointer hover:border-primary/40 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#ec4899]/20">
                <MessageSquare className="h-6 w-6 text-[#ec4899]" />
              </div>
              <div>
                <h4>Live Chat</h4>
                <p className="text-sm text-muted-foreground">Avg. 2 min wait</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-destructive/20 bg-gradient-to-br from-destructive/10 to-transparent cursor-pointer hover:border-destructive/40 transition-colors"
            onClick={() => setShowEmergencyDialog(true)}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/20">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h4>Emergency</h4>
                <p className="text-sm text-muted-foreground">Report damage</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="border-primary/20">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899]">
                  SA
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Support Chat</CardTitle>
                <p className="text-sm text-muted-foreground">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#10b981] mr-2"></span>
                  Online
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea className="h-[400px] p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] ${message.type === 'user'
                          ? 'bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white'
                          : 'bg-muted'
                        } rounded-lg p-4 space-y-1`}
                    >
                      <p className={`text-sm ${message.type === 'user' ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {message.sender}
                      </p>
                      <p>{message.content}</p>
                      <p className={`text-xs ${message.type === 'user' ? 'text-white/60' : 'text-muted-foreground'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border/40">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:opacity-90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <h4>How do I extend my rental period?</h4>
              <p className="text-sm text-muted-foreground">
                You can extend your rental through your dashboard or by contacting our support team.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <h4>What happens if I return the vehicle late?</h4>
              <p className="text-sm text-muted-foreground">
                Late returns incur a fee of $25 per hour. Please contact us if you expect to be late.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <h4>How do I report damage or issues?</h4>
              <p className="text-sm text-muted-foreground">
                Use the emergency button in your dashboard or call our 24/7 support line immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Damage Dialog */}
      <EmergencyDamageDialog
        open={showEmergencyDialog}
        onOpenChange={setShowEmergencyDialog}
      />
    </div>
  );
}