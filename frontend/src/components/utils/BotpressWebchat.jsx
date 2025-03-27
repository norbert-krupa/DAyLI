import { useEffect } from 'react';

const BotpressWebchat = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
    script.async = true;

    script.onload = () => {
      if (!window.botpress) return;

      window.botpress.init({
        botId: '13cd0165-aefb-45aa-a816-e6da7b31eb89',
        clientId: 'f9fb5f08-36c8-4dc5-8bd5-2eec3f7c26b3',
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

      window.botpress.on('webchat:ready', () => {
        window.botpress.open();
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
        width: '400px',
        height: '600px',
        zIndex: 9999
      }}
    />
  );
};

export default BotpressWebchat;
