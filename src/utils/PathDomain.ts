import { DOMAIN } from '@common/variables';

export class PathDomain {
  name: string;
  paths: string[] = [];
  included = false;

  constructor(name: string) {
    this.name = name;
  }

  get include() {
    this.included = true;
    return this;
  }

  addPath(...path: string[]) {
    this.paths.push(...path);
    return this;
  }

  addSubPath(...subDomain: PathDomain[]) {
    for (const sub of subDomain) {
      const paths = [
        sub.name,
        ...sub.paths.map((path) => [sub.name, path].join('/')),
      ];
      this.paths.push(...paths);
    }
    return this;
  }

  output() {
    const temp = [this.name];
    const paths = this.paths.map((path) =>
      this.name === '' ? path : [this.name, path].join('/'),
    );
    temp.push(...paths);
    return temp.map((path) => {
      const result = [DOMAIN, path.replace(/\/+/g, '/')].join('/');
      if (result.endsWith('/')) {
        return result;
      }
      if (result.includes('?')) {
        return result;
      }
      return result + '/';
    });
  }
}
