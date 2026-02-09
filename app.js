// Configuration
const CONFIG = {
    answerDisplayTime: 1500,
    answerCheckTime: 1000
};

// Full name mapping for ISO codes
const LANGUAGE_NAMES = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'bn': 'Bengali',
    'tr': 'Turkish',
    'nl': 'Dutch',
    'pl': 'Polish',
    'sv': 'Swedish',
    'da': 'Danish',
    'no': 'Norwegian',
    'fi': 'Finnish',
    'el': 'Greek',
    'he': 'Hebrew',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'id': 'Indonesian',
    'ms': 'Malay',
    'sw': 'Swahili',
    'fa': 'Persian',
    'uk': 'Ukrainian',
    'cs': 'Czech',
    'ro': 'Romanian',
    'hu': 'Hungarian',
    'sk': 'Slovak',
    'bg': 'Bulgarian',
    'hr': 'Croatian',
    'sr': 'Serbian',
    'sl': 'Slovenian',
    'lt': 'Lithuanian',
    'lv': 'Latvian',
    'et': 'Estonian',
    'ga': 'Irish',
    'cy': 'Welsh',
    'eu': 'Basque',
    'ca': 'Catalan',
    'gl': 'Galician',
    'af': 'Afrikaans',
    'zu': 'Zulu',
    'xh': 'Xhosa',
    'st': 'Southern Sotho',
    'tn': 'Tswana',
    'ss': 'Swati',
    've': 'Venda',
    'ts': 'Tsonga',
    'ta': 'Tamil',
    'te': 'Telugu',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'mr': 'Marathi',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'or': 'Odia',
    'as': 'Assamese',
    'ne': 'Nepali',
    'si': 'Sinhala',
    'my': 'Burmese',
    'km': 'Khmer',
    'lo': 'Lao',
    'ka': 'Georgian',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'kk': 'Kazakh',
    'uz': 'Uzbek',
    'ky': 'Kyrgyz',
    'tg': 'Tajik',
    'tk': 'Turkmen',
    'mn': 'Mongolian',
    'ps': 'Pashto',
    'ku': 'Kurdish',
    'sd': 'Sindhi',
    'ur': 'Urdu',
    'am': 'Amharic',
    'ti': 'Tigrinya',
    'om': 'Oromo',
    'so': 'Somali',
    'ha': 'Hausa',
    'yo': 'Yoruba',
    'ig': 'Igbo',
    'ff': 'Fulah',
    'rw': 'Kinyarwanda',
    'sn': 'Shona',
    'ny': 'Chichewa',
    'mg': 'Malagasy',
    'mt': 'Maltese',
    'is': 'Icelandic',
    'fy': 'Western Frisian',
    'gd': 'Scottish Gaelic',
    'br': 'Breton',
    'co': 'Corsican',
    'lb': 'Luxembourgish',
    'li': 'Limburgish',
    'oc': 'Occitan',
    'sc': 'Sardinian',
    'sq': 'Albanian',
    'bs': 'Bosnian',
    'mk': 'Macedonian'
};

// Dynamic language data - will be populated from files
let languageData = {};
let concepts = [];

// App state
let state = {
    targetLanguage: 'en',
    referenceLanguage: 'es',
    interactionMode: 'target-to-reference',
    currentConceptIndex: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    isConjugating: false,
    currentVerb: null,
    currentTense: null,
    currentPerson: null,
    conjugationTenses: ['present', 'past'],
    conjugationPersons: ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'],
    answerShown: false,
    awaitingNext: false,
    dataLoaded: false,
    usingFallbackData: false
};

