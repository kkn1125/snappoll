import { PathDomain } from './PathDomain';

describe('PathDomain', () => {
  it('[패스 도메인] 정의되어야한다.', () => {
    expect(new PathDomain('')).toBeDefined();
  });
  it('[패스 도메인] 도메인에 따라 패스 생성', () => {
    const domain = new PathDomain('test');
    domain.addPath('test1', 'test2', 'test3');
    expect(domain.output()).toEqual([
      'https://snappoll.kro.kr/test/',
      'https://snappoll.kro.kr/test/test1/',
      'https://snappoll.kro.kr/test/test2/',
      'https://snappoll.kro.kr/test/test3/',
    ]);
  });
  it('[패스 도메인] Nested Domain 생성', () => {
    const subdomain = new PathDomain('sub');
    subdomain.addPath('test1', 'test2', 'test3');
    const domain = new PathDomain('main');
    domain.addSubPath(subdomain);
    expect(domain.output()).toEqual([
      'https://snappoll.kro.kr/main/',
      'https://snappoll.kro.kr/main/sub/',
      'https://snappoll.kro.kr/main/sub/test1/',
      'https://snappoll.kro.kr/main/sub/test2/',
      'https://snappoll.kro.kr/main/sub/test3/',
    ]);
  });
  it('[패스 도메인] 베이직 패스', () => {
    const basic = new PathDomain('');
    basic.addPath('test1', 'test2', 'test3');
    expect(basic.output()).toEqual([
      'https://snappoll.kro.kr/',
      'https://snappoll.kro.kr/test1/',
      'https://snappoll.kro.kr/test2/',
      'https://snappoll.kro.kr/test3/',
    ]);
  });
});
