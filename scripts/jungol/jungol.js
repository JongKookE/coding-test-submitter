// document는 현재 웹페이지 전체를 가리킵니다.
// paste 이벤트를 가로채서, 붙여넣기 직전에 Java 코드를 정올 형식으로 바꿉니다.
document.addEventListener(
  "paste",
  (event) => {
    if (event.__formatted) return; // 우리가 재발행한 이벤트는 다시 가로채지 않도록

    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData?.getData("text");
    if (!pastedData) return;

    const formattedData = toJungol(pastedData);
    if (!formattedData || formattedData === pastedData) return;

    // 1. 원본 이벤트는 완전히 무효화
    event.preventDefault();
    event.stopImmediatePropagation();

    // 2. 수정된 텍스트를 담은 새 clipboard 데이터 생성
    const dt = new DataTransfer();
    dt.setData("text/plain", formattedData);

    // 3. 같은 대상에 "가짜" paste 이벤트를 새로 발행 -> Monaco가 이걸 정상적으로 처리
    const newEvent = new ClipboardEvent("paste", {
      clipboardData: dt,
      bubbles: true,
      cancelable: true,
    });
    newEvent.__formatted = true;

    event.target.dispatchEvent(newEvent);
  },
  true
);

// package 라인은 코드 제출에 필요가 없으니 제거
const deletePackageLine = (data) => data.replace(/^package\s+.*?;\s*\n?/gm, "");

const toJungol = (text) => {
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