import express, { Request, Response } from 'express';
import { Browserbase } from '@browserbasehq/sdk';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the rrweb-player package
app.use(
  '/rrweb-player',
  express.static(path.join(__dirname, 'node_modules', 'rrweb-player'))
);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// app.get('/iframe.html', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, 'iframe.html'));
// });

app.get('/sessions', async (req: Request, res: Response) => {
  const sessionId = 'afbd0734-7e7b-4486-90ac-1f73956e99b7';

  const browserbase = new Browserbase({
    apiKey: process.env.BROWSERBASE_API_KEY,
  });

  const session = await browserbase.getSession(sessionId);

  const events = await browserbase.getSessionRecording(sessionId);
  // Log the session status -> 'COMPLETED'
  console.log(session.status);
  // Output the session recording events retrieved using the sessionId
  console.log(events);
  // Send the events as JSON to the client
  res.json(events);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
