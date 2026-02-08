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
    
    // Set initial language selections
    targetLanguageSelect.value = state.targetLanguage;
    referenceLanguageSelect.value = state.referenceLanguage;
    interactionModeSelect.value = state.interactionMode;
    
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

// Load all data from external files
async function loadAllData() {
    console.log('loadAllData called');
    
    // Check if we're running locally or on GitHub
    const isGitHub = window.location.hostname.includes('github.io');
    const isLocal = window.location.protocol === 'file:';
    console.log('Environment:', { isGitHub, isLocal, hostname: window.location.hostname });
    
    // Try to load concepts data with timeout
    try {
        console.log('Fetching concept.json...');
        const conceptsResponse = await fetchWithTimeout('data/concept.json', 3000);
        
        if (!conceptsResponse.ok) {
            console.warn(`concept.json not found or error: ${conceptsResponse.status}`);
            throw new Error('concept.json not found');
        }
        
        const conceptsText = await conceptsResponse.text();
        console.log('concept.json loaded, length:', conceptsText.length);
        
        let parsedConcepts = [];
        
        try {
            const parsed = JSON.parse(conceptsText);
            if (Array.isArray(parsed)) {
                parsedConcepts = parsed;
                console.log('Successfully parsed concept.json as array, length:', parsedConcepts.length);
            } else {
                console.warn('concept.json is not an array');
                throw new Error('concept.json is not an array');
            }
        } catch (e) {
            console.warn('Failed to parse concept.json as JSON:', e);
            throw e;
        }
        
        // Transform the concepts to match expected structure
        if (parsedConcepts && parsedConcepts.length > 0) {
            concepts = parsedConcepts.map(item => {
                return {
                    type: item.type || 'noun',
                    icon: item.emoji || item.icon || '❓'
                };
            });
            console.log(`Transformed ${concepts.length} concepts`);
        } else {
            console.warn('No concepts found in concept.json');
            throw new Error('No concepts found');
        }
        
    } catch (error) {
        console.log('Failed to load concept.json, will use fallback:', error);
        throw error; // Re-throw to trigger fallback
    }
    
    // Load language data for each language
    const languages = ['en', 'es', 'ka'];
    const loadPromises = languages.map(async (lang) => {
        try {
            console.log(`Fetching ${lang}.json...`);
            const response = await fetchWithTimeout(`languages/${lang}.json`, 3000);
            
            if (!response.ok) {
                console.warn(`${lang}.json not found: ${response.status}`);
                return false;
            }
            
            const text = await response.text();
            console.log(`${lang}.json loaded, length:`, text.length);
            
            let words = [];
            
            try {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    words = parsed;
                    console.log(`${lang}: Successfully parsed as array, ${words.length} items`);
                } else {
                    console.warn(`${lang}.json is not an array`);
                    return false;
                }
            } catch (e) {
                console.warn(`Failed to parse ${lang}.json as JSON:`, e);
                return false;
            }
            
            if (words.length === 0) {
                console.warn(`${lang}.json is empty`);
                return false;
            }
            
            languageData[lang] = words;
            console.log(`Loaded ${words.length} words for ${lang}`);
            return true;
            
        } catch (error) {
            console.log(`Error loading ${lang}.json:`, error);
            return false;
        }
    });
    
    const results = await Promise.all(loadPromises);
    const successfulLoads = results.filter(result => result === true).length;
    
    console.log(`Successfully loaded ${successfulLoads} out of ${languages.length} language files`);
    
    if (successfulLoads === 0) {
        throw new Error('Could not load any language data from files');
    }
    
    // Make sure all languages have the same number of words as concepts
    const targetLength = concepts.length;
    languages.forEach(lang => {
        if (languageData[lang] && languageData[lang].length < targetLength) {
            console.log(`Padding ${lang} from ${languageData[lang].length} to ${targetLength} words`);
            // Pad with fallback data if needed
            while (languageData[lang].length < targetLength) {
                const fallbackIndex = languageData[lang].length % fallbackLanguageData[lang].length;
                languageData[lang].push(fallbackLanguageData[lang][fallbackIndex]);
            }
        }
    });
    
    state.dataLoaded = true;
    state.usingFallbackData = false;
    console.log('Data loading complete');
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

