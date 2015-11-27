import request from 'request';

export default function createClient(requestOptions) {

  const url = 'https://api.go-tellm.com/api/v2';

  const headers = {
    'User-Agent': 'Jodel/65000 Dalvik/2.1.0 (Linux; U; Android 5.1.1; Nexus 5 Build/LMY48M',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip'
  };

  const defaultLocation = {
    loc_accuracy: 19.0,
    city: 'Trondheim',
    loc_coordinates: {
      lat: 63.4299,
      lng: 10.3932
    },
    country: 'NO',
    name: 'mickjagger'
  };

  function createError(response) {
    const error = new Error(response.body);
    error.response = response;
    return error;
  }

  function fetch(method) {
    return ({ endpoint, headers, body }) =>
      new Promise((resolve, reject) => {
        request({
          method,
          url: `${url}${endpoint}`,
          headers,
          body: body && JSON.stringify(body),
          ...requestOptions
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
  const del = fetch('delete');

  /**
   * This is roughly equivalent to buying a new phone from Elkjøp.
   */
  function createDeviceUID() {
    const universe = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const uid = []; let n = 64;
    while (n--) uid.push(universe.charAt((Math.random() * 36) | 0));
    return uid.join('');
  }

  function getAccessTokenForDevice(device) {
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

  function karma(token) {
    return get({
      endpoint: `/user/karma`,
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  function createPost(token, message, ancestor) {
    return post({
      endpoint: '/posts',
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`
      },
      body: {
        color: 'FF0000',
        location: defaultLocation,
        message,
        ancestor
      }
    });
  }

  function deletePost(token, postId) {
    return del({
      endpoint: `/posts/${postId}`,
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`
      }
    })
  }

  function updatePosition(token, location) {
    return put({
      endpoint: '/users/place',
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`
      },
      body: {
        location
      }
    });
  }

  return {
    karma,
    createPost,
    deletePost,
    updatePosition,
    newest: posts('location'),
    popular: posts('location/popular'),
    discussed: posts('location/discussed'),
    mine: posts('mine'),
    upvote: vote('up'),
    downvote: vote('down'),
    getAccessTokenForNewDevice: () => getAccessTokenForDevice(createDeviceUID()),
    getAccessTokenForDevice
  };
}
