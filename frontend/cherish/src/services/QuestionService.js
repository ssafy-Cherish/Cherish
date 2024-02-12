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
