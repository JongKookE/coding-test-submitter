# Coding Test Submitter

브라우저에서 코딩 테스트 사이트의 제출 형식에 맞게 Java 코드를 정리하고, 문제 이름 기준으로 파일을 내려받을 수 있게 도와주는 크롬 확장 프로그램입니다.

## 개요

이 프로젝트는 두 가지 작업을 지원합니다.

1. 현재 문제 페이지 정보를 바탕으로 Java 템플릿 파일을 생성해서 다운로드합니다.
2. 코드 붙여넣기 시 사이트별 제출 규칙에 맞게 Java 코드를 자동으로 변환합니다.

현재 지원 사이트는 아래와 같습니다.

- 백준 (`acmicpc.net`)
- 프로그래머스 (`school.programmers.co.kr`)

## 동작 방식

### 1. 팝업에서 Java 파일 다운로드

확장 프로그램 팝업의 버튼을 누르면 다음 순서로 동작합니다.

1. 현재 활성 탭의 URL과 제목을 읽습니다.
2. 사이트별 resolver가 URL 패턴을 확인합니다.
3. 문제 번호와 제목으로 Java 클래스명을 만듭니다.
4. 사이트별 기본 템플릿 코드를 생성합니다.
5. `chrome.downloads.download`로 `.java` 파일을 저장합니다.

예시 파일명 규칙:

- 백준: `BOJ_문제번호_문제이름.java`
- 프로그래머스: `PRO_문제번호_문제이름.java`

### 2. 제출 페이지에서 붙여넣기 자동 변환

각 사이트에는 content script가 주입됩니다. 사용자가 에디터에 코드를 붙여넣으면 `paste` 이벤트를 가로채서 텍스트를 변환한 뒤 다시 입력합니다.

사이트별 처리 차이는 아래와 같습니다.

- 백준
  - `package` 선언 제거
  - 클래스명을 `Main`으로 변경
- 프로그래머스
  - Java 언어 선택 여부 확인
  - `package` 선언 제거
  - `import` 문만 유지
  - `Solution` 클래스만 추출해서 제출 형식으로 정리

## 디렉터리 구조

```text
coding-test-submitter/
├─ manifest.json
├─ assets/
│  ├─ submitter.png
│  └─ Button.png
├─ popup/
│  ├─ index.html
│  ├─ index.js
│  ├─ download.js
│  └─ sites/
│     ├─ baekjoon.js
│     └─ programmers.js
└─ scripts/
   ├─ baekjoon/
   │  └─ baekjoon.js
   └─ programmers/
      └─ programmers.js
```

## 파일별 역할

### `manifest.json`

- 크롬 확장 프로그램 메타데이터 정의
- 팝업 페이지 등록
- 권한 설정
  - `activeTab`
  - `downloads`
  - `clipboardRead`
  - `clipboardWrite`
- 사이트별 content script 연결

### `popup/index.html`

- 확장 프로그램 UI의 진입점
- 다운로드 버튼 하나를 렌더링

### `popup/index.js`

- 팝업 버튼 클릭 이벤트 처리
- 현재 탭 정보 조회
- 사이트별 resolver 선택
- 다운로드 대상 파일명/내용 생성

### `popup/download.js`

- Java 소스 문자열을 `Blob`으로 만들고 다운로드 실행

### `popup/sites/baekjoon.js`

- 백준 URL/제목에서 문제 번호와 제목 추출
- Java 클래스명 생성
- 백준용 기본 템플릿 생성

### `popup/sites/programmers.js`

- 프로그래머스 lesson id와 제목 추출
- Java 클래스명 생성
- `Solution` 클래스를 포함한 기본 템플릿 생성

### `scripts/baekjoon/baekjoon.js`

- 붙여넣은 코드에서 `package` 제거
- 클래스명을 `Main`으로 변경

### `scripts/programmers/programmers.js`

- 현재 언어가 Java인지 검사
- `import` 문만 수집
- `Solution` 클래스 블록만 추출
- 프로그래머스 제출 형식으로 재조합

## 설치 및 실행

1. 크롬에서 `chrome://extensions`로 이동합니다.
2. 우측 상단의 개발자 모드를 켭니다.
3. `압축해제된 확장 프로그램을 로드합니다`를 선택합니다.
4. 이 프로젝트 폴더를 선택합니다.

## 사용 방법

### Java 파일 다운로드

1. 백준 또는 프로그래머스 문제 페이지를 엽니다.
2. 확장 프로그램 아이콘을 클릭합니다.
3. 팝업 버튼을 누릅니다.
4. 문제명 기반 `.java` 파일을 저장합니다.

### 제출용 코드 붙여넣기

1. 로컬에서 작성한 Java 코드를 복사합니다.
2. 사이트의 코드 입력 영역에 붙여넣습니다.
3. 확장 프로그램이 사이트 규칙에 맞는 형태로 자동 변환합니다.

## 현재 구현 특징

- 사이트별 규칙을 `popup/sites`, `scripts`로 분리해서 책임이 비교적 명확합니다.
- 파일 다운로드와 코드 변환 기능이 분리되어 있어 확장하기 쉽습니다.
- 새로운 사이트를 추가하려면 아래 두 지점을 함께 확장하면 됩니다.
  - 팝업용 resolver
  - 제출 페이지용 content script

## 개선 포인트

- `README` 기준 사용 예시 스크린샷 추가
- 지원 사이트 추가 시 공통 인터페이스 추상화
- 예외 처리 강화
  - 지원하지 않는 URL에서 사용자 안내
  - 제목 파싱 실패 시 fallback 규칙 보강
- 테스트 코드 추가
  - 클래스명 생성 규칙
  - 붙여넣기 변환 규칙
- 일부 한글 문자열과 주석에서 인코딩이 깨진 흔적이 있어 UTF-8 정리가 필요할 수 있음

## 확장 포인트 예시

새 사이트를 추가할 때는 보통 아래 순서로 작업하면 됩니다.

1. `popup/sites/새사이트.js` 추가
2. `matches(url)`와 `resolve(url, title)` 구현
3. `popup/index.js`의 `supportedSites`에 등록
4. `scripts/새사이트/새사이트.js` 추가
5. `manifest.json`의 `content_scripts`에 매칭 URL 등록

## 요약

이 프로젝트는 코딩 테스트 사이트별 제출 형식 차이를 줄이기 위한 크롬 확장 프로그램입니다. 핵심은 "문제 기반 Java 파일 생성"과 "붙여넣기 시 제출 형식 자동 변환"이며, 현재 구조는 사이트별 규칙을 분리한 단순한 형태로 유지되고 있습니다.
