export async function main() {
  let cues = {};

  function setUpWebSocket() {
    const ws = new WebSocket(`ws:${location.host}/plugins/audio/_/feed`);

    ws.addEventListener('open', () => {
      console.info('Connection established');
    });

    ws.addEventListener('message', m => {
      let action = JSON.parse(m.data);
      switch (action.type) {
      }
    });

    ws.addEventListener('close', () => {
      console.info('Lost websocket connection, attempting to reconnect');
      setTimeout(setUpWebSocket, 1000);
    });
  }
  setUpWebSocket();
}

class AudioCue {
  constructor(asset, attack, release) {}
}
