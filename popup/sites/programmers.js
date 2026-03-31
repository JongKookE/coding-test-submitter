const normalizeIdentifier = (rawText) =>
    rawText
        // 특수문자를 지우고, 남은 단어만 Java 클래스명 후보
        .replace(/[^\p{L}\p{N}\s_]+/gu, " ")
        .trim()
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");

const makeClassName = (rawUrl, rawTitle) => {
    const lessonId = rawUrl.match(/\/lessons\/(\d+)/)?.[1] || "";
    // 프로그래머스 탭 제목은 "문제명 | 프로그래머스"처럼 오기 때문에 앞부분만 사용
    const titleWithoutSite = rawTitle.split("|")[0]?.trim() || rawTitle;
    const problemTitle = titleWithoutSite.split(" - ").pop()?.trim() || titleWithoutSite;
    const normalizedTitle = normalizeIdentifier(problemTitle);

    return ["PRO", lessonId, normalizedTitle].filter(Boolean).join("_") || "PRO_Problem";
};

const makeTemplate = (className) => `import java.util.*;

public class ${className} {
    public static void main(String[] args) {
        Solution solution = new Solution();
        // TODO: call solution(...)
    }

    static class Solution {
        public int solution() {
            return 0;
        }
    }
}
`;

export const programmersSite = {
    matches(url) {
        return url.includes("programmers.co.kr");
    },
    resolve(url, title) {
        const className = makeClassName(url, title);
        return {
            className,
            content: makeTemplate(className),
        };
    },
};
