import parseArgs from 'minimist';
import createClient from '../';

const jodel = createClient();

/**
 * Parse them command line args
 */
const argv = parseArgs(process.argv.slice(2));

function help(msg = '') {
  console.log(`Usage: vote up {post-id}\n\n${msg}`);
  process.exit(1);
}

/**
 * Decide what to do
 */
let vote;
switch (argv._[0]) {
  case 'up': vote = jodel.upvote; break;
  case 'down': vote = jodel.downvote; break;
  default: help();
}

/**
 * Who will get the flame or blame.
 */
const postId = argv._[1];

if (!postId) {
  help('post-id is required');
}

jodel.getAccessTokenForNewDevice()
  .then(token => vote(token, postId))
  .then(res => console.log(res))
  .catch(err => console.error('Error: ', err));
