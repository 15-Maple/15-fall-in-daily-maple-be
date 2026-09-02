# 🐿️ Fall in Daily (Back-End)

> Fall in Daily : 도토리 모으는 일상 습관 <br> Maple 팀의 백엔드 레포지토리입니다.

## 🛠️ 기술 스택 (Tech Stack)

- **런타임 및 프레임워크:** Node.js, Express 5
- **데이터베이스 및 ORM:** PostgreSQL, Prisma
- **코드 품질 및 자동화:** ESLint, Prettier, Husky, lint-staged, Commitlint
- **기타 주요 설정:** ES Modules(`import/export`), Subpath Imports(`#` 기반 절대 경로)

## 🚀 시작 가이드 (Getting Started)

프로젝트를 클론하고 개발을 시작하기 위한 초기 세팅 방법입니다. **데이터베이스 세팅이 포함되어 있으니 순서대로 천천히 따라와 주세요!**

### 1. 프로젝트 클론 및 폴더 열기

```bash
git clone https://github.com/15-Maple/15-fall-in-daily-maple-be.git
```

원하는 위치로 이동하여 클론 후, VS Code에서 해당 폴더를 열어주세요.

### 2. 확장 프로그램 설치

VS Code 우측 하단에 **"이 작업 영역에 권장되는 확장 프로그램이 있습니다"** 팝업이 뜨면 [설치]를 눌러주세요. _(설치 목록: Prettier, ESLint)_

### 3. 환경변수(.env) 설정하기 (중요!)

프로젝트 루트에 있는 `env/` 폴더로 이동합니다.

1. `.env.example` 파일을 복사하여 `.env.development` 라는 이름의 파일을 만듭니다.
2. `.env.development` 파일을 열고 `DATABASE_URL` 부분에 본인 로컬의 PostgreSQL 아이디와 비밀번호를 입력해 주세요.  
   (Mac의 경우 샘플과 똑같이 설정 / Window는 비밀번호 입력해야 함)

### 4. 패키지 설치 및 데이터베이스 동기화

VS Code 터미널을 열고 아래 명령어를 **순서대로** 입력하세요. 본인의 컴퓨터에 PostgreSQL 서버가 꼭 켜져 있어야 합니다.

```bash
# 1. 패키지 다운로드
npm install

# 2. 데이터베이스 테이블 자동 생성 (Prisma)
npm run prisma:migrate
```

> 🚨 `npm run prisma:migrate` 실행 시 터미널에서 _"Database 'test_log' does not exist... Do you want to create it? (Y/n)"_ 라고 물어보면, **`y`를 입력하고 엔터**를 치세요! 빈 DB와 테이블을 만들어 줍니다.

### 5. 로컬 서버 실행

```bash
npm run dev
```

## 📂 폴더 구조 (Directory Architecture)

현재 프로젝트는 3-Layer 아키텍처(Controller - Service - Repository(Prisma))를 기반으로 역할을 명확히 분리하고 있습니다.

```text
📦src
 ┣ 📂config        # DB 연결 및 환경변수(env) 설정 검증
 ┣ 📂constants     # 프로젝트 공통 상수 (에러 메시지, HTTP 상태 코드 등)
 ┣ 📂controllers   # 클라이언트의 요청(req)을 받고 응답(res)을 보내는 곳
 ┣ 📂errors        # 종류별 커스텀 에러 클래스 모음 (NotFound, BadRequest 등)
 ┣ 📂middlewares   # 글로벌 에러 핸들러 등 공통 미들웨어 로직
 ┣ 📂routes        # API 엔드포인트(URL)와 컨트롤러를 연결해 주는 이정표
 ┣ 📂services      # 실제 비즈니스 로직과 DB 조회가 일어나는 곳
 ┣ 📂utils         # 프로젝트 전역에서 쓰이는 공통 도우미 함수들
 ┣ 📜app.js        # Express 앱 세팅, 미들웨어/라우터 조립
 ┗ 📜server.js     # 서버를 실제로 켜는(Listen) 엔트리포인트 파일
```

