document.addEventListener(
  "paste",
  (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text");

    const formattedData = toProgrammers(textToken(pastedData));
    // console.log(formattedData);
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

    console.log(tokens.splice(removeStartIndex, removeEndIndex-removeStartIndex+4).join(''));
    tokens.splice(tokens.lastIndexOf('}'));
    return tokens.join("");
}


function removeClassBlockEndIndex(tokens){
    let start = tokens.indexOf('void') + 6;
    
    const stack = [];

    for(var i = start; i < tokens.length; i++){
        const token = tokens[i];
        // console.log(token);
        if(token.includes('{')) stack.push('{');
        else if (token.includes('}')) stack.pop();
        // console.log(stack);
        if(stack.length === 0) return i;
    }
    
}