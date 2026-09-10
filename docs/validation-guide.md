## 🛡️ Zod 유효성 검증 미들웨어 사용 가이드

API 입력값(body, query, params)을 안전하게 검증하고, 자동으로 타입을 변환해주는 공통 미들웨어 사용법입니다.

### 기본 원칙 (제일 중요 ⭐️)

Zod가 검증과 타입 변환(문자열 -> 숫자 등)을 완료한 데이터는 `req`가 아닌 `res.locals.validated`에 저장됩니다.
(`req.body`나 `req.query`를 사용하면 변환되기 전의 원본 문자열 데이터가 나오게 됩니다.)

### 사용 방법

> `focus-records.routes.js`, `focus-records.controller.js` 파일에도 주석으로 아래와 유사한 가이드를 적어 두었으니, 실제 사용 방법은 파일을 확인해 주세요.

#### 1. 라우터에 미들웨어 적용하기

##### ✅ Body 검증 (POST)

두 번째 인자를 생략하면 자동으로 `body`를 검사합니다.

```javascript
import { validate } from "#middlewares";
import { createSchema } from "./schemas.js"; // 따로 스키마를 만들어둔 경우

router.post("/", validate(createSchema), controller.createData);
```

##### ✅ Query 검증 (GET 목록 조회)

URL 뒤에 붙는 `?page=1` 같은 쿼리를 검사할 때는 두 번째 인자로 `"query"`를 명시해야 합니다.

```javascript
import { validate } from "#middlewares";
import { querySchema } from "./schemas.js"; // 따로 스키마를 만들어둔 경우

router.get("/", validate(querySchema, "query"), controller.getList);
```

##### ✅ Params 검증 + Body 검증 연속 사용 (PATCH/PUT)

url의 `:id`와 요청 `body`를 모두 검사하고 싶다면 미들웨어를 연속으로 붙이면 됩니다!
(참고: id 검증은 `utils/common.schema.js`의 공통 스키마를 재사용하세요.)

```javascript
import { validate } from "#middlewares";
import { idParamSchema } from "#utils/common.schema.js";
import { updateSchema } from "./schemas.js";

router.patch(
  "/:id",
  validate(idParamSchema, "params"), // 1. URL의 id 검증 및 숫자로 변환
  validate(updateSchema, "body"), // 2. body 데이터 검증
  controller.updateData,
);
```

#### 2. 컨트롤러에서 데이터 꺼내 쓰기

```javascript
export const createExample = async (req, res) => {
  // ❌ 주의: 변환이 적용되지 않은 날것의 데이터
  // const { id } = req.params;
  // const { logId } = req.body;

  // ✅ 성공: Zod가 검증하고 변환한 데이터
  const { id } = res.locals.validated.params;
  const { logId, targetSeconds } = res.locals.validated.body;
  const { page, limit } = res.locals.validated.query;
};
```

### 스키마 작성 팁

- **수정(PATCH) 스키마:** 처음부터 새로 짜지 말고 `const updateSchema = createSchema.partial();`을 쓰면 모든 필드가 자동으로 선택(optional) 값으로 바뀝니다.
- **숫자 형변환:** `query`와 `params`는 항상 문자열로 들어옵니다. 스키마 작성 시 `z.coerce.number()`를 사용하면 알아서 숫자로 바꿔줍니다.
