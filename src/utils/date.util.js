//시:분:초 를 버리고 '오늘' 날짜만 만드는 함수 한국시간 기준으로
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export const formatDateTime = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

export const getToday = () => {
  const kstNow = new Date(new Date().getTime() + KST_OFFSET_MS);
  return new Date(
    Date.UTC(
      kstNow.getUTCFullYear(),
      kstNow.getUTCMonth(),
      kstNow.getUTCDate(),
    ),
  );
};
