import { prisma } from "#db";

const DATABASE_NAME = "fall_in_daily";
const RESET_CONFIRMATION = `--allow-reset=${DATABASE_NAME}`;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function assertSafeSeedTarget({ databaseUrl, nodeEnv, args }) {
  let target;
  try {
    target = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid URL");
  }

  const databaseName = decodeURIComponent(target.pathname.slice(1));
  const isPostgres = ["postgresql:", "postgres:"].includes(target.protocol);
  const isConfirmed = args.includes(RESET_CONFIRMATION);

  if (
    nodeEnv !== "development" ||
    !isPostgres ||
    !LOCAL_HOSTS.has(target.hostname) ||
    databaseName !== DATABASE_NAME ||
    !isConfirmed
  ) {
    throw new Error("Refusing to reset a database outside the local target");
  }

  return true;
}

// Log가 지워지면 onDelete: Cascade로 하위 데이터 전부 지워짐
export function resetAllData() {
  return prisma.log.deleteMany();
}
