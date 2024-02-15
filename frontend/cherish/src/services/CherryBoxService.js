export async function getYearMonth(coupleId) {
  const response = await fetch(
    `${
      import.meta.env.VITE_APP_BACKEND_URL
    }/video/getYearMonth?coupleId=${coupleId}`
  );

  if (!response.ok) {
    const error = new Error("에러가 발생하였습니다 다시 시도해주세요");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const yearMonth = await response.json();
  return yearMonth;
}

export async function fetchMonthList(coupleId, date) {
  const response = await fetch(
    `${
      import.meta.env.VITE_APP_BACKEND_URL
    }/video/getVideo?coupleId=${coupleId}&yearMonth=${date}`
  );

  if (!response.ok) {
    const error = new Error("에러가 발생하였습니다 다시 시도해주세요");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const videoList = await response.json();
  return videoList;
}
