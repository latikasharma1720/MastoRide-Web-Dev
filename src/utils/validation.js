export function isPfwEmail(email = "") {
  return /^[^\s@]+@pfw\.edu$/i.test(email.trim());
}

export function isStrongPassword(pw = "") {
  return typeof pw === "string" && pw.length >= 8;
}
