function textToken(text) {
  // 공백, 줄바꿈, 탭을 기준으로 분리하는 정규표현식
  // ()을 통해서 분리되는 구분자도 배열에 포함시킴
  textArray = text.split(/(\s+)/);
  return textArray;
};


function getStartIndex(tokens) {
  if (tokens[0] === "package") return 4;
  return 0;
}


// 전역 객체에 함수 할당
window.textToken = textToken;
window.getStartIndex = getStartIndex;