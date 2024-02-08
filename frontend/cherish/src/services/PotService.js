export async function fetchExp(id) {
  const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/exp?coupleId=${id}`);

  if (!response.ok) {
    const error = new Error("에러가 발생하였습니다 다시 시도해주세요");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const exp = await response.json();
  return exp;
}
