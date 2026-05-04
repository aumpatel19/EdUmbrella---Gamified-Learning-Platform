require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BASE_VIDEO_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/lecture-videos/demo`;
const BASE_SUBTITLE_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/lecture-videos/subtitles`;

// 6 languages for multilingual support
const LANGUAGES = ['english', 'hindi', 'telugu', 'gujarati', 'kannada', 'tamil'];

// Subject -> demo video file
const SUBJECT_VIDEO = {
  'Mathematics':    'math.mp4',
  'Science':        'science.mp4',
  'Physics':        'physics.mp4',
  'Chemistry':      'chemistry.mp4',
  'Biology':        'biology.mp4',
  'English':        'english.mp4',
  'Hindi':          'english.mp4',
  'Social Science': 'social.mp4',
};

// VTT subtitle content per topic and language
// Format: { topic_key: { lang: vtt_content } }
const SUBTITLE_CONTENT = {
  math_numbers: {
    english: `WEBVTT

00:00:01.000 --> 00:00:05.000
Welcome to the chapter on Numbers and Number Systems.

00:00:05.000 --> 00:00:12.000
In this lecture, we will explore how numbers are classified and used in mathematics.

00:00:12.000 --> 00:00:18.000
Natural numbers are counting numbers: 1, 2, 3, and so on.

00:00:18.000 --> 00:00:25.000
Whole numbers include natural numbers plus zero: 0, 1, 2, 3...

00:00:25.000 --> 00:00:32.000
Integers include both positive and negative numbers: ...-2, -1, 0, 1, 2...

00:00:32.000 --> 00:00:40.000
Understanding number systems is the foundation of all mathematics.`,

    hindi: `WEBVTT

00:00:01.000 --> 00:00:05.000
संख्या प्रणाली के अध्याय में आपका स्वागत है।

00:00:05.000 --> 00:00:12.000
इस पाठ में हम सीखेंगे कि संख्याओं को कैसे वर्गीकृत किया जाता है।

00:00:12.000 --> 00:00:18.000
प्राकृत संख्याएँ गणना की संख्याएँ हैं: 1, 2, 3 और इसी तरह।

00:00:18.000 --> 00:00:25.000
पूर्ण संख्याओं में प्राकृत संख्याएँ तथा शून्य शामिल हैं: 0, 1, 2, 3...

00:00:25.000 --> 00:00:32.000
पूर्णांक में धनात्मक और ऋणात्मक दोनों संख्याएँ आती हैं।

00:00:32.000 --> 00:00:40.000
संख्या प्रणाली की समझ सभी गणित की नींव है।`,

    telugu: `WEBVTT

00:00:01.000 --> 00:00:05.000
సంఖ్యా వ్యవస్థ అధ్యాయానికి స్వాగతం.

00:00:05.000 --> 00:00:12.000
ఈ పాఠంలో సంఖ్యలు ఎలా వర్గీకరించబడతాయో నేర్చుకుంటాం.

00:00:12.000 --> 00:00:18.000
సహజ సంఖ్యలు లెక్కించే సంఖ్యలు: 1, 2, 3 మరియు అలా కొనసాగుతాయి.

00:00:18.000 --> 00:00:25.000
పూర్ణ సంఖ్యలలో సహజ సంఖ్యలు మరియు సున్నా ఉంటాయి.

00:00:25.000 --> 00:00:32.000
పూర్ణాంకాలలో ధన మరియు రుణ సంఖ్యలు ఉంటాయి.

00:00:32.000 --> 00:00:40.000
సంఖ్యా వ్యవస్థ అర్థం చేసుకోవడం గణితానికి పునాది.`,

    gujarati: `WEBVTT

00:00:01.000 --> 00:00:05.000
સંખ્યા પ્રણાલી અધ્યાયમાં આપનું સ્વાગત છે.

00:00:05.000 --> 00:00:12.000
આ પ્રકરણમાં આપણે સંખ્યાઓ કેવી રીતે વર્ગીકૃત થાય છે તે શીખીશું.

00:00:12.000 --> 00:00:18.000
કુદરતી સંખ્યાઓ ગણતરીની સંખ્યાઓ છે: 1, 2, 3 અને તેમ આગળ.

00:00:18.000 --> 00:00:25.000
સંપૂર્ણ સંખ્યાઓમાં કુદરતી સંખ્યાઓ અને શૂન્ય સામેલ છે.

00:00:25.000 --> 00:00:32.000
પૂર્ણ સંખ્યાઓમાં ધન અને ઋણ બંને સંખ્યાઓ આવે છે.

00:00:32.000 --> 00:00:40.000
સંખ્યા પ્રણાલીની સમજ સમગ્ર ગણિતનો આધાર છે.`,

    kannada: `WEBVTT

00:00:01.000 --> 00:00:05.000
ಸಂಖ್ಯಾ ವ್ಯವಸ್ಥೆಯ ಅಧ್ಯಾಯಕ್ಕೆ ಸ್ವಾಗತ.

00:00:05.000 --> 00:00:12.000
ಈ ಪಾಠದಲ್ಲಿ ಸಂಖ್ಯೆಗಳನ್ನು ಹೇಗೆ ವರ್ಗೀಕರಿಸಲಾಗುತ್ತದೆ ಎಂದು ಕಲಿಯುತ್ತೇವೆ.

00:00:12.000 --> 00:00:18.000
ನೈಸರ್ಗಿಕ ಸಂಖ್ಯೆಗಳು ಎಣಿಕೆ ಸಂಖ್ಯೆಗಳು: 1, 2, 3 ಮತ್ತು ಹೀಗೆ.

00:00:18.000 --> 00:00:25.000
ಪೂರ್ಣ ಸಂಖ್ಯೆಗಳಲ್ಲಿ ನೈಸರ್ಗಿಕ ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಶೂನ್ಯ ಸೇರಿವೆ.

00:00:25.000 --> 00:00:32.000
ಪೂರ್ಣಾಂಕಗಳಲ್ಲಿ ಧನ ಮತ್ತು ಋಣ ಸಂಖ್ಯೆಗಳಿವೆ.

00:00:32.000 --> 00:00:40.000
ಸಂಖ್ಯಾ ವ್ಯವಸ್ಥೆಯ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವಿಕೆ ಗಣಿತದ ಆಧಾರ.`,

    tamil: `WEBVTT

00:00:01.000 --> 00:00:05.000
எண் முறைமை அத்தியாயத்திற்கு வரவேற்கிறோம்.

00:00:05.000 --> 00:00:12.000
இந்த பாடத்தில் எண்கள் எவ்வாறு வகைப்படுத்தப்படுகின்றன என்று கற்போம்.

00:00:12.000 --> 00:00:18.000
இயற்கை எண்கள் எண்ணும் எண்கள்: 1, 2, 3 மற்றும் தொடர்ந்து.

00:00:18.000 --> 00:00:25.000
முழு எண்களில் இயற்கை எண்களும் பூஜ்யமும் அடங்கும்.

00:00:25.000 --> 00:00:32.000
முழு எண்களில் நேர் மற்றும் எதிர் எண்கள் உள்ளன.

00:00:32.000 --> 00:00:40.000
எண் முறைமையை புரிந்துகொள்வது கணிதத்தின் அடிப்படை.`,
  },

  science_life: {
    english: `WEBVTT

00:00:01.000 --> 00:00:05.000
Welcome to the chapter on Living Organisms and Their Environment.

00:00:05.000 --> 00:00:12.000
All living things share common characteristics that distinguish them from non-living things.

00:00:12.000 --> 00:00:18.000
Living organisms grow, reproduce, and respond to their environment.

00:00:18.000 --> 00:00:25.000
Plants make their own food through a process called photosynthesis.

00:00:25.000 --> 00:00:32.000
Animals depend on plants or other animals for their nutrition.

00:00:32.000 --> 00:00:40.000
Understanding life processes helps us appreciate the diversity of life on Earth.`,

    hindi: `WEBVTT

00:00:01.000 --> 00:00:05.000
जीवित जीवों और उनके पर्यावरण के अध्याय में आपका स्वागत है।

00:00:05.000 --> 00:00:12.000
सभी जीवित चीजें सामान्य विशेषताएं साझा करती हैं जो उन्हें निर्जीव चीजों से अलग करती हैं।

00:00:12.000 --> 00:00:18.000
जीवित जीव बढ़ते हैं, प्रजनन करते हैं और अपने पर्यावरण पर प्रतिक्रिया देते हैं।

00:00:18.000 --> 00:00:25.000
पौधे प्रकाश संश्लेषण की प्रक्रिया के माध्यम से अपना भोजन स्वयं बनाते हैं।

00:00:25.000 --> 00:00:32.000
जानवर अपने पोषण के लिए पौधों या अन्य जानवरों पर निर्भर होते हैं।

00:00:32.000 --> 00:00:40.000
जीवन प्रक्रियाओं को समझना हमें पृथ्वी पर जीवन की विविधता की सराहना करने में मदद करता है।`,

    telugu: `WEBVTT

00:00:01.000 --> 00:00:05.000
జీవులు మరియు వాటి పర్యావరణం అధ్యాయానికి స్వాగతం.

00:00:05.000 --> 00:00:12.000
అన్ని జీవులూ జడ వస్తువుల నుండి వాటిని వేరు చేసే సాధారణ లక్షణాలు కలిగి ఉంటాయి.

00:00:12.000 --> 00:00:18.000
జీవులు పెరుగుతాయి, జననం చేస్తాయి మరియు పర్యావరణానికి స్పందిస్తాయి.

00:00:18.000 --> 00:00:25.000
మొక్కలు కిరణజన్య సంయోగక్రియ ద్వారా తమ ఆహారాన్ని తాముగా తయారు చేసుకుంటాయి.

00:00:25.000 --> 00:00:32.000
జంతువులు తమ పోషణ కోసం మొక్కలపై లేదా ఇతర జంతువులపై ఆధారపడతాయి.

00:00:32.000 --> 00:00:40.000
జీవన ప్రక్రియలు అర్థం చేసుకోవడం భూమిపై జీవ వైవిధ్యాన్ని అభినందించడానికి సహాయపడుతుంది.`,

    gujarati: `WEBVTT

00:00:01.000 --> 00:00:05.000
જીવંત સજીવો અને તેમના પર્યાવરણ અધ્યાયમાં આપનું સ્વાગત.

00:00:05.000 --> 00:00:12.000
બધા જીવંત સજીવોમાં સામાન્ય લક્ષણો હોય છે જે તેમને નિર્જીવ વસ્તુઓથી અલગ પાડે છે.

00:00:12.000 --> 00:00:18.000
જીવંત સજીવો વૃદ્ધિ પામે છે, પ્રજનન કરે છે અને પર્યાવરણ પ્રત્યે પ્રતિક્રિયા આપે છે.

00:00:18.000 --> 00:00:25.000
છોડ પ્રકાશ સંશ્લેષણ દ્વારા પોતાનો ખોરાક બનાવે છે.

00:00:25.000 --> 00:00:32.000
પ્રાણીઓ તેમના પોષણ માટે છોડ અથવા અન્ય પ્રાણીઓ પર નિર્ભર હોય છે.

00:00:32.000 --> 00:00:40.000
જીવન પ્રક્રિયાઓ સમજવી આપણને પૃથ્વી પરના જીવનની વિવિધતાની પ્રશંસા કરવામાં મદદ કરે છે.`,

    kannada: `WEBVTT

00:00:01.000 --> 00:00:05.000
ಜೀವಿಗಳು ಮತ್ತು ಅವುಗಳ ಪರಿಸರ ಅಧ್ಯಾಯಕ್ಕೆ ಸ್ವಾಗತ.

00:00:05.000 --> 00:00:12.000
ಎಲ್ಲಾ ಜೀವಿಗಳು ಅಜೀವ ವಸ್ತುಗಳಿಂದ ಅವುಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸುವ ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುತ್ತವೆ.

00:00:12.000 --> 00:00:18.000
ಜೀವಿಗಳು ಬೆಳೆಯುತ್ತವೆ, ಸಂತಾನೋತ್ಪತ್ತಿ ಮಾಡುತ್ತವೆ ಮತ್ತು ಪರಿಸರಕ್ಕೆ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತವೆ.

00:00:18.000 --> 00:00:25.000
ಸಸ್ಯಗಳು ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಮೂಲಕ ತಮ್ಮ ಆಹಾರವನ್ನು ತಾವೇ ತಯಾರಿಸಿಕೊಳ್ಳುತ್ತವೆ.

00:00:25.000 --> 00:00:32.000
ಪ್ರಾಣಿಗಳು ತಮ್ಮ ಪೋಷಣೆಗಾಗಿ ಸಸ್ಯಗಳ ಅಥವಾ ಇತರ ಪ್ರಾಣಿಗಳ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿವೆ.

00:00:32.000 --> 00:00:40.000
ಜೀವನ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಭೂಮಿಯ ಜೀವ ವೈವಿಧ್ಯವನ್ನು ಮೆಚ್ಚಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.`,

    tamil: `WEBVTT

00:00:01.000 --> 00:00:05.000
உயிரினங்கள் மற்றும் சுற்றுச்சூழல் அத்தியாயத்திற்கு வரவேற்கிறோம்.

00:00:05.000 --> 00:00:12.000
அனைத்து உயிரினங்களும் உயிரற்ற பொருட்களிலிருந்து அவற்றை வேறுபடுத்தும் பொதுவான பண்புகளை கொண்டுள்ளன.

00:00:12.000 --> 00:00:18.000
உயிரினங்கள் வளர்கின்றன, இனப்பெருக்கம் செய்கின்றன மற்றும் சுற்றுச்சூழலுக்கு பதிலளிக்கின்றன.

00:00:18.000 --> 00:00:25.000
தாவரங்கள் ஒளிச்சேர்க்கை மூலம் தங்கள் உணவை தாமே தயாரிக்கின்றன.

00:00:25.000 --> 00:00:32.000
விலங்குகள் தங்கள் ஊட்டத்திற்கு தாவரங்கள் அல்லது பிற விலங்குகளை சார்ந்துள்ளன.

00:00:32.000 --> 00:00:40.000
உயிர் செயல்முறைகளை புரிந்துகொள்வது பூமியில் உயிர் வகையகத்தை பாராட்ட உதவுகிறது.`,
  },

  physics_motion: {
    english: `WEBVTT

00:00:01.000 --> 00:00:05.000
Welcome to the chapter on Motion and Forces.

00:00:05.000 --> 00:00:12.000
Motion is the change in position of an object over time relative to a reference point.

00:00:12.000 --> 00:00:18.000
Speed is defined as the distance traveled divided by the time taken.

00:00:18.000 --> 00:00:25.000
Velocity is speed with a specific direction — it is a vector quantity.

00:00:25.000 --> 00:00:32.000
Acceleration is the rate of change of velocity with respect to time.

00:00:32.000 --> 00:00:40.000
Newton's three laws of motion form the foundation of classical mechanics.`,

    hindi: `WEBVTT

00:00:01.000 --> 00:00:05.000
गति और बल के अध्याय में आपका स्वागत है।

00:00:05.000 --> 00:00:12.000
गति एक संदर्भ बिंदु के सापेक्ष समय के साथ किसी वस्तु की स्थिति में परिवर्तन है।

00:00:12.000 --> 00:00:18.000
चाल को तय की गई दूरी को लिए गए समय से विभाजित करके परिभाषित किया जाता है।

00:00:18.000 --> 00:00:25.000
वेग एक विशिष्ट दिशा के साथ चाल है — यह एक सदिश राशि है।

00:00:25.000 --> 00:00:32.000
त्वरण समय के सापेक्ष वेग के परिवर्तन की दर है।

00:00:32.000 --> 00:00:40.000
न्यूटन के गति के तीन नियम शास्त्रीय यांत्रिकी की नींव बनाते हैं।`,

    telugu: `WEBVTT

00:00:01.000 --> 00:00:05.000
చలనం మరియు బలాల అధ్యాయానికి స్వాగతం.

00:00:05.000 --> 00:00:12.000
చలనం అనేది సమయంతో పాటు ఒక వస్తువు యొక్క స్థానంలో మార్పు.

00:00:12.000 --> 00:00:18.000
వేగం అనేది ప్రయాణించిన దూరాన్ని తీసుకున్న సమయంతో భాగించడం.

00:00:18.000 --> 00:00:25.000
వేగ పరిమాణం దిశతో సహా వేగం — ఇది సదిశ రాశి.

00:00:25.000 --> 00:00:32.000
త్వరణం అనేది వేగ పరిమాణం మార్పు రేటు.

00:00:32.000 --> 00:00:40.000
న్యూటన్ యొక్క మూడు చలన నియమాలు శాస్త్రీయ యాంత్రిక శాస్త్రానికి పునాది.`,

    gujarati: `WEBVTT

00:00:01.000 --> 00:00:05.000
ગતિ અને બળ અધ્યાયમાં આપનું સ્વાગત.

00:00:05.000 --> 00:00:12.000
ગતિ એ સમયના સંદર્ભ સાપેક્ષ બિંદુ સાથે કોઈ વસ્તુની સ્થિતિમાં ફેરફાર છે.

00:00:12.000 --> 00:00:18.000
ઝડપ એ કાપેલ અંતર ÷ લાગેલ સમય તરીકે વ્યાખ્યાયિત છે.

00:00:18.000 --> 00:00:25.000
વેગ ચોક્કસ દિશા સાથેની ઝડપ છે — તે સદિશ રાશિ છે.

00:00:25.000 --> 00:00:32.000
પ્રવેગ એ સમય સાથે વેગ બદલાવની ગતિ છે.

00:00:32.000 --> 00:00:40.000
ન્યૂટનના ગતિના ત્રણ નિયમો ક્લાસિકલ મિકેનિક્સનો આધાર છે.`,

    kannada: `WEBVTT

00:00:01.000 --> 00:00:05.000
ಚಲನೆ ಮತ್ತು ಬಲಗಳ ಅಧ್ಯಾಯಕ್ಕೆ ಸ್ವಾಗತ.

00:00:05.000 --> 00:00:12.000
ಚಲನೆ ಎಂದರೆ ಸಮಯದೊಂದಿಗೆ ವಸ್ತುವಿನ ಸ್ಥಾನದಲ್ಲಿ ಬದಲಾವಣೆ.

00:00:12.000 --> 00:00:18.000
ವೇಗ ಎಂದರೆ ತೆಗೆದ ಸಮಯದಿಂದ ಭಾಗಿಸಿದ ಪ್ರಯಾಣಿಸಿದ ದೂರ.

00:00:18.000 --> 00:00:25.000
ವೇಗ ಪರಿಮಾಣ ನಿರ್ದಿಷ್ಟ ದಿಕ್ಕಿನೊಂದಿಗೆ ಚಲನ ವೇಗ — ಇದು ಸದಿಶ ರಾಶಿ.

00:00:25.000 --> 00:00:32.000
ತ್ವರಣ ಎಂದರೆ ಸಮಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ವೇಗದ ಬದಲಾವಣೆ ದರ.

00:00:32.000 --> 00:00:40.000
ನ್ಯೂಟನ್‌ನ ಮೂರು ಚಲನ ನಿಯಮಗಳು ಶಾಸ್ತ್ರೀಯ ಯಂತ್ರವಿಜ್ಞಾನದ ಆಧಾರ.`,

    tamil: `WEBVTT

00:00:01.000 --> 00:00:05.000
இயக்கம் மற்றும் விசைகள் அத்தியாயத்திற்கு வரவேற்கிறோம்.

00:00:05.000 --> 00:00:12.000
இயக்கம் என்பது காலத்துடன் ஒரு பொருளின் நிலையில் மாற்றம்.

00:00:12.000 --> 00:00:18.000
வேகம் என்பது பயணித்த தூரத்தை எடுத்த நேரத்தால் வகுத்தது.

00:00:18.000 --> 00:00:25.000
திசைவேகம் குறிப்பிட்ட திசையுடன் கூடிய வேகம் — இது ஒரு வெக்டர் அளவு.

00:00:25.000 --> 00:00:32.000
முடுக்கம் என்பது நேரத்தைப் பொருத்து திசைவேக மாற்ற வீதம்.

00:00:32.000 --> 00:00:40.000
நியூட்டனின் மூன்று இயக்க விதிகள் கிளாசிக்கல் இயக்கவியலின் அடிப்படை.`,
  },
};

