const myAlgorithmPath = "C:\\jongkookE\\Algorithm\\src"
console.log("Popup script loaded");

document.getElementById('image-text-button').addEventListener('click', async () => {
    console.log("Button Clicked!!")
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab)
    const filename = "BOJ_" + tab.title.replace(/^(\d+)[^\w\s]+\s*(.*)/, '$1\_$2') + ".java";
    console.log(filename)

    downloadJavaFile(baekjoonFormat, filename)
});

const downloadJavaFile = (text, filename) => {
    const blob = new Blob([text], { type: 'java/plain;charset=utf-8' });

    // 다운로드 URL 생성
    const url = URL.createObjectURL(blob);

    // 다운로드 트리거
    chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true  // 사용자가 저장 위치를 선택할 수 있게 함
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error("Download error:", chrome.runtime.lastError);
        } else {
            console.log("Download started:", downloadId);
        }
        // URL 해제
        URL.revokeObjectURL(url);
    });
}

const baekjoonFormat = `
\\import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // StringTokenizer st = new StringTokenizer(br.readLine());
        // TODO: 코드 작성
    }
};
`