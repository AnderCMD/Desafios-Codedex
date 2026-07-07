// --- Configuration & Constants ---
const ASTROLOGY_API_URL = 'https://api.astrology-api.io/api/v3/horoscope/sign/daily';
// Domain-restricted API Key (safe to use in frontend since it only accepts requests from your domain)
const ASTROLOGY_API_KEY = 'ask_31a09e9c326729a9858fd82be3c4c3e5c38075fbb3bf93dd1d4d9029db7b2448';

// User-facing translation mapping for zodiac signs
const ZODIAC_SIGNS = {
    'Aries': { nameEs: 'Aries', emoji: '♈️', dates: '21 Mar - 20 Abr' },
    'Taurus': { nameEs: 'Tauro', emoji: '♉️', dates: '21 Abr - 20 May' },
    'Gemini': { nameEs: 'Géminis', emoji: '♊️', dates: '21 May - 21 Jun' },
    'Cancer': { nameEs: 'Cáncer', emoji: '♋️', dates: '22 Jun - 22 Jul' },
    'Leo': { nameEs: 'Leo', emoji: '♌️', dates: '23 Jul - 22 Ago' },
    'Virgo': { nameEs: 'Virgo', emoji: '♍️', dates: '23 Ago - 22 Sep' },
    'Libra': { nameEs: 'Libra', emoji: '♎️', dates: '23 Sep - 22 Oct' },
    'Scorpio': { nameEs: 'Escorpio', emoji: '♏️', dates: '23 Oct - 22 Nov' },
    'Sagittarius': { nameEs: 'Sagitario', emoji: '♐️', dates: '23 Nov - 21 Dic' },
    'Capricorn': { nameEs: 'Capricornio', emoji: '♑️', dates: '22 Dic - 20 Ene' },
    'Aquarius': { nameEs: 'Acuario', emoji: '♒️', dates: '21 Ene - 19 Feb' },
    'Pisces': { nameEs: 'Piscis', emoji: '♓️', dates: '20 Feb - 20 Mar' }
};

// User-facing translation mapping for life areas
const LIFE_AREAS_ES = {
    'identity': 'Identidad',
    'health': 'Salud',
    'finance': 'Finanzas',
    'career': 'Trabajo',
    'love': 'Amor',
    'relationships': 'Relaciones',
    'creativity': 'Creatividad',
    'spirituality': 'Espiritualidad',
    'home': 'Hogar',
    'learning': 'Estudios',
    'communication': 'Comunicación',
    'travel': 'Viajes'
};

// User-facing translation mapping for moon phases
const MOON_PHASES_ES = {
    'new moon': 'Luna Nueva',
    'waxing crescent': 'Luna Creciente',
    'first quarter': 'Cuarto Creciente',
    'waxing gibbous': 'Luna Gibosa Creciente',
    'full moon': 'Luna Llena',
    'waning gibbous': 'Luna Gibosa Menguante',
    'last quarter': 'Cuarto Menguante',
    'waning crescent': 'Luna Menguante'
};

// --- Helper Functions ---

/**
 * Calculates the zodiac sign based on a date string (YYYY-MM-DD)
 * @param {string} dateString 
 * @returns {string|null} Sign key name in English (e.g. 'Aries', 'Taurus')
 */
function getZodiacSignFromDate(dateString) {
    const month = parseInt(dateString.substring(5, 7), 10);
    const day = parseInt(dateString.substring(8, 10), 10);

    if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) return 'Aries';
    if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'Gemini';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 22)) return 'Scorpio';
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 20)) return 'Capricorn';
    if ((month === 1 && day >= 21) || (month === 2 && day <= 19)) return 'Aquarius';
    if ((month === 2 && day >= 20) || (month === 3 && day <= 20)) return 'Pisces';
    return null;
}

/**
 * Translates a text string from English to Spanish using MyMemory API
 * @param {string} text 
 * @returns {Promise<string>} Translated text or original if failed
 */
