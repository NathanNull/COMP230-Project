export async function getEndpoint(endpoint) {
    let res = await fetch(`http://localhost:5000/${endpoint}`);
    if (res.ok) {
        return res.json();
    } else {
        throw new Error(res.statusText);
    }
}