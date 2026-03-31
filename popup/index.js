import { makeBaekjoonClassName, makeProgrammersClassName } from "./classNames.js";
import { downloadJavaFile } from "./download.js";
import { makeBaekjoonFormat, makeProgrammersFormat } from "./templates.js";

const popupButton = document.getElementById("image-text-button");

popupButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.url || !tab?.title) {
        console.error("Active tab information is unavailable.");
        return;
    }

    const downloadTarget = resolveDownloadTarget(tab.url, tab.title);
    if (!downloadTarget) {
        console.error("Unsupported site:", tab.url);
        return;
    }

    downloadJavaFile(`${downloadTarget.className}.java`, downloadTarget.content);
});

const resolveDownloadTarget = (url, title) => {
    if (url.includes("acmicpc.net")) {
        const className = makeBaekjoonClassName(url, title);
        return {
            className,
            content: makeBaekjoonFormat(className),
        };
    }

    if (url.includes("programmers.co.kr")) {
        const className = makeProgrammersClassName(url, title);
        return {
            className,
            content: makeProgrammersFormat(className),
        };
    }

    return null;
};
