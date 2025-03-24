import { useEffect } from 'react';
import {
  Webchat,
  WebchatProvider,
  getClient
} from '@botpress/webchat';

const clientId = '53612202-d931-4f14-9a0d-e01d5f6d435b';

const configuration = {
  color: '#4A90E2',
  botName: 'Assistant'
};

const Assistant = () => {
  const userId = localStorage.getItem('user_id');

  const client = getClient({ clientId });

  useEffect(() => {
    if (!localStorage.getItem('user_id')) {
      localStorage.setItem('user_id', userId);
    }

    // Wait for Webchat to be ready
    client.on('connectionOpened', async () => {
      await client.sendEvent({
        type: 'customEvent',
        channel: 'web',
        payload: {
          user_id: userId,
          name: 'TestUser2'
        }
      });
    });
  }, [client, userId]);

  return (
    <div style={{ padding: '24px', height: '100%' }}>
      <WebchatProvider client={client} configuration={configuration}>
        <Webchat />
      </WebchatProvider>
    </div>
  );
};

export default Assistant;
