import { downloadJavaFile } from "./download.js";
import { baekjoonSite } from "./sites/baekjoon.js";
import { programmersSite } from "./sites/programmers.js";

const supportedSites = [baekjoonSite, programmersSite];
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
    const site = supportedSites.find((site) => site.matches(url));
    return site ? site.resolve(url, title) : null;
};
