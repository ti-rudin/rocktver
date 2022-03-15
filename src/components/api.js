export async function getItems(page) {
	const path = `https://picsum.photos/v2/list?page=${page}&limit=15`
	const res = await fetch(path)
	return await res.json()
}