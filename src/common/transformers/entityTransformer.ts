export function EntityTransformer(user) {
  delete user["password"];
  return user;
}