// DOM Elements
const targetLanguageSelect = document.getElementById('target-language');
const referenceLanguageSelect = document.getElementById('reference-language');
const interactionModeSelect = document.getElementById('interaction-mode');
const modeIndicator = document.getElementById('mode-indicator');
const conceptMain = document.getElementById('concept-main');
const loadingIndicator = document.getElementById('loading-indicator');
const errorDisplay = document.getElementById('error-display');
const conceptIcon = document.getElementById('concept-icon');
const conceptType = document.getElementById('concept-type');
const conceptWord = document.getElementById('concept-word');
const conceptPhonetic = document.getElementById('concept-phonetic');
const conjugationDisplay = document.getElementById('conjugation-display');
const answerHidden = document.getElementById('answer-hidden');
const answerWord = document.getElementById('answer-word');
const answerPhonetic = document.getElementById('answer-phonetic');
const answerFeedback = document.getElementById('answer-feedback');
const conjugateBtn = document.getElementById('conjugate-btn');
const guessInput = document.getElementById('guess-input');
const sendBtn = document.getElementById('send-btn');
const tellBtn = document.getElementById('tell-btn');
const nextBtn = document.getElementById('next-btn');
const correctCount = document.getElementById('correct-count');
const totalCount = document.getElementById('total-count');
const accuracy = document.getElementById('accuracy');

// Fallback data
const fallbackConcepts = [
    { type: 'noun', icon: '🚪' },
    { type: 'noun', icon: '🏠' },
    { type: 'noun', icon: '🏡' },
    { type: 'noun', icon: '🏢' },
    { type: 'noun', icon: '🍳' },
    { type: 'noun', icon: '🛋️' },
    { type: 'noun', icon: '🛏️' },
    { type: 'noun', icon: '🚿' },
    { type: 'noun', icon: '🚽' }
];

// Initialize the app
async function init() {
    console.log('Initializing app...');
    
    // Set up event listeners
    targetLanguageSelect.addEventListener('change', handleLanguageChange);
    referenceLanguageSelect.addEventListener('change', handleLanguageChange);
    interactionModeSelect.addEventListener('change', handleInteractionModeChange);
    
    sendBtn.addEventListener('click', handleSendGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendGuess();
    });
    
    tellBtn.addEventListener('click', handleTellAnswer);
    nextBtn.addEventListener('click', handleNext);
    conjugateBtn.addEventListener('click', toggleConjugation);
    
    // Show loading indicator
    loadingIndicator.style.display = 'flex';
    conceptMain.style.display = 'none';
    
    // Try to load external data with timeout
    try {
        console.log('Attempting to load external data...');
        await loadAllData();
        state.dataLoaded = true;
        console.log('External data loaded successfully');
    } catch (error) {
        console.log('Failed to load external data:', error);
        showError('Using fallback data. External files could not be loaded.');
        useFallbackData();
    }
    
    // Populate dropdowns based on loaded languages
    populateLanguageDropdowns();
    
    // Set initial language selections after dropdowns are built
    if (Object.keys(languageData).length >= 2) {
        const languages = Object.keys(languageData);
        state.targetLanguage = languages[0];
        state.referenceLanguage = languages[1] || languages[0];
        targetLanguageSelect.value = state.targetLanguage;
        referenceLanguageSelect.value = state.referenceLanguage;
    }
    
    interactionModeSelect.value = state.interactionMode;
    
    // Load initial concept
    if (state.dataLoaded) {
        console.log('Loading first concept...');
        loadNewConcept();
        updateStats();
        updateModeIndicator();
    } else {
        console.error('Failed to load any data');
        showError('Failed to load data. Please check your internet connection and try again.');
    }
}

// Populate the dropdown menus dynamically
function populateLanguageDropdowns() {
    const dropdowns = [targetLanguageSelect, referenceLanguageSelect];
    const availableCodes = Object.keys(languageData);

    dropdowns.forEach(select => {
        select.innerHTML = ''; // Clear hardcoded HTML options
        
        availableCodes.forEach(code => {
            if (languageData[code] && languageData[code].length > 0) {
                const option = document.createElement('option');
                option.value = code;
                // Use the full name from mapping, or uppercase code if not found
                option.textContent = LANGUAGE_NAMES[code] || code.toUpperCase();
                select.appendChild(option);
            }
        });
    });
}

