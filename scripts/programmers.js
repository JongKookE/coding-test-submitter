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
  const language = checkLanguage()
  if(language === 'Java') return makeJavaFormat(tokens)
  else if (language === 'Kotlin') return makeKotlinFormat(tokens);
}

function removeClassBlockEndIndex(tokens, start) {
  let count = 1;  // 시작 중괄호는 이미 있으므로 1로 시작
  
  for (let i = start; i < tokens.length; i++) {
    const token = tokens[i];
    // 정규표현식을 통해 중괄호를 가져오면서 g 플래그를 통해 일치하는 부분을 배열로 전환
    count += (token.match(/{/g) || []).length;
    count -= (token.match(/}/g) || []).length;
    
    if (count === 0) return i;
  }
}

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

const makeJavaFormat = (tokens) => {
  let startPoint = getStartIndex(tokens);
  tokens.splice(0, startPoint);
  
  let start = tokens.indexOf('void') + 6;

  const removeStartIndex = tokens.indexOf("public");
  const removeEndIndex = removeClassBlockEndIndex(tokens, start);
  tokens.splice(removeStartIndex, removeEndIndex - removeStartIndex + 4);
  tokens.splice(tokens.lastIndexOf("}"));
  return tokens.join("");
}

const makeKotlinFormat = (tokens) => {
  let startPoint = getStartIndex(tokens);
  tokens.splice(0, startPoint);
  tokens[0] = 0

  const nextClassIndex = tokens.indexOf('class')
  tokens.splice(0, nextClassIndex)
  
  const start = tokens.indexOf('{')
  const end = removeClassBlockEndIndex(tokens, start)
  const slicedToken = tokens.slice(0, end+4)
  return slicedToken.join("")
}
