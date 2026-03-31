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

const deletePackageLine = (data) => data.replace(/^package\s+.*?;\s*\n?/gm, "");

const extractSolutionClass = (data) => {
  const classMatch = data.match(/\b(?:public\s+)?(?:static\s+)?class\s+Solution\b/);
  if (!classMatch || classMatch.index == null) return null;

  const classStart = classMatch.index;
  const braceIndex = data.indexOf("{", classStart);
  if (braceIndex === -1) return null;

  const classEnd = findBlockEnd(data, braceIndex);
  if (classEnd === -1) return null;

  return data
    .slice(classStart, classEnd + 1)
    .replace(
      /\bpublic\s+static\s+class\s+Solution\b|\bpublic\s+class\s+Solution\b|\bstatic\s+class\s+Solution\b/,
      "class Solution"
    )
    .trim();
};

const pickupImportsLine = (data) => {
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
