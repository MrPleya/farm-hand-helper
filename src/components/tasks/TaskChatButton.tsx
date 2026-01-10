import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface TaskChatButtonProps {
  taskId: string;
  taskTitle: string;
  animalName?: string;
}

export function TaskChatButton({ taskId, taskTitle, animalName }: TaskChatButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleOpenChat = async () => {
    if (!isOnline) {
      toast({
        title: 'Offline',
        description: 'Chat requires an internet connection',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Check if room already exists for this task
      const { data: existingRoom, error: fetchError } = await supabase
        .from('chat_rooms')
        .select('share_code')
        .eq('task_id', taskId)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (existingRoom) {
        setShareCode(existingRoom.share_code);
        setShowShareDialog(true);
      } else {
        // Create new room
        const { data: newRoom, error: createError } = await supabase
          .from('chat_rooms')
          .insert({
            task_id: taskId,
            task_title: taskTitle,
            animal_name: animalName || null,
          })
          .select('share_code')
          .single();

        if (createError) {
          throw createError;
        }

        setShareCode(newRoom.share_code);
        setShowShareDialog(true);
      }
    } catch (error) {
      console.error('Error creating/fetching chat room:', error);
      toast({
        title: 'Error',
        description: 'Could not open chat room',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const shareLink = shareCode ? `${window.location.origin}/chat?code=${shareCode}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: 'Link Copied!',
      description: 'Share this link with your workers',
    });
  };

  const openChat = () => {
    setShowShareDialog(false);
    navigate(`/chat?code=${shareCode}`);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenChat}
        disabled={loading || !isOnline}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MessageSquare className="w-4 h-4" />
        )}
        Chat
      </Button>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Chat Created</DialogTitle>
            <DialogDescription>
              Share this link with your workers so they can join the chat
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Task:</p>
              <p className="text-sm text-muted-foreground">{taskTitle}</p>
              {animalName && (
                <>
                  <p className="text-sm font-medium mb-1 mt-2">Animal:</p>
                  <p className="text-sm text-muted-foreground">{animalName}</p>
                </>
              )}
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Share Link:</p>
              <p className="text-xs text-muted-foreground break-all mb-2">{shareLink}</p>
              <Button onClick={copyLink} variant="secondary" size="sm" className="w-full gap-2">
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
            </div>

            <Button onClick={openChat} className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              Open Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
