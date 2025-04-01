document.addEventListener(
  "paste",
  (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text");

    const formattedData = toBaekjoon(textToken(pastedData));
    document.execCommand("insertText", false, formattedData);
    // paste 이벤트는 cancleable하지 않기 때문에 cancelable 파라미터를 true로 지정해줘야함
  },
  true
);

const toBaekjoon = (tokens) => {
  let startPoint = getStartIndex(tokens);
  let classNameIndex = tokens.indexOf("public") + 4;

  tokens[classNameIndex] = "Main";
  return tokens.slice(startPoint).join("");
};

const getStartIndex = (tokens) => {
  if (tokens[0] === "package") return 4;
  return 0;
};

const textToken = (text) => {
  // 공백, 줄바꿈, 탭을 기준으로 분리하는 정규표현식
  // ()을 통해서 분리되는 구분자도 배열에 포함시킴
  textArray = text.split(/(\s+)/);
  return textArray;
};