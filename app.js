const seeds = [
    { id: 'growth', name: 'צמיחה', icon: '🌱' },
    { id: 'connection', name: 'חיבור', icon: '🤝' },
    { id: 'courage', name: 'אומץ', icon: '🦁' },
    { id: 'curiosity', name: 'סקרנות', icon: '🔍' },
    { id: 'good_eye', name: 'עין טובה', icon: '✨' },
    { id: 'cohesion', name: 'לכידות', icon: '🔗' },
    { id: 'unity', name: 'אחדות', icon: '🧩' },
    { id: 'hope', name: 'תקווה', icon: '🕊️' },
    { id: 'dream', name: 'חלום', icon: '💭' }
];

let selectedSeed = null;

// פונקציות מעבר בין מסכים
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// בניית מסך הזרעים
function renderSeeds() {
    const container = document.getElementById('seeds-container');
    container.innerHTML = '';
    
    seeds.forEach(seed => {
        const card = document.createElement('div');
        card.className = 'seed-card';
        card.innerHTML = `
            <span class="seed-icon">${seed.icon}</span>
            <span class="seed-title">${seed.name}</span>
        `;
        card.onclick = () => selectSeed(seed);
        container.appendChild(card);
    });
}

function selectSeed(seed) {
    selectedSeed = seed;
    document.getElementById('selected-seed-name').innerText = seed.name;
    document.getElementById('final-seed-name').innerText = seed.name;
    showScreen('screen-2');
}

// תהליך ההשקיה והאנימציה
document.getElementById('water-btn').onclick = async () => {
    const userPrompt = document.getElementById('user-prompt').value;
    if (!userPrompt.trim()) {
        alert("אנא כתבו תיאור קצר כדי להשקות את הזרע.");
        return;
    }

    showScreen('screen-loading');
    
    // אנימציית התפתחות הצמח (דמוי השהייה)
    const plantStage = document.getElementById('plant-stage');
    setTimeout(() => { plantStage.innerText = '🌿'; }, 1500);
    setTimeout(() => { plantStage.innerText = '🌸'; }, 3000);

    // קריאה ל-API של התמונות
    const imageUrl = await generateImage(selectedSeed.name, userPrompt);
    
    document.getElementById('generated-image').src = imageUrl;
    document.getElementById('final-vision').innerText = `"${userPrompt}"`;
    
    setTimeout(() => {
        showScreen('screen-3');
        plantStage.innerText = '🌱'; // איפוס
    }, 4500);
};

// פונקציה לבקשת תמונה מה-API
async function generateImage(seedName, userText) {
    // ---------------------------------------------------------
    // כאן נכנס הקוד לתקשורת עם Google API (Vertex AI / Imagen 3)
    // ---------------------------------------------------------
    const API_KEY = 'הכנס_כאן_את_המפתח_שלך'; 
    const API_URL = 'כאן_תיכנס_כתובת_ה_API_של_גוגל';

    /*
    דוגמה למבנה קריאה אמיתי (מוסתר כרגע כדי לא לגרום לשגיאות):
    
    const fullPrompt = `Watercolor painting, soft pastel colors, educational concept of ${seedName}. Scene: ${userText}`;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                prompt: fullPrompt,
                // פרמטרים נוספים של המודל
            })
        });
        const data = await response.json();
        return data.image_url; // התאמה למבנה התשובה של גוגל
    } catch(err) {
        console.error("שגיאה ביצירת תמונה", err);
    }
    */

    // לבינתיים, כדי שהאפליקציה תעבוד עד חיבור ה-API, נחזיר תמונת Placeholder בסגנון צבעי מים:
    return `https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTI2OTd8MHwxfHNlYXJjaHwyfHx3YXRlcmNvbG9yJTIwcGxhbnR8ZW58MHx8fHwxNzA5NjM4ODc0fDA&ixlib=rb-4.0.3&q=80&w=800`;
}

document.getElementById('restart-btn').onclick = () => {
    document.getElementById('user-prompt').value = '';
    showScreen('screen-1');
};

// אתחול המסך הראשון
renderSeeds();
showScreen('screen-1');
