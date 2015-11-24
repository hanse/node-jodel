import request from 'request';
import Agent from 'socks5-https-client/lib/Agent';

/**
 * Jodel API URL
 */
const url = 'https://api.go-tellm.com/api/v2';

/**
 * Default headers
 */
const headers = {
  'User-Agent': 'Jodel/65000 Dalvik/2.1.0 (Linux; Android 5.0; Nexus 6 Build/LRX21D)',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Accept-Encoding': 'gzip'
};

const defaultLocation = {
  loc_accuracy: 19.0,
  city: 'Trondheim',
  loc_coordinates: {
    lat: 63.42,
    lng: 10.39
  },
  country: 'NO',
  name: 'mickjagger'
};

function createError(response) {
  const error = new Error(response.body);
  error.response = response;
  return error;
}

/**
 * Utility function for running HTTPS requests through the Tor network.
 */
function fetch(method) {
  return ({ endpoint, headers, body }) =>
    new Promise((resolve, reject) => {
      request({
        method,
        url: `${url}${endpoint}`,
        headers,
        body: body && JSON.stringify(body),
        strictSSL: true,
        agentClass: Agent,
        agentOptions: {
          socksHost: 'localhost',
          socksPort: 9050
        }
      }, (err, res) => {
        if (err) return reject(err);
        if (res.statusCode >= 400) return reject(createError(res));
        return resolve(JSON.parse(res.body));
      });
    });
}

const get = fetch('get');
const post = fetch('post');
const put = fetch('put');

/**
 * This is roughly equivalent to buying a new phone from Elkjøp.
 *
 * @returns {string} The device UID
 */
function createDeviceUID() {
  const universe = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const uid = []; let n = 63;
  while (n--) uid.push(universe.charAt((Math.random() * 36) | 0));
  return uid.join('');
}

/**
 * Ask the Jodel API for a new access token.
 * @returns {Promise}
 */
function getAccessTokenDevice(device) {
  return post({
    endpoint: '/users',
    headers,
    body: {
      device_uid: device,
      client_id: '81e8a76e-1e02-4d17-9ba0-8a7020261b26',
      location: defaultLocation
    }
  }).then(body => body.access_token);
}

/**
 * @returns {Function} A function that returns a Promise
 */
function vote(upOrDown) {
  return (token, postId) => put({
    endpoint: `/posts/${postId}/${upOrDown}vote`,
    headers: {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  });
}

function posts(type) {
  return (token) => get({
    endpoint: `/posts/${type}`,
    headers: {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  });
}

export function karma(token) {
  return get({
    endpoint: `/user/karma`,
    headers: {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  });
}

export function createPost(token, message) {
  return post({
    endpoint: '/posts',
    headers: {
      ...headers,
      'Authorization': `Bearer ${token}`
    },
    body: {
      color: 'FF0000',
      location: defaultLocation,
      message
    }
  });
}

export const newest = posts('location');
export const popular = posts('location/popular');
export const discussed = posts('location/discussed');
export const mine = posts('mine');
export const upvote = vote('up');
export const downvote = vote('down');
export const getAccessTokenForNewDevice = () => getAccessTokenDevice(createDeviceUID());
