import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  createNewBinId,
  addToMongo,
  addToPostgres,
  getRequestsFromPostgres,
  getRequestFromPostgres,
} from './helpers';

const app = express();
const port = 3000;

app.use(express.json());

app.use((req: any, _, next) => {
  console.log('Subdomain:', req.headers.host.split('.')[0]);
  next();
});

// // Middleware to handle all request methods for the same path
app.all('/bin/:bin_id', async (req, res) => {
  const { method, url, headers, query, body } = req;
  console.log({ method, url, headers, query, body });
  const mongoRequestId = await addToMongo(req);
  const requestId = uuidv4();
  await addToPostgres(
    method,
    url,
    mongoRequestId,
    req.params.bin_id,
    requestId,
  );

  res.send(`Handled ${req.method} request`);
  return mongoRequestId;
});

// To serve public directory for the path '/public/bins/:bin_id'
app.use(
  '/public/bin/:bin_id',
  express.static(path.join(__dirname, '../client/public')),
);

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query Params:', req.query);
  console.log('Body:', req.body);
});

app.post('/api/create_new_bin', async (_, res) => {
  // create new bin id
  // add check to ensure not a duplicate
  // store bin id in postgres
  const binId = await createNewBinId();
  console.log(binId);

  res.redirect(`/public/bin/${binId}`);
});

// API
// Get info about specific request
// user flow - when they click on a request within the full request table for a bin
// This route returns null if doesn't exist, else return obj with request info
app.get('/api/:bin_id/requests/:request_id', async (req, res) => {
  const request = await getRequestFromPostgres(
    req.params.bin_id,
    req.params.request_id,
  );
  res.json(request);
});

app.get('/api/:bin_id', async (req, res) => {
  // logic to get all requests for a specific binId
  // interacting with postgres to select all requests from request where requestbin_id == binId
  const requests = await getRequestsFromPostgres(req.params.bin_id);
  console.log(requests);
  res.json(requests);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);

// visit localhost:3000
// assuming you have done 1) npm init 2) npm install express

// https://7440-76-23-45-191.ngrok-free.app
// https://ecf6-76-23-45-191.ngrok-free.app/
