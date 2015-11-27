# node-jodel

> Programmatic access to [Jodel](https://jodel-app.com/)

```bash
npm install jodel
```

```js
import createClient from 'jodel';
const client = createClient();
client.popular().then(::console.log);
```

See the [examples](https://github.com/Hanse/node-jodel/tree/master/examples/) for hints on how to use it.


## Advanced Usage
```js
import Agent from 'socks5-https-client/lib/Agent';
import createClient from 'jodel';

const jodel = createClient({
  strictSSL: true,
  agentClass: Agent,
  agentOptions: {
    socksHost: 'localhost',
    socksPort: 9050
  }
});
```
