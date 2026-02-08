// Configuration
const CONFIG = {
    answerDisplayTime: 1500,
    answerCheckTime: 1000
};

// Language data
let languageData = {
    en: [],
    es: [],
    ka: []
};

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

const fallbackLanguageData = {
    en: [
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
    es: [
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
    ka: [
        { word: 'ოთახი', phonetic: '/otʰaxi/' },
        { word: 'სახლი', phonetic: '/saxli/' },
        { word: 'მთავარი', phonetic: '/mtʰavari/' },
        { word: 'ბინა', phonetic: '/bina/' },
        { word: 'სამზარეულო', phonetic: '/samzareulo/' },
        { word: 'მისაღები ოთახი', phonetic: '/misaɣebi otʰaxi/' },
        { word: 'საძინებელი', phonetic: '/sadzinebeli/' },
        { word: 'აბაზანა', phonetic: '/abazana/' },
        { word: 'ტუალეტი', phonetic: '/tʼualetʼi/' }
    ]
};

// Initialize the app
async function init() {
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
    
    // Set initial language selections
    targetLanguageSelect.value = state.targetLanguage;
    referenceLanguageSelect.value = state.referenceLanguage;
    interactionModeSelect.value = state.interactionMode;
    
    // Try to load external data
    try {
        await loadAllData();
        state.dataLoaded = true;
    } catch (error) {
        showError('Using fallback data. External files could not be loaded.');
        useFallbackData();
    }
    
    // Load initial concept
    if (state.dataLoaded) {
        loadNewConcept();
        updateStats();
        updateModeIndicator();
    }
}

// Load all data from external files
async function loadAllData() {
    try {
        // Load concepts data
        const conceptsResponse = await fetch('data/concept.json');
        if (!conceptsResponse.ok) {
            throw new Error('Failed to load concepts');
        }
        
        const conceptsText = await conceptsResponse.text();
        let parsedConcepts = [];
        
        try {
            const parsed = JSON.parse(conceptsText);
            if (Array.isArray(parsed)) {
                parsedConcepts = parsed;
            }
        } catch (e) {
            // Try to extract first JSON array
            const firstArrayMatch = conceptsText.match(/\[[\s\S]*?\]/);
            if (firstArrayMatch) {
                try {
                    parsedConcepts = JSON.parse(firstArrayMatch[0]);
                } catch (parseError) {
                    // Can't parse, will use fallback
                }
            }
        }
        
        // Transform the concepts to match expected structure
        if (parsedConcepts && parsedConcepts.length > 0) {
            concepts = parsedConcepts.map(item => {
                return {
                    type: item.type || 'noun',
                    icon: item.emoji || item.icon || '❓'
                };
            });
        } else {
            concepts = fallbackConcepts;
        }
        
        // Load language data for each language
        const languages = ['en', 'es', 'ka'];
        const loadPromises = languages.map(async (lang) => {
            try {
                const response = await fetch(`languages/${lang}.json`);
                if (!response.ok) {
                    return false;
                }
                
                const text = await response.text();
                let words = [];
                
                try {
                    const parsed = JSON.parse(text);
                    if (Array.isArray(parsed)) {
                        words = parsed;
                    }
                } catch (e) {
                    // Try to extract first JSON array
                    const firstArrayMatch = text.match(/\[[\s\S]*?\]/);
                    if (firstArrayMatch) {
                        try {
                            words = JSON.parse(firstArrayMatch[0]);
                        } catch (parseError) {
                            // Try NDJSON
                            const lines = text.split('\n').filter(line => line.trim() !== '');
                            words = lines.map(line => {
                                try {
                                    return JSON.parse(line);
                                } catch (lineError) {
                                    return null;
                                }
                            }).filter(item => item !== null);
                        }
                    }
                }
                
                if (words.length === 0) {
                    return false;
                }
                
                languageData[lang] = words;
                return true;
            } catch (error) {
                return false;
            }
        });
        
        const results = await Promise.all(loadPromises);
        const successfulLoads = results.filter(result => result === true).length;
        
        if (successfulLoads === 0) {
            throw new Error('Could not load any language data from files');
        }
        
        // Make sure all languages have the same number of words as concepts
        const targetLength = concepts.length;
        languages.forEach(lang => {
            if (languageData[lang] && languageData[lang].length < targetLength) {
                // Pad with fallback data if needed
                while (languageData[lang].length < targetLength) {
                    const fallbackIndex = languageData[lang].length % fallbackLanguageData[lang].length;
                    languageData[lang].push(fallbackLanguageData[lang][fallbackIndex]);
                }
            }
        });
        
        state.dataLoaded = true;
        state.usingFallbackData = false;
        
    } catch (error) {
        throw error;
    }
}

// Use fallback data
function useFallbackData() {
    concepts = fallbackConcepts;
    languageData = fallbackLanguageData;
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
    
    // Make sure languages are different
    if (state.targetLanguage === state.referenceLanguage) {
        if (state.targetLanguage === 'en') {
            state.referenceLanguage = 'es';
            referenceLanguageSelect.value = 'es';
        } else {
            state.referenceLanguage = 'en';
            referenceLanguageSelect.value = 'en';
        }
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
    
    // Hide loading indicator and show concept
    loadingIndicator.style.display = 'none';
    conceptMain.style.display = 'flex';
    
    // Enable all buttons and inputs
    enableInterface(true);
    
    // Reset state
    state.answerShown = false;
    state.awaitingNext = false;
    
    // Hide answer and show placeholder
    answerHidden.style.display = 'flex';
    answerWord.style.display = 'none';
    answerPhonetic.style.display = 'none';
    answerFeedback.textContent = '';
    answerFeedback.className = 'answer-feedback';
    
    // Clear conjugation display
    conjugationDisplay.innerHTML = '';
    
    // Get a random concept index
    state.currentConceptIndex = Math.floor(Math.random() * concepts.length);
    const concept = concepts[state.currentConceptIndex];
    
    // Update concept display
    if (concept) {
        conceptIcon.innerHTML = concept.icon || '❓';
        conceptType.textContent = concept.type || 'noun';
    } else {
        conceptIcon.innerHTML = '❓';
        conceptType.textContent = 'noun';
    }
    
    // Get words for current concept
    const targetWord = getWordForLanguage(state.targetLanguage, state.currentConceptIndex);
    const referenceWord = getWordForLanguage(state.referenceLanguage, state.currentConceptIndex);
    
    // Determine display based on interaction mode
    let displayWord, displayPhonetic, answerWordText, answerPhoneticText, currentDirection;
    
    if (state.interactionMode === 'target-to-reference') {
        displayWord = targetWord.word;
        displayPhonetic = targetWord.phonetic;
        answerWordText = referenceWord.word;
        answerPhoneticText = referenceWord.phonetic;
        currentDirection = 'target-to-reference';
    } else if (state.interactionMode === 'reference-to-target') {
        displayWord = referenceWord.word;
        displayPhonetic = referenceWord.phonetic;
        answerWordText = targetWord.word;
        answerPhoneticText = targetWord.phonetic;
        currentDirection = 'reference-to-target';
    } else {
        // Random mode
        if (Math.random() > 0.5) {
            displayWord = targetWord.word;
            displayPhonetic = targetWord.phonetic;
            answerWordText = referenceWord.word;
            answerPhoneticText = referenceWord.phonetic;
            currentDirection = 'target-to-reference';
        } else {
            displayWord = referenceWord.word;
            displayPhonetic = referenceWord.phonetic;
            answerWordText = targetWord.word;
            answerPhoneticText = targetWord.phonetic;
            currentDirection = 'reference-to-target';
        }
        
        // Update mode indicator temporarily for random mode
        const indicatorText = currentDirection === 'target-to-reference' 
            ? 'Current: Target → Reference' 
            : 'Current: Reference → Target';
        modeIndicator.textContent = indicatorText;
    }
    
    // Update display
    conceptWord.textContent = displayWord;
    conceptPhonetic.textContent = displayPhonetic || '';
    answerWord.textContent = answerWordText;
    answerPhonetic.textContent = answerPhoneticText || '';
    
    // Clear guess input
    guessInput.value = '';
    
    // Show/hide conjugate button based on word type
    const wordType = concept?.type || 'noun';
    if (wordType.toLowerCase() === 'verb' && targetWord.forms) {
        conjugateBtn.style.display = 'block';
        conjugateBtn.textContent = 'Conjugate Verb';
        conjugateBtn.classList.remove('conjugating');
        conjugateBtn.disabled = false;
        state.currentVerb = targetWord;
    } else {
        conjugateBtn.style.display = 'none';
        state.currentVerb = null;
    }
    
    // Store the correct answer for checking
    state.currentCorrectAnswer = answerWordText;
    state.currentDirection = currentDirection;
    
    // If we're conjugating, set up a new conjugation prompt
    if (state.isConjugating && state.currentVerb) {
        setupConjugationPrompt();
    }
}

// Get word for a specific language and concept index
function getWordForLanguage(language, conceptIndex) {
    // Make sure we have data for this language
    if (!languageData[language] || languageData[language].length === 0) {
        // Use fallback data
        const fallbackIndex = conceptIndex % fallbackLanguageData[language].length;
        return fallbackLanguageData[language][fallbackIndex];
    }
    
    // Make sure index is within bounds
    if (conceptIndex >= languageData[language].length) {
        const wrappedIndex = conceptIndex % languageData[language].length;
        return languageData[language][wrappedIndex];
    }
    
    const word = languageData[language][conceptIndex];
    
    if (!word) {
        const fallbackIndex = conceptIndex % fallbackLanguageData[language].length;
        return fallbackLanguageData[language][fallbackIndex];
    }
    
    return {
        word: word.word || word.text || `[${language.toUpperCase()} word ${conceptIndex}]`,
        phonetic: word.phonetic || word.pronunciation || '/?/',
        forms: word.forms
    };
}

// Enable/disable interface elements
function enableInterface(enabled) {
    guessInput.disabled = !enabled;
    sendBtn.dis