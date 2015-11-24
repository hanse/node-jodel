import parseArgs from 'minimist';
import { newest, popular, discussed, mine } from '../';


/**
 * Parse them command line args
 */
const argv = parseArgs(process.argv.slice(2));

function help(msg = '') {
  console.log(`Usage: posts (newest|popular|discussed|mine) [--geojson --device=1234]\n\n${msg}`);
  process.exit(1);
}

const outputGeoJSON = argv.geojson;
const prettyPrint = argv.pretty;
const accessToken = argv.token;

if (!accessToken) {
  help('--token is required');
}

let filter;
switch (argv._[0]) {
  case 'newest': filter = newest; break;
  case 'popular': filter = popular; break;
  case 'discussed': filter = discussed; break;
  case 'mine': filter = mine; break;
  default: help();
}

filter(accessToken).then(result => {
  if (!outputGeoJSON) {
    console.log(JSON.stringify(result.posts, null, prettyPrint && 2));
    return;
  }

  const features = result.posts.map(post => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        post.location.loc_coordinates.lng,
        post.location.loc_coordinates.lat
      ]
    },
    properties: {
      id: post.post_id,
      title: post.vote_count,
      description: post.message,
      'marker-color': '#63b6e5',
      'marker-symbol': 'rocket',
      'marker-size': 'medium'
    }
  }));

  console.log(JSON.stringify({
    type: 'FeatureCollection',
    features
  }));
}).catch(err => console.error('Error: ', err));
