export const downloadJavaFile = (filename, content) => {
    // 문자열 내용을 파일처럼 다루기 위해 Blob 객체를 만듭니다.
    const blob = new Blob([content], { type: "text/x-java-source;charset=utf-8" });
    // Blob을 브라우저가 다운로드할 수 있는 임시 URL로 바꿉니다.
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
            // 임시 URL은 다운로드 요청 후 바로 정리해도 됩니다.
            URL.revokeObjectURL(url);
        }
    );
};
