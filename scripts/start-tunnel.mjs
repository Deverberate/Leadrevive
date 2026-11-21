import localtunnel from 'localtunnel';

const port = 3000;
const subdomain = 'leadrevive-' + Math.floor(1000 + Math.random() * 9000);

async function start() {
  try {
    const tunnel = await localtunnel({ port, subdomain });
    console.log(`TUNNEL_ONLINE: ${tunnel.url}`);

    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err);
  }
}

start();