// Load all data from external files
async function loadAllData() {
    console.log('loadAllData called');
    
    try {
        console.log('Fetching concept.json...');
        const conceptsResponse = await fetchWithTimeout('data/concept.json', 3000);
        
        if (!conceptsResponse.ok) {
            throw new Error('concept.json not found');
        }
        
        const parsedConcepts = await conceptsResponse.json();
        
        if (Array.isArray(parsedConcepts)) {
            concepts = parsedConcepts.map(item => ({
                type: item.type || 'noun',
                icon: item.emoji || item.icon || '❓'
            }));
        } else {
            throw new Error('concept.json is not an array');
        }
        
    } catch (error) {
        console.log('Failed to load concept.json, will use fallback:', error);
        throw error; 
    }
    
    // First, detect which language files exist
    const possibleLanguages = Object.keys(LANGUAGE_NAMES);
    const loadPromises = possibleLanguages.map(async (lang) => {
        try {
            console.log(`Checking for ${lang}.json...`);
            const response = await fetchWithTimeout(`languages/${lang}.json`, 2000);
            
            if (!response.ok) {
                console.log(`${lang}.json not found`);
                return null;
            }
            
            const words = await response.json();
            
            if (Array.isArray(words) && words.length > 0) {
                console.log(`Loaded ${words.length} words for ${lang}`);
                return { lang, words };
            }
            return null;
            
        } catch (error) {
            console.log(`Error loading ${lang}.json:`, error.message);
            return null;
        }
    });
    
    const loadedLanguages = await Promise.all(loadPromises);
    
    // Filter out null results and populate languageData
    loadedLanguages.forEach(result => {
        if (result) {
            languageData[result.lang] = result.words;
        }
    });
    
    console.log(`Loaded ${Object.keys(languageData).length} languages:`, Object.keys(languageData));
    
    if (Object.keys(languageData).length === 0) {
        throw new Error('No language files found');
    }
    
    // Ensure padding for all loaded languages
    const targetLength = concepts.length;
    Object.keys(languageData).forEach(lang => {
        if (languageData[lang].length < targetLength) {
            console.log(`Padding ${lang} from ${languageData[lang].length} to ${targetLength} entries`);
            const fallbackWords = getFallbackWordsForLanguage(lang);
            while (languageData[lang].length < targetLength) {
                const fallbackIndex = languageData[lang].length % fallbackWords.length;
                languageData[lang].push(fallbackWords[fallbackIndex]);
            }
        }
    });
    
    state.dataLoaded = true;
}