// Use fallback data immediately (simpler approach)
function useFallbackData() {
    console.log('Using fallback data...');
    concepts = [...fallbackConcepts];
    languageData = {
        en: [...fallbackLanguageData.en],
        es: [...fallbackLanguageData.es],
        ka: [...fallbackLanguageData.ka]
    };
    state.dataLoaded = true;
    state.usingFallbackData = true;
    console.log('Fallback data loaded:', {
        concepts: concepts.length,
        en: languageData.en.length,
        es: languageData.es.length,
        ka: languageData.ka.length
    });
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
    console.log('loadNewConcept called, dataLoaded:', state.dataLoaded, 'concepts length:', concepts.length);
    
    if (!state.dataLoaded || concepts.length === 0) {
        console.error('Cannot load concept: data not loaded or no concepts available');
        showError('No data available. Please refresh the page.');
        return;
    }
    
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
    
    console.log('Selected concept index:', state.currentConceptIndex, 'concept:', concept);
    
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
    
    console.log('Target word:', targetWord);
    console.log('Reference word:', referenceWord);
    
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
        console.warn(`No data for language: ${language}, using fallback`);
        // Use fallback data
        const fallbackIndex = conceptIndex % fallbackLanguageData[language].length;
        return fallbackLanguageData[language][fallbackIndex];
    }
    
    // Make sure index is within bounds
    if (conceptIndex >= languageData[language].length) {
        console.warn(`Index ${conceptIndex} out of bounds for ${language}, wrapping`);
        const wrappedIndex = conceptIndex % languageData[language].length;
        return languageData[language][wrappedIndex];
    }
    
    const word = languageData[language][conceptIndex];
    
    if (!word) {
        console.warn(`No word at index ${conceptIndex} for ${language}, using fallback`);
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
    sendBtn.disabled = !enabled;
    tellBtn.disabled = !enabled;
    nextBtn.disabled = !enabled;
    if (!enabled) {
        conjugateBtn.disabled = true;
    }
}

// Show the answer with feedback
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

// Handle send guess
function handleSendGuess() {
    if (state.answerShown || state.awaitingNext || !state.dataLoaded) return;
    
    const userGuess = guessInput.value.trim().toLowerCase();
    
    // Use the correct conjugation if we're conjugating, otherwise use the regular answer
    const correctAnswer = state.isConjugating && state.currentCorrectConjugation 
        ? state.currentCorrectConjugation.toLowerCase()
        : state.currentCorrectAnswer.toLowerCase();
    
    state.totalAnswers++;
    
    if (userGuess === correctAnswer) {
        state.correctAnswers++;
        showAnswer(true, 'Correct!');
    } else {
        showAnswer(false, 'Incorrect.');
    }
    
    updateStats();
}

// Handle tell answer
function handleTellAnswer() {
    if (state.answerShown || state.awaitingNext || !state.dataLoaded) return;
    
    state.totalAnswers++;
    showAnswer(false, 'Answer revealed.');
    updateStats();
}

// Handle next
function handleNext() {
    if (!state.dataLoaded) return;
    
    if (!state.answerShown) {
        // User pressed Next without seeing the answer first
        state.correctAnswers++;
        state.totalAnswers++;
        showAnswer(true, 'Counted as correct!');
        updateStats();
        
        // Wait before loading next concept or conjugation
        if (state.isConjugating) {
            setTimeout(() => {
                if (state.isConjugating && state.currentVerb) {
                    setupConjugationPrompt();
                } else {
                    loadNewConcept();
                }
            }, CONFIG.answerDisplayTime);
        } else {
            setTimeout(loadNewConcept, CONFIG.answerDisplayTime);
        }
    } else {
        // Answer was already shown
        if (state.isConjugating) {
            setupConjugationPrompt();
        } else {
            loadNewConcept();
        }
    }
}

