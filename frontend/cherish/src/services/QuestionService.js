export async function postVideoSave(formData) {
  console.log(formData);
  const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/qna`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "*/*",
    },
  });
}

export async function getAnsList(coupleId) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_BACKEND_URL}/qna/getAns?coupleId=${coupleId}`
  );

  if (!response.ok) {
    const error = new Error("에러가 발생하였습니다 다시 시도해주세요");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const ansList = await response.json();
  return ansList;
}
