import { MODE } from './variables';

const DEV = MODE === 'development';

export default {
  hosts: DEV
    ? ['localhost', 'snappoll.kro.kr', '172.16.101.163']
    : ['snappoll.kro.kr'],
  ports: DEV ? [8080, 5000, 80] : [80],
};
