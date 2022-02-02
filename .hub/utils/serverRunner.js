import { exec } from "child_process";
import sleep from "./sleep";

const envs = {};

class ServerData {
  constructor() {
    this._process = null;
    this._lastCommand = null;
  }

  get process() {
    return this._process;
  }

  async setProcess(newValueSetter) {
    if (this._process !== null) {
      exec(`kill -9 ${this._process.pid}`);
      exec(`kill -9 ${this._process.pid + 1}`);
      await sleep(2500);
    }

    await(2500);
    this._process = newValueSetter();
  }
}

const server = new ServerData();

function setEnv(env, value) {
  envs[env] = value;
}

async function _setup() {
  await server.setProcess(() => exec(`${Object.keys(envs).map(env => `${env}=${envs[env]}`).join(' ')} node src/app`));
  server.process.stdout.on('data', chunk => console.log(chunk.toString()));
  server.process.stderr.on('data', chunk => console.log(chunk.toString()));
  await sleep(2000);
}

async function end() {
  await server.setProcess(() => null);
}

export {
  server,
  _setup,
  end,
  setEnv
}
