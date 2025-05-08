document.addEventListener(
  "paste",
  (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text");

    const formattedData = toProgrammers(textToken(pastedData));
    document.execCommand("insertText", false, formattedData);
    // paste 이벤트는 cancleable하지 않기 때문에 cancelable 파라미터를 true로 지정해줘야함
  },
  true
);

function toProgrammers(tokens) {
  let startPoint = getStartIndex(tokens);
  tokens.splice(0, startPoint);

  const removeStartIndex = tokens.indexOf("public");
  const removeEndIndex = removeClassBlockEndIndex(tokens);
  tokens.splice(removeStartIndex, removeEndIndex - removeStartIndex + 4);
  tokens.splice(tokens.lastIndexOf("}"));
  return tokens.join("");
}

function removeClassBlockEndIndex(tokens, removeWord, nextRemoveCount) {
  let start = tokens.indexOf(removeWord) + nextRemoveCount;
  const stack = [];

  for (var i = start; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.includes("{")) for (var j = 0; j < countTokenInStr(token, token); j++) stack.push("{");
    else if (token.includes("}")) for (var j = 0; j < countTokenInStr(token, token); j++) stack.pop();

    if (stack.length === 0) return i;
  }
}

const countTokenInStr = (token, block) => {
  let count = 0;
  for (let i = 0; i < token.length; i++) {
    if (token[i] !== block) continue;
    count++;
  }
  return count;
  
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

const checkLanguage = () => {
  return document.querySelector('#tour7').querySelector('.btn').innerText.trim()
}