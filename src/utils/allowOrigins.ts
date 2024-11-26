export function allowOrigins(hosts: string[], ports: number[]) {
  const temp: string[] = [];
  const addPort = (port: number) => (port === 80 ? '' : ':' + port);
  for (const host of hosts) {
    temp.push(...ports.map((port) => 'http://' + host + addPort(port)));
    temp.push(...ports.map((port) => 'https://' + host + addPort(port)));
  }
  return temp;
}
