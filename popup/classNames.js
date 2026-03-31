const normalizeIdentifier = (rawText) =>
    rawText
        .replace(/[^\p{L}\p{N}\s_]+/gu, " ")
        .trim()
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");

export const makeBaekjoonClassName = (rawUrl, rawTitle) => {
    const problemNumber = rawUrl.match(/\/problem\/(\d+)/)?.[1] || "";
    const problemTitle = rawTitle
        .replace(/^\s*\d+\s*번?\s*[:\-]\s*/u, "")
        .replace(/\s*-\s*백준.*$/u, "")
        .trim();

    const normalizedTitle = normalizeIdentifier(problemTitle);
    const parts = ["BOJ", problemNumber, normalizedTitle].filter(Boolean);

    return parts.join("_") || "BOJ_Problem";
};

export const makeProgrammersClassName = (rawUrl, rawTitle) => {
    const lessonId = rawUrl.match(/\/lessons\/(\d+)/)?.[1] || "";
    const titleWithoutSite = rawTitle.split("|")[0]?.trim() || rawTitle;
    const problemTitle = titleWithoutSite.split(" - ").pop()?.trim() || titleWithoutSite;
    const normalizedTitle = normalizeIdentifier(problemTitle);

    return ["PRO", lessonId, normalizedTitle].filter(Boolean).join("_") || "PRO_Problem";
};
