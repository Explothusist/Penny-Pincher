import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_AI_API_KEY } from "$env/static/private";
import { text, type RequestHandler } from "@sveltejs/kit";
import { SYSTEM_PROMPT } from "./prompt.server";

if (!GOOGLE_AI_API_KEY) throw new Error("Missing GOOGLE_AI_API_KEY!!!! Check .env");
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const POST: RequestHandler = async function({ request }) {
    const messageContext = await request.text();
    const context = SYSTEM_PROMPT + messageContext;

    const result = await model.generateContent(context);
    const out = await result.response.text();

    return text(out);
}