import * as Tone from 'tone';

export async function main() {
  let players = {};

  function setUpWebSocket() {
    const ws = new WebSocket(`ws:${location.host}/plugins/audio/_/feed`);

    ws.addEventListener('open', () => {
      console.info('Connection established');
    });

    ws.addEventListener('message', m => {
      let action = JSON.parse(m.data);
      switch (action.type) {
        case 'ADD':
          for (const cue of action.data) {
            const player = new Tone.Player(`/assets/${cue.asset}`);
            player.fadeIn = cue.attack;
            player.fadeOut = cue.release;
            player.loop = cue.loop;
            player.toMaster();
            players[cue.id] = player;
          }
          break;
        case 'START':
          players[action.id].start();
          break;
        case 'STOP_ALL':
          for (const player of Object.values(players)) {
            player.stop();
          }
          break;
      }
    });

    ws.addEventListener('close', () => {
      console.info('Lost websocket connection, attempting to reconnect');
      setTimeout(setUpWebSocket, 1000);
    });
  }
  setUpWebSocket();
}
