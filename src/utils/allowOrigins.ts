export function allowOrigins(hosts: string[], ports: number[]) {
  const temp: string[] = [];
  for (const host of hosts) {
    temp.concat(ports.map((port) => 'http://' + host + ':' + port));
    temp.concat(ports.map((port) => 'https://' + host + ':' + port));
  }
  return temp;
}
