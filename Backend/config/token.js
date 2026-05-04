import jwt from "jsonwebtoken";
const getToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "90d" });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
    }
}
export default getToken;