// Map topic keys to subject names
const SUBJECT_TOPIC = {
  'Mathematics': 'math_numbers',
  'Science': 'science_life',
  'Physics': 'physics_motion',
  'Chemistry': 'physics_motion',
  'Biology': 'science_life',
  'English': 'math_numbers',
  'Hindi': 'math_numbers',
  'Social Science': 'science_life',
};

// Demo lectures: 3 per class across different subjects
const DEMO_LECTURES = [
  // Class 6
  { class_level: 6, subject: 'Mathematics', chapter_no: 1 },
  { class_level: 6, subject: 'Science', chapter_no: 1 },
  { class_level: 6, subject: 'Hindi', chapter_no: 1 },
  // Class 7
  { class_level: 7, subject: 'Mathematics', chapter_no: 1 },
  { class_level: 7, subject: 'Science', chapter_no: 1 },
  { class_level: 7, subject: 'Social Science', chapter_no: 1 },
  // Class 8
  { class_level: 8, subject: 'Mathematics', chapter_no: 1 },
  { class_level: 8, subject: 'Science', chapter_no: 1 },
  // Class 9
  { class_level: 9, subject: 'Mathematics', chapter_no: 1 },
  { class_level: 9, subject: 'Science', chapter_no: 1 },
  { class_level: 9, subject: 'Chemistry', chapter_no: 1 },
  // Class 10
  { class_level: 10, subject: 'Mathematics', chapter_no: 1 },
  { class_level: 10, subject: 'Science', chapter_no: 1 },
  // Class 11
  { class_level: 11, subject: 'Mathematics', chapter_no: 1 },
  { class_level: 11, subject: 'Physics', chapter_no: 1 },
  { class_level: 11, subject: 'Biology', chapter_no: 1 },
  // Class 12
  { class_level: 12, subject: 'Mathematics', chapter_no: 1 },
  { class_level: 12, subject: 'Physics', chapter_no: 1 },
  { class_level: 12, subject: 'Biology', chapter_no: 1 },
];

