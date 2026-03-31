document.addEventListener(
  "paste",
  (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData?.getData("text");

    if (!pastedData) return;

    const formattedData = toProgrammers(pastedData);
    if (!formattedData || formattedData === pastedData) return;

    event.preventDefault();
    insertText(formattedData);
  },
  true
);

function toProgrammers(data) {
  const language = checkLanguage();
  if (language !== "Java") return null;
  return makeJavaFormat(data);
}

function findBlockEnd(source, openBraceIndex) {
  let depth = 0;

  for (let i = openBraceIndex; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") depth -= 1;

    if (depth === 0) return i;
  }

  return -1;
}

const checkLanguage = () => {
  return document.querySelector("#tour7 .btn")?.innerText.trim() || "";
};

const makeJavaFormat = (data) => {
  const imports = pickupImportsLine(data);
  const normalizedData = deletePackageLine(data);

  const solutionClass = extractSolutionClass(normalizedData);
  if (!solutionClass) {
    console.error("Class Solution not found in the data.");
    return data;
  }

  return [imports, solutionClass].filter(Boolean).join("\n\n").trim();
};

// package 라인은 코드 제출에 필요가 없으니 제거
const deletePackageLine = (data) => data.replace(/^package\s+.*?;\s*\n?/gm, "");

const extractSolutionClass = (data) => {
  // public class Solution / static class Solution 등 여러 선언 형태를 모두 허용
  const classMatch = data.match(/\b(?:public\s+)?(?:static\s+)?class\s+Solution\b/);
  if (!classMatch || classMatch.index == null) return null;

  const classStart = classMatch.index;
  const braceIndex = data.indexOf("{", classStart);
  if (braceIndex === -1) return null;

  const classEnd = findBlockEnd(data, braceIndex);
  if (classEnd === -1) return null;

  return data
    .slice(classStart, classEnd + 1)
    // 접근 제어자 또는 static을 제거한 class Solution 선언으로 변경
    .replace(
      /\bpublic\s+static\s+class\s+Solution\b|\bpublic\s+class\s+Solution\b|\bstatic\s+class\s+Solution\b/,
      "class Solution"
    )
    .trim();
};

const pickupImportsLine = (data) => {
  // gm 플래그:
  // g는 전체 검색, m은 여러 줄 텍스트에서 줄 단위 ^ $를 쓰기 위한 옵션입니다.
  const importMatches = data.match(/^import\s+.*?;\s*$/gm) || [];
  return importMatches.join("\n");
};

const insertText = (text) => {
  if (document.queryCommandSupported?.("insertText")) {
    document.execCommand("insertText", false, text);
    return;
  }

  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  selection.deleteFromDocument();
  selection.getRangeAt(0).insertNode(document.createTextNode(text));
  selection.collapseToEnd();
};
