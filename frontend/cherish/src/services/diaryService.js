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

export async function updateMemoFetch({ coupleId, content, date }) {
  const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/memo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coupleId: coupleId,
      content: content,
      date: date,
    }),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error("update Memo Fetch Error");
  }

  return resData;
}

export async function getMemoFetch(coupleId, date) {
  const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/memo/${coupleId}/${date}`);

  const resData = await res.json();

  if (!res.ok) {
    throw new Error("Get Memo Fetch Error");
  }

  return resData;
}

export async function changePinFetch(data) {
  const res = await fetch(
    `${import.meta.env.VITE_APP_BACKEND_URL}/clip/pin/${data.clipId}/${data.mode}`,
    {
      method: "PUT",
    }
  );

  const resData = await res.json();

  if (!res.ok) {
    throw new Error("Change Pin Fetch Error");
  }

  return resData;
}

export async function deleteClipFetch(data) {
  const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/clip/${data.clipId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Delete Clip Fetch Error");
  }

  return res;
}
