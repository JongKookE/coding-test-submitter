// document는 현재 웹페이지 전체를 가리킵니다.
// paste 이벤트를 가로채서, 붙여넣기 직전에 Java 코드를 백준 형식으로 바꿉니다.
document.addEventListener(
  "paste",
  (event) => {
    // event는 이번 붙여넣기 동작에 대한 정보입니다.
    // window는 브라우저 전역 객체이고, clipboardData는 붙여넣은 텍스트를 읽을 때 사용합니다.
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData?.getData("text");

    if (!pastedData) return;

    const formattedData = toBaekjoon(pastedData);
    if (!formattedData || formattedData === pastedData) return;

    event.preventDefault();
    insertText(formattedData);
  },
  true
);

// package 라인은 코드 제출에 필요가 없으니 제거
const deletePackageLine = (data) => data.replace(/^package\s+.*?;\s*\n?/gm, "");

const toBaekjoon = (text) => {
  const withoutPackage = deletePackageLine(text);
  // public class Main으로 변경
  // \b는 단어 경계, [^\s{]+는 공백/중괄호 전까지의 클래스명
  const renamedClass = withoutPackage.replace(
    /\bpublic\s+class\s+[^\s{]+/u,
    "public class Main"
  );

  if (renamedClass !== withoutPackage) return renamedClass;

  return withoutPackage.replace(
    /\bclass\s+[^\s{]+/u,
    "class Main"
  );
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
