document.addEventListener(
  "paste",
  (event) => {
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

const toBaekjoon = (text) => {
  const withoutPackage = text.replace(/^\s*package\s+[\w.]+\s*;\s*\n?/m, "");
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
