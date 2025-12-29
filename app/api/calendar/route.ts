import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // 1. 環境変数のチェック
        const EMAIL = process.env.GOOGLE_SERVICE_EMAIL;
        const KEY = process.env.GOOGLE_PRIVATE_KEY;
        const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

        if (!EMAIL || !KEY || !CALENDAR_ID) {
            // 設定がまだの場合は、ダミーデータを返す（エラーにしない）
            return NextResponse.json({
                events: [],
                message: "Google Calendar credentials are missing. Showing default availability.",
                isConfigured: false
            });
        }

        // 2. 秘密鍵のフォーマット調整（改行コードの処理）
        const formatKey = KEY.replace(/\\n/g, "\n");

        // 3. Google APIの認証
        const jwtClient = new google.auth.JWT({
            email: EMAIL,
            key: formatKey,
            scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
        });

        // 4. カレンダーAPIクライアントの作成
        const calendar = google.calendar({ version: "v3", auth: jwtClient });

        // 5. 期間指定（今月の1日 〜 来月末まで）
        const now = new Date();
        const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const timeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

        // 6. 予定の取得
        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: timeMin,
            timeMax: timeMax,
            maxResults: 200,
            singleEvents: true,
            orderBy: "startTime",
        });

        const events = response.data.items || [];

        // 7. データの返却
        return NextResponse.json({
            events: events,
            isConfigured: true
        });

    } catch (error) {
        console.error("Calendar API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch calendar events" },
            { status: 500 }
        );
    }
}