// Update statistics
function updateStats() {
    correctCount.textContent = state.correctAnswers;
    totalCount.textContent = state.totalAnswers;
    
    const accuracyPercent = state.totalAnswers > 0 
        ? Math.round((state.correctAnswers / state.totalAnswers) * 100) 
        : 0;
    accuracy.textContent = `${accuracyPercent}%`;
}

// Toggle conjugation practice
function toggleConjugation() {
    if (!state.dataLoaded) return;
    
    if (!state.isConjugating) {
        // Start conjugation
        state.isConjugating = true;
        conjugateBtn.textContent = 'Stop Conjugation';
        conjugateBtn.classList.add('conjugating');
        
        // Setup first conjugation prompt
        setupConjugationPrompt();
    } else {
        // Stop conjugation
        state.isConjugating = false;
        conjugateBtn.textContent = 'Conjugate Verb';
        conjugateBtn.classList.remove('conjugating');
        
        // Clear conjugation display
        conjugationDisplay.innerHTML = '';
        
        // Load a new regular concept
        loadNewConcept();
    }
}

// Setup conjugation prompt
function setupConjugationPrompt() {
    if (!state.currentVerb || !state.currentVerb.forms) return;
    
    // Get random tense and person
    const tenseIndex = Math.floor(Math.random() * state.conjugationTenses.length);
    const personIndex = Math.floor(Math.random() * state.conjugationPersons.length);
    
    state.currentTense = state.conjugationTenses[tenseIndex];
    state.currentPerson = state.conjugationPersons[personIndex];
    
    // Get correct answer
    if (state.currentPerson === '*' || !state.currentVerb.forms[state.currentTense][state.currentPerson]) {
        state.currentCorrectConjugation = state.currentVerb.forms[state.currentTense]['*'] || 
            state.currentVerb.word;
    } else {
        state.currentCorrectConjugation = state.currentVerb.forms[state.currentTense][state.currentPerson];
    }
    
    // Update answer display for conjugation (but keep hidden)
    answerWord.textContent = state.currentCorrectConjugation;
    answerPhonetic.textContent = '';
    
    // Update conjugation display with button-like tags
    conjugationDisplay.innerHTML = '';
    
    const tenseDisplay = state.currentTense === 'present' ? 'Present' : 'Past';
    const personDisplay = getPersonDisplay(state.currentPerson);
    
    // Create tense tag
    const tenseTag = document.createElement('span');
    tenseTag.className = 'conjugation-tag';
    tenseTag.textContent = tenseDisplay;
    conjugationDisplay.appendChild(tenseTag);
    
    // Create person tag
    const personTag = document.createElement('span');
    personTag.className = 'conjugation-tag';
    personTag.textContent = personDisplay;
    conjugationDisplay.appendChild(personTag);
    
    // Reset answer shown state
    state.answerShown = false;
    state.awaitingNext = false;
    
    // Hide answer and show placeholder
    answerHidden.style.display = 'flex';
    answerWord.style.display = 'none';
    answerPhonetic.style.display = 'none';
    answerFeedback.textContent = '';
    answerFeedback.className = 'answer-feedback';
    
    // Clear guess input
    guessInput.value = '';
}

// Get display text for person
function getPersonDisplay(personCode) {
    const personMap = {
        '1sg': '1st singular',
        '2sg': '2nd singular',
        '3sg': '3rd singular',
        '1pl': '1st plural',
        '2pl': '2nd plural',
        '3pl': '3rd plural',
        '*': 'generic'
    };
    return personMap[personCode] || personCode;
}

// Initialize the app when page loads
window.addEventListener('DOMContentLoaded', init);