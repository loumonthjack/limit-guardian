import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import express from 'express';
import env from '../env';

const app = express();

const resetQueue = new Queue('reset-limits');

const serverAdapter = new ExpressAdapter();
const { addQueue, removeQueue, setQueues } = createBullBoard({
  queues: [
    new BullMQAdapter(resetQueue),
  ],
  serverAdapter,
});

serverAdapter.setBasePath('/queues');
app.use('/queues', serverAdapter.getRouter());

app.listen(env.QUEUE_PORT, () => {
  console.log(`Bull-Board running on http://localhost:${env.QUEUE_PORT}/queues`);
});
