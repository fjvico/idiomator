# IDIOMATOR - Language Learning Web Application

IDIOMATOR is a compact, all-in-one language learning tool designed for efficient vocabulary and conjugation practice.

## 🎯 Features

### Core Learning Modes
- **Target → Reference Mode**: Word shown in language to learn, guess in known language
- **Reference → Target Mode**: Word shown in known language, guess in language to learn  
- **Random Mode**: Alternates between the two directions randomly
- **Verb Conjugation Practice**: Special mode for practicing verb conjugations

### Supported Languages
- English (en)
- Spanish (es) 
- Georgian (ka)
- *Easily extendable to more languages*

### Interactive Features
- **Three Response Options**:
  1. Type your guess and check
  2. Reveal the answer
  3. Skip to next (counts as correct)
- **Verb Conjugation**: Practice verb forms for different tenses and persons
- **Statistics Tracking**: Real-time accuracy tracking
- **Phonetic Transcription**: Learn proper pronunciation
- **Visual Icons**: Each word type has a representative icon

## 🚀 Quick Start

### Option 1: Use GitHub Pages
Visit: [https://fjvico.github.io/idiomator/](https://fjvico.github.io/idiomator/)

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/fjvico/idiomator.git
cd idiomator

# Run a simple web server
python3 -m http.server 8000

# Open in browser: http://localhost:8000
```

## 📁 Project Structure

```
idiomator/
├── index.html              # Main application
├── data/
│   └── concept.json       # Concepts with icons and types
├── languages/
│   ├── en.json           # English vocabulary (NDJSON format)
│   ├── es.json           # Spanish vocabulary
│   └── ka.json           # Georgian vocabulary
└── README.md
```

## Data Format

### Concepts File (`data/concept.json`)
```json
[
  {"icon": "🚪", "type": "noun"},
  {"icon": "🍽️", "type": "verb"},
  {"icon": "⚫", "type": "adjective"}
]
```

### Language Files (`languages/*.json`) - NDJSON Format
Each line is a separate JSON object:
```json
{"word":"room","phonetic":"/ruːm/"}
{"word":"eat","phonetic":"/iːt/","forms":{"present":{"1sg":"eat","3sg":"eats"},"past":{"*":"ate"}}}
```

## How to Use

1. **Select Languages**:
   - Choose "Language to Learn" (target)
   - Choose "Reference Language" (known language)

2. **Choose Interaction Style**:
   - Target → Reference: Learn from new language
   - Reference → Target: Test from known language  
   - Random: Mix of both

3. **Practice**:
   - Word appears with icon, type, and phonetic transcription
   - Choose one of three options:
     - Type guess and click "Send"
     - Click "Tell the Answer" to reveal
     - Click "OK, Next..." to skip (counts as correct)

4. **Verb Conjugation**:
   - When a verb appears, click "Conjugate Verb"
   - Practice specific tense/person combinations
   - Click "Stop Conjugation" to return to regular practice

## Customization

### Add New Language
1. Create `languages/xx.json` (where xx is language code)
2. Format: One JSON object per line (NDJSON)
3. Include at minimum: `word` and `phonetic` fields
4. For verbs, add `forms` object with conjugations

### Add New Concepts
1. Edit `data/concept.json`
2. Add objects with `icon` (emoji) and `type` (noun/verb/adjective)
3. Ensure language files have corresponding entries

## Design Philosophy

- **Compact Layout**: All elements visible at once, no scrolling needed
- **Consistent Positioning**: Buttons never move or shift
- **Immediate Feedback**: Answers appear in dedicated sidebar
- **Clean Aesthetics**: Dark theme with color-coded elements
- **Responsive Design**: Works on desktop and mobile devices

## Learning Benefits

- **Spaced Repetition**: Random word selection
- **Active Recall**: Must produce answer before seeing solution
- **Multiple Modalities**: Visual (icons), auditory (phonetics), written
- **Contextual Learning**: Words presented with type and usage context
- **Progress Tracking**: Real-time statistics for motivation

## Technical Details

- **Pure HTML/CSS/JavaScript**: No external dependencies
- **Responsive Design**: CSS Grid and Flexbox
- **Local Storage**: Statistics persist in browser
- **Fallback System**: Embedded data ensures app always works
- **GitHub Pages**: Easy deployment

## Contributing

1. Fork the repository
2. Add new language files or improve existing ones
3. Submit a pull request
4. Follow the existing NDJSON format for consistency

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Icons from Unicode emoji
- Phonetic transcriptions in IPA format
- Inspired by spaced repetition systems like Anki

---

**IDIOMATOR**: Making language learning intuitive, efficient, and accessible for everyone.