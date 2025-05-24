import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(5000, () => {
      console.log(`MediMart is listening at http://localhost:${5000}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection:', reason);

  if (server) {
    server.close(() => {
      console.log('Server closed due to unhandled rejection.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});


