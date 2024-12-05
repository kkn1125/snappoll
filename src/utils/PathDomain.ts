import { DOMAIN } from '@common/variables';

export class PathDomain {
  name: string;
  paths: string[] = [];
  included = false;

  constructor(name: string) {
    this.name = '/' + name;
  }

  get include() {
    this.included = true;
    return this;
  }

  addPath(...path: string[]) {
    this.paths.push(...path.map((p) => '/' + p));
    return this;
  }

  output() {
    const temp = [];
    if (this.included) {
      temp.push(this.name + '/');
    }

    return temp
      .concat(
        ...this.paths.map(
          (path) => (this.name === '/' ? '' : this.name) + path + '/',
        ),
      )
      .map((path) => DOMAIN + path);
  }
}