## 🤝 Git 협업 규칙 및 자동화 도구

프론트엔드와 동일한 협업 자동화 도구가 프로젝트에 적용되어 있습니다. `npm install`을 하면 자동으로 세팅이 완료됩니다.

### 3가지 자동화 도구의 역할

- **🐶 Husky (허스키):** 여러분이 커밋을 시도할 때, 코드가 잘 짜였는지 규칙을 검사하도록 명령을 내리는 깃(Git) 훅 관리자입니다.
- **📦 lint-staged:** 전체 파일이 아닌, **여러분이 이번에 수정한 파일만** 골라서 문법 검사(ESLint)와 자동 정렬(Prettier)을 실행해 줍니다.
- **📝 Commitlint:** 커밋 메시지가 우리 팀 규칙에 맞는지 검사하고, 틀리면 커밋을 막아줍니다.

### 커밋 메시지 작성 규칙

커밋 메시지는 반드시 아래 양식을 지켜주세요! (양식을 지키지 않으면 커밋이 거절됩니다)

> `타입(스코프): 제목` <br>
> (예시: `feat(habit): 습관 기록 기능 추가`)

1. **타입 (Type)**: 아래 7가지만 소문자로 작성해 주세요.

- `feat`, `fix`, `style`, `chore`, `refactor`, `docs`, `test`

2. **스코프 (Scope)**: **반드시 괄호 안에 작성해야 합니다!**

- 특정 도메인 API 작업 시: `record`, `habit` 등 도메인명
- 글로벌 세팅 작업 시: `config`, `error`, `middleware`
- 환경 설정 작업 시: `env` (예: 패키지 설치, 린트 설정)
- 데이터베이스 작업 시: `db` (예: Prisma 스키마 변경, 마이그레이션)
- GitHub 관련 작업 시: `github` (예: PR 템플릿, Issue 템플릿)

3. **제목 (Subject)**:

- 비워둘 수 없으며, 최대 72자까지 작성 가능합니다.
- 한글과 영어 대소문자를 자유롭게 섞어 쓸 수 있습니다.

## 💻 사용 가능한 스크립트 명령어

터미널에서 `npm run <명령어>` 형태로 사용할 수 있습니다.

### 🏃‍♂️ 서버 실행 관련

- **`npm run dev`** : 개발용 서버를 실행합니다. (코드를 수정하면 자동으로 서버가 재시작됩니다.)
- **`npm run start`** : 일반적인 서버 실행 명령어입니다.
- **`npm run start:prod`** : 배포(운영) 환경용 환경변수(`.env.production`)를 적용하여 서버를 실행합니다.

### 🗄️ 데이터베이스 (Prisma) 관련

- **`npm run prisma:generate`** : `schema.prisma`가 변경되었을 때, 자바스크립트에서 쓸 수 있는 DB 클라이언트(번역기)를 최신화합니다.
- **`npm run prisma:migrate`** : 스키마 변경 사항을 실제 데이터베이스 테이블에 적용(마이그레이션)합니다.
- **`npm run prisma:studio`** : 브라우저에서 데이터베이스를 엑셀처럼 쉽게 보고 수정할 수 있는 관리자 화면(Prisma Studio)을 엽니다.

### 🧹 코드 퀄리티 (Lint & Format) 관련

- **`npm run lint`** : 프로젝트 전체 파일의 자바스크립트 문법 및 컨벤션 에러를 검사합니다.
- **`npm run lint:fix`** : 문법 검사를 수행하고, 자동으로 고칠 수 있는 에러(import 순서 등)는 알아서 수정합니다.
- **`npm run format`** : 프로젝트 전체 파일의 띄어쓰기, 줄바꿈 등을 일괄 정렬(Prettier)합니다.
