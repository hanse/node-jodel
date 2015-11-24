import parseArgs from 'minimist';
import { getAccessTokenForNewDevice, upvote, downvote } from '../';

/**
 * Parse them command line args
 */
const argv = parseArgs(process.argv.slice(2));

function help(msg = '') {
  console.log(`Usage: vote up {post-id} [--no-tor]\n\n${msg}`);
  process.exit(1);
}

/**
 * Decide what to do
 */
let vote;
switch (argv._[0]) {
  case 'up': vote = upvote; break;
  case 'down': vote = downvote; break;
  default: help();
}

/**
 * Who will get the flame or blame.
 */
const postId = argv._[1];

if (!postId) {
  help('post-id is required');
}

getAccessTokenForNewDevice()
  .then(token => vote(token, postId))
  .then(res => console.log(res))
  .catch(err => console.error('Error: ', err));