// Helper function to get fallback words for a language
function getFallbackWordsForLanguage(lang) {
    const fallbackWords = {
        'en': [
            { word: 'room', phonetic: '/ruːm/' },
            { word: 'house', phonetic: '/haʊs/' },
            { word: 'home', phonetic: '/hoʊm/' },
            { word: 'apartment', phonetic: '/əˈpɑːrt.mənt/' },
            { word: 'kitchen', phonetic: '/ˈkɪtʃ.ɪn/' },
            { word: 'living room', phonetic: '/ˈlɪv.ɪŋ ˌruːm/' },
            { word: 'bedroom', phonetic: '/ˈbed.ruːm/' },
            { word: 'bathroom', phonetic: '/ˈbæθ.ruːm/' },
            { word: 'toilet', phonetic: '/ˈtɔɪ.lət/' }
        ],
        'es': [
            { word: 'habitación', phonetic: '/a.βi.taˈθjon/' },
            { word: 'casa', phonetic: '/ˈka.sa/' },
            { word: 'hogar', phonetic: '/oˈɡaɾ/' },
            { word: 'apartamento', phonetic: '/a.paɾ.taˈmen.to/' },
            { word: 'cocina', phonetic: '/koˈθi.na/' },
            { word: 'sala de estar', phonetic: '/ˈsa.la ðe esˈtaɾ/' },
            { word: 'dormitorio', phonetic: '/doɾ.miˈto.ɾjo/' },
            { word: 'baño', phonetic: '/ˈba.ɲo/' },
            { word: 'inodoro', phonetic: '/i.noˈðo.ɾo/' }
        ],
        'fr': [
            { word: 'chambre', phonetic: '/ʃɑ̃bʁ/' },
            { word: 'maison', phonetic: '/mɛ.zɔ̃/' },
            { word: 'maison', phonetic: '/mɛ.zɔ̃/' },
            { word: 'appartement', phonetic: '/a.paʁ.tə.mɑ̃/' },
            { word: 'cuisine', phonetic: '/kɥi.zin/' },
            { word: 'salon', phonetic: '/sa.lɔ̃/' },
            { word: 'chambre', phonetic: '/ʃɑ̃bʁ/' },
            { word: 'salle de bain', phonetic: '/sal də bɛ̃/' },
            { word: 'toilettes', phonetic: '/twa.lɛt/' }
        ],
        'de': [
            { word: 'Zimmer', phonetic: '/ˈtsɪmɐ/' },
            { word: 'Haus', phonetic: '/haʊ̯s/' },
            { word: 'Zuhause', phonetic: '/tsuˈhaʊ̯zə/' },
            { word: 'Wohnung', phonetic: '/ˈvoːnʊŋ/' },
            { word: 'Küche', phonetic: '/ˈkʏçə/' },
            { word: 'Wohnzimmer', phonetic: '/ˈvoːnˌtsɪmɐ/' },
            { word: 'Schlafzimmer', phonetic: '/ˈʃlaːfˌtsɪmɐ/' },
            { word: 'Badezimmer', phonetic: '/ˈbaːdəˌtsɪmɐ/' },
            { word: 'Toilette', phonetic: '/to̯aˈlɛtə/' }
        ]
    };
    
    return fallbackWords[lang] || fallbackWords['en'];
}

// Helper function for fetch with timeout
function fetchWithTimeout(url, timeout = 5000) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

// Use fallback data
function useFallbackData() {
    concepts = [...fallbackConcepts];
    languageData = {
        'en': getFallbackWordsForLanguage('en'),
        'es': getFallbackWordsForLanguage('es'),
        'fr': getFallbackWordsForLanguage('fr'),
        'de': getFallbackWordsForLanguage('de')
    };
    state.dataLoaded = true;
    state.usingFallbackData = true;
}

// Show error message
function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
    
    setTimeout(() => {
        errorDisplay.style.display = 'none';
    }, 5000);
}

// Handle language change
function handleLanguageChange() {
    if (!state.dataLoaded) return;
    
    state.targetLanguage = targetLanguageSelect.value;
    state.referenceLanguage = referenceLanguageSelect.value;
    
    if (state.targetLanguage === state.referenceLanguage) {
        const codes = Object.keys(languageData);
        state.referenceLanguage = codes.find(c => c !== state.targetLanguage) || state.targetLanguage;
        referenceLanguageSelect.value = state.referenceLanguage;
    }
    
    loadNewConcept();
    updateModeIndicator();
}

// Handle interaction mode change
function handleInteractionModeChange() {
    if (!state.dataLoaded) return;
    state.interactionMode = interactionModeSelect.value;
    loadNewConcept();
    updateModeIndicator();
}

// Update mode indicator text
function updateModeIndicator() {
    let indicatorText = '';
    switch(state.interactionMode) {
        case 'target-to-reference':
            indicatorText = 'Shown: Target, Answer: Reference';
            break;
        case 'reference-to-target':
            indicatorText = 'Shown: Reference, Answer: Target';
            break;
        case 'random':
            indicatorText = 'Randomly alternating direction';
            break;
    }
    modeIndicator.textContent = indicatorText;
}

