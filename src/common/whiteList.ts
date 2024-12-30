import { MODE } from './variables';
import os from 'os';
const networks = os.networkInterfaces();
const currentNetwork = networks['Wi-Fi'] || networks['eth0'];
const ipv4 = currentNetwork.find((net) => net.family === 'IPv4');

const DEV = MODE === 'development';

export default {
  hosts: DEV
    ? ['localhost', 'snappoll.kro.kr', '172.16.101.163', ipv4.address]
    : ['snappoll.kro.kr'],
  ports: DEV ? [8080, 5000, 80] : [80],
};
