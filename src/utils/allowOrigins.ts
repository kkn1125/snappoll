export function allowOrigins(hosts: string[], ports: number[]) {
  const temp: string[] = [];
  for (const host of hosts) {
    temp.push(...ports.map((port) => 'http://' + host + ':' + port));
    temp.push(...ports.map((port) => 'https://' + host + ':' + port));
  }
  return temp;
}
