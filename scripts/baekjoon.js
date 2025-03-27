document.addEventListener(
  "paste",
  (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text");

    const formattedData = toBaekjoon(textToken(pastedData));
    console.log(formattedData);
    document.execCommand("insertText", false, formattedData);
    // paste 이벤트는 cancleable하지 않기 때문에 cancelable 파라미터를 true로 지정해줘야함
  },
  true
);

function toBaekjoon(tokens) {
  let startPoint = getStartIndex(tokens);
  let classNameIndex = tokens.indexOf("public") + 4;

  tokens[classNameIndex] = "Main";
  return tokens.slice(startPoint).join("");
}
