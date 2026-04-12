import { useState, useEffect } from 'react';
import { Mail, MailOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await base44.entities.ContactMessage.list('-created_date', 200);
    setMessages(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markRead(msg) {
    await base44.entities.ContactMessage.update(msg.id, { read: !msg.read });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-gold mb-6">Mensajes</h1>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
      ) : messages.length === 0 ? (
        <p className="font-body text-foreground/40 text-center py-12">No hay mensajes.</p>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`gradient-card border rounded-xl p-5 transition-all ${msg.read ? 'border-gold/5 opacity-60' : 'border-gold/20'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-heading text-foreground text-sm">{msg.name}</p>
                  <p className="font-body text-foreground/40 text-xs">{msg.email}</p>
                </div>
                <button onClick={() => markRead(msg)} className="text-foreground/30 hover:text-gold transition-colors">
                  {msg.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </button>
              </div>
              <p className="font-body text-foreground/70 text-sm">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}