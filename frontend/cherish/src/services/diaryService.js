export async function meetingFetch(coupleId, yearMonth) {
  const res = await fetch(
    `${
      import.meta.env.VITE_APP_BACKEND_URL
    }/meeting/month?coupleId=${coupleId}&yearMonth=${yearMonth}`
  );

  const resData = await res.json();

  if (!res.ok) {
    throw new Error("MonthMeeting Fetch Error");
  }

  return resData;
}

export async function dailyFetch(coupleId, date) {
  const res = await fetch(
    `${import.meta.env.VITE_APP_BACKEND_URL}/meeting/day?coupleId=${coupleId}&date=${date}`
  );

  const resData = await res.json();

  if (!res.ok) {
    throw new Error("Daily Fetch Error");
  }

  return resData;
}

export async function updateMemoFetch(memo) {
  const res = await fetch();

  const resData = await res.json();

  if (!res.ok) {
    throw new Error("update Memo Fetch Error");
  }

  return resData;
}
