document.addEventListener(
  "paste",
  (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text");
    const formattedData = toProgrammers(pastedData);
    document.execCommand("insertText", false, formattedData);
    // paste 이벤트는 cancleable하지 않기 때문에 cancelable 파라미터를 true로 지정해줘야함
  },
  true
);

function toProgrammers(data) {
  const language = checkLanguage()
  if(language === 'Java') return makeJavaFormat(data)
  return;
  // else if (language === 'Kotlin') return makeKotlinFormat(data);
}

function removeClassBlockEndIndex(tokens, start) {
  let count = 1;  // 시작 중괄호는 이미 있으므로 1로 시작
  
  for (let i = start; i < tokens.length; i++) {
    const token = tokens[i];
    count += (token.match(/{/g) || []).length;
    count -= (token.match(/}/g) || []).length;
    
    if (count === 0) return i;
  }
}

const checkLanguage = () => {
  return document.querySelector('#tour7').querySelector('.btn').innerText.trim()
}

const makeJavaFormat = (data) => {
  // import 구문은 따로 찾아서 저장
  const imports = pickupImportsLine(data);
  // 패키지 선언과 static 키워드 제거
  data = deletePackageLineAndStaticKeyword(data);

  const classStart = data.indexOf("class Solution")
  if (classStart === -1) {console.error("Class Solution not found in the data."); return data;}
  const classEnd = removeClassBlockEndIndex(data, classStart)

  data = data.slice(classStart, classEnd);

  return imports + formatIndent(data);
}

// const makeKotlinFormat = (data) => {
//   // import 구문은 따로 찾아서 저장
//   const imports = pickupImportsLine(data);
//   // 패키지 선언과 static 키워드 제거
//   data = deletePackageLineAndStaticKeyword(data);
//   const classStart = data.indexOf("fun main")
//   if (classStart === -1) {console.error("fun main not found in the data."); return data;}
//   const classEnd = removeClassBlockEndIndex(data, classStart)
//   data = data.slice(classStart, classEnd);

//   return imports + formatIndent(data);
// }

const deletePackageLineAndStaticKeyword = (data) => {
  // 패키지 라인 제거
  data = data.replace(/^package\s+.*?;\s*/gm, "");
  // static 키워드 제거
  data = data.replace(/\bstatic\b\s*/g, "");
  return data;
}

const pickupImportsLine = (data) => {
  // import 구문을 찾아서 따로 저장
  // import 구문은 줄의 시작 부분에 위치하고, 세미콜론으로 끝나야 함
  // ^는 줄의 시작을 의미, .*?는 모든 문자(0개 이상)를 의미, ;는 세미콜론을 의미
  // gm 플래그는 각각 줄의 시작과 끝을 의미, m은 멀티라인 모드를 의미
  // g는 전역 검색을 의미, m은 멀티라인 모드를 의미
  const importMatches = data.match(/^import\s+.*?;\s*$/gm) || [];
  return importMatches.join("\n");
}

const formatIndent = (data, space = 4) => {
  // 들여쓰기 처리
  const result = data.split("\n");
  const formattedResult = result.map(line => {
    // 라인 시작 부분의 공백 개수 확인
    const leadingSpaces = line.match(/^\s*/)[0].length;
    // 4칸 이상의 공백이 있다면 4칸 제거
    if (leadingSpaces >= space) return line.slice(space);
    return line;
  });
  return formattedResult.join("\n");
}

