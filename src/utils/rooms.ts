export function createRoomSlug() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map((byte) => characters[byte % characters.length])
    .join("");
}
