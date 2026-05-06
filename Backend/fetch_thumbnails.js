require('dotenv').config();
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const lectures = require('./seed_data/diksha_videos.json');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Curated Wikipedia article titles per lecture topic keyword
const WIKI_TOPIC_MAP = {
  // Science Class 6-8
  'Food: Where Does It Come From':      'Food',
  'Motion and Measurement':             'Motion_(physics)',
  'Nutrition in Plants':                'Photosynthesis',
  'Respiration in Organisms':           'Cellular_respiration',
  'Crop Production':                    'Agriculture',
  'Cell Structure':                     'Cell_(biology)',
  // Science Class 9-10
  'Motion - Uniform':                   'Kinematics',
  'Force and Laws of Motion':           'Newton%27s_laws_of_motion',
  'Matter in Our Surroundings':         'States_of_matter',
  'Atoms and Molecules':                'Atom',
  'Life Processes - Nutrition':         'Digestion',
  "Electricity - Ohm's Law":            'Ohm%27s_law',
  'Chemical Reactions':                 'Chemical_reaction',
  'Acids Bases and Salts':              'Acid%E2%80%93base_reaction',
  // Mathematics
  'Knowing Our Numbers':                'Number',
  'Fractions':                          'Fraction',
  'Integers':                           'Integer',
  'Triangles':                          'Triangle',
  'Rational Numbers':                   'Rational_number',
  'Linear Equations':                   'Linear_equation',
  'Polynomials':                        'Polynomial',
  'Real Numbers':                       'Real_number',
  'Quadratic Equations':                'Quadratic_equation',
  // Social Science
  'Understanding Diversity':            'Multiculturalism',
  'Tracing Changes':                    'Medieval_India',
  'How When and Where History':         'Mughal_Empire',
  'Rise of Nationalism Europe':         'Nationalism',
  // Class 11
  'Units and Measurement':              'International_System_of_Units',
  'Laws of Motion Newton':              'Newton%27s_laws_of_motion',
  'Structure of Atom':                  'Atomic_theory',
  'Chemical Bonding':                   'Chemical_bond',
  'Cell The Unit of Life':              'Cell_(biology)',
  'Biomolecules':                       'Biomolecule',
  'Sets':                               'Set_(mathematics)',
  'Trigonometric Functions':            'Trigonometric_functions',
  // Class 12
  'Electric Charges Fields':            'Electric_field',
  'Electromagnetic Induction':          'Electromagnetic_induction',
  'Solutions':                          'Solution_(chemistry)',
  'Electrochemistry':                   'Electrochemistry',
  'Reproduction Flowering Plants':      'Flower',
  'Genetics Inheritance':               'Genetics',
  'Relations Functions':                'Function_(mathematics)',
  'Integrals Calculus':                 'Integral',
  // English / others
  'An Alien Hand':                      'Short_story',
};

function getWikiKey(title) {
  for (const [key, wiki] of Object.entries(WIKI_TOPIC_MAP)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return wiki;
  }
  return null;
}

function fetchWikiThumb(wikiTitle) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`;
    const req = https.get(url, { headers: { 'User-Agent': 'EdUmbrella/1.0 (educational app)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json?.thumbnail?.source || json?.originalimage?.source || null);
        } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // Load subject map
  const { data: subjects } = await supabase.from('subjects').select('id, name');
  const subjectMap = {};
  for (const s of subjects) subjectMap[s.name] = s.id;

  const SUBJECT_ALIASES = { 'Environmental Studies': 'Science', 'Social Studies': 'Social Science' };
  const norm = s => SUBJECT_ALIASES[s] || s;

  let updated = 0;

  for (const lec of lectures) {
    const wikiKey = getWikiKey(lec.title);
    if (!wikiKey) { console.log(`  skip (no wiki key): ${lec.title}`); continue; }

    const thumbUrl = await fetchWikiThumb(wikiKey);
    if (!thumbUrl) { console.log(`  skip (no wiki thumb): ${lec.title}`); continue; }

    // Update in DB
    const subjectId = subjectMap[norm(lec.subject)];
    if (!subjectId) continue;

    const { data: row } = await supabase
      .from('lectures')
      .select('id')
      .eq('class_level', lec.class_level)
      .eq('subject_id', subjectId)
      .eq('chapter_number', lec.chapter_no)
      .maybeSingle();

    if (!row) { console.log(`  not found in DB: Class ${lec.class_level} ${lec.subject} Ch${lec.chapter_no}`); continue; }

    await supabase.from('lectures').update({ thumbnail_url: thumbUrl }).eq('id', row.id);

    // Update local JSON too
    lec.thumbnail_url = thumbUrl;

    console.log(`  ✓ ${lec.title.slice(0,45)} → ${thumbUrl.slice(0,60)}`);
    updated++;
    await sleep(150);
  }

  // Save updated JSON
  require('fs').writeFileSync('./seed_data/diksha_videos.json', JSON.stringify(lectures, null, 2));
  console.log(`\nUpdated ${updated} thumbnails`);
}

main().catch(console.error);
