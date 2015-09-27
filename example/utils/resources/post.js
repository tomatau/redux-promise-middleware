
import Server from '../server';

const server = new Server();

// Get the latest comic
export function getLatest() {
  return server.get('http://xkcd.com/info.0.json');
}
