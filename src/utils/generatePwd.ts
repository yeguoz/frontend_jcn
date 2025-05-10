
export function generateRandomPwd() {
  const randomPwd = Math.random().toString(36).slice(-6);
  return randomPwd;
}