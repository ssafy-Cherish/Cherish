import Kakao, { getAccessToken } from "../utils/Kakao";

export async function checkByCode(code) {
	const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/user/code?code=${code}`);
	const resData = await res.json();

	if (!res.ok) {
		throw new Error("checkByCode Fetch Error occured!");
	}

	return resData;
}

export async function kakaoLoginFetch() {
	const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/user/login`, {
		headers: {
			Authorization: getAccessToken(),
		},
	});
	const resData = await response.json();

	if (!response.ok) {
		throw Error("login fetch Error");
	}

	return resData;
}

export async function userDeleteFetch({ userId, coupleId }) {
	const res = await fetch(
		`${import.meta.env.VITE_APP_BACKEND_URL}/user/delete/${userId}/${coupleId}`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: getAccessToken(),
			},
		}
	);

	if (!res.ok) {
		new Error("userDelete Fetch Error");
	}

	return res;
}

export async function userModifyFetch({ formData }) {
	console.log(formData);
	const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/user/modifyUser`, {
		method: "PUT",
		headers: {
			Authorization: Kakao.Auth.getAccessToken(),
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	});

	if (!res.ok) {
		throw new Error("user Modify Fetch Error");
	}

	return res;
}
