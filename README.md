# IDIOMATOR - Language Learning Web Application

IDIOMATOR is a compact, all-in-one language learning tool designed for efficient vocabulary and conjugation practice. Whether you're a language learner or a developer looking to contribute, IDIOMATOR offers an intuitive interface with powerful customization options.

## Features

### For Language Learners
- **Three Learning Modes**: Choose how words are presented
- **Smart Feedback System**: Three ways to respond to each word
- **Verb Conjugation Practice**: Special mode for mastering verb forms
- **Progress Tracking**: Real-time statistics to monitor improvement
- **Phonetic Transcriptions**: Learn proper pronunciation
- **Visual Learning**: Icons represent word categories
- **Responsive Design**: Works perfectly on desktop and mobile

### For Developers & Contributors
- **Simple File-Based Structure**: Easy to add new languages and words
- **Clean Architecture**: Pure HTML/CSS/JavaScript, no frameworks required
- **Open Format**: JSON files that are human-readable and editable
- **GitHub Pages Ready**: Deploy with a single push
- **Extensible Design**: Easy to add features or customize

## Quick Start

### For Users
1. **Visit**: [https://fjvico.github.io/idiomator/](https://fjvico.github.io/idiomator/)
2. **Choose Languages**: Select what you want to learn and your reference language
3. **Start Learning**: Use the three response options to practice
4. **Track Progress**: Watch your accuracy improve over time

### For Developers
```bash
# Clone and run locally
git clone https://github.com/fjvico/idiomator.git
cd idiomator
python3 -m http.server 8000
# Open http://localhost:8000
```

## Project Structure

```
idiomator/
├── index.html              # Main application file
├── data/
│   └── concept.json       # Concepts with icons and word types
├── languages/
│   ├── en.json           # English vocabulary
│   ├── es.json           # Spanish vocabulary  
│   └── ka.json           # Georgian vocabulary
└── README.md
```

## How to Use (For Learners)

### Step 1: Choose Your Languages
- **Language to Learn**: The language you're studying
- **Reference Language**: Your known language for reference

### Step 2: Select Learning Mode
- **Target → Reference**: Word shown in language you're learning, guess in your language
- **Reference → Target**: Word shown in your language, guess in new language  
- **Random Mode**: Mixes both approaches for variety

### Step 3: Practice Words
Each word appears with:
- **Icon**: Visual representation of the word type
- **Type**: Noun, verb, or adjective
- **Phonetic**: Pronunciation guide
- **Three Response Options**:
  1. **Type & Check**: Type your guess and click "Send"
  2. **Reveal Answer**: Click "Tell the Answer" to see it immediately
  3. **Skip & Count**: Click "OK, Next..." (counts as correct, shows answer briefly)

### Step 4: Master Verb Conjugations
When verbs appear:
- Click **"Conjugate Verb"** to enter conjugation practice
- Practice specific tense/person combinations
- Click **"Stop Conjugation"** to return to normal practice
- Conjugation forms appear as button-like tags below the word

### Step 5: Track Your Progress
- **Correct/Total**: See how many you've answered correctly
- **Accuracy**: Percentage of correct answers
- All statistics update in real-time

## Customization & Development

### Adding New Languages
1. Create `languages/xx.json` (replace `xx` with language code)
2. Format: One JSON object per line (NDJSON format)
3. Each line must contain at least `word` and `phonetic` fields

### Language File Format
```json
{"word":"room","phonetic":"/ruːm/"}
{"word":"eat","phonetic":"/iːt/","forms":{"present":{"1sg":"eat","2sg":"eat","3sg":"eats"},"past":{"*":"ate"}}}
```

### Verb Conjugation Format
For verbs, use the `forms` object. You can specify forms efficiently:

**Different forms for each person:**
```json
{"word":"eat","forms":{"present":{"1sg":"eat","2sg":"eat","3sg":"eats","1pl":"eat","2pl":"eat","3pl":"eat"},"past":{"*":"ate"}}}
```

**Same form for all persons (optimized):**
```json
{"word":"can","forms":{"present":{"*":"can"}}}
```

**Supported:**
- Tenses: `present`, `past`, etc.
- Persons: `1sg`, `2sg`, `3sg`, `1pl`, `2pl`, `3pl`
- Wildcard: `"*"` for forms identical across all persons
- Optional: `nonFinite` forms (infinitives, participles)

### Adding New Concepts
1. Edit `data/concept.json`
2. Add objects with `icon` (emoji) and `type` (noun/verb/adjective)
3. Ensure each language file has a corresponding entry at the same position

### Concepts File Format
```json
[
  {"icon": "🚪", "type": "noun"},
  {"icon": "🍽️", "type": "verb"},
  {"icon": "⚫", "type": "adjective"}
]
```

## Technical Details (For Developers)

### Architecture
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **No Dependencies**: No frameworks or libraries required
- **Data Storage**: External JSON files, no database needed
- **Deployment**: Static files, compatible with any web server

### Key Components
1. **State Management**: Centralized app state object
2. **Dynamic UI**: All interface updates handled via DOM manipulation
3. **Error Handling**: Graceful fallbacks for missing data
4. **Responsive CSS**: Grid and Flexbox layouts
5. **Progressive Enhancement**: Works even without external data

### Development Workflow
1. Clone the repository
2. Edit language files or add new ones
3. Test locally with a web server
4. Commit and push changes
5. GitHub Pages automatically deploys

### Extending Functionality
- Add new word types by extending the concepts file
- Support additional tenses in verb conjugations
- Implement user accounts (advanced)
- Add audio pronunciations
- Create themed word packs

## Learning Benefits (For Educators)

### Pedagogical Advantages
- **Active Recall**: Forces memory retrieval before showing answers
- **Spaced Repetition**: Random word selection mimics spaced learning
- **Multiple Modalities**: Visual, textual, and phonetic learning
- **Contextual Learning**: Words presented with grammatical context
- **Self-Paced**: Learners control speed and difficulty

### Classroom Use
- **Vocabulary Sets**: Create themed word lists
- **Verb Drills**: Focus on conjugation patterns
- **Pronunciation Practice**: Phonetic transcriptions guide speaking
- **Progress Monitoring**: Track student improvement over time

## Contributing

We welcome contributions from both language experts and developers:

### For Language Experts
1. **Add Vocabulary**: Contribute word lists for new languages
2. **Improve Transcriptions**: Add or correct phonetic transcriptions
3. **Create Themes**: Develop specialized vocabulary sets (travel, business, etc.)
4. **Verify Accuracy**: Check existing language files for errors

### For Developers
1. **Fix Bugs**: Report or fix issues
2. **Add Features**: Implement new learning modes or tools
3. **Improve UI**: Enhance the user interface
4. **Optimize Performance**: Make the app faster or more efficient

### Contribution Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details. You are free to use, modify, and distribute this software.

## Acknowledgments

- **Language Data**: Contributions from language experts worldwide
- **Icons**: Unicode emoji for visual representation
- **Phonetics**: IPA transcriptions for accurate pronunciation
- **Inspiration**: Based on principles from spaced repetition systems like Anki
- **Community**: All contributors and users who help improve IDIOMATOR

## Troubleshooting

### Common Issues
- **Can't load language files**: Ensure files are in correct NDJSON format
- **Missing words**: Check that concept count matches vocabulary entries
- **CORS errors**: Run with a local server, not file:// protocol
- **Layout issues**: Clear browser cache or check console for errors

### Getting Help
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check this README and code comments
- **Community**: Share experiences and tips with other users

## TBD
- Languages in the drop-down menu must be identified from the files in `languages/`.
- Test TWEMOJI instead of Unicode symbols