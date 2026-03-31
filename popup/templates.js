export const makeBaekjoonFormat = (className) => `import java.io.*;
import java.util.*;

public class ${className} {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // StringTokenizer st = new StringTokenizer(br.readLine());
        // TODO: implement
    }
}
`;

export const makeProgrammersFormat = (className) => `import java.util.*;

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
