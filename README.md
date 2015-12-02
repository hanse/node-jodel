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

## Get The Device UID of Android Phones
To use this with the account on your phone, you need to obtain the unique id for your device. This is a SHA-256 hash that can be calculated from the following info:

* **JODEL_ID** (`81e8a76e-1e02-4d17-9ba0-8a7020261b26`)
* **PHONE_NUMBER_ON_SIM**: `"null"` if not provided by sim card (not all do this)
* **HARDWARE_SERIAL**: `android.os.Build.SERIAL`
* **ANDROID_ID**: `Settings.Secure.ANDROID_ID`
* **IMEI**: `TelephonyManager.getDeviceId())`
* **IMSI**: `TelephonyManager.getSubscriberId()` or `"null"`
* **SIM_SERIAL_NUMBER**: `TelephonyManager.getSimSerialNumber()` or `"null"`

All the info except `ANDROID_ID` can be found in `Settings → About → Status`. There are apps on the Play Store that gives you everything.

Using Node.js >= v5.0.0:
```js
const crypto = require('crypto');
const encode = (spec) => crypto.createHash('sha256').update(spec.join('')).digest('hex');

console.log(encode([
  '81e8a76e-1e02-4d17-9ba0-8a7020261b26',
  'phone_number_on_sim',
  'your hardware serial',
  'android id',
  'imei',
  'imsi',
  'sim serial number'
]))
```
