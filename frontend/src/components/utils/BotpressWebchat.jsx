import { useEffect } from 'react';

const botId = import.meta.env.VITE_BOTPRESS_BOT_ID
const clientId = import.meta.env.VITE_BOTPRESS_CLIENT_ID

const BotpressWebchat = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
    script.async = true;

    script.onload = () => {
      if (!window.botpress) return;

      window.botpress.init({
        botId: botId,
        clientId: clientId,
        selector: '#webchat',
        user: {
          data: {
            user_id: localStorage.getItem('user_id'),
          }
        },
        configuration: {
          color: '#3B82F6',
          themeMode: 'light',
          botName: 'Assistant',
        }
      });

    };

    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="webchat"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '64px',
        height: '64px',
        zIndex: 9999
      }}
    />
  );
};

export default BotpressWebchat;
