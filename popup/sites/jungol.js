const normalizeIdentifier = (rawText) =>
    rawText
        // 클래스명에 쓰기 어려운 문자는 공백으로 바꿉니다.
        // \p{L}: 모든 언어의 문자, \p{N}: 숫자, \s: 공백
        .replace(/[^\p{L}\p{N}\s_]+/gu, " ")
        .trim()
        // 여러 칸 공백은 Java 식별자 스타일에 맞게 _ 하나로 줄입니다.
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");

const makeClassName = (rawUrl, rawTitle) => {
    // /problem/1000 형태 URL에서 문제 번호만 뽑습니다.
    // (\d+)는 숫자가 1개 이상 이어진 부분을 캡처합니다.
    const problemNumber = rawUrl.match(/\/problem\/(\d+)/)?.[1] || "";
    const problemTitle = rawTitle
        // 제목 앞의 "1000번 :" 같은 접두어를 제거합니다.
        .replace(/^\s*\d+\s*번\s*[:\-]\s*/u, "")
        // 제목 뒤의 "- jungol ..." 같은 사이트명을 제거합니다.
        .replace(/\s*-\s*jungol.*$/u, "")
        .trim();

    const normalizedTitle = normalizeIdentifier(problemTitle);
    const parts = ["Jungol", problemNumber, normalizedTitle].filter(Boolean);

    return parts.join("_") || "Jungol_Problem";
};

const makeTemplate = (className) => `import java.io.*;
import java.util.*;

public class ${className} {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // StringTokenizer st = new StringTokenizer(br.readLine());
        // TODO: implement
    }
}
`;

export const jungolSite = {
    matches(url) {
        return url.includes("jungol.co.kr");
    },
    resolve(url, title) {
        // popup 쪽에서는 사이트별로 resolve 결과만 공통 형식으로 사용합니다.
        const className = makeClassName(url, title);
        return {
            className,
            content: makeTemplate(className),
        };
    },
};
