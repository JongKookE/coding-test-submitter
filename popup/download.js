export const downloadJavaFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/x-java-source;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download(
        {
            url,
            filename,
            saveAs: true,
        },
        (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error("Download error:", chrome.runtime.lastError);
            } else {
                console.log("Download started:", downloadId);
            }
            URL.revokeObjectURL(url);
        }
    );
};
