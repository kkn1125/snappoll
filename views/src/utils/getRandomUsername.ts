const modifier = [
  '다정다감한',
  '용맹한',
  '너그러운',
  '익살스러운',
  '표효하는',
  '역동적인',
  '다채로운',
  '따스한',
  '차가운',
  '매서운눈빛의',
  '시큰둥한',
  '매력적인',
  '호기심넘치는',
  '자랑스런',
  '방황하는',
];
const nameList = [
  'A4용지',
  'B4용지',
  '설문지',
  '투표지',
  '연필',
  '볼펜',
  '만연필',
  '4B흑심',
  '그냥흑심',
  '지우개',
  '모나미펜',
  '잉크펜',
  '마카펜',
  '검은잉크',
  '레이저프린트',
  '파쇄기',
  '샤프',
  '제도샤프',
  '붓펜',
];

function getRandom<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function getRandomUsername() {
  const modify = getRandom(modifier);
  const name = getRandom(nameList);
  return modify + name;
}
