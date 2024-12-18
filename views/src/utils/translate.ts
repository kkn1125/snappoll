export const translate = (key: string) => {
  switch (key) {
    case 'notice':
      return '공지사항';
    case 'community':
      return '커뮤니티';
    case 'event':
      return '이벤트';
    case 'faq':
      return 'FAQ';
    default:
      return key;
  }
};
