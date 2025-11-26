const myAlgorithmPath = "C:\\jongkookE\\Algorithm\\src"
console.log("Popup script loaded");

document.getElementById('image-text-button').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab.title)
    if(tab.url.includes("acmicpc")){
        const className = "BOJ_" + tab.title.replace(/^(\d+)[^\w\s]+\s*(.*)/, '$1\_$2').replace(/ /g, '_');
        const filename = className +  ".java";
        downloadJavaFile(className, makeBaekjoonFormat(filename))
    }
    else if(tab.url.includes("programmers")){
        const className = "PRO_" + tab.title.replace(/^(\d+)[^\w\s]+\s*(.*)/, '$1\_$2').replace(/ /g, '_');
        const filename = className + ".java"
        console.log(filename)
        downloadJavaFile(className, makeProFormat(filename))
    }
});

const downloadJavaFile = (filename, format) => {
    const blob = new Blob([format], { type: 'java/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true  
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error("Download error:", chrome.runtime.lastError);
        } else {
            console.log("Download started:", downloadId);
        }
        URL.revokeObjectURL(url);
    });
}

const makeBaekjoonFormat = (filename) => {
    return `
import java.io.*;
import java.util.*;

public class ${filename} {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // StringTokenizer st = new StringTokenizer(br.readLine());
        // TODO: logic
    }
};
`
}

const makeProFormat = (filename) => {
    return `
import java.io.*;
import java.util.*;

public class ${filename} {
    public static void main(String[] args) {
        Solution solution = new Solution();

    }
    static class Solution{
        int solution(){
            answer = 0;
            return answer;
        }
    }
};
`
}