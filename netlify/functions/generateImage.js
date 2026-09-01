exports.handler = async function(event, context) {
    // מוודאים שהבקשה נשלחה בצורה תקינה
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // שולפים את הנתונים שהמשתמש שלח מהאפליקציה
        const { seedName, userText, style } = JSON.parse(event.body);
        
        // שולפים את המפתח הסודי שהטמנת ב-Netlify
        const API_KEY = process.env.GOOGLE_API_KEY;

        if (!API_KEY) {
            throw new Error("מפתח ה-API חסר בשרת.");
        }

        // הגדרת סגנונות העיצוב עבור הבינה המלאכותית
        const stylePrompts = {
            'watercolor': 'Create a beautiful, minimalist watercolor illustration, soft pastel colors, cream background, delicate brush strokes.',
            'botanical': 'Create a clean, minimalist botanical line-art illustration, subtle natural colors, elegant and simple.',
            '3d-clay': 'Create a soft, 3D claymation Pixar-style illustration, warm lighting, smooth textures, cute and inviting.'
        };

        const selectedStylePrompt = stylePrompts[style] || stylePrompts['watercolor'];
        
        // הפרומפט המלא שנשלח ל-AI
        const fullPrompt = `${selectedStylePrompt} The core educational theme is '${seedName}'. Specific scene details: ${userText}`;

        /* 
        =========================================================
        כאן תתבצע הקריאה האמיתית ל-API של גוגל (Imagen / Vertex AI).
        מכיוון שקריאות יצירת תמונה משתנות מעט בהתאם לסוג החשבון שלך, 
        השארתי כאן את המבנה המוכן. כרגע זה מחזיר תמונות דמה לפי הסגנון, 
        כדי שתוכלי לבדוק שהמערכת עובדת, לפני חיבור סופי לחיוב של גוגל.
        =========================================================
        */

        let dummyImageUrl = "";
        if (style === 'watercolor') dummyImageUrl = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTI2OTd8MHwxfHNlYXJjaHwyfHx3YXRlcmNvbG9yJTIwcGxhbnR8ZW58MHx8fHwxNzA5NjM4ODc0fDA&ixlib=rb-4.0.3&q=80&w=800";
        if (style === 'botanical') dummyImageUrl = "https://images.unsplash.com/photo-1611078816578-872fdb611e3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTI2OTd8MHwxfHNlYXJjaHwzfHxib3RhbmljYWwlMjBpbGx1c3RyYXRpb258ZW58MHx8fHwxNzA5NjQxMjM0fDA&ixlib=rb-4.0.3&q=80&w=800";
        if (style === '3d-clay') dummyImageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTI2OTd8MHwxfHNlYXJjaHwyfHwzZCUyMGFydHxlbnwwfHx8fDE3MDk2NDEyNTV8MA&ixlib=rb-4.0.3&q=80&w=800";

        // החזרת התשובה לאפליקציה (בהמשך נחליף את ה-dummy בכתובת שגוגל תחזיר)
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                imageUrl: dummyImageUrl,
                success: true
            })
        };

    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message, success: false }) 
        };
    }
};
