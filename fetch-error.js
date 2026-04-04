async function fetchError() {
  const r = await fetch("http://localhost:3000");
  const t = await r.text();
  console.log(t.substring(t.indexOf("PrismaClientKnownRequestError"), t.indexOf("PrismaClientKnownRequestError") + 1000));
}
fetchError();