async function uploadSubtitle(filename, content) {
  const { error } = await supabase.storage
    .from('lecture-videos')
    .upload(`subtitles/${filename}`, new Blob([content], { type: 'text/vtt' }), {
      upsert: true,
      contentType: 'text/vtt',
    });
  if (error) console.warn(`  Warning uploading ${filename}:`, error.message);
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/lecture-videos/subtitles/${filename}`;
}

async function main() {
  console.log('Setting up demo lectures with multilingual subtitles...\n');

  // Load subjects
  const { data: subjects } = await supabase.from('subjects').select('id, name');
  const subjectMap = {};
  for (const s of subjects) subjectMap[s.name] = s.id;

  let processed = 0;

  for (const demo of DEMO_LECTURES) {
    const subjectId = subjectMap[demo.subject];
    if (!subjectId) { console.warn(`Subject not found: ${demo.subject}`); continue; }

    // Find the lecture
    const { data: lectures } = await supabase
      .from('lectures')
      .select('id, title')
      .eq('class_level', demo.class_level)
      .eq('subject_id', subjectId)
      .eq('chapter_number', demo.chapter_no)
      .limit(1);

    if (!lectures?.length) { console.warn(`Lecture not found: Class ${demo.class_level} ${demo.subject} ch${demo.chapter_no}`); continue; }

    const lecture = lectures[0];
    const videoFile = SUBJECT_VIDEO[demo.subject] || 'math.mp4';
    const videoUrl = `${BASE_VIDEO_URL}/${videoFile}`;
    const topicKey = SUBJECT_TOPIC[demo.subject] || 'math_numbers';
    const topicData = SUBTITLE_CONTENT[topicKey];

    console.log(`Processing: Class ${demo.class_level} ${demo.subject} - "${lecture.title}"`);

    // Upload subtitle VTT files for each language
    const subtitleUrls = {};
    for (const lang of LANGUAGES) {
      const vttContent = topicData[lang];
      if (!vttContent) continue;
      const filename = `class${demo.class_level}_${demo.subject.toLowerCase().replace(/\s+/g,'_')}_${lang}.vtt`;
      const url = await uploadSubtitle(filename, vttContent);
      subtitleUrls[lang] = url;
    }

    // Update all lecture_videos rows for this lecture
    const { data: videoRows } = await supabase
      .from('lecture_videos')
      .select('id, language')
      .eq('lecture_id', lecture.id);

    if (videoRows?.length) {
      for (const row of videoRows) {
        await supabase
          .from('lecture_videos')
          .update({ video_url: videoUrl, subtitle_urls: subtitleUrls })
          .eq('id', row.id);
      }
    } else {
      // Insert language rows if none exist
      for (const lang of LANGUAGES) {
        await supabase.from('lecture_videos').insert({
          lecture_id: lecture.id,
          language: lang,
          youtube_video_id: 'placeholder',
          video_url: videoUrl,
          subtitle_urls: subtitleUrls,
          is_default: lang === 'english',
        });
      }
    }

    // Add thumbnail URL to lecture
    const thumbnailUrl = `https://awupegzmggkigoruoqus.supabase.co/storage/v1/object/public/lecture-videos/thumbnails/${demo.subject.toLowerCase().replace(/\s+/g,'_')}.jpg`;
    await supabase.from('lectures').update({ thumbnail_url: thumbnailUrl }).eq('id', lecture.id);

    processed++;
    console.log(`  ✓ ${LANGUAGES.length} subtitle tracks uploaded, video URL set`);
  }

  console.log(`\nDone! Processed ${processed} demo lectures.`);
  console.log(`Each lecture has ${LANGUAGES.length} subtitle languages: ${LANGUAGES.join(', ')}`);
}

main().catch(console.error);
