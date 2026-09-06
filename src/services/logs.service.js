import { prisma } from "#db";
import { BadRequestException } from "#errors";

// 데이터 처리와 로직만 담당함 (req, res를 알 수 없음)
export const getLogs = async () => {
  // Prisma(내장 Repository) 사용
  const logs = await prisma.log.findMany();
  return logs;
};

// 배경 허용값
const ALLOWED_BACKGROUNDS = [
  "bgGreen",
  "bgYellow",
  "bgBlue",
  "bgPink",
  "bgDesk",
  "bgWindow",
  "bgTile",
  "bgPlant",
];

export const createLog = async (logData = {}) => {
  const { nickname, name, description, background, password, passwordConfirm } =
    logData;

  // 필수항목(nickname, name, background, password, passwordConfirm) 누락
  if (!nickname || !name || !background || !password || !passwordConfirm) {
    throw new BadRequestException("필수 정보가 누락되었습니다.");
  }

  const trimmedNickname = nickname.trim();
  const trimmedName = name.trim();
  const trimmedDescription = description?.trim() || null;
  // 근데 여기서 description을 null로 하는게 나은가 ""빈문자열로 하는게 나을까??
  // nullable이니까 null인가?

  // 닉네임 글자수 > 12
  if (trimmedNickname.length > 12) {
    throw new BadRequestException("닉네임 글자수 초과입니다.");
  }

  // 로그 이름 글자수 > 20
  if (trimmedName.length > 20) {
    throw new BadRequestException("로그 이름 글자수 초과입니다.");
  }

  // 소개 글자수 > 140
  if (trimmedDescription && trimmedDescription.length > 140) {
    throw new BadRequestException("소개 글자수 초과입니다.");
  }

  // 배경 값 목록에 없는 내용 들어옴
  if (!ALLOWED_BACKGROUNDS.includes(background)) {
    throw new BadRequestException("허용되지 않은 배경입니다.");
  }

  // 비밀번호와 비밀번호 확인 불일치
  if (password !== passwordConfirm) {
    throw new BadRequestException(
      "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    );
  }

  // password 암호화 로직 추가해야 한다.
  const hashedPassword = password;

  // Prisma(내장 Repository) 사용
  const savedLog = await prisma.log.create({
    data: {
      nickname: trimmedNickname,
      name: trimmedName,
      description: trimmedDescription,
      background,
      password: hashedPassword,
    },
  });

  return {
    logId: savedLog.id,
    nickname: savedLog.nickname,
    name: savedLog.name,
    description: savedLog.description,
    background: savedLog.background,
    points: savedLog.points,
    createdAt: savedLog.createdAt,
  };
};
