// This really shouldn't be controlled from the client individually from the
// ai-response endpoint but unless we're going to deal with individual sessions
// for multiple users and store all message states on the server this will have
// to do.

import { text, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/db.server";

let sessionId = -1;

function incrementSessionId() {
    if (sessionId === -1) {
        const row: any = db.prepare("SELECT MAX(session_id) AS maxId FROM abe_messages;").get();
        const lastSessionId: number = (row && typeof row.maxId === 'number') ? row.maxId : -1;

        sessionId = lastSessionId;
    }

    sessionId++;
}

export const POST: RequestHandler = async function({ request }) {
    const j = await request.json();

    if (j.newSession) {
        incrementSessionId();
    }

    const query = "INSERT INTO abe_messages(session_id, author, message) VALUES(?, ?, ?);";
    db.prepare(query).run([sessionId, j["author"], j["message"]]);
    console.log("WOw", sessionId, j);

    return text("OK");
}