// Load a new concept
function loadNewConcept() {
    if (!state.dataLoaded || concepts.length === 0) return;
    
    loadingIndicator.style.display = 'none';
    conceptMain.style.display = 'flex';
    enableInterface(true);
    
    state.answerShown = false;
    state.awaitingNext = false;
    state.isConjugating = false;
    
    answerHidden.style.display = 'flex';
    answerWord.style.display = 'none';
    answerPhonetic.style.display = 'none';
    answerFeedback.textContent = '';
    answerFeedback.className = 'answer-feedback';
    conjugationDisplay.innerHTML = '';
    
    state.currentConceptIndex = Math.floor(Math.random() * concepts.length);
    const concept = concepts[state.currentConceptIndex];
    
    conceptIcon.innerHTML = concept?.icon || '❓';
    conceptType.textContent = concept?.type || 'noun';
    
    const targetWord = getWordForLanguage(state.targetLanguage, state.currentConceptIndex);
    const referenceWord = getWordForLanguage(state.referenceLanguage, state.currentConceptIndex);
    
    let displayWord, displayPhonetic, answerWordText, answerPhoneticText;
    
    if (state.interactionMode === 'target-to-reference' || (state.interactionMode === 'random' && Math.random() > 0.5)) {
        displayWord = targetWord.word;
        displayPhonetic = targetWord.phonetic;
        answerWordText = referenceWord.word;
        answerPhoneticText = referenceWord.phonetic;
    } else {
        displayWord = referenceWord.word;
        displayPhonetic = referenceWord.phonetic;
        answerWordText = targetWord.word;
        answerPhoneticText = targetWord.phonetic;
    }
    
    conceptWord.textContent = displayWord;
    conceptPhonetic.textContent = displayPhonetic || '';
    answerWord.textContent = answerWordText;
    answerPhonetic.textContent = answerPhoneticText || '';
    guessInput.value = '';
    
    if (concept?.type?.toLowerCase() === 'verb' && targetWord.forms) {
        conjugateBtn.style.display = 'block';
        conjugateBtn.textContent = 'Conjugate Verb';
        conjugateBtn.classList.remove('conjugating');
        conjugateBtn.disabled = false;
        state.currentVerb = targetWord;
    } else {
        conjugateBtn.style.display = 'none';
        state.currentVerb = null;
    }
    
    state.currentCorrectAnswer = answerWordText;
}

// Get word helper
function getWordForLanguage(language, conceptIndex) {
    const data = languageData[language];
    if (!data || data.length === 0) {
        return {
            word: '?',
            phonetic: '',
            forms: null
        };
    }
    
    const index = conceptIndex % data.length;
    const word = data[index];
    
    return {
        word: word.word || word.text || '?',
        phonetic: word.phonetic || word.pronunciation || '',
        forms: word.forms
    };
}

// Enable/disable interface elements
function enableInterface(enabled) {
    guessInput.disabled = !enabled;
    sendBtn.disabled = !enabled;
    tellBtn.disabled = !enabled;
    nextBtn.disabled = !enabled;
    if (!enabled && conjugateBtn.style.display === 'block') {
        conjugateBtn.disabled = true;
    }
}

// Show the answer
function showAnswer(isCorrect, message) {
    state.answerShown = true;
    answerHidden.style.display = 'none';
    answerWord.style.display = 'flex';
    answerPhonetic.style.display = 'block';
    
    if (message) {
        answerFeedback.textContent = message;
        answerFeedback.className = isCorrect ? 'answer-feedback correct' : 'answer-feedback incorrect';
    }
    state.awaitingNext = true;
}

// Handle actions
function handleSendGuess() {
    if (state.answerShown || state.awaitingNext) return;
    const userGuess = guessInput.value.trim().toLowerCase();
    const correct = state.isConjugating ? state.currentCorrectConjugation.toLowerCase() : state.currentCorrectAnswer.toLowerCase();
    
    state.totalAnswers++;
    if (userGuess === correct) {
        state.correctAnswers++;
        showAnswer(true, 'Correct!');
    } else {
        showAnswer(false, 'Incorrect.');
    }
    updateStats();
}

