const https = require('https');
require('dotenv').config();

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!PROJECT_REF || !ACCESS_TOKEN) {
  console.error('❌ Missing SUPABASE_PROJECT_REF or SUPABASE_ACCESS_TOKEN in .env');
  process.exit(1);
}

function runSQL(sql, label) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) { console.error(`[${label}] Error:`, data.slice(0, 300)); reject(new Error(label)); }
        else { console.log(`[${label}] ✅`); resolve(JSON.parse(data)); }
      });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

function esc(s) { return (s || '').replace(/'/g, "''"); }

// subject IDs: Math=1, Science=2, Physics=3, History=4, English=5, Geography=6, Biology=7, Chemistry=8, Hindi=9, SocialScience=10
const S = { Math:1, Science:2, Physics:3, English:5, Hindi:9, Social:10, Chemistry:8, Biology:7 };

// Each quiz: { title, desc, subject_id, class_level, difficulty, questions:[{q, a, opts:[4], exp}] }
const allQuizzes = [

  // ══ CLASS 6 ══
  { title:'Class 6 - Mathematics - Numbers & Operations', desc:'Knowing numbers, place value, whole numbers', subject_id:S.Math, class_level:6, difficulty:'easy', questions:[
    {q:'What is the place value of 5 in 35,678?', a:'5000', opts:['500','5000','50000','50'], exp:'In 35,678 the digit 5 is in the thousands place, so its place value is 5000.'},
    {q:'Which is the smallest prime number?', a:'2', opts:['1','2','3','5'], exp:'2 is the smallest prime number as it has exactly two factors: 1 and 2.'},
    {q:'What is the LCM of 4 and 6?', a:'12', opts:['6','8','12','24'], exp:'LCM of 4 and 6 is 12 as it is the smallest number divisible by both.'},
    {q:'What is the HCF of 12 and 18?', a:'6', opts:['3','6','9','12'], exp:'HCF of 12 and 18 is 6 as it is the greatest common factor.'},
    {q:'Which number is neither prime nor composite?', a:'1', opts:['0','1','2','4'], exp:'1 is neither prime nor composite by definition.'},
    {q:'How many factors does 12 have?', a:'6', opts:['4','5','6','8'], exp:'Factors of 12 are: 1,2,3,4,6,12 — total 6 factors.'},
    {q:'What is 1000 + 999 + 998?', a:'2997', opts:['2997','2998','2999','3000'], exp:'1000+999+998 = 2997'},
    {q:'Which is the largest 4-digit number?', a:'9999', opts:['1000','9000','9999','10000'], exp:'The largest 4-digit number is 9999.'},
  ]},
  { title:'Class 6 - Mathematics - Fractions & Decimals', desc:'Fractions, equivalent fractions, decimals', subject_id:S.Math, class_level:6, difficulty:'easy', questions:[
    {q:'Which fraction is equivalent to 1/2?', a:'3/6', opts:['2/3','3/6','3/4','4/6'], exp:'3/6 = 1/2 when simplified by dividing numerator and denominator by 3.'},
    {q:'What is 1/4 + 1/4?', a:'1/2', opts:['1/4','1/2','2/4','2/8'], exp:'1/4 + 1/4 = 2/4 = 1/2'},
    {q:'Convert 0.5 to a fraction.', a:'1/2', opts:['5/10','1/2','1/5','5/100'], exp:'0.5 = 5/10 = 1/2'},
    {q:'Which decimal is greater: 0.7 or 0.07?', a:'0.7', opts:['0.07','0.7','Equal','Cannot determine'], exp:'0.7 > 0.07 because 0.7 = 7 tenths while 0.07 = 7 hundredths.'},
    {q:'What is 3/5 of 25?', a:'15', opts:['10','12','15','20'], exp:'3/5 of 25 = (3 × 25)/5 = 75/5 = 15'},
    {q:'Which is a proper fraction?', a:'3/7', opts:['7/3','3/3','9/4','3/7'], exp:'A proper fraction has numerator less than denominator. 3/7 satisfies this.'},
    {q:'What is 2.3 + 1.7?', a:'4.0', opts:['3.0','4.0','4.1','3.10'], exp:'2.3 + 1.7 = 4.0'},
    {q:'What is 1/2 of 1/2?', a:'1/4', opts:['1/2','1/4','2/4','1/8'], exp:'1/2 × 1/2 = 1/4'},
  ]},

  { title:'Class 6 - Science - Living World', desc:'Plants, animals, habitats and adaptations', subject_id:S.Science, class_level:6, difficulty:'easy', questions:[
    {q:'Which part of the plant makes food?', a:'Leaf', opts:['Root','Stem','Leaf','Flower'], exp:'Leaves make food through photosynthesis using sunlight, water and CO2.'},
    {q:'What gas do plants take in during photosynthesis?', a:'Carbon dioxide', opts:['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'], exp:'Plants absorb carbon dioxide (CO2) for photosynthesis.'},
    {q:'Which of these is a herbivore?', a:'Cow', opts:['Lion','Tiger','Cow','Eagle'], exp:'Cows eat only plants, so they are herbivores.'},
    {q:'What is the function of roots?', a:'Absorb water and minerals', opts:['Make food','Absorb water and minerals','Carry pollen','Store seeds'], exp:'Roots absorb water and minerals from the soil.'},
    {q:'Which organism is a decomposer?', a:'Mushroom', opts:['Grass','Deer','Mushroom','Eagle'], exp:'Mushrooms (fungi) are decomposers — they break down dead matter.'},
    {q:'What is the process by which plants make their food called?', a:'Photosynthesis', opts:['Respiration','Photosynthesis','Digestion','Transpiration'], exp:'Plants make food through photosynthesis in their leaves.'},
    {q:'Which part of the flower becomes a fruit?', a:'Ovary', opts:['Petal','Sepal','Ovary','Stamen'], exp:'After fertilisation, the ovary develops into a fruit.'},
    {q:'Animals that eat both plants and animals are called?', a:'Omnivores', opts:['Herbivores','Carnivores','Omnivores','Decomposers'], exp:'Omnivores eat both plants and animals. E.g., humans, bears.'},
  ]},
  { title:'Class 6 - Science - Materials & Changes', desc:'Properties of materials, separation, changes', subject_id:S.Science, class_level:6, difficulty:'easy', questions:[
    {q:'Which material is transparent?', a:'Glass', opts:['Wood','Glass','Stone','Rubber'], exp:'Glass allows light to pass through completely, making it transparent.'},
    {q:'Which method is used to separate sand from water?', a:'Filtration', opts:['Evaporation','Distillation','Filtration','Sieving'], exp:'Filtration separates insoluble solids like sand from water using a filter.'},
    {q:'Rusting of iron is a?', a:'Chemical change', opts:['Physical change','Chemical change','Reversible change','No change'], exp:'Rusting is a chemical change as a new substance (iron oxide) is formed.'},
    {q:'Which of the following dissolves in water?', a:'Salt', opts:['Sand','Oil','Salt','Chalk'], exp:'Salt (NaCl) dissolves completely in water forming a solution.'},
    {q:'Which is a conductor of electricity?', a:'Copper', opts:['Rubber','Plastic','Wood','Copper'], exp:'Copper is a metal and conducts electricity well.'},
    {q:'Melting of ice is a?', a:'Physical change', opts:['Chemical change','Physical change','Biological change','Irreversible change'], exp:'Melting is a physical change — water can be frozen back to ice.'},
    {q:'Which separation method uses wind?', a:'Winnowing', opts:['Sieving','Filtration','Winnowing','Evaporation'], exp:'Winnowing uses wind to separate lighter husk from heavier grain.'},
    {q:'What happens when water is boiled?', a:'It turns to steam', opts:['It turns to ice','It turns to steam','It becomes solid','Nothing happens'], exp:'Water boils at 100°C and turns into steam (water vapour).'},
  ]},

  { title:'Class 6 - Social Science - Ancient History', desc:'Early humans, Harappan civilisation, Vedic age', subject_id:S.Social, class_level:6, difficulty:'easy', questions:[
    {q:'Where did the Harappan civilisation flourish?', a:'Indus Valley', opts:['Ganga Valley','Indus Valley','Deccan Plateau','Brahmaputra Valley'], exp:'The Harappan civilisation (2600-1900 BCE) flourished in the Indus Valley.'},
    {q:'The earliest humans were known as?', a:'Hunter-gatherers', opts:['Farmers','Traders','Hunter-gatherers','Nomads'], exp:'Early humans hunted animals and gathered fruits — they were hunter-gatherers.'},
    {q:'Which metal was used in the Vedic age?', a:'Iron', opts:['Gold','Silver','Copper','Iron'], exp:'The later Vedic age (1000-600 BCE) saw extensive use of iron tools.'},
    {q:'The Vedas are written in which language?', a:'Sanskrit', opts:['Pali','Prakrit','Sanskrit','Tamil'], exp:'The four Vedas are written in Vedic Sanskrit.'},
    {q:'The great bath was found at?', a:'Mohenjo-daro', opts:['Harappa','Lothal','Mohenjo-daro','Kalibangan'], exp:'The Great Bath, used for ritual bathing, was discovered at Mohenjo-daro.'},
    {q:'Which is the oldest Veda?', a:'Rigveda', opts:['Samaveda','Yajurveda','Rigveda','Atharvaveda'], exp:'The Rigveda is the oldest of the four Vedas.'},
    {q:'Janapadas were?', a:'Territorial kingdoms', opts:['Rivers','Mountains','Territorial kingdoms','Trading routes'], exp:'Janapadas were territorial kingdoms that arose in the later Vedic period.'},
    {q:'The Harappan cities were known for?', a:'Town planning', opts:['Large armies','Town planning','Pyramids','Iron weapons'], exp:'Harappan cities had advanced town planning with grid-pattern streets and drainage.'},
  ]},
  { title:'Class 6 - Social Science - Geography', desc:'Earth, globes, maps, landforms', subject_id:S.Social, class_level:6, difficulty:'easy', questions:[
    {q:'The Earth revolves around the?', a:'Sun', opts:['Moon','Sun','Mars','Stars'], exp:'The Earth revolves around the Sun in about 365.25 days completing one year.'},
    {q:'The imaginary line dividing Earth into North and South is?', a:'Equator', opts:['Tropic of Cancer','Equator','Prime Meridian','Arctic Circle'], exp:'The Equator (0° latitude) divides the Earth into Northern and Southern hemispheres.'},
    {q:'How many continents are there on Earth?', a:'7', opts:['5','6','7','8'], exp:'There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, Australia.'},
    {q:'The largest ocean is?', a:'Pacific Ocean', opts:['Atlantic Ocean','Indian Ocean','Pacific Ocean','Arctic Ocean'], exp:'The Pacific Ocean is the largest and deepest ocean covering about one-third of Earth.'},
    {q:'What does a map scale show?', a:'Ratio of map distance to actual distance', opts:['Direction','Height of mountains','Ratio of map distance to actual distance','Rainfall'], exp:'Scale shows the relationship between distances on the map and actual distances on the ground.'},
    {q:'The North Pole is located in the?', a:'Arctic', opts:['Antarctic','Arctic','Atlantic','Sahara'], exp:'The North Pole is in the Arctic region, surrounded by the Arctic Ocean.'},
    {q:'Which layer of the Earth is we live on?', a:'Crust', opts:['Mantle','Core','Crust','Inner core'], exp:'The outermost layer of the Earth is called the crust, and we live on it.'},
    {q:'Rotation of Earth causes?', a:'Day and night', opts:['Seasons','Day and night','Eclipses','Tides only'], exp:'Earth rotates on its axis causing day and night (one rotation = 24 hours).'},
  ]},

  { title:'Class 6 - English - Reading & Grammar', desc:'Comprehension, vocabulary, basic grammar', subject_id:S.English, class_level:6, difficulty:'easy', questions:[
    {q:'A noun that names a general person or thing is called?', a:'Common noun', opts:['Proper noun','Common noun','Abstract noun','Collective noun'], exp:'Common nouns name general people, places or things (e.g., boy, city, book).'},
    {q:'Which sentence is correct?', a:'She is going to school.', opts:['She are going to school.','She going to school.','She is going to school.','Her is going to school.'], exp:'Subject-verb agreement: singular subject "She" takes "is".'},
    {q:'The opposite of "ancient" is?', a:'Modern', opts:['Old','Older','Modern','Historic'], exp:'Ancient means very old; its antonym (opposite) is modern.'},
    {q:'A word that describes a noun is called?', a:'Adjective', opts:['Verb','Adverb','Adjective','Pronoun'], exp:'An adjective describes or modifies a noun (e.g., "tall" tree, "blue" sky).'},
    {q:'Which punctuation ends a question?', a:'?', opts:['.','!','?',','], exp:'A question mark (?) is used at the end of interrogative sentences.'},
    {q:'"The stars _____ bright tonight." Which verb fits?', a:'are', opts:['is','am','are','be'], exp:'"Stars" is plural, so the correct verb is "are".'},
    {q:'A synonym of "happy" is?', a:'Joyful', opts:['Sad','Angry','Joyful','Tired'], exp:'Joyful means feeling great happiness — a synonym of happy.'},
    {q:'Which is a pronoun?', a:'They', opts:['Run','Beautiful','They','Quickly'], exp:'Pronouns replace nouns. "They" is a personal pronoun.'},
  ]},
  { title:'Class 6 - English - Literature', desc:'Stories, poems and comprehension from Class 6 textbook', subject_id:S.English, class_level:6, difficulty:'easy', questions:[
    {q:'In "A Tale of Two Birds", what separated the two birds?', a:'A storm', opts:['A hunter','A storm','A river','A wall'], exp:'A storm separated the two birds and they grew up in different environments.'},
    {q:'What is the moral of "The Friendly Mongoose"?', a:'Hasty decisions can be dangerous', opts:['Be kind to animals','Hasty decisions can be dangerous','Mongooses are friendly','Always trust pets'], exp:'The story warns against making hasty judgments without thinking clearly.'},
    {q:'Who was Tansen in Mughal history?', a:'A great musician', opts:['A great warrior','A great musician','A poet','A painter'], exp:'Tansen was one of the Navaratnas (nine gems) of Emperor Akbar, a legendary musician.'},
    {q:'In "The Wonder Called Sleep", which type of text is it?', a:'Informational', opts:['Fiction','Poem','Informational','Drama'], exp:'It is an informational/factual text providing scientific facts about sleep.'},
    {q:'What is a fable?', a:'A story with a moral, often with animals as characters', opts:['A long poem','A true story','A story with a moral, often with animals as characters','A drama'], exp:'Fables are short stories, usually with animal characters, that teach a moral lesson.'},
    {q:'What does "comprehension" mean in English class?', a:'Understanding a passage', opts:['Writing a story','Understanding a passage','Learning grammar rules','Memorising poems'], exp:'Comprehension exercises test your understanding of a given reading passage.'},
    {q:'In "The Monkey and the Crocodile", what did the crocodile want?', a:'The monkey\'s heart', opts:['The monkey\'s banana','The monkey\'s heart','To be friends','To swim together'], exp:'The crocodile\'s wife wanted the monkey\'s heart, so the crocodile tricked the monkey.'},
    {q:'A poem that tells a story is called?', a:'Ballad', opts:['Sonnet','Haiku','Ballad','Ode'], exp:'A ballad is a narrative poem that tells a story, often with repeated refrains.'},
  ]},

  { title:'Class 6 - Hindi - वसंत भाग 1', desc:'कविता और कहानियाँ - वसंत भाग 1', subject_id:S.Hindi, class_level:6, difficulty:'easy', questions:[
    {q:'"वह चिड़िया जो" कविता के कवि कौन हैं?', a:'केदारनाथ अग्रवाल', opts:['सूरदास','केदारनाथ अग्रवाल','तुलसीदास','कबीर'], exp:'"वह चिड़िया जो" केदारनाथ अग्रवाल द्वारा रचित कविता है।'},
    {q:'"नादान दोस्त" कहानी किसने लिखी?', a:'प्रेमचंद', opts:['रवींद्रनाथ','प्रेमचंद','निराला','महादेवी वर्मा'], exp:'"नादान दोस्त" मुंशी प्रेमचंद की प्रसिद्ध बाल कहानी है।'},
    {q:'संज्ञा किसे कहते हैं?', a:'किसी व्यक्ति, वस्तु या स्थान के नाम को', opts:['क्रिया को','विशेषण को','किसी व्यक्ति, वस्तु या स्थान के नाम को','सर्वनाम को'], exp:'संज्ञा वह शब्द है जो किसी व्यक्ति, स्थान, वस्तु या भाव का नाम बताए।'},
    {q:'निम्न में से क्रिया शब्द कौन सा है?', a:'दौड़ना', opts:['सुंदर','घर','दौड़ना','नीला'], exp:'क्रिया वह शब्द है जो कार्य करने का बोध कराए। "दौड़ना" एक क्रिया है।'},
    {q:'"अक्षरों का महत्व" पाठ किस विधा में है?', a:'निबंध', opts:['कविता','कहानी','निबंध','नाटक'], exp:'"अक्षरों का महत्व" एक निबंध है जो लेखन कला के इतिहास पर आधारित है।'},
    {q:'विशेषण किसकी विशेषता बताता है?', a:'संज्ञा की', opts:['क्रिया की','संज्ञा की','सर्वनाम की','अव्यय की'], exp:'विशेषण संज्ञा या सर्वनाम की विशेषता बताने वाला शब्द है।'},
    {q:'"बचपन" पाठ किसका संस्मरण है?', a:'कृष्णा सोबती', opts:['महादेवी वर्मा','कृष्णा सोबती','प्रेमचंद','हजारीप्रसाद द्विवेदी'], exp:'"बचपन" कृष्णा सोबती का संस्मरण है जिसमें उन्होंने अपने बचपन को याद किया है।'},
    {q:'सर्वनाम का उदाहरण है?', a:'वह', opts:['राम','दौड़ना','सुंदर','वह'], exp:'सर्वनाम वह शब्द है जो संज्ञा के स्थान पर प्रयोग होता है। "वह" एक सर्वनाम है।'},
  ]},

  // ══ CLASS 7 ══
  { title:'Class 7 - Mathematics - Integers & Equations', desc:'Integers, simple equations, fractions', subject_id:S.Math, class_level:7, difficulty:'easy', questions:[
    {q:'What is (-5) + (-3)?', a:'-8', opts:['-8','8','-2','2'], exp:'Adding two negative numbers: (-5) + (-3) = -8'},
    {q:'Solve: x + 5 = 12', a:'7', opts:['5','6','7','17'], exp:'x = 12 - 5 = 7'},
    {q:'What is (-6) × (-4)?', a:'24', opts:['-24','24','-10','10'], exp:'Negative × Negative = Positive. (-6) × (-4) = +24'},
    {q:'Solve: 3x = 21', a:'7', opts:['7','63','18','9'], exp:'x = 21 ÷ 3 = 7'},
    {q:'What is the product of -3 and +7?', a:'-21', opts:['21','-21','4','-4'], exp:'Positive × Negative = Negative. (-3) × 7 = -21'},
    {q:'Which is on the right of 0 on a number line?', a:'Positive numbers', opts:['Negative numbers','Positive numbers','Fractions only','Zero only'], exp:'Positive numbers are to the right of zero on the number line.'},
    {q:'Solve: 2x - 4 = 10', a:'7', opts:['3','7','5','8'], exp:'2x = 10 + 4 = 14, so x = 7'},
    {q:'What is |-8|?', a:'8', opts:['-8','8','0','80'], exp:'The absolute value of -8 is 8 (distance from zero on number line).'},
  ]},
  { title:'Class 7 - Mathematics - Geometry & Mensuration', desc:'Lines, angles, triangles, area and perimeter', subject_id:S.Math, class_level:7, difficulty:'medium', questions:[
    {q:'Sum of angles in a triangle is?', a:'180°', opts:['90°','180°','270°','360°'], exp:'The angle sum property states that interior angles of a triangle add up to 180°.'},
    {q:'An equilateral triangle has how many equal sides?', a:'3', opts:['1','2','3','0'], exp:'All three sides of an equilateral triangle are equal.'},
    {q:'Area of a rectangle with length 8 cm and width 5 cm is?', a:'40 sq cm', opts:['13 sq cm','26 sq cm','40 sq cm','80 sq cm'], exp:'Area = length × width = 8 × 5 = 40 sq cm'},
    {q:'What is the perimeter of a square with side 6 cm?', a:'24 cm', opts:['12 cm','18 cm','24 cm','36 cm'], exp:'Perimeter of square = 4 × side = 4 × 6 = 24 cm'},
    {q:'A right angle measures?', a:'90°', opts:['45°','60°','90°','180°'], exp:'A right angle is exactly 90°.'},
    {q:'Two angles that add up to 90° are called?', a:'Complementary', opts:['Supplementary','Complementary','Adjacent','Vertical'], exp:'Complementary angles sum to 90°. Supplementary angles sum to 180°.'},
    {q:'Area of a triangle with base 10 cm and height 6 cm?', a:'30 sq cm', opts:['60 sq cm','30 sq cm','16 sq cm','20 sq cm'], exp:'Area = ½ × base × height = ½ × 10 × 6 = 30 sq cm'},
    {q:'The longest side of a right-angled triangle is called?', a:'Hypotenuse', opts:['Base','Perpendicular','Hypotenuse','Median'], exp:'The side opposite the right angle is called the hypotenuse.'},
  ]},

  { title:'Class 7 - Science - Nutrition & Digestion', desc:'Nutrition in plants and animals, digestion', subject_id:S.Science, class_level:7, difficulty:'easy', questions:[
    {q:'Which organelle is the site of photosynthesis?', a:'Chloroplast', opts:['Mitochondria','Nucleus','Chloroplast','Ribosome'], exp:'Chloroplasts contain chlorophyll and are the sites of photosynthesis in plant cells.'},
    {q:'Which enzyme in saliva digests starch?', a:'Amylase', opts:['Pepsin','Lipase','Amylase','Trypsin'], exp:'Salivary amylase breaks down starch into simpler sugars in the mouth.'},
    {q:'Which nutrient provides energy?', a:'Carbohydrates', opts:['Vitamins','Minerals','Carbohydrates','Water'], exp:'Carbohydrates are the primary source of energy for the body.'},
    {q:'Photosynthesis produces?', a:'Glucose and oxygen', opts:['Carbon dioxide and water','Glucose and oxygen','Protein and fat','ATP only'], exp:'6CO2 + 6H2O + light → C6H12O6 (glucose) + 6O2'},
    {q:'Which vitamin is produced by our skin in sunlight?', a:'Vitamin D', opts:['Vitamin A','Vitamin B','Vitamin C','Vitamin D'], exp:'Skin produces Vitamin D when exposed to sunlight (UV radiation).'},
    {q:'Plants that feed on insects are called?', a:'Insectivorous', opts:['Parasitic','Insectivorous','Saprophytic','Symbiotic'], exp:'Insectivorous plants (like pitcher plant) trap and digest insects for nutrients.'},
    {q:'The stomach produces which acid?', a:'Hydrochloric acid', opts:['Sulphuric acid','Hydrochloric acid','Nitric acid','Acetic acid'], exp:'The stomach produces hydrochloric acid (HCl) to help digest food and kill bacteria.'},
    {q:'Which part of the body absorbs digested food?', a:'Small intestine', opts:['Stomach','Large intestine','Small intestine','Liver'], exp:'The small intestine absorbs digested nutrients into the bloodstream.'},
  ]},
  { title:'Class 7 - Science - Motion, Heat & Light', desc:'Heat transfer, light reflection, motion and time', subject_id:S.Science, class_level:7, difficulty:'medium', questions:[
    {q:'Heat transfer through solids is called?', a:'Conduction', opts:['Convection','Radiation','Conduction','Evaporation'], exp:'Conduction is heat transfer through direct contact, mainly in solids.'},
    {q:'The speed of light is approximately?', a:'3 × 10⁸ m/s', opts:['3 × 10⁶ m/s','3 × 10⁸ m/s','3 × 10⁴ m/s','3 × 10¹⁰ m/s'], exp:'The speed of light in vacuum is approximately 3 × 10⁸ m/s.'},
    {q:'A concave mirror is used in?', a:'Torches', opts:['Rear-view mirrors','Torches','Periscopes','Kaleidoscopes'], exp:'Concave mirrors focus light and are used in torches and headlights.'},
    {q:'Temperature is measured in?', a:'Degrees Celsius', opts:['Kilogram','Metre','Degrees Celsius','Newton'], exp:'Temperature is measured in degrees Celsius (°C) or Kelvin (K).'},
    {q:'Sound travels fastest in?', a:'Solids', opts:['Air','Water','Vacuum','Solids'], exp:'Sound travels fastest in solids because particles are closely packed.'},
    {q:'A convex mirror always forms an image that is?', a:'Virtual and diminished', opts:['Real and magnified','Virtual and magnified','Real and diminished','Virtual and diminished'], exp:'Convex mirrors always form virtual, erect and diminished images.'},
    {q:'The SI unit of speed is?', a:'m/s', opts:['km/h','m/s','cm/s','m/h'], exp:'The SI unit of speed is metres per second (m/s).'},
    {q:'Echo is caused by?', a:'Reflection of sound', opts:['Absorption of sound','Reflection of sound','Refraction of sound','Transmission of sound'], exp:'Echo occurs when sound reflects off a hard surface and returns to the listener.'},
  ]},

  { title:'Class 7 - Social Science - Medieval India', desc:'Delhi Sultanate, Mughal Empire, trade', subject_id:S.Social, class_level:7, difficulty:'easy', questions:[
    {q:'Who founded the Delhi Sultanate?', a:'Qutb-ud-din Aibak', opts:['Babur','Akbar','Qutb-ud-din Aibak','Iltutmish'], exp:'Qutb-ud-din Aibak founded the Delhi Sultanate in 1206 CE.'},
    {q:'The Mughal Empire was founded by?', a:'Babur', opts:['Akbar','Humayun','Babur','Aurangzeb'], exp:'Babur defeated Ibrahim Lodi in the First Battle of Panipat (1526) and founded the Mughal Empire.'},
    {q:'Akbar is known for his policy of?', a:'Sulh-i-kul (peace with all)', opts:['Religious persecution','Sulh-i-kul (peace with all)','Military expansion only','Trade restrictions'], exp:'Akbar followed a policy of Sulh-i-kul meaning universal peace and tolerance.'},
    {q:'The Qutb Minar was built by?', a:'Qutb-ud-din Aibak', opts:['Akbar','Shah Jahan','Qutb-ud-din Aibak','Humayun'], exp:'The Qutb Minar was begun by Qutb-ud-din Aibak and completed by Iltutmish.'},
    {q:'Bhakti movement emphasised?', a:'Devotion to God without rituals', opts:['Idol worship','Devotion to God without rituals','Caste system','Pilgrimages'], exp:'The Bhakti movement stressed personal devotion to God, rejecting caste and rituals.'},
    {q:'The Sufi saint Khwaja Moinuddin Chishti is associated with?', a:'Ajmer', opts:['Delhi','Agra','Ajmer','Lahore'], exp:'The dargah of Khwaja Moinuddin Chishti is located in Ajmer, Rajasthan.'},
    {q:'Which Mughal emperor built the Taj Mahal?', a:'Shah Jahan', opts:['Akbar','Aurangzeb','Shah Jahan','Jahangir'], exp:'Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal (completed 1653).'},
    {q:'Trade in medieval India was mainly conducted through?', a:'Barter and coins', opts:['Only barter','Only coins','Barter and coins','Credit cards'], exp:'Medieval Indian trade used both barter (exchange of goods) and metal coins.'},
  ]},
  { title:'Class 7 - Social Science - Our Environment', desc:'Weather, climate, landforms, water bodies', subject_id:S.Social, class_level:7, difficulty:'easy', questions:[
    {q:'The innermost layer of the Earth is called?', a:'Inner core', opts:['Crust','Mantle','Outer core','Inner core'], exp:'The Earth has four layers: crust, mantle, outer core, and inner core (the innermost).'},
    {q:'Which rocks are formed by cooling of magma?', a:'Igneous rocks', opts:['Sedimentary rocks','Metamorphic rocks','Igneous rocks','Fossil rocks'], exp:'Igneous rocks form when molten magma cools and solidifies (e.g., granite, basalt).'},
    {q:'The process of wearing away of rocks is called?', a:'Erosion', opts:['Deposition','Erosion','Weathering','Sedimentation'], exp:'Erosion is the removal and transportation of rock particles by wind, water or ice.'},
    {q:'The Himalayas are an example of?', a:'Fold mountains', opts:['Block mountains','Volcanic mountains','Plateau','Fold mountains'], exp:'The Himalayas formed when the Indian plate collided with the Eurasian plate — fold mountains.'},
    {q:'Which ocean is the smallest?', a:'Arctic Ocean', opts:['Indian Ocean','Atlantic Ocean','Arctic Ocean','Southern Ocean'], exp:'The Arctic Ocean is the smallest and shallowest of the world\'s five oceans.'},
    {q:'Monsoon winds bring rain in which season?', a:'Summer', opts:['Winter','Spring','Summer','Autumn'], exp:'Monsoon winds blow from the sea in summer, bringing heavy rainfall to South Asia.'},
    {q:'The water cycle is driven by?', a:'Solar energy', opts:['Wind energy','Solar energy','Gravity alone','Human activity'], exp:'Solar energy drives evaporation in the water cycle, while gravity drives precipitation.'},
    {q:'Which gas makes up most of Earth\'s atmosphere?', a:'Nitrogen', opts:['Oxygen','Carbon dioxide','Nitrogen','Hydrogen'], exp:'Nitrogen makes up about 78% of Earth\'s atmosphere.'},
  ]},

  { title:'Class 7 - English - Grammar & Comprehension', desc:'Tenses, parts of speech, comprehension', subject_id:S.English, class_level:7, difficulty:'easy', questions:[
    {q:'Which sentence is in simple past tense?', a:'She walked to school.', opts:['She walks to school.','She is walking to school.','She walked to school.','She will walk to school.'], exp:'Simple past tense describes a completed action. "Walked" is past tense of "walk".'},
    {q:'A word that joins two sentences is called?', a:'Conjunction', opts:['Preposition','Conjunction','Interjection','Article'], exp:'Conjunctions join words, phrases or clauses (e.g., and, but, because, although).'},
    {q:'Which is a compound sentence?', a:'She sings and he dances.', opts:['She sings.','She sings beautifully.','She sings and he dances.','Because she sings well.'], exp:'A compound sentence has two independent clauses joined by a conjunction.'},
    {q:'The plural of "child" is?', a:'Children', opts:['Childs','Childes','Children','Childrens'], exp:'"Children" is the irregular plural of "child".'},
    {q:'Which is an adverb?', a:'Quickly', opts:['Quick','Quickly','Quickness','Quicker'], exp:'An adverb modifies a verb, adjective or another adverb. "Quickly" modifies how an action is done.'},
    {q:'A word opposite in meaning is called?', a:'Antonym', opts:['Synonym','Antonym','Homonym','Acronym'], exp:'An antonym is a word with the opposite meaning (e.g., hot ↔ cold).'},
    {q:'Which tense is "They are playing cricket"?', a:'Present continuous', opts:['Simple present','Simple past','Present continuous','Past continuous'], exp:'Present continuous uses "is/are + verb-ing" for actions happening right now.'},
    {q:'The past participle of "write" is?', a:'Written', opts:['Wrote','Writed','Written','Writes'], exp:'"Written" is the past participle of "write" (irregular verb: write-wrote-written).'},
  ]},
  { title:'Class 7 - Hindi - वसंत भाग 2', desc:'गद्य और पद्य - वसंत भाग 2', subject_id:S.Hindi, class_level:7, difficulty:'easy', questions:[
    {q:'"हिमालय की बेटियाँ" के लेखक कौन हैं?', a:'नागार्जुन', opts:['निराला','नागार्जुन','महादेवी वर्मा','प्रेमचंद'], exp:'"हिमालय की बेटियाँ" नागार्जुन द्वारा रचित निबंध है जिसमें नदियों को हिमालय की बेटियाँ कहा गया है।'},
    {q:'"कठपुतली" कविता का मुख्य भाव क्या है?', a:'स्वतंत्रता की इच्छा', opts:['दुख','स्वतंत्रता की इच्छा','भक्ति','देशभक्ति'], exp:'"कठपुतली" कविता में कठपुतली अपनी धागे की बंधन से मुक्ति चाहती है — स्वतंत्रता का भाव।'},
    {q:'क्रिया-विशेषण किसकी विशेषता बताता है?', a:'क्रिया की', opts:['संज्ञा की','सर्वनाम की','क्रिया की','विशेषण की'], exp:'क्रिया-विशेषण क्रिया की विशेषता बताता है जैसे "वह धीरे चलता है" में "धीरे" क्रिया-विशेषण है।'},
    {q:'मुहावरे का अर्थ होता है?', a:'विशेष अर्थ में प्रयुक्त वाक्यांश', opts:['कविता की पंक्ति','विशेष अर्थ में प्रयुक्त वाक्यांश','गद्य का अंश','व्याकरण का नियम'], exp:'मुहावरा एक ऐसा वाक्यांश है जिसका शाब्दिक अर्थ से अलग विशेष अर्थ होता है।'},
    {q:'"मिठाईवाला" कहानी का मुख्य पात्र क्या बेचता है?', a:'मिठाइयाँ', opts:['फल','सब्जियाँ','मिठाइयाँ','खिलौने'], exp:'"मिठाईवाला" में मुख्य पात्र बच्चों को प्यार से मिठाइयाँ बेचता है।'},
    {q:'संधि किसे कहते हैं?', a:'दो वर्णों के मेल से होने वाले परिवर्तन को', opts:['शब्द का अर्थ','दो वर्णों के मेल से होने वाले परिवर्तन को','वाक्य को','समास को'], exp:'जब दो वर्ण मिलते हैं तो उनमें जो परिवर्तन होता है उसे संधि कहते हैं।'},
    {q:'"पापा खो गए" किस विधा में है?', a:'एकांकी', opts:['कविता','कहानी','एकांकी','उपन्यास'], exp:'"पापा खो गए" विजय तेंदुलकर द्वारा लिखित एकांकी (one-act play) है।'},
    {q:'लोकोक्ति और मुहावरे में क्या अंतर है?', a:'लोकोक्ति पूर्ण वाक्य होती है, मुहावरा वाक्यांश', opts:['दोनों एक ही हैं','लोकोक्ति पूर्ण वाक्य होती है, मुहावरा वाक्यांश','मुहावरा पूर्ण वाक्य होता है','कोई अंतर नहीं'], exp:'लोकोक्ति स्वतंत्र वाक्य के रूप में प्रयुक्त होती है जबकि मुहावरा वाक्यांश के रूप में।'},
  ]},

  // ══ CLASS 8 ══
  { title:'Class 8 - Mathematics - Algebra & Equations', desc:'Linear equations, algebraic identities, factorisation', subject_id:S.Math, class_level:8, difficulty:'medium', questions:[
    {q:'Expand (a + b)²', a:'a² + 2ab + b²', opts:['a² + b²','a² + 2ab + b²','a² - 2ab + b²','2a + 2b'], exp:'(a+b)² = a² + 2ab + b² is a standard algebraic identity.'},
    {q:'Solve: 2(x - 3) = 8', a:'7', opts:['5','6','7','8'], exp:'2x - 6 = 8 → 2x = 14 → x = 7'},
    {q:'The value of (x + y)(x - y) is?', a:'x² - y²', opts:['x² + y²','x² - y²','2x','2xy'], exp:'(x+y)(x-y) = x² - y² is the difference of squares identity.'},
    {q:'Factorise: x² - 5x + 6', a:'(x-2)(x-3)', opts:['(x+2)(x+3)','(x-2)(x-3)','(x-1)(x-6)','(x+2)(x-3)'], exp:'x²-5x+6 = (x-2)(x-3) since (-2)×(-3)=6 and (-2)+(-3)=-5'},
    {q:'What is the degree of polynomial 3x³ + 2x - 7?', a:'3', opts:['1','2','3','7'], exp:'The degree is the highest power of the variable. Here it is 3 (from 3x³).'},
    {q:'Simplify: (3x²)(4x³)', a:'12x⁵', opts:['7x⁵','12x⁶','12x⁵','7x⁶'], exp:'Multiply coefficients: 3×4=12. Add exponents: x²×x³=x⁵. Answer: 12x⁵'},
    {q:'Solve: x/3 + 2 = 5', a:'9', opts:['1','9','7','3'], exp:'x/3 = 5-2 = 3 → x = 3×3 = 9'},
    {q:'Which is an identity?', a:'(a-b)² = a² - 2ab + b²', opts:['a+b = b+a for specific values','(a-b)² = a² - 2ab + b²','a² = a×a for a=2 only','a+0 = a sometimes'], exp:'An identity is true for all values of variables. (a-b)² = a²-2ab+b² always holds.'},
  ]},
  { title:'Class 8 - Mathematics - Mensuration & Data', desc:'Surface areas, volumes, data handling', subject_id:S.Math, class_level:8, difficulty:'medium', questions:[
    {q:'Volume of a cube with side 4 cm is?', a:'64 cm³', opts:['16 cm³','32 cm³','64 cm³','48 cm³'], exp:'Volume of cube = side³ = 4³ = 64 cm³'},
    {q:'Curved surface area of a cylinder with r=7, h=10 is?', a:'440 cm²', opts:['220 cm²','440 cm²','154 cm²','308 cm²'], exp:'CSA = 2πrh = 2 × (22/7) × 7 × 10 = 440 cm²'},
    {q:'The mode is?', a:'The most frequently occurring value', opts:['The middle value','The average','The most frequently occurring value','The range'], exp:'Mode is the value that appears most often in a data set.'},
    {q:'A pie chart shows data as?', a:'Sectors of a circle', opts:['Bars','Lines','Sectors of a circle','Dots'], exp:'A pie chart represents data as sectors (slices) of a circle proportional to each category.'},
    {q:'Total surface area of a cuboid l=5, b=4, h=3 is?', a:'94 cm²', opts:['60 cm²','94 cm²','74 cm²','120 cm²'], exp:'TSA = 2(lb+bh+lh) = 2(20+12+15) = 2(47) = 94 cm²'},
    {q:'If mean of 5 numbers is 10, what is their sum?', a:'50', opts:['2','10','50','15'], exp:'Mean = Sum/Count → Sum = Mean × Count = 10 × 5 = 50'},
    {q:'Volume of a cylinder with r=3.5 cm, h=10 cm is?', a:'385 cm³', opts:['110 cm³','220 cm³','385 cm³','770 cm³'], exp:'V = πr²h = (22/7) × 3.5² × 10 = (22/7) × 12.25 × 10 = 385 cm³'},
    {q:'Probability of getting head on a coin toss is?', a:'1/2', opts:['1','0','1/2','1/4'], exp:'A fair coin has 2 outcomes (H or T). P(head) = 1/2.'},
  ]},

  { title:'Class 8 - Science - Chemistry & Materials', desc:'Materials, metals, coal, petroleum, combustion', subject_id:S.Science, class_level:8, difficulty:'medium', questions:[
    {q:'Which metal is the best conductor of electricity?', a:'Silver', opts:['Iron','Aluminium','Silver','Copper'], exp:'Silver is the best conductor of electricity, though copper is used more due to cost.'},
    {q:'Coal is a?', a:'Fossil fuel', opts:['Renewable resource','Fossil fuel','Mineral','Metal'], exp:'Coal is a fossil fuel formed from ancient plant material over millions of years.'},
    {q:'Which property allows metals to be drawn into wires?', a:'Ductility', opts:['Malleability','Ductility','Conductivity','Lustre'], exp:'Ductility is the property that allows metals to be drawn into thin wires.'},
    {q:'Which gas is produced when acid reacts with a metal?', a:'Hydrogen', opts:['Oxygen','Carbon dioxide','Hydrogen','Nitrogen'], exp:'Acid + Metal → Salt + Hydrogen gas. E.g., Zn + H₂SO₄ → ZnSO₄ + H₂↑'},
    {q:'LPG mainly consists of?', a:'Butane and propane', opts:['Methane','Ethane','Butane and propane','Hydrogen'], exp:'LPG (Liquefied Petroleum Gas) is mainly a mixture of butane (C₄H₁₀) and propane (C₃H₈).'},
    {q:'The process of depositing a thin layer of a metal on another metal using electric current is?', a:'Electroplating', opts:['Galvanisation','Electroplating','Rusting','Coating'], exp:'Electroplating uses electric current to deposit a metal layer on objects for protection/beauty.'},
    {q:'Which is a non-metal that conducts electricity?', a:'Graphite', opts:['Sulphur','Phosphorus','Graphite','Iodine'], exp:'Graphite (a form of carbon) is the only non-metal that conducts electricity.'},
    {q:'The ignition temperature is?', a:'Minimum temperature needed for combustion', opts:['Maximum temperature during burning','Minimum temperature needed for combustion','Temperature of the flame','Room temperature'], exp:'Ignition temperature is the lowest temperature at which a substance catches fire.'},
  ]},
  { title:'Class 8 - Science - Biology & Environment', desc:'Cells, reproduction, microbes, conservation', subject_id:S.Science, class_level:8, difficulty:'medium', questions:[
    {q:'The control centre of a cell is?', a:'Nucleus', opts:['Mitochondria','Nucleus','Ribosome','Chloroplast'], exp:'The nucleus contains DNA and controls all cellular activities — it is the control centre.'},
    {q:'Which organelle is called the powerhouse of the cell?', a:'Mitochondria', opts:['Nucleus','Chloroplast','Mitochondria','Ribosome'], exp:'Mitochondria produce ATP (energy) through cellular respiration — powerhouse of the cell.'},
    {q:'Bacteria are?', a:'Prokaryotes', opts:['Eukaryotes','Prokaryotes','Fungi','Viruses'], exp:'Bacteria are prokaryotes — they lack a membrane-bound nucleus.'},
    {q:'Which disease is caused by a virus?', a:'Influenza', opts:['Tuberculosis','Malaria','Influenza','Cholera'], exp:'Influenza (flu) is caused by influenza viruses. TB is bacterial, malaria is caused by Plasmodium.'},
    {q:'Curd is made with the help of?', a:'Bacteria', opts:['Yeast','Bacteria','Fungi','Algae'], exp:'Lactobacillus bacteria ferment milk to form curd (yogurt).'},
    {q:'Which gas is produced in a biogas plant?', a:'Methane', opts:['Oxygen','Carbon dioxide','Methane','Hydrogen'], exp:'Biogas plants produce methane (CH₄) through anaerobic decomposition of organic waste.'},
    {q:'Cell division for growth and repair is called?', a:'Mitosis', opts:['Meiosis','Mitosis','Binary fission','Budding'], exp:'Mitosis is cell division that produces two identical daughter cells for growth and repair.'},
    {q:'Conservation of forests is important to?', a:'Maintain biodiversity', opts:['Increase rainfall only','Maintain biodiversity','Get timber','None of these'], exp:'Forests maintain biodiversity, regulate climate, prevent erosion and support millions of species.'},
  ]},

  { title:'Class 8 - Social Science - Modern Indian History', desc:'British rule, 1857 revolt, social reforms', subject_id:S.Social, class_level:8, difficulty:'medium', questions:[
    {q:'The 1857 revolt is also known as?', a:'First War of Indian Independence', opts:['Sepoy Mutiny only','First War of Indian Independence','Quit India Movement','Non-cooperation Movement'], exp:'The 1857 revolt is called both the Sepoy Mutiny and the First War of Indian Independence.'},
    {q:'Who started the Brahmo Samaj?', a:'Ram Mohan Roy', opts:['Dayanand Saraswati','Vivekananda','Ram Mohan Roy','Gopal Krishna Gokhale'], exp:'Raja Ram Mohan Roy founded the Brahmo Samaj in 1828 to reform Hindu society.'},
    {q:'The Permanent Settlement of 1793 was introduced by?', a:'Lord Cornwallis', opts:['Lord Dalhousie','Lord Cornwallis','Lord Canning','Lord Ripon'], exp:'Lord Cornwallis introduced the Permanent Settlement (Zamindari system) in Bengal in 1793.'},
    {q:'Which act abolished Sati?', a:'Regulation XVII (1829)', opts:['Indian Penal Code','Regulation XVII (1829)','Government of India Act','Charter Act'], exp:'Regulation XVII of 1829 banned the practice of Sati, largely due to Ram Mohan Roy\'s efforts.'},
    {q:'Birsa Munda led the revolt of?', a:'Mundas of Jharkhand', opts:['Santhals','Mundas of Jharkhand','Bhils','Gonds'], exp:'Birsa Munda led the Munda Ulgulan (revolt) in 1899-1900 in the Chhotanagpur region.'},
    {q:'The Doctrine of Lapse was introduced by?', a:'Lord Dalhousie', opts:['Lord Cornwallis','Lord Wellesley','Lord Dalhousie','Lord Hastings'], exp:'Lord Dalhousie\'s Doctrine of Lapse (1848) annexed states without a natural heir.'},
    {q:'The Indian National Congress was founded in?', a:'1885', opts:['1857','1885','1905','1920'], exp:'The Indian National Congress was founded in 1885 by A.O. Hume, Dadabhai Naoroji and others.'},
    {q:'Ryotwari system involved?', a:'Direct revenue settlement with farmers', opts:['Revenue through zamindars','Direct revenue settlement with farmers','Village community paying tax','No land revenue'], exp:'In the Ryotwari system, the government settled revenue directly with individual farmers (ryots).'},
  ]},
  { title:'Class 8 - Social Science - Resources & Civics', desc:'Land, water, agriculture, Indian Constitution', subject_id:S.Social, class_level:8, difficulty:'medium', questions:[
    {q:'The Indian Constitution came into force on?', a:'26 January 1950', opts:['15 August 1947','26 November 1949','26 January 1950','2 October 1950'], exp:'The Constitution of India was enacted on 26 November 1949 and came into force on 26 January 1950.'},
    {q:'Which article of the Constitution abolishes untouchability?', a:'Article 17', opts:['Article 14','Article 15','Article 17','Article 21'], exp:'Article 17 of the Indian Constitution abolishes untouchability and its practice in any form.'},
    {q:'Natural resources formed over millions of years are?', a:'Non-renewable resources', opts:['Renewable resources','Non-renewable resources','Biotic resources','Abiotic resources'], exp:'Non-renewable resources like coal, petroleum take millions of years to form and cannot be replenished quickly.'},
    {q:'Black soil is most suitable for growing?', a:'Cotton', opts:['Wheat','Rice','Cotton','Jute'], exp:'Black (regur) soil retains moisture well and is ideal for cotton cultivation.'},
    {q:'Which is a conventional source of energy?', a:'Coal', opts:['Solar energy','Wind energy','Coal','Tidal energy'], exp:'Conventional sources of energy include coal, petroleum and natural gas (fossil fuels).'},
    {q:'Secularism means?', a:'The state has no official religion', opts:['The state promotes one religion','The state has no official religion','Everyone must follow the same religion','Religion and state are merged'], exp:'A secular state treats all religions equally and does not promote any particular religion.'},
    {q:'Terrace farming is practised in?', a:'Hilly areas', opts:['Plains','Deserts','Hilly areas','Coastal areas'], exp:'Terrace farming cuts steps into hillsides to reduce erosion and create flat land for cultivation.'},
    {q:'The Fundamental Rights are in which part of the Constitution?', a:'Part III', opts:['Part I','Part II','Part III','Part IV'], exp:'Fundamental Rights are enshrined in Part III (Articles 12-35) of the Indian Constitution.'},
  ]},

  { title:'Class 8 - English - Advanced Grammar', desc:'Passive voice, reported speech, complex sentences', subject_id:S.English, class_level:8, difficulty:'medium', questions:[
    {q:'Change to passive: "She writes a letter."', a:'A letter is written by her.', opts:['A letter was written by her.','A letter is written by her.','A letter is being written.','A letter has been written.'], exp:'Simple present active → Simple present passive: Subject becomes object, object becomes subject.'},
    {q:'Which sentence uses reported speech correctly?', a:'He said that he was tired.', opts:['He said that he is tired.','He said that he was tired.','He says that he was tired.','He told he was tired.'], exp:'In reported speech, present tense changes to past: "I am" → "he was". Use "that" and correct pronoun.'},
    {q:'A complex sentence has?', a:'One main clause and one or more subordinate clauses', opts:['Two main clauses','One main clause and one or more subordinate clauses','Only subordinate clauses','Three simple sentences'], exp:'A complex sentence has one independent (main) clause and at least one dependent (subordinate) clause.'},
    {q:'Which is correct use of apostrophe?', a:"The children's books", opts:["The childrens books","The children's books","The childrens' books","The children book's"], exp:"Apostrophe shows possession. Irregular plural 'children' takes 's → children's."},
    {q:'Identify the subordinating conjunction: "She left because she was ill."', a:'because', opts:['she','was','because','left'], exp:'"Because" is a subordinating conjunction that introduces the adverb clause of reason.'},
    {q:'Which is the correct sentence?', a:'Neither he nor she was present.', opts:['Neither he nor she were present.','Neither he nor she was present.','Neither he nor she are present.','Neither he or she was present.'], exp:'With "neither...nor", the verb agrees with the subject closest to it ("she" — singular → "was").'},
    {q:'The gerund in "Swimming is good exercise" is?', a:'Swimming', opts:['is','good','exercise','Swimming'], exp:'A gerund is a verb form ending in -ing used as a noun. "Swimming" is the subject here.'},
    {q:'Which figure of speech is "The stars are diamonds in the sky"?', a:'Metaphor', opts:['Simile','Metaphor','Personification','Alliteration'], exp:'A metaphor directly compares without using "like" or "as". "Stars are diamonds" is a metaphor.'},
  ]},
  { title:'Class 8 - Hindi - वसंत भाग 3', desc:'गद्य-पद्य - वसंत भाग 3', subject_id:S.Hindi, class_level:8, difficulty:'medium', questions:[
    {q:'"बस की यात्रा" के लेखक कौन हैं?', a:'हरिशंकर परसाई', opts:['प्रेमचंद','हरिशंकर परसाई','रामवृक्ष बेनीपुरी','यशपाल'], exp:'"बस की यात्रा" हरिशंकर परसाई का प्रसिद्ध व्यंग्य है।'},
    {q:'"दीवानों की हस्ती" कविता का भाव है?', a:'बेफ़िक्री और मस्ती', opts:['देशभक्ति','बेफ़िक्री और मस्ती','दुख','भक्ति'], exp:'"दीवानों की हस्ती" में कवि भगवतीचरण वर्मा ने फक्कड़ और मस्त जीवन का चित्रण किया है।'},
    {q:'समास किसे कहते हैं?', a:'दो या अधिक शब्दों के मेल से बने नए शब्द को', opts:['संधि को','दो या अधिक शब्दों के मेल से बने नए शब्द को','क्रिया को','वाक्य को'], exp:'समास में दो या अधिक शब्द मिलकर एक नया सार्थक शब्द बनाते हैं।'},
    {q:'"चिट्ठियों की अनूठी दुनिया" किस विधा का पाठ है?', a:'निबंध', opts:['कहानी','निबंध','कविता','जीवनी'], exp:'"चिट्ठियों की अनूठी दुनिया" अरविंद कुमार सिंह का निबंध है।'},
    {q:'"यह सबसे कठिन समय नहीं" कविता में क्या संदेश है?', a:'आशावाद', opts:['निराशावाद','आशावाद','क्रोध','उदासी'], exp:'जया जादवानी की यह कविता कठिन समय में भी आशा बनाए रखने का संदेश देती है।'},
    {q:'निम्न में से तत्सम शब्द कौन सा है?', a:'अग्नि', opts:['आग','अग्नि','आँख','हाथ'], exp:'तत्सम शब्द संस्कृत से सीधे लिए जाते हैं। "अग्नि" तत्सम है, "आग" उसका तद्भव रूप है।'},
    {q:'"भगवान के डाकिए" में कवि ने किसे डाकिया बताया है?', a:'पक्षी और बादल', opts:['नदियाँ','पक्षी और बादल','पहाड़','हवा'], exp:'रामधारी सिंह दिनकर की कविता में पक्षी और बादल को प्रकृति के डाकिए बताया गया है।'},
    {q:'तद्भव शब्द का अर्थ है?', a:'संस्कृत से बदलकर बना हिंदी शब्द', opts:['अरबी से आया शब्द','संस्कृत से बदलकर बना हिंदी शब्द','अंग्रेज़ी से आया शब्द','देशज शब्द'], exp:'तद्भव शब्द संस्कृत से उत्पन्न होकर हिंदी में परिवर्तित रूप में प्रयुक्त होते हैं।'},
  ]},

  // ══ CLASS 9 ══
  { title:'Class 9 - Mathematics - Number Systems & Polynomials', desc:'Real numbers, irrational numbers, polynomials', subject_id:S.Math, class_level:9, difficulty:'medium', questions:[
    {q:'√2 is?', a:'Irrational', opts:['Natural number','Integer','Rational','Irrational'], exp:'√2 cannot be expressed as p/q (where p,q are integers, q≠0), so it is irrational.'},
    {q:'The degree of polynomial 5 is?', a:'0', opts:['1','0','5','Undefined'], exp:'A constant polynomial like 5 (= 5x⁰) has degree 0.'},
    {q:'Which is not a real number?', a:'√-1', opts:['√2','0','-7','√-1'], exp:'√-1 is an imaginary number (i), not a real number. All others are real.'},
    {q:'Remainder when x³-2x+1 is divided by (x-1)?', a:'0', opts:['0','1','-2','2'], exp:'By Remainder Theorem, substitute x=1: 1-2+1=0. So remainder is 0.'},
    {q:'p(x) = x²-5x+6. Find p(2).', a:'0', opts:['-4','0','4','6'], exp:'p(2) = 4-10+6 = 0. Since p(2)=0, x=2 is a zero of the polynomial.'},
    {q:'Every rational number is?', a:'A real number', opts:['A natural number','An integer','A real number','An irrational number'], exp:'The set of real numbers includes all rational and irrational numbers.'},
    {q:'Factorise: x²-9', a:'(x+3)(x-3)', opts:['(x-3)²','(x+3)²','(x+3)(x-3)','(x-9)(x+1)'], exp:'x²-9 = x²-3² = (x+3)(x-3) using difference of squares identity.'},
    {q:'Rational number between 1/3 and 1/4 is?', a:'7/24', opts:['1/6','7/24','1/2','2/7'], exp:'Average of 1/3 and 1/4 = (4+3)/24 = 7/24, which lies between them.'},
  ]},
  { title:'Class 9 - Mathematics - Geometry', desc:'Triangles, quadrilaterals, circles, coordinate geometry', subject_id:S.Math, class_level:9, difficulty:'medium', questions:[
    {q:'In a right triangle, if one angle is 30°, the third angle is?', a:'60°', opts:['45°','60°','90°','30°'], exp:'Sum of angles = 180°. 90° + 30° + x = 180° → x = 60°.'},
    {q:'SAS congruence means?', a:'Two sides and included angle are equal', opts:['Three sides are equal','Two angles and included side','Two sides and included angle are equal','All sides and angles'], exp:'SAS: Side-Angle-Side. Two sides and the angle between them are equal.'},
    {q:'A quadrilateral with all sides equal and all angles 90° is?', a:'Square', opts:['Rectangle','Rhombus','Square','Parallelogram'], exp:'A square has all four sides equal and all four angles equal to 90°.'},
    {q:'The distance of a point (3, 4) from origin is?', a:'5', opts:['7','1','5','12'], exp:'Distance = √(3²+4²) = √(9+16) = √25 = 5 units.'},
    {q:'Point (-3, 5) lies in which quadrant?', a:'II', opts:['I','II','III','IV'], exp:'Quadrant II: x is negative, y is positive. Point (-3, 5) → x<0, y>0 → Quadrant II.'},
    {q:'Equal chords of a circle are?', a:'Equidistant from the centre', opts:['Equal in angle','Equidistant from the centre','Parallel to each other','Equal to diameter'], exp:'Equal chords of a circle are equidistant from the centre.'},
    {q:'Midpoint theorem states that the line segment joining midpoints of two sides is?', a:'Parallel to and half of the third side', opts:['Equal to the third side','Perpendicular to the third side','Parallel to and half of the third side','Double the third side'], exp:'The midpoint theorem: segment joining midpoints of two sides is parallel to and half the third side.'},
    {q:'Area of equilateral triangle with side a is?', a:'(√3/4)a²', opts:['a²','(√3/2)a²','(√3/4)a²','3a²/4'], exp:'Area of equilateral triangle = (√3/4)a² where a is the side length.'},
  ]},

  { title:'Class 9 - Science - Matter & Atoms', desc:'States of matter, atoms, molecules, structure of atom', subject_id:S.Science, class_level:9, difficulty:'medium', questions:[
    {q:'Which state of matter has definite shape and volume?', a:'Solid', opts:['Gas','Liquid','Solid','Plasma'], exp:'Solids have definite shape and definite volume because particles are closely packed.'},
    {q:'The SI unit of amount of substance is?', a:'Mole', opts:['Gram','Kilogram','Mole','Litre'], exp:'The mole is the SI unit for the amount of substance (6.022 × 10²³ particles = 1 mole).'},
    {q:'Atomic number of an element represents?', a:'Number of protons', opts:['Number of neutrons','Number of electrons + neutrons','Number of protons','Mass number'], exp:'Atomic number (Z) = number of protons in the nucleus of an atom.'},
    {q:'Who proposed the plum pudding model of atom?', a:'J.J. Thomson', opts:['Rutherford','Bohr','J.J. Thomson','Dalton'], exp:'J.J. Thomson proposed the plum pudding model (1904) — electrons embedded in positive charge.'},
    {q:'Number of atoms in one mole of carbon is?', a:'6.022 × 10²³', opts:['12','6.022 × 10²³','22.4','12 × 10²³'], exp:'One mole of any substance contains 6.022 × 10²³ particles (Avogadro\'s number).'},
    {q:'Isotopes have the same number of?', a:'Protons', opts:['Neutrons','Mass number','Protons','Electrons and neutrons'], exp:'Isotopes have the same atomic number (same protons) but different number of neutrons.'},
    {q:'Which of the following is a mixture?', a:'Air', opts:['Water','Salt','Air','Carbon dioxide'], exp:'Air is a mixture of nitrogen (78%), oxygen (21%), argon and other gases.'},
    {q:'The maximum number of electrons in the second shell (L) of an atom is?', a:'8', opts:['2','8','18','32'], exp:'The electron capacity formula is 2n². For n=2 (L shell): 2×4 = 8 electrons.'},
  ]},
  { title:'Class 9 - Science - Motion & Force', desc:'Motion, Newton\'s laws, gravitation, work and energy', subject_id:S.Science, class_level:9, difficulty:'medium', questions:[
    {q:'A body moving with uniform velocity has acceleration?', a:'Zero', opts:['Positive','Negative','Zero','Variable'], exp:'Uniform velocity means constant speed in a constant direction → acceleration = 0.'},
    {q:'Newton\'s first law of motion is also called?', a:'Law of Inertia', opts:['Law of Momentum','Law of Inertia','Law of Action-Reaction','Law of Gravitation'], exp:'Newton\'s first law states a body continues in its state unless acted upon by external force — Inertia.'},
    {q:'Unit of force is?', a:'Newton', opts:['Joule','Watt','Newton','Pascal'], exp:'Force is measured in Newtons (N). 1 N = 1 kg·m/s².'},
    {q:'Momentum = ?', a:'Mass × Velocity', opts:['Mass × Acceleration','Mass × Velocity','Force × Time','Mass × Distance'], exp:'Momentum (p) = mass (m) × velocity (v). Unit: kg·m/s'},
    {q:'Work is done when?', a:'Force causes displacement', opts:['Force is applied','Object moves','Force causes displacement','Energy is present'], exp:'Work = Force × Displacement × cos θ. Work is done only when force causes displacement.'},
    {q:'The value of g (acceleration due to gravity) is approximately?', a:'9.8 m/s²', opts:['9.8 m/s²','9.8 m/s','9.8 km/s²','98 m/s²'], exp:'The acceleration due to gravity on Earth\'s surface is approximately 9.8 m/s².'},
    {q:'1 Joule = ?', a:'1 N × 1 m', opts:['1 N × 1 s','1 N × 1 m','1 kg × 1 m','1 W × 1 s'], exp:'1 Joule = 1 Newton × 1 metre. It is the work done by 1 N force over 1 m displacement.'},
    {q:'Universal Law of Gravitation was given by?', a:'Newton', opts:['Galileo','Einstein','Newton','Kepler'], exp:'Newton\'s Universal Law of Gravitation (1687): every mass attracts every other mass.'},
  ]},

  { title:'Class 9 - Social Science - French Revolution & World History', desc:'French Revolution, Russian Revolution, Nazism', subject_id:S.Social, class_level:9, difficulty:'medium', questions:[
    {q:'The French Revolution began in?', a:'1789', opts:['1776','1789','1804','1815'], exp:'The French Revolution began on 14 July 1789 with the storming of the Bastille.'},
    {q:'The slogan of the French Revolution was?', a:'Liberty, Equality, Fraternity', opts:['God, King, Country','Liberty, Equality, Fraternity','Work, Bread, Peace','Justice and Order'], exp:'"Liberté, Égalité, Fraternité" (Liberty, Equality, Fraternity) was the rallying cry of the Revolution.'},
    {q:'The Bolshevik Revolution occurred in?', a:'1917', opts:['1905','1914','1917','1921'], exp:'The October Revolution (Bolshevik Revolution) occurred in November 1917 (old calendar: October).'},
    {q:'Who led the Bolsheviks?', a:'Lenin', opts:['Stalin','Trotsky','Lenin','Kerensky'], exp:'Vladimir Lenin led the Bolshevik Party and the Russian Revolution of 1917.'},
    {q:'The Treaty of Versailles (1919) blamed World War I on?', a:'Germany', opts:['Austria','Germany','France','Russia'], exp:'The War Guilt Clause (Article 231) of the Treaty of Versailles blamed Germany for WWI.'},
    {q:'Hitler became Chancellor of Germany in?', a:'1933', opts:['1920','1933','1939','1945'], exp:'Adolf Hitler was appointed Chancellor of Germany on 30 January 1933.'},
    {q:'The Holocaust refers to?', a:'Systematic genocide of Jews by Nazis', opts:['World War II battles','Systematic genocide of Jews by Nazis','Russian Revolution','Economic depression'], exp:'The Holocaust was the systematic, state-sponsored genocide of six million Jews by the Nazi regime.'},
    {q:'Weimar Republic was established in Germany after?', a:'World War I', opts:['World War II','Russian Revolution','World War I','French Revolution'], exp:'The Weimar Republic (1919-1933) was established in Germany after its defeat in World War I.'},
  ]},
  { title:'Class 9 - Social Science - Indian Geography & Politics', desc:'India\'s physical features, climate, democracy', subject_id:S.Social, class_level:9, difficulty:'medium', questions:[
    {q:'India is located in which hemisphere?', a:'Northern and Eastern', opts:['Southern and Western','Northern and Eastern','Northern and Western','Southern and Eastern'], exp:'India lies in the Northern (8°4\'N to 37°6\'N) and Eastern (68°7\'E to 97°25\'E) hemispheres.'},
    {q:'The Tropic of Cancer passes through how many Indian states?', a:'8', opts:['6','7','8','9'], exp:'The Tropic of Cancer (23.5°N) passes through 8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, WB, Tripura, Mizoram.'},
    {q:'India\'s Himalayan river system includes?', a:'Ganga, Indus, Brahmaputra', opts:['Narmada, Godavari, Krishna','Ganga, Indus, Brahmaputra','Cauvery, Mahanadi, Tapti','Luni, Ghaggar, Chambal'], exp:'The Himalayan rivers (Ganga, Indus, Brahmaputra) are perennial — fed by snowmelt and rainfall.'},
    {q:'The monsoon retreats from India in which month?', a:'October-November', opts:['June-July','August-September','October-November','December-January'], exp:'The northeast (retreating) monsoon withdraws from India between October and November.'},
    {q:'Universal Adult Franchise means?', a:'All adult citizens can vote', opts:['Only men can vote','Only educated can vote','All adult citizens can vote','Only property owners can vote'], exp:'Universal Adult Franchise gives every citizen above 18 the right to vote, regardless of caste/gender/wealth.'},
    {q:'Which country has the longest written Constitution?', a:'India', opts:['USA','UK','India','Germany'], exp:'India has the longest written Constitution in the world, with 448 articles in 25 parts.'},
    {q:'The Constituent Assembly adopted the Constitution on?', a:'26 November 1949', opts:['15 August 1947','26 January 1950','26 November 1949','2 October 1948'], exp:'The Constitution was adopted on 26 November 1949 (Constitution Day) and enacted on 26 January 1950.'},
    {q:'India is a?', a:'Federal republic with unitary features', opts:['Pure federal state','Unitary state','Federal republic with unitary features','Confederation'], exp:'India is described as a "Union of States" — federal in structure but with strong unitary (central) features.'},
  ]},

  { title:'Class 9 - English - Literature & Writing', desc:'Prose, poetry and writing skills', subject_id:S.English, class_level:9, difficulty:'medium', questions:[
    {q:'Who wrote "The Fun They Had"?', a:'Isaac Asimov', opts:['O. Henry','Isaac Asimov','Mark Twain','Ray Bradbury'], exp:'"The Fun They Had" (1951) is a science fiction short story by Isaac Asimov.'},
    {q:'In "My Childhood", who is the author?', a:'A.P.J. Abdul Kalam', opts:['Jawaharlal Nehru','A.P.J. Abdul Kalam','Nelson Mandela','Ruskin Bond'], exp:'"My Childhood" is an excerpt from "Wings of Fire", the autobiography of Dr A.P.J. Abdul Kalam.'},
    {q:'A travelogue is a?', a:'Written account of a journey', opts:['Fantasy story','Written account of a journey','Scientific report','Biography'], exp:'A travelogue records a person\'s travels — descriptions of places, people and experiences.'},
    {q:'In "The Snake and the Mirror", what is the doctor doing when the snake arrives?', a:'Looking in the mirror', opts:['Reading','Sleeping','Looking in the mirror','Eating'], exp:'The doctor is admiring himself in the mirror when the cobra appears and coils around his arm.'},
    {q:'A sonnet has how many lines?', a:'14', opts:['8','10','12','14'], exp:'A sonnet is a 14-line poem, traditionally written in iambic pentameter.'},
    {q:'Alliteration is?', a:'Repetition of consonant sounds at the start of words', opts:['Repetition of vowel sounds','End rhyme','Repetition of consonant sounds at the start of words','Comparison using like/as'], exp:'Alliteration: "Peter Piper picked..." — repetition of initial consonant sounds.'},
    {q:'In "Reach for the Top", Santosh Yadav is known for?', a:'Climbing Everest twice', opts:['Swimming the English Channel','Climbing Everest twice','Running a marathon','Cycling across India'], exp:'Santosh Yadav became the first woman to climb Mount Everest twice.'},
    {q:'A metaphor differs from a simile in that it?', a:'Does not use "like" or "as"', opts:['Uses "like" or "as"','Does not use "like" or "as"','Is always about nature','Rhymes'], exp:'Simile: "brave as a lion"; Metaphor: "He is a lion" — direct comparison without "like/as".'},
  ]},
  { title:'Class 9 - Hindi - क्षितिज भाग 1', desc:'गद्य और पद्य - क्षितिज', subject_id:S.Hindi, class_level:9, difficulty:'medium', questions:[
    {q:'"दो बैलों की कथा" में हीरा और मोती क्या हैं?', a:'बैल', opts:['कुत्ते','घोड़े','बैल','भैंस'], exp:'"दो बैलों की कथा" प्रेमचंद की कहानी है जिसमें हीरा और मोती दो मित्र बैल हैं।'},
    {q:'"ल्हासा की ओर" यात्रावृत्त किसने लिखा?', a:'राहुल सांकृत्यायन', opts:['रामधारी सिंह दिनकर','राहुल सांकृत्यायन','हजारीप्रसाद द्विवेदी','प्रेमचंद'], exp:'"ल्हासा की ओर" राहुल सांकृत्यायन का प्रसिद्ध यात्रावृत्त है।'},
    {q:'"साखियाँ" किसकी रचना हैं?', a:'कबीर', opts:['तुलसीदास','सूरदास','कबीर','मीराबाई'], exp:'साखियाँ कबीर की दोहों की रचना है जिनमें ज्ञान और भक्ति का उपदेश है।'},
    {q:'निम्न में से कौन सा अलंकार है "जहाज का पंछी जैसे लौट आया"?', a:'उपमा', opts:['रूपक','उपमा','उत्प्रेक्षा','अनुप्रास'], exp:'"जैसे" से तुलना की जा रही है, इसलिए यह उपमा अलंकार है।'},
    {q:'रस को काव्य की आत्मा किसने कहा?', a:'आचार्य भरतमुनि', opts:['कबीर','आचार्य भरतमुनि','तुलसीदास','मम्मट'], exp:'नाट्यशास्त्र में आचार्य भरतमुनि ने रस को काव्य की आत्मा माना है।'},
    {q:'"उपभोक्तावाद की संस्कृति" पाठ में लेखक किसकी आलोचना करते हैं?', a:'उपभोक्ता संस्कृति की', opts:['लोकतंत्र की','विज्ञान की','उपभोक्ता संस्कृति की','सरकार की'], exp:'श्यामाचरण दुबे इस निबंध में बाज़ारवाद और उपभोक्तावाद की बढ़ती प्रवृत्ति की आलोचना करते हैं।'},
    {q:'श्रृंगार रस का स्थायी भाव क्या है?', a:'रति', opts:['हास','रति','शोक','क्रोध'], exp:'श्रृंगार रस का स्थायी भाव रति (प्रेम) है।'},
    {q:'"साँवले सपनों की याद" में किसका स्मरण किया गया है?', a:'सालिम अली', opts:['जिम कॉर्बेट','सालिम अली','टैगोर','प्रेमचंद'], exp:'जाबिर हुसेन ने इस संस्मरण में प्रसिद्ध पक्षी-विज्ञानी (birdwatcher) सालिम अली को याद किया है।'},
  ]},

  // ══ CLASS 10 ══
  { title:'Class 10 - Mathematics - Algebra & Trigonometry', desc:'Quadratic equations, AP, trigonometry', subject_id:S.Math, class_level:10, difficulty:'hard', questions:[
    {q:'The roots of x²-5x+6=0 are?', a:'2 and 3', opts:['1 and 6','-2 and -3','2 and 3','-1 and -6'], exp:'x²-5x+6 = (x-2)(x-3) = 0 → x=2 or x=3'},
    {q:'The 10th term of AP 2, 5, 8, 11... is?', a:'29', opts:['27','28','29','30'], exp:'aₙ = a + (n-1)d = 2 + 9×3 = 2+27 = 29'},
    {q:'sin 30° = ?', a:'1/2', opts:['√3/2','1/2','1','√2/2'], exp:'sin 30° = 1/2 is a standard trigonometric value.'},
    {q:'If tan A = 3/4, what is sin A?', a:'3/5', opts:['3/4','4/5','3/5','4/3'], exp:'In right triangle: opposite=3, adjacent=4, hypotenuse=√(9+16)=5. sin A = 3/5.'},
    {q:'The discriminant of ax²+bx+c=0 is?', a:'b²-4ac', opts:['b²+4ac','b²-4ac','√(b²-4ac)','b-4ac'], exp:'Discriminant Δ = b²-4ac determines nature of roots of quadratic equation.'},
    {q:'Sum of n terms of AP: Sₙ = ?', a:'n/2[2a+(n-1)d]', opts:['n[a+(n-1)d]','n/2[2a+(n-1)d]','na+(n-1)d','n(a+l)/2 only'], exp:'Sₙ = n/2[2a+(n-1)d] where a=first term, d=common difference, n=number of terms.'},
    {q:'cos²θ + sin²θ = ?', a:'1', opts:['0','1','2','sin2θ'], exp:'The fundamental Pythagorean identity: sin²θ + cos²θ = 1 for all values of θ.'},
    {q:'Nature of roots when Δ < 0?', a:'No real roots', opts:['Two equal real roots','Two distinct real roots','No real roots','Rational roots'], exp:'When discriminant < 0, the equation has no real roots (complex/imaginary roots).'},
  ]},
  { title:'Class 10 - Mathematics - Geometry & Mensuration', desc:'Circles, coordinate geometry, surface areas', subject_id:S.Math, class_level:10, difficulty:'hard', questions:[
    {q:'Length of tangent from external point P at distance d from centre of circle with radius r?', a:'√(d²-r²)', opts:['d-r','√(d²-r²)','d+r','√(d²+r²)'], exp:'Using Pythagoras: tangent² + radius² = distance² → tangent = √(d²-r²)'},
    {q:'Area of sector with radius r and angle θ (in degrees)?', a:'(θ/360)×πr²', opts:['πr²','(θ/180)×πr²','(θ/360)×πr²','2πr×θ'], exp:'Area of sector = (θ/360°) × πr² where θ is the central angle.'},
    {q:'Total surface area of a cone with r=7, l=25?', a:'704 cm²', opts:['550 cm²','704 cm²','616 cm²','352 cm²'], exp:'TSA = πr(l+r) = (22/7)×7×(25+7) = 22×32 = 704 cm²'},
    {q:'Volume of a sphere with radius 6 cm?', a:'288π cm³', opts:['144π cm³','288π cm³','72π cm³','216π cm³'], exp:'V = (4/3)πr³ = (4/3)π×216 = 288π cm³'},
    {q:'The distance between (-1,3) and (4,-2) is?', a:'5√2', opts:['5','5√2','10','√50'], exp:'d = √[(4-(-1))²+(-2-3)²] = √[25+25] = √50 = 5√2'},
    {q:'Section formula: point dividing (x₁,y₁) and (x₂,y₂) in ratio m:n is?', a:'((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))', opts:['((x₁+x₂)/2, (y₁+y₂)/2)','((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))','(m×x₁, n×y₂)','(x₂-x₁, y₂-y₁)'], exp:'Section formula for internal division in ratio m:n.'},
    {q:'Angle in a semicircle is?', a:'90°', opts:['45°','60°','90°','180°'], exp:'The angle subtended by a diameter (semicircle) at any point on the circle is always 90°.'},
    {q:'Probability that event will NOT occur if P(A)=0.3?', a:'0.7', opts:['0.3','0.7','1.3','0.07'], exp:"P(A') = 1 - P(A) = 1 - 0.3 = 0.7. Complementary probability."},
  ]},

  { title:'Class 10 - Science - Chemistry', desc:'Chemical reactions, acids, metals, carbon', subject_id:S.Science, class_level:10, difficulty:'hard', questions:[
    {q:'Displacement reaction: Fe + CuSO₄ → ?', a:'FeSO₄ + Cu', opts:['FeCu + SO₄','FeSO₄ + Cu','Fe₂SO₄ + Cu','FeO + CuS'], exp:'More reactive iron displaces less reactive copper: Fe + CuSO₄ → FeSO₄ + Cu'},
    {q:'Baking soda is?', a:'NaHCO₃', opts:['Na₂CO₃','NaHCO₃','NaOH','Na₂SO₄'], exp:'Baking soda is sodium bicarbonate (NaHCO₃). Washing soda is Na₂CO₃.'},
    {q:'Which has the highest pH?', a:'NaOH solution', opts:['Lemon juice','Pure water','Vinegar','NaOH solution'], exp:'NaOH is a strong base with pH around 13-14. Acids have low pH, water = 7.'},
    {q:'The alloy of copper and zinc is?', a:'Brass', opts:['Bronze','Brass','Steel','Solder'], exp:'Brass = copper + zinc. Bronze = copper + tin. Steel = iron + carbon.'},
    {q:'Carbon forms so many compounds because of its?', a:'Tetravalency and catenation', opts:['High atomic mass','Tetravalency and catenation','Metallic properties','Low boiling point'], exp:'Carbon\'s ability to form 4 bonds (tetravalency) and chain with itself (catenation) gives millions of compounds.'},
    {q:'Which acid is present in vinegar?', a:'Acetic acid', opts:['Citric acid','Hydrochloric acid','Acetic acid','Sulphuric acid'], exp:'Vinegar contains approximately 5-8% acetic acid (ethanoic acid, CH₃COOH).'},
    {q:'Saponification is the process of making?', a:'Soap', opts:['Alcohol','Soap','Plastic','Petroleum'], exp:'Saponification: fat/oil + strong base (NaOH/KOH) → soap + glycerol.'},
    {q:'Which reaction releases heat?', a:'Exothermic reaction', opts:['Endothermic reaction','Exothermic reaction','Decomposition only','Electrolysis'], exp:'Exothermic reactions release energy as heat (e.g., combustion, neutralisation).'},
  ]},
  { title:'Class 10 - Science - Biology & Physics', desc:'Life processes, electricity, magnetism, optics', subject_id:S.Science, class_level:10, difficulty:'hard', questions:[
    {q:'The functional unit of kidney is?', a:'Nephron', opts:['Neuron','Nephron','Alveolus','Villus'], exp:'The nephron is the structural and functional unit of the kidney that filters blood.'},
    {q:'Ohm\'s Law states that?', a:'V = IR', opts:['V = I/R','V = IR','I = VR','R = V/I only'], exp:'Ohm\'s Law: Voltage = Current × Resistance (V = IR), when temperature is constant.'},
    {q:'A convex lens has focal length 20 cm. Its power is?', a:'+5 D', opts:['-5 D','+5 D','+20 D','0.05 D'], exp:'Power P = 1/f (in metres) = 1/0.20 = +5 D. Convex lenses have positive power.'},
    {q:'Reflex arc passes through?', a:'Spinal cord', opts:['Brain','Spinal cord','Heart','Liver'], exp:'Reflex actions are controlled by the spinal cord without involving the brain, for faster response.'},
    {q:'Ozone layer is present in the?', a:'Stratosphere', opts:['Troposphere','Stratosphere','Mesosphere','Thermosphere'], exp:'The ozone layer (ozonosphere) is in the stratosphere, 15-35 km above Earth, protecting us from UV.'},
    {q:'The male reproductive gamete in plants is present in?', a:'Pollen grain', opts:['Ovule','Anther','Pollen grain','Pistil'], exp:'Pollen grains contain the male gametes (microspores). They are produced in the anther.'},
    {q:'Magnetic field lines around a straight current-carrying conductor are?', a:'Concentric circles', opts:['Straight lines','Concentric circles','Ellipses','Parallel lines'], exp:'By right-hand rule, field lines around a straight conductor form concentric circles.'},
    {q:'Which gas is released during photosynthesis?', a:'Oxygen', opts:['Carbon dioxide','Oxygen','Hydrogen','Nitrogen'], exp:'Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Oxygen is released as a byproduct.'},
  ]},

  { title:'Class 10 - Social Science - Indian History & Economy', desc:'Nationalism, industrialisation, development', subject_id:S.Social, class_level:10, difficulty:'hard', questions:[
    {q:'The Non-Cooperation Movement was launched in?', a:'1920', opts:['1905','1915','1920','1930'], exp:'Mahatma Gandhi launched the Non-Cooperation Movement in 1920 against British rule.'},
    {q:'The Civil Disobedience Movement began with the?', a:'Dandi March', opts:['Quit India Movement','Dandi March','Champaran Satyagraha','Khilafat Movement'], exp:'Gandhi began the Civil Disobedience Movement with the Dandi Salt March in March 1930.'},
    {q:'Belgium\'s consociational system is used as an example of?', a:'Power sharing', opts:['Democracy','Power sharing','Federalism','Secularism'], exp:'Belgium\'s model of sharing power among linguistic communities is a classic example of consociationalism.'},
    {q:'Human Development Index measures?', a:'Life expectancy, education and income', opts:['GDP only','Life expectancy, education and income','Military strength','Land area'], exp:'UNDP\'s HDI measures human development through life expectancy, education (GNI) and per capita income.'},
    {q:'Primary sector includes?', a:'Agriculture and mining', opts:['Manufacturing','Services','Agriculture and mining','Banking'], exp:'Primary sector involves extraction of natural resources — farming, fishing, forestry, mining.'},
    {q:'Globalisation means?', a:'Integration of economies across the world', opts:['Spreading of democracy','Integration of economies across the world','Cultural homogenisation only','Free movement of people only'], exp:'Globalisation is the process of increased integration of national economies through trade, investment and technology.'},
    {q:'Who coined the term "nationalism" in the modern sense?', a:'The French Revolutionaries', opts:['British imperialists','The French Revolutionaries','Napoleon','Bismarck'], exp:'The French Revolution popularised ideas of nationalism, citizenship and the nation-state.'},
    {q:'The Rowlatt Act (1919) was protested against because it?', a:'Allowed detention without trial', opts:['Imposed heavy taxes','Allowed detention without trial','Banned political parties','Divided India'], exp:'The Rowlatt Act allowed authorities to imprison political activists without trial, causing widespread protest.'},
  ]},
  { title:'Class 10 - Social Science - Geography', desc:'Resources, agriculture, minerals, transport', subject_id:S.Social, class_level:10, difficulty:'hard', questions:[
    {q:'Which state is the largest producer of cotton in India?', a:'Gujarat', opts:['Maharashtra','Punjab','Gujarat','Rajasthan'], exp:'Gujarat is India\'s largest cotton-producing state, followed by Maharashtra.'},
    {q:'The Jharia coalfield is located in?', a:'Jharkhand', opts:['Bihar','Jharkhand','Odisha','West Bengal'], exp:'Jharia in Jharkhand is India\'s largest coalfield and known for superior coking coal.'},
    {q:'Which crop is known as the "Golden Fibre" of India?', a:'Jute', opts:['Cotton','Silk','Jute','Hemp'], exp:'Jute is called "Golden Fibre" due to its golden colour and economic importance.'},
    {q:'National Highways are maintained by?', a:'National Highways Authority of India (NHAI)', opts:['State governments','Railways','National Highways Authority of India (NHAI)','Municipal corporations'], exp:'NHAI (National Highways Authority of India) constructs and maintains the national highway network.'},
    {q:'Which type of industry produces raw materials for other industries?', a:'Basic industries', opts:['Consumer industries','Basic industries','Cottage industries','Service industries'], exp:'Basic (key) industries like iron and steel provide raw materials for other industries.'},
    {q:'Rooftop solar panels are an example of?', a:'Non-conventional energy', opts:['Conventional energy','Non-conventional energy','Nuclear energy','Tidal energy'], exp:'Solar energy from panels is a non-conventional/renewable source of energy.'},
    {q:'Which river forms the Sundarbans delta?', a:'Ganga-Brahmaputra', opts:['Indus','Godavari','Ganga-Brahmaputra','Cauvery'], exp:'The Sundarbans mangrove delta is formed by the Ganga-Brahmaputra river system in West Bengal and Bangladesh.'},
    {q:'Regur soil is another name for?', a:'Black soil', opts:['Red soil','Black soil','Laterite soil','Alluvial soil'], exp:'Regur (black cotton soil) is rich in calcium carbonate, ideal for cotton — found in Deccan Plateau.'},
  ]},

  // ══ CLASS 11 ══
  { title:'Class 11 - Mathematics - Algebra & Functions', desc:'Sets, functions, complex numbers, sequences', subject_id:S.Math, class_level:11, difficulty:'hard', questions:[
    {q:'A∪B = ?', a:'Set of elements in A or B or both', opts:['Set of elements in both A and B','Set of elements in A or B or both','Set of elements only in A','Empty set'], exp:'Union (A∪B) contains all elements that are in A, in B, or in both.'},
    {q:'If f(x) = x², then f(-3) = ?', a:'9', opts:['-9','9','6','-6'], exp:'f(-3) = (-3)² = 9. Squaring any number gives positive result.'},
    {q:'i² = ?', a:'-1', opts:['1','-1','i','-i'], exp:'i = √(-1), so i² = -1. This is the fundamental property of imaginary unit.'},
    {q:'The 8th term of GP 1, 2, 4, 8... is?', a:'128', opts:['64','128','256','16'], exp:'GP with a=1, r=2. aₙ = arⁿ⁻¹ = 1×2⁷ = 128.'},
    {q:'How many subsets does a set with 3 elements have?', a:'8', opts:['3','6','8','9'], exp:'A set with n elements has 2ⁿ subsets. For n=3: 2³ = 8 subsets.'},
    {q:'The range of f(x) = sin x is?', a:'[-1, 1]', opts:['[0,1]','[-1,1]','(-∞,∞)','[0,∞)'], exp:'sin x oscillates between -1 and 1, so its range is [-1, 1].'},
    {q:'nCr = n!/r!(n-r)! gives the number of?', a:'Combinations', opts:['Permutations','Combinations','Both','Neither'], exp:'nCr (n choose r) counts combinations — selections without regard to order.'},
    {q:'Modulus of complex number (3+4i) is?', a:'5', opts:['3','4','5','7'], exp:'|3+4i| = √(3²+4²) = √(9+16) = √25 = 5'},
  ]},
  { title:'Class 11 - Mathematics - Calculus & Coordinate Geometry', desc:'Limits, derivatives, straight lines, conic sections', subject_id:S.Math, class_level:11, difficulty:'hard', questions:[
    {q:'lim(x→0) sin(x)/x = ?', a:'1', opts:['0','1','∞','Undefined'], exp:'This is a standard limit: lim(x→0) sin(x)/x = 1 (proved using squeeze theorem).'},
    {q:'d/dx(x³) = ?', a:'3x²', opts:['x²','3x²','3x³','x³/3'], exp:'Power rule: d/dx(xⁿ) = nxⁿ⁻¹. For x³: derivative = 3x².'},
    {q:'The slope of line 3x-4y+7=0 is?', a:'3/4', opts:['4/3','-3/4','3/4','-4/3'], exp:'Rewrite: y = (3x+7)/4. Slope m = 3/4.'},
    {q:'Equation of circle with centre (2,-3) and radius 5?', a:'(x-2)²+(y+3)²=25', opts:['(x+2)²+(y-3)²=25','(x-2)²+(y+3)²=25','(x-2)²+(y-3)²=25','x²+y²=25'], exp:'(x-h)²+(y-k)²=r². Centre (2,-3), r=5: (x-2)²+(y+3)²=25.'},
    {q:'d/dx(sin x) = ?', a:'cos x', opts:['sin x','-cos x','cos x','-sin x'], exp:'The derivative of sin x is cos x.'},
    {q:'The vertex of parabola y²=8x is?', a:'(0,0)', opts:['(8,0)','(0,8)','(0,0)','(2,0)'], exp:'Standard form y²=4ax, vertex at origin (0,0), focus at (a,0)=(2,0).'},
    {q:'Lim(x→2) (x²-4)/(x-2) = ?', a:'4', opts:['0','2','4','Undefined'], exp:'Factor: (x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2. As x→2: 2+2=4.'},
    {q:'If y = eˣ, then dy/dx = ?', a:'eˣ', opts:['xeˣ⁻¹','eˣ','e','1'], exp:'The exponential function eˣ is its own derivative: d/dx(eˣ) = eˣ.'},
  ]},

  { title:'Class 11 - Physics - Mechanics', desc:'Units, motion, laws, work, energy, gravitation', subject_id:S.Physics, class_level:11, difficulty:'hard', questions:[
    {q:'SI unit of pressure is?', a:'Pascal', opts:['Newton','Joule','Pascal','Watt'], exp:'Pressure = Force/Area. SI unit is Pascal (Pa) = 1 N/m².'},
    {q:'A body thrown horizontally has what type of motion?', a:'Projectile motion', opts:['Uniform motion','Simple harmonic motion','Projectile motion','Circular motion'], exp:'Horizontal projection gives projectile motion — combination of uniform horizontal and accelerated vertical motion.'},
    {q:'Moment of inertia depends on?', a:'Mass and its distribution about the axis', opts:['Mass only','Speed only','Mass and its distribution about the axis','Shape only'], exp:'Moment of inertia I = Σmr² depends on the mass and how it is distributed relative to the rotation axis.'},
    {q:'Escape velocity from Earth is approximately?', a:'11.2 km/s', opts:['9.8 km/s','11.2 km/s','3×10⁸ km/s','7.9 km/s'], exp:'Escape velocity = √(2gR) ≈ 11.2 km/s. This is the minimum speed to escape Earth\'s gravity.'},
    {q:'The work-energy theorem states?', a:'Net work = Change in kinetic energy', opts:['Work = Force × Distance always','Net work = Change in kinetic energy','Potential energy is always conserved','Work = mgh only'], exp:'Work-Energy theorem: Wnet = ΔKE = ½mv² - ½mu²'},
    {q:'Centre of mass of a system of particles moves as if?', a:'All mass is concentrated at it and all forces act on it', opts:['No external force acts','All mass is concentrated at it and all forces act on it','Rotational motion ceases','Internal forces move it'], exp:'The centre of mass moves as if the entire mass is concentrated there and all external forces act on that point.'},
    {q:'Geostationary satellite has time period of?', a:'24 hours', opts:['12 hours','24 hours','1 hour','365 days'], exp:'A geostationary satellite completes one revolution in 24 hours, matching Earth\'s rotation, so it appears stationary.'},
    {q:'Elastic collision conserves?', a:'Both momentum and kinetic energy', opts:['Momentum only','Kinetic energy only','Both momentum and kinetic energy','Neither'], exp:'Elastic collisions conserve both linear momentum and kinetic energy.'},
  ]},
  { title:'Class 11 - Physics - Waves, Thermodynamics & Optics', desc:'Oscillations, waves, thermodynamics, kinetic theory', subject_id:S.Physics, class_level:11, difficulty:'hard', questions:[
    {q:'Time period of simple pendulum depends on?', a:'Length of pendulum and g', opts:['Mass of bob','Length of pendulum and g','Amplitude only','Angle of swing only'], exp:'T = 2π√(L/g). Period depends only on length L and acceleration due to gravity g.'},
    {q:'First law of thermodynamics is?', a:'ΔU = Q - W', opts:['ΔU = Q + W','ΔU = Q - W','Q = ΔU + W only for gases','Energy can be created'], exp:'First law: ΔU = Q - W. Internal energy increases by heat added minus work done by the system.'},
    {q:'The speed of sound in air at room temperature is approximately?', a:'343 m/s', opts:['300 m/s','343 m/s','3×10⁸ m/s','1500 m/s'], exp:'Speed of sound in air at ~20°C is approximately 343 m/s.'},
    {q:'Degrees of freedom of a monoatomic gas is?', a:'3', opts:['1','2','3','5'], exp:'A monoatomic gas (e.g., He, Ar) has 3 translational degrees of freedom.'},
    {q:'Interference of light proves its?', a:'Wave nature', opts:['Particle nature','Wave nature','Both particle and wave nature','Neither'], exp:'Interference is a wave phenomenon — it demonstrates the wave nature of light.'},
    {q:'The phenomenon of bending of light around obstacles is?', a:'Diffraction', opts:['Refraction','Reflection','Diffraction','Dispersion'], exp:'Diffraction is the bending of waves around the edges of obstacles or through openings.'},
    {q:'Standing waves are formed by?', a:'Superposition of two waves of same frequency travelling in opposite directions', opts:['Single wave reflection','Superposition of two waves of same frequency travelling in opposite directions','Diffraction only','Interference from a single source'], exp:'Standing waves result from the superposition of two identical waves travelling in opposite directions.'},
    {q:'The SI unit of frequency is?', a:'Hertz (Hz)', opts:['Metre','Second','Hertz (Hz)','Ampere'], exp:'Frequency is measured in Hertz (Hz) = cycles per second. 1 Hz = 1 s⁻¹.'},
  ]},

  { title:'Class 11 - Chemistry - Atomic Structure & Bonding', desc:'Atoms, periodic table, chemical bonding', subject_id:S.Chemistry, class_level:11, difficulty:'hard', questions:[
    {q:'The number of orbitals in d subshell is?', a:'5', opts:['1','3','5','7'], exp:'The d subshell has l=2, so ml = -2,-1,0,+1,+2 → 5 orbitals, holding max 10 electrons.'},
    {q:'Electronegativity increases in the periodic table going?', a:'Left to right and bottom to top', opts:['Right to left and top to bottom','Left to right and bottom to top','Down a group','Along a period decreasing'], exp:'Electronegativity increases across a period (L→R) and up a group (bottom to top). F is most electronegative.'},
    {q:'Which bond is present in NaCl?', a:'Ionic bond', opts:['Covalent bond','Ionic bond','Metallic bond','Hydrogen bond'], exp:'NaCl is formed by transfer of electron from Na to Cl, creating Na⁺ and Cl⁻ ions — ionic bond.'},
    {q:'The shape of water molecule is?', a:'Bent/angular', opts:['Linear','Trigonal planar','Tetrahedral','Bent/angular'], exp:'Water (H₂O) has 2 bond pairs and 2 lone pairs. VSEPR predicts bent/angular shape (~104.5°).'},
    {q:'Aufbau principle states that electrons fill?', a:'Orbitals in order of increasing energy', opts:['Highest energy orbitals first','Orbitals in order of increasing energy','All orbitals singly first','s orbitals before any other'], exp:'Aufbau (building up) principle: electrons occupy available orbitals from lowest to highest energy.'},
    {q:'Hydrogen bonding is strongest in?', a:'HF', opts:['HCl','H₂O','HF','HBr'], exp:'HF has the strongest hydrogen bonds due to fluorine\'s high electronegativity and small size.'},
    {q:'Isotopes of hydrogen are?', a:'Protium, Deuterium, Tritium', opts:['Protium only','Protium and Deuterium','Protium, Deuterium, Tritium','Deuterium and Tritium only'], exp:'Hydrogen has three isotopes: ¹H (protium), ²H (deuterium), ³H (tritium).'},
    {q:'The quantum number that describes the shape of an orbital is?', a:'Azimuthal quantum number (l)', opts:['Principal quantum number (n)','Azimuthal quantum number (l)','Magnetic quantum number (ml)','Spin quantum number (ms)'], exp:'The azimuthal quantum number (l) determines the shape/subshell of an orbital (s,p,d,f).'},
  ]},
  { title:'Class 11 - Chemistry - Thermodynamics & Equilibrium', desc:'Energy, equilibrium, redox, organic chemistry basics', subject_id:S.Chemistry, class_level:11, difficulty:'hard', questions:[
    {q:'A reaction is spontaneous when?', a:'ΔG < 0', opts:['ΔH < 0 always','ΔG < 0','ΔS < 0','ΔG > 0'], exp:'Gibbs free energy: ΔG = ΔH - TΔS. Spontaneous process has ΔG < 0.'},
    {q:'Le Chatelier\'s principle states that on adding more reactant?', a:'Equilibrium shifts to products side', opts:['Equilibrium shifts to reactants side','Equilibrium shifts to products side','No change occurs','Reaction stops'], exp:'Adding reactant increases stress → equilibrium shifts forward (toward products) to reduce stress.'},
    {q:'pH of pure water at 25°C is?', a:'7', opts:['0','7','14','9'], exp:'Pure water has [H⁺] = [OH⁻] = 10⁻⁷ mol/L, so pH = -log(10⁻⁷) = 7.'},
    {q:'IUPAC name of CH₃CH₂OH is?', a:'Ethanol', opts:['Methanol','Ethanol','Propanol','Ethene'], exp:'CH₃CH₂OH has 2 carbons and an -OH group → ethanol (1-ethanol).'},
    {q:'In redox reaction, oxidation involves?', a:'Loss of electrons', opts:['Gain of electrons','Loss of electrons','Gain of hydrogen','Loss of oxygen only'], exp:'Oxidation = loss of electrons (OIL — Oxidation Is Loss). Reduction = gain of electrons (RIG).'},
    {q:'Enthalpy of neutralisation of strong acid with strong base is approximately?', a:'-57.1 kJ/mol', opts:['-57.1 kJ/mol','+57.1 kJ/mol','-100 kJ/mol','0 kJ/mol'], exp:'Neutralisation of any strong acid with strong base releases about 57.1 kJ/mol (standard value).'},
    {q:'Which is the functional group of an aldehyde?', a:'-CHO', opts:['-COOH','-OH','-CHO','C=O in ring'], exp:'Aldehydes contain the -CHO (formyl) functional group at the end of a carbon chain.'},
    {q:'Catalyst affects a reaction by?', a:'Lowering activation energy', opts:['Increasing activation energy','Lowering activation energy','Changing equilibrium constant','Changing enthalpy'], exp:'Catalysts provide an alternative pathway with lower activation energy, speeding up the reaction.'},
  ]},

  { title:'Class 11 - Biology - Cell Biology & Plant Science', desc:'Cell, cell division, plant nutrition, photosynthesis', subject_id:S.Biology, class_level:11, difficulty:'hard', questions:[
    {q:'Cell theory was proposed by?', a:'Schleiden and Schwann', opts:['Darwin and Wallace','Schleiden and Schwann','Mendel and Morgan','Watson and Crick'], exp:'Matthias Schleiden (1838) and Theodor Schwann (1839) proposed the cell theory.'},
    {q:'Which organelle is absent in animal cells?', a:'Cell wall and chloroplast', opts:['Mitochondria','Nucleus','Cell wall and chloroplast','Ribosome'], exp:'Animal cells lack cell walls and chloroplasts, which are present in plant cells.'},
    {q:'Meiosis results in?', a:'4 haploid cells', opts:['2 diploid cells','4 diploid cells','2 haploid cells','4 haploid cells'], exp:'Meiosis (reduction division) produces 4 genetically different haploid (n) daughter cells.'},
    {q:'The light reactions of photosynthesis occur in?', a:'Thylakoid membrane', opts:['Stroma','Thylakoid membrane','Cytoplasm','Mitochondrial matrix'], exp:'Light reactions (splitting water, ATP/NADPH production) occur in the thylakoid membranes of chloroplasts.'},
    {q:'RuBisCO is the enzyme responsible for?', a:'Carbon fixation in Calvin cycle', opts:['Photolysis of water','Carbon fixation in Calvin cycle','ATP synthesis','Electron transport'], exp:'RuBisCO (Ribulose-1,5-bisphosphate carboxylase/oxygenase) catalyses CO₂ fixation in the Calvin cycle.'},
    {q:'Which plant hormone promotes cell elongation?', a:'Auxin', opts:['Cytokinin','Abscisic acid','Auxin','Ethylene'], exp:'Auxin (IAA) promotes cell elongation and is responsible for phototropism and gravitropism.'},
    {q:'The site of aerobic respiration is?', a:'Mitochondria', opts:['Chloroplast','Nucleus','Mitochondria','Ribosome'], exp:'Aerobic respiration (Krebs cycle, electron transport chain) occurs in the mitochondria.'},
    {q:'Essential mineral element for nitrogen fixation?', a:'Molybdenum', opts:['Iron','Calcium','Molybdenum','Potassium'], exp:'Molybdenum is a cofactor of nitrogenase enzyme, essential for biological nitrogen fixation.'},
  ]},
  { title:'Class 11 - Biology - Animal Kingdom & Physiology', desc:'Classification, structural organisation, digestion', subject_id:S.Biology, class_level:11, difficulty:'hard', questions:[
    {q:'The study of classification of organisms is called?', a:'Taxonomy', opts:['Ecology','Taxonomy','Physiology','Morphology'], exp:'Taxonomy is the science of identification, nomenclature and classification of organisms.'},
    {q:'Binomial nomenclature was introduced by?', a:'Carl Linnaeus', opts:['Charles Darwin','Carl Linnaeus','Gregor Mendel','Robert Hooke'], exp:'Carl Linnaeus introduced the binomial system of nomenclature in "Systema Naturae" (1758).'},
    {q:'Cockroach belongs to which phylum?', a:'Arthropoda', opts:['Annelida','Mollusca','Arthropoda','Echinodermata'], exp:'Cockroach belongs to Phylum Arthropoda, Class Insecta, Order Blattodea.'},
    {q:'Which blood group is the universal donor?', a:'O', opts:['A','B','AB','O'], exp:'Blood group O (negative) has no antigens and can donate to all groups — universal donor.'},
    {q:'Peristalsis is the movement of?', a:'Food through the alimentary canal', opts:['Blood through heart','Food through the alimentary canal','Air through lungs','Urine through ureter'], exp:'Peristalsis is the wave-like muscular contraction that moves food through the digestive tract.'},
    {q:'The largest gland in the human body is?', a:'Liver', opts:['Pancreas','Kidney','Liver','Thyroid'], exp:'The liver is the largest gland (and organ) in the human body, weighing about 1.5 kg.'},
    {q:'Nephron is the functional unit of?', a:'Kidney', opts:['Liver','Lung','Heart','Kidney'], exp:'The nephron is the functional unit of the kidney, responsible for filtration of blood.'},
    {q:'Which tissue connects muscle to bone?', a:'Tendon', opts:['Ligament','Tendon','Cartilage','Adipose tissue'], exp:'Tendons connect muscles to bones. Ligaments connect bones to bones.'},
  ]},

  { title:'Class 11 - English - Hornbill & Snapshots', desc:'Prose, poetry and comprehension from Class 11 textbook', subject_id:S.English, class_level:11, difficulty:'medium', questions:[
    {q:'Who wrote "The Portrait of a Lady"?', a:'Khushwant Singh', opts:['Ruskin Bond','R.K. Narayan','Khushwant Singh','Mulk Raj Anand'], exp:'"The Portrait of a Lady" is by Khushwant Singh, describing his grandmother.'},
    {q:'In "We\'re Not Afraid to Die", the family was sailing to?', a:'Duplicate the voyage of Captain Cook', opts:['Go on a holiday','Duplicate the voyage of Captain Cook','Reach Australia quickly','Escape a storm'], exp:'Gordon Cook\'s family set out to duplicate the round-the-world voyage of Captain James Cook.'},
    {q:'A metaphysical poem deals with?', a:'Deep philosophical and spiritual themes', opts:['Nature only','Love poetry','Deep philosophical and spiritual themes','War and violence'], exp:'Metaphysical poetry (Donne, Marvell) uses elaborate conceits to explore spiritual and philosophical themes.'},
    {q:'"The Ailing Planet" article is about?', a:'Environmental conservation', opts:['Astronomy','Environmental conservation','Animal diseases','Planet Mars'], exp:'Nani Palkhivala\'s article discusses the Green Movement and the need for environmental protection.'},
    {q:'Voice in grammar refers to?', a:'Whether subject does or receives action', opts:['Loudness of speech','Tone of writing','Whether subject does or receives action','Type of sentence'], exp:'Active voice: subject performs action. Passive voice: subject receives action.'},
    {q:'A debate requires?', a:'Arguments for and against a topic', opts:['Only supporting arguments','Only opposing arguments','Arguments for and against a topic','Creative writing only'], exp:'A formal debate presents arguments for (proposition) and against (opposition) a motion.'},
    {q:'In "Silk Road", Nick Middleton travels to?', a:'Mount Kailash, Tibet', opts:['Beijing, China','New Delhi','Mount Kailash, Tibet','Nepal'], exp:'Nick Middleton\'s travelogue describes his journey to Mount Kailash for the Kailash Mansarovar yatra.'},
    {q:'Which literary device is "the sun smiled down"?', a:'Personification', opts:['Simile','Metaphor','Personification','Hyperbole'], exp:'Personification gives human qualities to non-human things. "The sun smiled" → sun given human action.'},
  ]},
  { title:'Class 11 - Hindi - आरोह भाग 1', desc:'गद्य और पद्य - आरोह', subject_id:S.Hindi, class_level:11, difficulty:'medium', questions:[
    {q:'"नमक का दारोगा" के लेखक कौन हैं?', a:'प्रेमचंद', opts:['जयशंकर प्रसाद','प्रेमचंद','हजारीप्रसाद द्विवेदी','फणीश्वरनाथ रेणु'], exp:'"नमक का दारोगा" प्रेमचंद की प्रसिद्ध कहानी है जो ईमानदारी के विषय पर आधारित है।'},
    {q:'"मियाँ नसीरुद्दीन" पाठ किस विधा का है?', a:'रेखाचित्र', opts:['कहानी','उपन्यास','रेखाचित्र','जीवनी'], exp:'"मियाँ नसीरुद्दीन" कृष्णा सोबती का रेखाचित्र है जो एक प्रसिद्ध खानसामे का चित्रण करता है।'},
    {q:'छायावाद के प्रमुख कवि कौन हैं?', a:'जयशंकर प्रसाद, निराला, महादेवी वर्मा, पंत', opts:['तुलसीदास, सूरदास, कबीर','जयशंकर प्रसाद, निराला, महादेवी वर्मा, पंत','प्रेमचंद, यशपाल, रेणु','दिनकर, अज्ञेय, मुक्तिबोध'], exp:'हिंदी साहित्य में छायावाद के चार प्रमुख स्तंभ: प्रसाद, निराला, महादेवी वर्मा और सुमित्रानंद पंत हैं।'},
    {q:'"आत्मा का ताप" किसकी आत्मकथा है?', a:'सैयद हैदर रज़ा', opts:['अज्ञेय','सैयद हैदर रज़ा','निर्मल वर्मा','मोहन राकेश'], exp:'"आत्मा का ताप" प्रसिद्ध चित्रकार सैयद हैदर रज़ा की आत्मकथा है।'},
    {q:'छंद किसे कहते हैं?', a:'वर्णों और मात्राओं के नियमबद्ध विन्यास को', opts:['अलंकार को','रस को','वर्णों और मात्राओं के नियमबद्ध विन्यास को','समास को'], exp:'छंद वह नियम है जो कविता में वर्णों, मात्राओं और पादों का नियमन करता है।'},
    {q:'"कबीर" की भाषा को क्या कहते हैं?', a:'सधुक्कड़ी या पंचमेल खिचड़ी', opts:['ब्रजभाषा','अवधी','सधुक्कड़ी या पंचमेल खिचड़ी','खड़ीबोली'], exp:'कबीर की भाषा में हिंदी, अरबी, फारसी, राजस्थानी आदि भाषाओं का मिश्रण है — इसे सधुक्कड़ी कहते हैं।'},
    {q:'सूफी काव्य की प्रमुख भाषा थी?', a:'अवधी', opts:['ब्रजभाषा','अवधी','खड़ीबोली','मैथिली'], exp:'जायसी की "पद्मावत" जैसे सूफी प्रेमाख्यान काव्य अवधी भाषा में रचे गए।'},
    {q:'"मेरे तो गिरधर गोपाल" किसकी रचना है?', a:'मीराबाई', opts:['सूरदास','तुलसीदास','मीराबाई','कबीर'], exp:'"मेरे तो गिरधर गोपाल" मीराबाई का प्रसिद्ध भजन है जिसमें वे कृष्ण को अपना सर्वस्व मानती हैं।'},
  ]},

  // ══ CLASS 12 ══
  { title:'Class 12 - Mathematics - Calculus & Algebra', desc:'Matrices, determinants, integration, differential equations', subject_id:S.Math, class_level:12, difficulty:'hard', questions:[
    {q:'∫eˣ dx = ?', a:'eˣ + C', opts:['eˣ/x + C','eˣ + C','xeˣ + C','eˣ⁻¹ + C'], exp:'The integral of eˣ is eˣ itself (plus constant C), since d/dx(eˣ) = eˣ.'},
    {q:'Determinant of a 2×2 matrix [[a,b],[c,d]] = ?', a:'ad - bc', opts:['ab - cd','ac - bd','ad - bc','ad + bc'], exp:'For matrix [[a,b],[c,d]], det = ad - bc (main diagonal product minus off-diagonal product).'},
    {q:'∫(1/x)dx = ?', a:'ln|x| + C', opts:['x⁻² + C','ln|x| + C','1/x² + C','x + C'], exp:'The integral of 1/x is the natural logarithm: ∫(1/x)dx = ln|x| + C.'},
    {q:'If A is a 3×3 matrix with det(A)=5, then det(2A) = ?', a:'40', opts:['10','40','15','25'], exp:'det(kA) = kⁿ·det(A) for n×n matrix. det(2A) = 2³ × 5 = 8 × 5 = 40.'},
    {q:'d/dx(ln x) = ?', a:'1/x', opts:['1','1/x','ln x','x'], exp:'The derivative of natural log: d/dx(ln x) = 1/x (for x > 0).'},
    {q:'The order of differential equation y\'\' + 2y\' - 3y = 0 is?', a:'2', opts:['0','1','2','3'], exp:'Order = highest order derivative present. y\'\' is second derivative → order 2.'},
    {q:'∫sin x dx = ?', a:'-cos x + C', opts:['cos x + C','-cos x + C','sin x + C','-sin x + C'], exp:'∫sin x dx = -cos x + C. (Check: d/dx(-cos x) = sin x ✓)'},
    {q:'The inverse of matrix A exists when?', a:'det(A) ≠ 0', opts:['det(A) = 0','det(A) ≠ 0','det(A) = 1','A is square only'], exp:'A matrix is invertible (non-singular) if and only if its determinant is non-zero.'},
  ]},
  { title:'Class 12 - Mathematics - Probability & 3D Geometry', desc:'Probability, vectors, 3D geometry, linear programming', subject_id:S.Math, class_level:12, difficulty:'hard', questions:[
    {q:'Bayes\' theorem deals with?', a:'Conditional probability', opts:['Independent events','Conditional probability','Joint probability','Mutually exclusive events'], exp:'Bayes\' theorem calculates the probability of a hypothesis given evidence — conditional probability.'},
    {q:'The dot product of two perpendicular vectors is?', a:'0', opts:['1','-1','0','Undefined'], exp:'a·b = |a||b|cosθ. For perpendicular vectors, θ=90°, cos90°=0, so a·b=0.'},
    {q:'Direction cosines l, m, n satisfy?', a:'l²+m²+n²=1', opts:['l+m+n=1','l²+m²+n²=1','l²+m²+n²=0','lmn=1'], exp:'Direction cosines are cosines of angles with axes. l²+m²+n²=cos²α+cos²β+cos²γ=1.'},
    {q:'P(A∩B) = P(A)×P(B) when A and B are?', a:'Independent', opts:['Mutually exclusive','Independent','Exhaustive','Complementary'], exp:'For independent events, P(A∩B) = P(A)×P(B). This is the multiplication rule for independence.'},
    {q:'The angle between vectors a and b is θ, then |a×b| = ?', a:'|a||b|sinθ', opts:['|a||b|cosθ','|a||b|sinθ','|a||b|tanθ','|a|+|b|'], exp:'Magnitude of cross product: |a×b| = |a||b|sinθ (where θ is angle between them).'},
    {q:'Equation of plane through (1,2,3) with normal (1,0,-1) is?', a:'x - z = -2', opts:['x + z = 4','x - z = -2','x + 2y - z = 1','x - z = 2'], exp:'Plane: n·(r-a)=0. (1,0,-1)·(x-1,y-2,z-3)=0 → x-1-z+3=0 → x-z=-2.'},
    {q:'In linear programming, the feasible region is?', a:'The set of all feasible solutions', opts:['The optimal solution','The set of all feasible solutions','The objective function','The constraint set only'], exp:'The feasible region is the set of all points satisfying all constraints — where solutions are feasible.'},
    {q:'Expected value E(X) of a random variable X = ?', a:'Σ xᵢP(xᵢ)', opts:['Σ P(xᵢ)','Σ xᵢP(xᵢ)','(max+min)/2','Σ xᵢ'], exp:'E(X) = Σ xᵢP(xᵢ) — the weighted average of all possible values weighted by their probabilities.'},
  ]},

  { title:'Class 12 - Physics - Electromagnetism & Modern Physics', desc:'Electricity, magnetism, optics, dual nature, atoms', subject_id:S.Physics, class_level:12, difficulty:'hard', questions:[
    {q:'Coulomb\'s law: Force between two charges is proportional to?', a:'Product of charges and inversely to square of distance', opts:['Sum of charges','Product of charges and inversely to square of distance','Distance between them','Difference of charges'], exp:'F = kq₁q₂/r². Force ∝ q₁q₂ and ∝ 1/r². Coulomb\'s law.'},
    {q:'Capacitance of parallel plate capacitor is increased by?', a:'Inserting a dielectric between plates', opts:['Increasing distance between plates','Inserting a dielectric between plates','Decreasing area of plates','Using air as medium'], exp:'C = εA/d. Inserting dielectric (ε > ε₀) increases capacitance. Increasing d decreases C.'},
    {q:'Lenz\'s law is a consequence of conservation of?', a:'Energy', opts:['Charge','Momentum','Energy','Mass'], exp:'Lenz\'s law states induced EMF opposes the cause — this opposition conserves energy.'},
    {q:'Photoelectric effect proves light has?', a:'Particle nature', opts:['Wave nature','Particle nature','Both','Neither'], exp:'The photoelectric effect, explained by Einstein using photons, proves the particle nature of light.'},
    {q:'de Broglie wavelength λ = ?', a:'h/mv', opts:['mv/h','h/mv','hm/v','v/hm'], exp:'de Broglie relation: λ = h/p = h/mv, where h is Planck\'s constant, m is mass, v is velocity.'},
    {q:'In a transformer, if Ns > Np, it is a?', a:'Step-up transformer', opts:['Step-down transformer','Step-up transformer','Autotransformer','Isolation transformer'], exp:'When secondary coil (Ns) has more turns than primary (Np), voltage is stepped up — step-up transformer.'},
    {q:'Critical angle is the angle of incidence in the denser medium for which angle of refraction is?', a:'90°', opts:['0°','45°','90°','180°'], exp:'At critical angle, the refracted ray goes along the surface (90°). Beyond this: total internal reflection.'},
    {q:'The binding energy per nucleon is maximum for?', a:'Iron (Fe-56)', opts:['Hydrogen','Uranium','Iron (Fe-56)','Carbon'], exp:'Iron-56 has the highest binding energy per nucleon (~8.8 MeV), making it the most stable nucleus.'},
  ]},
  { title:'Class 12 - Physics - Semiconductors & Communication', desc:'Semiconductor devices, digital logic, communication', subject_id:S.Physics, class_level:12, difficulty:'hard', questions:[
    {q:'In a p-n junction diode, the depletion region contains?', a:'No free charge carriers', opts:['Only holes','Only electrons','No free charge carriers','Equal holes and electrons'], exp:'The depletion region forms when holes and electrons recombine, leaving fixed ions and no free carriers.'},
    {q:'A transistor can be used as?', a:'Amplifier and switch', opts:['Only amplifier','Only switch','Amplifier and switch','Neither'], exp:'Transistors work as amplifiers (in active region) and as switches (in saturation/cutoff regions).'},
    {q:'NOT gate output is?', a:'Complement of input', opts:['Same as input','Complement of input','AND of inputs','OR of inputs'], exp:'NOT gate inverts the input: if input=0, output=1; if input=1, output=0.'},
    {q:'The bandwidth of a communication channel determines?', a:'Rate of information transfer', opts:['Signal strength','Rate of information transfer','Antenna height','Frequency of carrier wave only'], exp:'Bandwidth (frequency range) determines the maximum rate of information transfer through a channel.'},
    {q:'Amplitude Modulation (AM) involves?', a:'Varying the amplitude of carrier wave with message signal', opts:['Varying frequency','Varying the amplitude of carrier wave with message signal','Digital modulation only','Pulse coding'], exp:'In AM, the amplitude of the high-frequency carrier wave varies according to the information signal.'},
    {q:'NAND gate is?', a:'Universal gate', opts:['Basic gate','Universal gate','Complex gate','Output gate'], exp:'NAND (and NOR) gates are universal — any Boolean function can be implemented using only NAND gates.'},
    {q:'In a full-wave rectifier, how many diodes are used?', a:'4', opts:['1','2','4','8'], exp:'A bridge full-wave rectifier uses 4 diodes. A centre-tap rectifier uses 2 diodes.'},
    {q:'The range of sky waves is?', a:'Very large (thousands of km)', opts:['A few km','Up to 100 km','Very large (thousands of km)','Unlimited always'], exp:'Sky waves bounce off the ionosphere, enabling long-distance communication (thousands of km).'},
  ]},

  { title:'Class 12 - Chemistry - Physical & Inorganic Chemistry', desc:'Solutions, electrochemistry, kinetics, p-block elements', subject_id:S.Chemistry, class_level:12, difficulty:'hard', questions:[
    {q:'Raoult\'s law states that vapour pressure of solution is?', a:'Proportional to mole fraction of solvent', opts:['Equal to vapour pressure of pure solvent','Proportional to mole fraction of solvent','Independent of solute','Proportional to solute concentration'], exp:'Raoult\'s law: P = P°×xsolvent. Vapour pressure is proportional to the mole fraction of solvent.'},
    {q:'Osmotic pressure π = ?', a:'MRT', opts:['nRT/V','MRT','P°×x','RT/V'], exp:'π = MRT (van\'t Hoff equation) where M = molarity, R = gas constant, T = temperature (K).'},
    {q:'In electrolysis, oxidation occurs at?', a:'Anode', opts:['Cathode','Anode','Both electrodes','Neither electrode'], exp:'At anode: oxidation (loss of electrons). At cathode: reduction (gain of electrons). (AN OX = ANOde OXidation)'},
    {q:'Rate of reaction is expressed as?', a:'Change in concentration per unit time', opts:['Moles of product formed','Change in concentration per unit time','Activation energy','Temperature change'], exp:'Rate = -d[Reactant]/dt = +d[Product]/dt. Measured as change in concentration per unit time.'},
    {q:'Nitrogen forms how many bonds in N₂?', a:'Triple bond', opts:['Single bond','Double bond','Triple bond','Ionic bond'], exp:'N₂ has a triple bond (N≡N): one σ bond and two π bonds. Bond energy: 945 kJ/mol.'},
    {q:'Ozone is a?', a:'Triatomic molecule of oxygen', opts:['Diatomic molecule','Triatomic molecule of oxygen','Compound of oxygen and nitrogen','Allotrope of sulphur'], exp:'Ozone (O₃) is a triatomic allotrope of oxygen. It is formed in the stratosphere by UV radiation.'},
    {q:'Which noble gas is used in filling balloons for lighter-than-air craft?', a:'Helium', opts:['Neon','Argon','Helium','Xenon'], exp:'Helium (non-flammable, lightest noble gas) is used in weather balloons and airships.'},
    {q:'Corrosion of iron produces?', a:'Fe₂O₃·xH₂O (rust)', opts:['FeO','Fe₃O₄','Fe₂O₃·xH₂O (rust)','FeCl₂'], exp:'Rusting of iron produces hydrated iron(III) oxide (Fe₂O₃·xH₂O), the reddish-brown rust.'},
  ]},
  { title:'Class 12 - Chemistry - Organic Chemistry', desc:'Haloalkanes, alcohols, aldehydes, amines, biomolecules', subject_id:S.Chemistry, class_level:12, difficulty:'hard', questions:[
    {q:'SN2 reaction proceeds with?', a:'Inversion of configuration', opts:['Retention of configuration','Inversion of configuration','Racemisation always','No stereo change'], exp:'SN2 (bimolecular nucleophilic substitution) involves backside attack → inversion (Walden inversion).'},
    {q:'Primary alcohol on oxidation gives?', a:'Aldehyde', opts:['Ketone','Aldehyde','Carboxylic acid first','No reaction'], exp:'Primary alcohols oxidise to aldehydes (with PCC or mild oxidants) or carboxylic acids (with strong oxidants).'},
    {q:'The functional group of carboxylic acids is?', a:'-COOH', opts:['-OH','-CHO','-COOH','-NH₂'], exp:'Carboxylic acids (-COOH) contain the carboxyl group (carbonyl + hydroxyl combined).'},
    {q:'Amines are classified based on?', a:'Number of hydrogen atoms replaced by alkyl groups on nitrogen', opts:['Number of carbon atoms','Number of hydrogen atoms replaced by alkyl groups on nitrogen','Molecular weight','Solubility'], exp:'Primary: RNH₂ (1 alkyl), Secondary: R₂NH (2 alkyl), Tertiary: R₃N (3 alkyl).'},
    {q:'Glucose is a?', a:'Monosaccharide', opts:['Disaccharide','Polysaccharide','Monosaccharide','Oligosaccharide'], exp:'Glucose (C₆H₁₂O₆) is a monosaccharide — the simplest sugar that cannot be hydrolysed further.'},
    {q:'DNA double helix is held together by?', a:'Hydrogen bonds between base pairs', opts:['Covalent bonds between bases','Hydrogen bonds between base pairs','Ionic bonds','Phosphodiester bonds only'], exp:'The two strands of DNA are held together by hydrogen bonds between complementary base pairs (A-T, G-C).'},
    {q:'Nylon-6,6 is a?', a:'Condensation polymer', opts:['Addition polymer','Condensation polymer','Natural polymer','Rubber'], exp:'Nylon-6,6 is a condensation polymer formed from hexamethylene diamine and adipic acid with loss of water.'},
    {q:'Aspirin is chemically?', a:'Acetylsalicylic acid', opts:['Salicylic acid','Acetylsalicylic acid','Methyl salicylate','Benzyl alcohol'], exp:'Aspirin is acetylsalicylic acid (C₉H₈O₄), synthesised by acetylation of salicylic acid.'},
  ]},

  { title:'Class 12 - Biology - Genetics & Evolution', desc:'Inheritance, molecular biology, evolution, biotechnology', subject_id:S.Biology, class_level:12, difficulty:'hard', questions:[
    {q:'Mendel\'s law of segregation states?', a:'Two alleles of a gene separate during gamete formation', opts:['Genes are linked on chromosomes','Two alleles of a gene separate during gamete formation','Traits blend in offspring','Genes are inherited independently'], exp:'Law of Segregation: allele pairs separate (segregate) during meiosis so each gamete carries one allele.'},
    {q:'The DNA replication is?', a:'Semi-conservative', opts:['Conservative','Semi-conservative','Dispersive','Random'], exp:'Meselson-Stahl experiment proved DNA replication is semi-conservative — each new DNA has one old and one new strand.'},
    {q:'Transcription produces?', a:'mRNA from DNA template', opts:['DNA from RNA','Protein from mRNA','mRNA from DNA template','tRNA from mRNA'], exp:'Transcription: DNA → mRNA using RNA polymerase. This mRNA is then translated to protein.'},
    {q:'Natural selection was proposed by?', a:'Charles Darwin', opts:['Lamarck','Charles Darwin','Mendel','Wallace only'], exp:'Charles Darwin (and independently Alfred Russel Wallace) proposed the theory of natural selection (1858).'},
    {q:'Restriction enzymes cut DNA at?', a:'Specific palindromic sequences', opts:['Random sites','Specific palindromic sequences','Only at promoters','End of chromosomes'], exp:'Restriction endonucleases recognise specific palindromic sequences (4-8 bp) and cut DNA there.'},
    {q:'PCR (Polymerase Chain Reaction) is used to?', a:'Amplify specific DNA sequences', opts:['Sequence proteins','Amplify specific DNA sequences','Separate DNA fragments','Make RNA from DNA'], exp:'PCR amplifies a specific DNA segment millions of times using primers and Taq polymerase through cycles of heating and cooling.'},
    {q:'Down syndrome is caused by?', a:'Trisomy of chromosome 21', opts:['Monosomy of X','Trisomy of chromosome 21','Deletion of chromosome 5','Inversion of chromosome 9'], exp:'Down syndrome (trisomy 21) results from non-disjunction — three copies of chromosome 21 instead of two.'},
    {q:'Bt crops are modified to?', a:'Produce insecticidal protein', opts:['Grow faster','Produce insecticidal protein','Resist drought','Fix nitrogen'], exp:'Bt crops contain a gene from Bacillus thuringiensis that produces crystal (Cry) proteins toxic to specific insect pests.'},
  ]},
  { title:'Class 12 - Biology - Ecology & Human Health', desc:'Ecosystems, biodiversity, health, reproductive biology', subject_id:S.Biology, class_level:12, difficulty:'hard', questions:[
    {q:'Energy flow in an ecosystem is?', a:'Unidirectional', opts:['Bidirectional','Cyclic','Unidirectional','Random'], exp:'Energy flows in one direction only (sun → producers → consumers → decomposers). It is not recycled.'},
    {q:'The 10% law in ecology refers to?', a:'Only 10% energy transferred to next trophic level', opts:['10% species are endangered','Only 10% energy transferred to next trophic level','10% water recycled','Biomass increases 10% per level'], exp:'Lindemann\'s 10% law: only 10% of energy at each trophic level is transferred to the next. 90% is lost.'},
    {q:'Which disease is caused by Plasmodium?', a:'Malaria', opts:['AIDS','Malaria','Tuberculosis','Cholera'], exp:'Malaria is caused by Plasmodium parasite, transmitted by the female Anopheles mosquito.'},
    {q:'Ozone depletion is mainly caused by?', a:'Chlorofluorocarbons (CFCs)', opts:['Carbon dioxide','Methane','Chlorofluorocarbons (CFCs)','Sulphur dioxide'], exp:'CFCs (from refrigerants, aerosols) release Cl radicals in stratosphere that catalytically destroy ozone.'},
    {q:'Biodiversity hotspot has?', a:'High species richness and endemism but threatened by habitat loss', opts:['Low species diversity','High species richness and endemism but threatened by habitat loss','Only marine species','Stable ecosystems'], exp:'Biodiversity hotspots have exceptional concentrations of endemic species and are under serious threat.'},
    {q:'The Western Ghats of India is a?', a:'Biodiversity hotspot', opts:['Desert ecosystem','Biodiversity hotspot','Polar biome','Temperate forest only'], exp:'The Western Ghats (along with Sri Lanka) is one of 36 recognised global biodiversity hotspots.'},
    {q:'Ex-situ conservation includes?', a:'Zoos, botanical gardens, seed banks', opts:['National parks','Biosphere reserves','Zoos, botanical gardens, seed banks','Wildlife sanctuaries'], exp:'Ex-situ conservation protects species outside their natural habitat — zoos, seed banks, culture collections.'},
    {q:'AIDS is caused by?', a:'HIV (Human Immunodeficiency Virus)', opts:['Bacteria','HIV (Human Immunodeficiency Virus)','Plasmodium','Prion'], exp:'AIDS (Acquired Immuno-Deficiency Syndrome) is caused by HIV, which destroys CD4+ T-helper lymphocytes.'},
  ]},

  { title:'Class 12 - English - Flamingo & Vistas', desc:'Prose and poetry from Class 12 textbook', subject_id:S.English, class_level:12, difficulty:'hard', questions:[
    {q:'Who wrote "The Last Lesson"?', a:'Alphonse Daudet', opts:['Guy de Maupassant','Alphonse Daudet','Victor Hugo','Emile Zola'], exp:'"The Last Lesson" is by French author Alphonse Daudet, set in Alsace during the Franco-Prussian War.'},
    {q:'"Lost Spring" is about?', a:'Child labour and poverty', opts:['Environmental destruction','Child labour and poverty','Industrial growth','Migration'], exp:'Anees Jung\'s "Lost Spring" explores the lives of children like Saheb from Dhaka who rag-pick in Delhi.'},
    {q:'William Douglas overcame his fear of water by?', a:'Learning to swim with an instructor', opts:['Reading about swimming','Learning to swim with an instructor','Watching others swim','Facing deep water alone'], exp:'Douglas hired an instructor who gradually helped him overcome his aquaphobia through systematic swimming lessons.'},
    {q:'The theme of "Indigo" is?', a:'Gandhi\'s Champaran Satyagraha', opts:['Industrial development','Gandhi\'s Champaran Satyagraha','Environmental conservation','Women\'s empowerment'], exp:'"Indigo" by Louis Fischer describes Gandhi\'s 1917 Champaran campaign defending indigo farmers\' rights.'},
    {q:'In "Going Places", Sophie\'s daydreaming represents?', a:'Teenage escapism and fantasy', opts:['Career planning','Teenage escapism and fantasy','Social commentary','Historical event'], exp:'Sophie fantasises about meeting footballer Danny Casey — the story explores teenage fantasy vs. reality.'},
    {q:'Kamala Das\'s "My Mother at Sixty-Six" deals with?', a:'Fear of old age and separation', opts:['Joy of motherhood','Fear of old age and separation','Nature\'s beauty','Career struggles'], exp:'The poem explores the poet\'s anxiety about her aging mother\'s mortality and the pain of separation.'},
    {q:'Which poetic device is "miles to go before I sleep"?', a:'Repetition', opts:['Metaphor','Simile','Repetition','Alliteration'], exp:'Robert Frost repeats "miles to go before I sleep" at the end of "Stopping by Woods" for emphasis — repetition.'},
    {q:'An autobiography is?', a:'Life story written by the person themselves', opts:['Life story written by another person','Life story written by the person themselves','Fiction based on real events','Historical account'], exp:'Autobiography: self-written life story. Biography: life story written by another person.'},
  ]},
  { title:'Class 12 - Hindi - आरोह भाग 2', desc:'गद्य और पद्य - आरोह भाग 2', subject_id:S.Hindi, class_level:12, difficulty:'hard', questions:[
    {q:'"बादल राग" किसकी कविता है?', a:'सूर्यकांत त्रिपाठी निराला', opts:['जयशंकर प्रसाद','सूर्यकांत त्रिपाठी निराला','सुमित्रानंद पंत','महादेवी वर्मा'], exp:'"बादल राग" निराला की क्रांतिकारी भावना से ओत-प्रोत कविता है।'},
    {q:'"काले मेघा पानी दे" किस विधा की रचना है?', a:'संस्मरण', opts:['कहानी','संस्मरण','उपन्यास','नाटक'], exp:'"काले मेघा पानी दे" धर्मवीर भारती का संस्मरण है जो इंद्र-सेना की परंपरा पर आधारित है।'},
    {q:'"उषा" कविता में किसका वर्णन है?', a:'भोर के दृश्य का', opts:['रात के तारों का','भोर के दृश्य का','समुद्र का','वर्षा का'], exp:'शमशेर बहादुर सिंह की "उषा" कविता में भोर (प्रातःकाल) के बदलते रंगों का चित्रण है।'},
    {q:'महाकाव्य और खंडकाव्य में क्या अंतर है?', a:'महाकाव्य में संपूर्ण जीवन का चित्रण, खंडकाव्य में एक खंड', opts:['दोनों एक समान हैं','महाकाव्य में संपूर्ण जीवन का चित्रण, खंडकाव्य में एक खंड','खंडकाव्य बड़ा होता है','कोई अंतर नहीं'], exp:'महाकाव्य में नायक के संपूर्ण जीवन का चित्रण होता है जबकि खंडकाव्य जीवन के एक खंड को चित्रित करता है।'},
    {q:'"सिल्वर वेडिंग" कहानी का मुख्य विषय क्या है?', a:'पीढ़ियों के बीच का अंतर', opts:['देशभक्ति','पीढ़ियों के बीच का अंतर','प्रकृति प्रेम','ऐतिहासिक घटना'], exp:'मनोहर श्याम जोशी की "सिल्वर वेडिंग" में पिता-पुत्र के बीच पीढ़ीगत अंतर और मूल्यों का द्वंद्व है।'},
    {q:'हिंदी में "रिपोर्ताज" किसे कहते हैं?', a:'आँखों देखी घटना का सजीव वर्णन', opts:['यात्रावृत्त','आँखों देखी घटना का सजीव वर्णन','उपन्यास की समीक्षा','काल्पनिक कहानी'], exp:'रिपोर्ताज में लेखक किसी घटना या स्थान का प्रत्यक्ष और सजीव शैली में वर्णन करता है।'},
    {q:'"फिराक गोरखपुरी" का असली नाम क्या था?', a:'रघुपति सहाय', opts:['रामप्रसाद बिस्मिल','रघुपति सहाय','सूर्यकांत त्रिपाठी','हरिवंशराय बच्चन'], exp:'फ़िराक गोरखपुरी का असली नाम रघुपति सहाय था। वे उर्दू के प्रसिद्ध कवि थे।'},
    {q:'"पहलवान की ढोलक" कहानी के लेखक कौन हैं?', a:'फणीश्वरनाथ रेणु', opts:['प्रेमचंद','यशपाल','फणीश्वरनाथ रेणु','मोहन राकेश'], exp:'"पहलवान की ढोलक" फणीश्वरनाथ रेणु की कहानी है जो एक पहलवान के संघर्ष और हिम्मत की कहानी है।'},
  ]},
];

async function main() {
  // Clear existing traditional quizzes
  await runSQL(`DELETE FROM quiz_questions WHERE quiz_id IN (SELECT id FROM quizzes WHERE quiz_type = 'traditional');`, 'clear-questions');
  await runSQL(`DELETE FROM quizzes WHERE quiz_type = 'traditional';`, 'clear-quizzes');

  let quizCount = 0;
  let questionCount = 0;

  for (const quiz of allQuizzes) {
    // Insert quiz
    const qResult = await runSQL(`
      INSERT INTO quizzes (title, description, subject_id, class_level, difficulty, duration_minutes, total_questions, passing_score, is_active, quiz_type)
      VALUES (
        '${esc(quiz.title)}',
        '${esc(quiz.desc)}',
        ${quiz.subject_id},
        ${quiz.class_level},
        '${quiz.difficulty}',
        ${quiz.questions.length * 2},
        ${quiz.questions.length},
        60,
        true,
        'traditional'
      ) RETURNING id;
    `, `quiz-${quiz.class_level}-${quiz.subject_id}`);

    const quizId = qResult[0].id;
    quizCount++;

    // Insert questions
    const qVals = quiz.questions.map((q, i) => {
      const opts = JSON.stringify(q.opts).replace(/'/g, "''");
      return `(${quizId}, '${esc(q.q)}', 'multiple_choice', '${esc(q.a)}', '${opts}', '${esc(q.exp)}', 1, ${i + 1})`;
    }).join(',\n');

    await runSQL(`
      INSERT INTO quiz_questions (quiz_id, question_text, question_type, correct_answer, options, explanation, points, order_index)
      VALUES ${qVals};
    `, `questions-${quizId}`);

    questionCount += quiz.questions.length;
  }

  console.log(`\n✅ Phase 2b complete: ${quizCount} quizzes, ${questionCount} questions seeded`);

  // Phase 2c: Add game quiz rows for more class levels
  console.log('\nPhase 2c: Expanding game coverage...');
  await runSQL(`
    INSERT INTO quizzes (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component)
    SELECT title, description, subject_id, category_id, 7, difficulty, duration_minutes, total_questions, quiz_type, game_component
    FROM quizzes WHERE game_component = 'pizza' AND class_level = 6
    ON CONFLICT DO NOTHING;
  `, 'game-pizza-class7');

  await runSQL(`
    INSERT INTO quizzes (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component)
    SELECT title, description, subject_id, category_id, 7, difficulty, duration_minutes, total_questions, quiz_type, game_component
    FROM quizzes WHERE game_component = 'nutrition' AND class_level = 6
    ON CONFLICT DO NOTHING;
  `, 'game-nutrition-class7');

  await runSQL(`
    INSERT INTO quizzes (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component)
    SELECT title, description, subject_id, category_id, 8, difficulty, duration_minutes, total_questions, quiz_type, game_component
    FROM quizzes WHERE game_component = 'photosynthesis' AND class_level = 7
    ON CONFLICT DO NOTHING;
  `, 'game-photosynthesis-class8');

  await runSQL(`
    INSERT INTO quizzes (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component)
    SELECT title, description, subject_id, category_id, 9, difficulty, duration_minutes, total_questions, quiz_type, game_component
    FROM quizzes WHERE game_component = 'equation-unlock' AND class_level = 8
    ON CONFLICT DO NOTHING;
  `, 'game-equation-class9');

  await runSQL(`
    INSERT INTO quizzes (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component)
    SELECT title, description, subject_id, category_id, 11, difficulty, duration_minutes, total_questions, quiz_type, game_component
    FROM quizzes WHERE game_component = 'circuit' AND class_level = 10
    ON CONFLICT DO NOTHING;
  `, 'game-circuit-class11');

  await runSQL(`
    INSERT INTO quizzes (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component)
    SELECT title, description, subject_id, category_id, 12, difficulty, duration_minutes, total_questions, quiz_type, game_component
    FROM quizzes WHERE game_component = 'circuit' AND class_level = 10
    ON CONFLICT DO NOTHING;
  `, 'game-circuit-class12');

  console.log('✅ Phase 2c complete: Game coverage expanded');
}

main().catch(e => { console.error(e); process.exit(1); });
