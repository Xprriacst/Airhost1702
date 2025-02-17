import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography,
  Paper,
  Alert,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Message {
  id: string;
  content: string;
  created_at: string;
  direction: 'inbound' | 'outbound';
}

interface Template {
  id: string;
  namespace: string;
  name: string;
  language: string;
}

interface ChatWindowProps {
  conversationId: string;
  guestNumber: string;
  propertyName: string;
  conversationStartTime: string;
}

export default function ChatWindow({ 
  conversationId, 
  guestNumber,
  propertyName,
  conversationStartTime 
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOutsideWindow, setIsOutsideWindow] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    loadTemplates();
    checkMessageWindow();

    // Souscrire aux nouveaux messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur lors du chargement des messages:', error);
      return;
    }

    setMessages(data || []);
    scrollToBottom();
  };

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('language', 'fr');

    if (error) {
      console.error('Erreur lors du chargement des templates:', error);
      return;
    }

    setTemplates(data || []);
  };

  const checkMessageWindow = () => {
    const startTime = new Date(conversationStartTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    setIsOutsideWindow(hoursDiff > 24);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.rpc('send_whatsapp_message', {
        p_conversation_id: conversationId,
        p_content: newMessage
      });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const handleSendTemplate = async (template: Template) => {
    try {
      const { error } = await supabase.rpc('send_whatsapp_template', {
        p_conversation_id: conversationId,
        p_template_namespace: template.namespace,
        p_template_name: template.name
      });

      if (error) throw error;

      setAnchorEl(null);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du template:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 800 }}>
      {/* En-tête */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">{guestNumber}</Typography>
            <Typography variant="body2" color="text.secondary">
              {propertyName}
            </Typography>
          </Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Menu des templates */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Typography variant="subtitle2">Templates de message</Typography>
        </MenuItem>
        {templates.map((template) => (
          <MenuItem 
            key={template.id}
            onClick={() => handleSendTemplate(template)}
          >
            {template.namespace}.{template.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Messages */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              alignSelf: message.direction === 'outbound' ? 'flex-end' : 'flex-start',
              maxWidth: '70%'
            }}
          >
            <Paper
              sx={{
                p: 1,
                bgcolor: message.direction === 'outbound' ? 'primary.main' : 'grey.100',
                color: message.direction === 'outbound' ? 'white' : 'text.primary'
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5,
                  opacity: 0.8
                }}
              >
                {new Date(message.created_at).toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Zone de saisie */}
      {isOutsideWindow ? (
        <Alert 
          severity="warning" 
          action={
            <Button
              color="inherit"
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              Utiliser un template
            </Button>
          }
        >
          La fenêtre de 24h est dépassée. Vous devez utiliser un template.
        </Alert>
      ) : (
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