function handleTellAnswer() {
    if (state.answerShown || state.awaitingNext) return;
    state.totalAnswers++;
    showAnswer(false, 'Answer revealed.');
    updateStats();
}

function handleNext() {
    if (!state.dataLoaded) return;
    
    if (!state.answerShown) {
        state.correctAnswers++;
        state.totalAnswers++;
        showAnswer(true, 'Counted as correct!');
        updateStats();
        
        if (state.isConjugating) {
            setTimeout(() => setupConjugationPrompt(), CONFIG.answerDisplayTime);
        } else {
            setTimeout(() => loadNewConcept(), CONFIG.answerDisplayTime);
        }
    } else {
        if (state.isConjugating) {
            setupConjugationPrompt();
        } else {
            loadNewConcept();
        }
    }
}

function updateStats() {
    correctCount.textContent = state.correctAnswers;
    totalCount.textContent = state.totalAnswers;
    const acc = state.totalAnswers > 0 ? Math.round((state.correctAnswers / state.totalAnswers) * 100) : 0;
    accuracy.textContent = `${acc}%`;
}

function toggleConjugation() {
    state.isConjugating = !state.isConjugating;
    if (state.isConjugating) {
        conjugateBtn.textContent = 'Stop Conjugation';
        conjugateBtn.classList.add('conjugating');
        // Clear the current concept display and set up conjugation
        conceptWord.textContent = '';
        conceptPhonetic.textContent = '';
        conceptIcon.innerHTML = '🔤';
        conceptType.textContent = 'Verb Conjugation';
        setupConjugationPrompt();
    } else {
        conjugateBtn.textContent = 'Conjugate Verb';
        conjugateBtn.classList.remove('conjugating');
        conjugationDisplay.innerHTML = '';
        loadNewConcept();
    }
}

function setupConjugationPrompt() {
    if (!state.currentVerb?.forms) return;
    
    loadingIndicator.style.display = 'none';
    conceptMain.style.display = 'flex';
    enableInterface(true);
    
    state.currentTense = state.conjugationTenses[Math.floor(Math.random() * state.conjugationTenses.length)];
    state.currentPerson = state.conjugationPersons[Math.floor(Math.random() * state.conjugationPersons.length)];
    state.currentCorrectConjugation = state.currentVerb.forms[state.currentTense][state.currentPerson] || state.currentVerb.forms[state.currentTense]['*'];
    
    answerWord.textContent = state.currentCorrectConjugation;
    answerPhonetic.textContent = state.currentVerb.phonetic || '';
    
    // Clear and set up the conjugation display
    conjugationDisplay.innerHTML = '';
    
    const tenseTag = document.createElement('span');
    tenseTag.className = 'conjugation-tag';
    tenseTag.textContent = state.currentTense;
    
    const personTag = document.createElement('span');
    personTag.className = 'conjugation-tag';
    personTag.textContent = getPersonDisplay(state.currentPerson);
    
    conjugationDisplay.appendChild(tenseTag);
    conjugationDisplay.appendChild(personTag);
    
    // Display the infinitive verb for context
    conceptWord.textContent = state.currentVerb.word + ' →';
    conceptPhonetic.textContent = state.currentVerb.phonetic || '';
    
    state.answerShown = false;
    state.awaitingNext = false;
    answerHidden.style.display = 'flex';
    answerWord.style.display = 'none';
    answerPhonetic.style.display = 'none';
    answerFeedback.textContent = '';
    guessInput.value = '';
    guessInput.focus();
}

function getPersonDisplay(p) {
    const map = {'1sg': '1st sing. (I)', '2sg': '2nd sing. (YOU)', '3sg': '3rd sing. (HE/SHE/IT)', '1pl': '1st plur. (WE)', '2pl': '2nd plur. (YOU)', '3pl': '3rd plur. (THEY)'};
    return map[p] || p;
}

window.addEventListener('DOMContentLoaded', init);