import bycrpt from 'bcrypt';

export const saltGen = async () => {
  return await bycrpt.genSalt();
}