async function translateToSpanish(text) {
    if (!text) return '';
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`);
        const data = await response.json();
        return data.responseData.translatedText || text;
    } catch (error) {
        console.error('Translation error occurred:', error);
        return text;
    }
}

/**
 * Converts a numerical rating (1-5) to a star character string representation
 * @param {number} rating 
 * @returns {string} Fenced star string
 */
function getStarsHTML(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

/**
 * Translates the moon phase names into Spanish
 * @param {string} phase 
 * @returns {string} Translated phase
 */
function translateMoonPhase(phase) {
    if (!phase) return '';
    const cleanPhase = phase.toLowerCase().trim();
    return MOON_PHASES_ES[cleanPhase] || phase;
}

// --- Main Operations ---

/**
 * Triggers zodiac sign calculation from form birthday input
 * @param {Event} event 
 */
function calculateSign(event) {
    event.preventDefault();
    const dateValue = document.getElementById('Fecha').value;
    if (!dateValue) return;

    const calculatedSign = getZodiacSignFromDate(dateValue);
    if (calculatedSign) {
        selectSign(calculatedSign);
    } else {
        alert('Por favor selecciona una fecha válida.');
    }
}

/**
 * Selects a zodiac sign, queries the API, translates responses, and displays results inside modal
 * @param {string} signKey 
 */
async function selectSign(signKey) {
    const modalElement = document.getElementById('horoscopeModal');
    const loaderElement = document.getElementById('modalLoader');
    const dataElement = document.getElementById('modalData');

    // Show modal overlay and loading animation spinner
    modalElement.classList.add('active');
    loaderElement.classList.remove('hidden');
    dataElement.classList.add('hidden');

    try {
        // Fetch horoscope directly from Astrology API (secured via domain-restriction)
        const response = await fetch(ASTROLOGY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ASTROLOGY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sign: signKey })
        });

        if (!response.ok) {
            throw new Error('No se pudo conectar con el templo estelar.');
        }

        const responsePayload = await response.json();
        if (!responsePayload.success || !responsePayload.data) {
            throw new Error('Las estrellas no respondieron el día de hoy.');
        }

        const rawData = responsePayload.data;

        // Perform batch translation request to reduce translation API latency & request volume
        const textsToTranslate = [];
        textsToTranslate.push(rawData.overall_theme);

        const tipsList = rawData.tips || [];
        tipsList.forEach(tip => textsToTranslate.push(tip));

        const lifeAreasList = rawData.life_areas || [];
        lifeAreasList.forEach(area => textsToTranslate.push(area.prediction));

        // Send unified request using a custom split delimiter
        const combinedString = textsToTranslate.join(' ### ');
        const translatedResultString = await translateToSpanish(combinedString);

        // Reconstruct arrays by splitting on delimiter
        const translatedChunks = translatedResultString.split(/\s*###\s*/);

        let overallThemeEs = rawData.overall_theme;
        let tipsEs = [...tipsList];
        let predictionsEs = lifeAreasList.map(area => area.prediction);

        if (translatedChunks.length === textsToTranslate.length) {
            overallThemeEs = translatedChunks[0];
            for (let i = 0; i < tipsList.length; i++) {
                tipsEs[i] = translatedChunks[1 + i];
            }
            for (let i = 0; i < lifeAreasList.length; i++) {
                predictionsEs[i] = translatedChunks[1 + tipsList.length + i];
            }
        } else {
            // Fallback to individual translations if parsing mismatch occurs
            overallThemeEs = await translateToSpanish(rawData.overall_theme);
            for (let i = 0; i < tipsList.length; i++) {
                tipsEs[i] = await translateToSpanish(tipsList[i]);
            }
            for (let i = 0; i < lifeAreasList.length; i++) {
                predictionsEs[i] = await translateToSpanish(lifeAreasList[i].prediction);
            }
        }

        // Render target values inside the HTML DOM
        const targetSign = ZODIAC_SIGNS[signKey];
        document.getElementById('modalSignEmoji').textContent = targetSign.emoji;
        document.getElementById('modalSignName').textContent = targetSign.nameEs;
        document.getElementById('modalSignDates').textContent = targetSign.dates;

        // Format dates into local user Spanish context
        const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const localSignDate = new Date(rawData.date + 'T12:00:00'); // Prevent timezone offset shift
        document.getElementById('modalHoroscopeDate').textContent = localSignDate.toLocaleDateString('es-ES', formatOptions);

        // Overall theme
        document.getElementById('modalThemeText').textContent = overallThemeEs;

        // Luck Elements
        const luckyElements = rawData.lucky_elements || {};
        const translatedColors = luckyElements.colors ? await translateToSpanish(luckyElements.colors.join(', ')) : 'N/A';
        const translatedStones = luckyElements.stones ? await translateToSpanish(luckyElements.stones.join(', ')) : 'N/A';

        document.getElementById('luckyNumbers').textContent = luckyElements.numbers ? luckyElements.numbers.join(', ') : 'N/A';
        document.getElementById('luckyColors').textContent = translatedColors;
        document.getElementById('luckyStones').textContent = translatedStones;

        const moonInfo = rawData.moon || {};
        const moonPhaseText = translateMoonPhase(moonInfo.phase || rawData.moon_phase);
        const moonEmojiChar = moonInfo.emoji || '🌙';
        document.getElementById('moonPhase').textContent = `${moonEmojiChar} ${moonPhaseText}`;

        // Life area cards
        const areasGridElement = document.getElementById('areasGrid');
        areasGridElement.innerHTML = '';
        lifeAreasList.forEach((area, index) => {
            const mappedTitleEs = LIFE_AREAS_ES[area.area] || area.title;
            const areaCardDiv = document.createElement('div');
            areaCardDiv.className = 'area-card';
            areaCardDiv.innerHTML = `
                <div class="area-card-header">
                    <span class="area-emoji">${area.extra?.emoji || '✦'}</span>
                    <span class="area-title">${mappedTitleEs}</span>
                    <span class="area-rating">${getStarsHTML(area.rating)}</span>
                </div>
                <p class="area-prediction">${predictionsEs[index]}</p>
            `;
            areasGridElement.appendChild(areaCardDiv);
        });

        // Daily Tips List
        const tipsContainerElement = document.getElementById('modalTipsList');
        tipsContainerElement.innerHTML = '';
        tipsEs.forEach(tip => {
            const listElement = document.createElement('li');
            listElement.textContent = tip;
            tipsContainerElement.appendChild(listElement);
        });

        // Toggle visibility from loader to data container
        loaderElement.classList.add('hidden');
        dataElement.classList.remove('hidden');

    } catch (error) {
        console.error('Stellar operation failed:', error);
        loaderElement.classList.add('hidden');
        alert(error.message || 'Hubo un error al calcular el horóscopo. Inténtalo más tarde.');
        closeModal();
    }
}

/**
 * Hides the daily horoscope modal
 */
function closeModal() {
    const modalElement = document.getElementById('horoscopeModal');
    modalElement.classList.remove('active');
}

// Close modal when user clicks outside the modal content box
window.onclick = function(event) {
    const modalElement = document.getElementById('horoscopeModal');
    if (event.target === modalElement) {
        closeModal();
    }
};
