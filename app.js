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

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function renderSeeds() {
    const container = document.getElementById('seeds-container');
    container.innerHTML = '';
    seeds.forEach(seed => {
        const card = document.createElement('div');
        card.className = 'seed-card';
        card.innerHTML = `<span class="seed-icon">${seed.icon}</span><span class="seed-title">${seed.name}</span>`;
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

document.getElementById('water-btn').onclick = async () => {
    const userPrompt = document.getElementById('user-prompt').value;
    if (!userPrompt.trim()) {
        alert("אנא כתבו תיאור קצר כדי להשקות את הזרע.");
        return;
    }

    // תפיסת סגנון האמנות שהמשתמש בחר
    const selectedStyle = document.querySelector('input[name="art-style"]:checked').value;

    showScreen('screen-loading');
    
    // אנימציית צמיחה להחזקת הקשב ולבניית ציפייה
    const plantStage = document.getElementById('plant-stage');
    setTimeout(() => { plantStage.innerText = '🌿'; }, 1500);
    setTimeout(() => { plantStage.innerText = '🌸'; }, 3000);

    try {
        // כאן מתבצעת הקריאה החכמה והמאובטחת לשרת הנסתר שלנו ב-Netlify
        const response = await fetch('/.netlify/functions/generateImage', {
            method: 'POST',
            body: JSON.stringify({ 
                seedName: selectedSeed.name, 
                userText: userPrompt,
                style: selectedStyle
            })
        });
        
        const data = await response.json();
        
        if(data.success) {
            document.getElementById('generated-image').src = data.imageUrl;
            document.getElementById('final-vision').innerText = `"${userPrompt}"`;
        } else {
            alert("התרחשה שגיאה בהצמחת הזרע. נסו שוב.");
        }
    } catch (error) {
        console.error("שגיאת תקשורת:", error);
        alert("שגיאת תקשורת. אנא ודאו שאתם מחוברים לרשת.");
    }
    
    setTimeout(() => {
        showScreen('screen-3');
        plantStage.innerText = '🌱'; // איפוס לקראת הפעם הבאה
    }, 4500);
};

document.getElementById('restart-btn').onclick = () => {
    document.getElementById('user-prompt').value = '';
    showScreen('screen-1');
};

// אתחול האפליקציה בטעינה הראשונה
renderSeeds();
showScreen('screen-1');
