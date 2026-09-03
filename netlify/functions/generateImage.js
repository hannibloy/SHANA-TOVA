exports.handler = async function(event, context) {
    // הגדרות אבטחה בסיסיות (CORS)
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "OK" };
    }

    try {
        // 1. קבלת הנתונים שהמשתתפת הזינה באפליקציה (הזרע, הטקסט, והסגנון)
        const body = JSON.parse(event.body);
        const { seedName, userText, style } = body;
        
        // 2. שליפת המפתח הסודי מ-Netlify
        const apiKey = process.env.API_KEY; 

        if (!apiKey) {
            return { 
                statusCode: 500, 
                headers,
                body: JSON.stringify({ success: false, error: "Missing API Key in Netlify" }) 
            };
        }

        // 3. בניית ה"פרומפט" הפדגוגי המדויק לבינה המלאכותית
        const aiPrompt = `A ${style} style illustration of: ${userText}. The central pedagogical theme is the value of ${seedName}. Soft pastel colors, minimalist watercolor aesthetics, inspiring and therapeutic atmosphere, safe space, clean background.`;

        // 4. הקריאה לבינה המלאכותית (הקוד כאן מותאם ל-OpenAI DALL-E, הסטנדרט הנפוץ ביותר)
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3", // מודל יצירת התמונות
                prompt: aiPrompt,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();

        // 5. החזרת התמונה האמיתית לאפליקציה שלך
        if (data.data && data.data[0]) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, imageUrl: data.data[0].url })
            };
        } else {
            console.error("AI API Error:", data);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ success: false, error: "שגיאה ביצירת התמונה" })
            };
        }

    } catch (error) {
        console.error("Server Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
