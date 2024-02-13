export async function getPinedClip(coupleId) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_BACKEND_URL}/clip/pin/${coupleId}`
  );

  if (!response.ok) {
    const error = new Error("에러가 발생하였습니다 다시 시도해주세요");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const pinedClip = await response.json();
  return pinedClip;
}
