exports.handler = async function(event, context) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "OK" };
    }

    try {
        const body = JSON.parse(event.body);
        const { seedName, userText, style } = body;
        
        // שליפת המפתח של Gemini מתוך Netlify
        const apiKey = process.env.API_KEY; 

        if (!apiKey) {
            throw new Error("חסר מפתח API של Gemini במערכת");
        }

        // בניית הפרומפט המדויק שיתורגם לציור בצבעי מים רכים
        const aiPrompt = `A minimalist watercolor illustration of: ${userText}. The visual concept represents ${seedName}. Soft pastel colors, gentle brush strokes, warm and inspiring atmosphere, purely aesthetic, empty cream background. No text in the image.`;

        // קריאה מאובטחת לשרת יצירת התמונות של Google (Gemini/Imagen)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instances: [
                    { prompt: aiPrompt }
                ],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "1:1"
                }
            })
        });

        const data = await response.json();

        // המרת התמונה שחוזרת מגוגל לפורמט שהאתר יכול להציג מיד
        if (data.predictions && data.predictions[0]) {
            const imageBase64 = data.predictions[0].bytesBase64Encoded;
            const imageUrl = `data:image/png;base64,${imageBase64}`;
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, imageUrl: imageUrl })
            };
        } else {
            console.error("Gemini API Error:", data);
            throw new Error("הבינה המלאכותית לא הצליחה לחולל תמונה מהתיאור הזה.");
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
