import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, ArrowLeft, Copy, Share2, MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatRoom {
  id: string;
  task_id: string;
  task_title: string;
  animal_name: string | null;
  share_code: string;
  created_at: string;
  is_active: boolean;
}

interface ChatMessage {
  id: string;
  room_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  created_at: string;
}

export default function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const shareCode = searchParams.get('code');
  
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load room and messages
  useEffect(() => {
    if (!shareCode || !isOnline) {
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('share_code', shareCode)
        .maybeSingle();

      if (roomError) {
        console.error('Error fetching room:', roomError);
        toast({
          title: 'Error',
          description: 'Could not load chat room',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (!roomData) {
        toast({
          title: 'Not Found',
          description: 'Chat room not found',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      setRoom(roomData);

      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomData.id)
        .order('created_at', { ascending: true });

      if (!messagesError && messagesData) {
        setMessages(messagesData);
      }

      setLoading(false);
    };

    fetchRoom();

    // Check for saved name
    const savedName = localStorage.getItem('chat_sender_name');
    if (savedName) {
      setSenderName(savedName);
      setIsNameSet(true);
    }
  }, [shareCode, isOnline, toast]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!room || !isOnline) return;

    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, isOnline]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSetName = () => {
    if (senderName.trim()) {
      localStorage.setItem('chat_sender_name', senderName.trim());
      setIsNameSet(true);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !room || !isOnline) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase.from('chat_messages').insert({
      room_id: room.id,
      sender_name: senderName,
      sender_role: 'worker',
      content: messageContent,
    });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      setNewMessage(messageContent);
    }
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/chat?code=${room?.share_code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied!',
      description: 'Share this link with your workers',
    });
  };

  if (!isOnline) {
    return (
      <MobileLayout title="Chat">
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <WifiOff className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">You're Offline</h2>
          <p className="text-muted-foreground mb-4">
            Chat requires an internet connection. Other features like Tasks, Notes, and Animals work offline.
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </MobileLayout>
    );
  }

  if (!shareCode) {
    return (
      <MobileLayout title="Chat">
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No Chat Room</h2>
          <p className="text-muted-foreground mb-4">
            Start a chat from a task to discuss it with your workers.
          </p>
          <Button onClick={() => navigate('/tasks')}>
            Go to Tasks
          </Button>
        </div>
      </MobileLayout>
    );
  }

  if (loading) {
    return (
      <MobileLayout title="Chat">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading chat...</div>
        </div>
      </MobileLayout>
    );
  }

  if (!isNameSet) {
    return (
      <MobileLayout title="Join Chat">
        <div className="flex flex-col items-center justify-center h-full p-6">
          <Card className="w-full max-w-sm p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Enter Your Name</h2>
            <p className="text-muted-foreground text-sm mb-4 text-center">
              This will be shown to others in the chat
            </p>
            <Input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your name..."
              className="mb-4"
              onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
            />
            <Button onClick={handleSetName} className="w-full" disabled={!senderName.trim()}>
              Join Chat
            </Button>
          </Card>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg truncate max-w-[200px]">
                {room?.task_title}
              </h1>
              {room?.animal_name && (
                <p className="text-xs opacity-80">{room.animal_name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-green-300" />
            <Button
              variant="ghost"
              size="icon"
              onClick={copyShareLink}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_name === senderName;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        {msg.sender_name}
                        {msg.sender_role === 'farmer' && ' (Farmer)'}
                      </p>
                    )}
                    <p className="break-words">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'opacity-70' : 'text-muted-foreground'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
