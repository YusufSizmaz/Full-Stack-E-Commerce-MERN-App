import jwt from "jsonwebtoken";

const generatedAccessToken = async (userId) => {
  const token = await jwt.sign(
    { id: userId },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    { expiresIn: "5h" }
  );
  return token;
};

export default generatedAccessToken;

// Kullanıcı ID aldık, JWT ile token oluşturduk, token'ı 5 Saat süreli yaptık.
// Oluşturdugumuz token ı döndürdük
