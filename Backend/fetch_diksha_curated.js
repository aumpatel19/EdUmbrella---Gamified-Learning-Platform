require('dotenv').config();
const https = require('https');
const fs = require('fs');

// Curated Hindi do_ids sourced from KV library pages (verified real CBSE content)
const CURATED_HINDI = [
  // Class 6 Science
  { id: 'do_3130136194542714881156', class: 6, subject: 'Science', ch: 1, topic: 'Food: Where Does It Come From' },
  { id: 'do_3130136206122762241135', class: 6, subject: 'Science', ch: 10, topic: 'Motion and Measurement of Distances' },
  // Class 7 Science
  { id: 'do_3130347774434508801107', class: 7, subject: 'Science', ch: 1, topic: 'Nutrition in Plants' },
  { id: 'do_3130461125647564801436', class: 7, subject: 'Science', ch: 10, topic: 'Respiration in Organisms' },
  // Class 8 Science
  { id: 'do_3130894448126771201734', class: 8, subject: 'Science', ch: 1, topic: 'Crop Production and Management' },
  { id: 'do_313090081336451072197',  class: 8, subject: 'Science', ch: 8, topic: 'Cell Structure and Functions' },
  // Class 9 Science
  { id: 'do_3130580824387993601822', class: 9, subject: 'Science', ch: 8, topic: 'Motion - Uniform and Non-Uniform' },
  { id: 'do_3130580826331709441875', class: 9, subject: 'Science', ch: 9, topic: 'Force and Laws of Motion' },
  { id: 'do_3130986545253007361179', class: 9, subject: 'Science', ch: 1, topic: 'Matter in Our Surroundings' },
  { id: 'do_3130986559923978241135', class: 9, subject: 'Science', ch: 3, topic: 'Atoms and Molecules' },
  // Class 10 Science
  { id: 'do_3130580839856128001357', class: 10, subject: 'Science', ch: 6, topic: 'Life Processes - Nutrition' },
  { id: 'do_3130580852193116161881', class: 10, subject: "Science", ch: 12, topic: "Electricity - Ohm's Law" },
  { id: 'do_3130986570428170241182', class: 10, subject: 'Science', ch: 1, topic: 'Chemical Reactions and Equations' },
  { id: 'do_3130986575169372161280', class: 10, subject: 'Science', ch: 2, topic: 'Acids Bases and Salts' },
];

// Topics to search for per class/subject (English + Hindi medium)
const SEARCH_TARGETS = [
  // Class 6
  { class: 6, subject: 'Mathematics',    keyword: 'Knowing Our Numbers' },
  { class: 6, subject: 'Mathematics',    keyword: 'Fractions' },
  { class: 6, subject: 'Social Science', keyword: 'Understanding Diversity' },
  { class: 6, subject: 'Social Science', keyword: 'Globe Latitudes Longitudes' },
  { class: 6, subject: 'English',        keyword: 'Grammar Writing' },
  // Class 7
  { class: 7, subject: 'Mathematics',    keyword: 'Integers' },
  { class: 7, subject: 'Mathematics',    keyword: 'Triangles' },
  { class: 7, subject: 'Social Science', keyword: 'Tracing Changes Through Thousand Years' },
  { class: 7, subject: 'English',        keyword: 'An Alien Hand' },
  // Class 8
  { class: 8, subject: 'Mathematics',    keyword: 'Rational Numbers' },
  { class: 8, subject: 'Mathematics',    keyword: 'Linear Equations' },
  { class: 8, subject: 'Social Science', keyword: 'How When and Where History' },
  { class: 8, subject: 'English',        keyword: 'Honeydew Grammar' },
  // Class 9
  { class: 9, subject: 'Mathematics',    keyword: 'Number System Real Numbers' },
  { class: 9, subject: 'Mathematics',    keyword: 'Polynomials' },
  { class: 9, subject: 'Social Science', keyword: 'French Revolution' },
  { class: 9, subject: 'English',        keyword: 'Beehive Grammar' },
  // Class 10
  { class: 10, subject: 'Mathematics',    keyword: 'Real Numbers' },
  { class: 10, subject: 'Mathematics',    keyword: 'Quadratic Equations' },
  { class: 10, subject: 'Social Science', keyword: 'Rise of Nationalism Europe' },
  { class: 10, subject: 'English',        keyword: 'First Flight Grammar' },
  // Class 11
  { class: 11, subject: 'Physics',     keyword: 'Units and Measurement' },
  { class: 11, subject: 'Physics',     keyword: 'Laws of Motion Newton' },
  { class: 11, subject: 'Chemistry',   keyword: 'Structure of Atom' },
  { class: 11, subject: 'Chemistry',   keyword: 'Chemical Bonding' },
  { class: 11, subject: 'Biology',     keyword: 'Cell The Unit of Life' },
  { class: 11, subject: 'Biology',     keyword: 'Biomolecules' },
  { class: 11, subject: 'Mathematics', keyword: 'Sets' },
  { class: 11, subject: 'Mathematics', keyword: 'Trigonometric Functions' },
  { class: 11, subject: 'English',     keyword: 'Hornbill Grammar' },
  // Class 12
  { class: 12, subject: 'Physics',     keyword: 'Electric Charges Fields' },
  { class: 12, subject: 'Physics',     keyword: 'Electromagnetic Induction' },
  { class: 12, subject: 'Chemistry',   keyword: 'Solutions' },
  { class: 12, subject: 'Chemistry',   keyword: 'Electrochemistry' },
  { class: 12, subject: 'Biology',     keyword: 'Reproduction Flowering Plants' },
  { class: 12, subject: 'Biology',     keyword: 'Genetics Inheritance' },
  { class: 12, subject: 'Mathematics', keyword: 'Relations Functions' },
  { class: 12, subject: 'Mathematics', keyword: 'Integrals Calculus' },
  { class: 12, subject: 'English',     keyword: 'Flamingo Grammar' },
];

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(15000, () => { req.destroy(); resolve(null); });
  });
}

function httpPost(data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'diksha.gov.in',
      path: '/api/content/v1/search',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'User-Agent': 'Mozilla/5.0' },
    };
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(15000, () => { req.destroy(); resolve(null); });
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchById(id) {
  const res = await httpGet(`https://diksha.gov.in/api/content/v1/read/${id}`);
  return res?.result?.content || null;
}

async function searchByTopic(classLevel, subject, keyword, medium) {
  const res = await httpPost({
    request: {
      query: keyword,
      filters: {
        contentType: ['ExplanationResource'],
        mimeType: ['video/mp4'],
        medium: [medium],
        gradeLevel: [`Class ${classLevel}`],
        subject: [subject],
        status: ['Live'],
      },
      fields: ['name', 'gradeLevel', 'subject', 'medium', 'artifactUrl', 'posterImage', 'identifier'],
      limit: 5,
    }
  });
  const items = (res?.result?.content || []).filter(c =>
    c.artifactUrl && c.artifactUrl.includes('.mp4') &&
    !c.name.includes('निर्देशक') && !c.name.includes('SCERT') &&
    !c.name.includes('सुनो सुनाओ')
  );
  return items[0] || null;
}

async function main() {
  const lectures = []; // final output

  // ── Step 1: fetch curated Hindi IDs ──
  console.log('Fetching curated Hindi DIKSHA videos...');
  const hindiCache = {};
  for (const item of CURATED_HINDI) {
    const content = await fetchById(item.id);
    if (content?.artifactUrl) {
      const key = `${item.class}_${item.subject}_${item.ch}`;
      hindiCache[key] = { ...item, artifactUrl: content.artifactUrl, posterImage: content.posterImage, name: content.name };
      console.log(`  ✓ Class ${item.class} ${item.subject} Ch${item.ch}`);
    }
    await sleep(200);
  }

  // ── Step 2: for each curated Hindi video, find English counterpart ──
  console.log('\nFinding English counterparts for curated Hindi videos...');
  const englishCache = {};
  for (const item of CURATED_HINDI) {
    const key = `${item.class}_${item.subject}_${item.ch}`;
    const eng = await searchByTopic(item.class, item.subject, item.topic, 'English');
    if (eng) {
      englishCache[key] = eng;
      console.log(`  ✓ EN ${item.class} ${item.subject} Ch${item.ch}: ${eng.name.slice(0,50)}`);
    }
    await sleep(300);
  }

  // ── Step 3: build lectures from curated data ──
  const usedKeys = new Set();
  for (const item of CURATED_HINDI) {
    const key = `${item.class}_${item.subject}_${item.ch}`;
    const hin = hindiCache[key];
    const eng = englishCache[key];
    if (!hin && !eng) continue;
    usedKeys.add(key);

    const lecture = {
      class_level: item.class,
      subject: item.subject,
      chapter_no: item.ch,
      title: item.topic,
      description: `NCERT CBSE ${item.subject} Class ${item.class} - ${item.topic}`,
      duration_minutes: 15,
      thumbnail_url: (eng?.posterImage || hin?.posterImage || ''),
      videos: {},
    };
    if (eng?.artifactUrl) lecture.videos.english = eng.artifactUrl;
    if (hin?.artifactUrl) lecture.videos.hindi = hin.artifactUrl;
    // If only one language, duplicate as fallback
    if (lecture.videos.english && !lecture.videos.hindi) lecture.videos.hindi = lecture.videos.english;
    if (!lecture.videos.english && lecture.videos.hindi) lecture.videos.english = lecture.videos.hindi;
    lectures.push(lecture);
  }

  // ── Step 4: search-based lectures for Math, SSt, Physics, Chemistry, Biology, English ──
  console.log('\nFetching search-based lectures...');
  const searchGroups = {};
  for (const t of SEARCH_TARGETS) {
    const key = `${t.class}_${t.subject}`;
    if (!searchGroups[key]) searchGroups[key] = [];
    searchGroups[key].push(t);
  }

  for (const [key, targets] of Object.entries(searchGroups)) {
    for (let i = 0; i < Math.min(targets.length, 2); i++) {
      const t = targets[i];
      const [eng, hin] = await Promise.all([
        searchByTopic(t.class, t.subject, t.keyword, 'English'),
        searchByTopic(t.class, t.subject, t.keyword, 'Hindi'),
      ]);
      const primary = eng || hin;
      if (!primary) { console.log(`  ✗ No result: Class ${t.class} ${t.subject} "${t.keyword}"`); continue; }

      const chKey = `${t.class}_${t.subject}_search${i+1}`;
      if (usedKeys.has(chKey)) continue;
      usedKeys.add(chKey);

      const lecture = {
        class_level: t.class,
        subject: t.subject,
        chapter_no: 10 + i, // offset to avoid conflict with Science chapters
        title: t.keyword,
        description: `NCERT CBSE ${t.subject} Class ${t.class} - ${t.keyword}`,
        duration_minutes: 15,
        thumbnail_url: (eng?.posterImage || hin?.posterImage || ''),
        videos: {},
      };
      if (eng?.artifactUrl) lecture.videos.english = eng.artifactUrl;
      if (hin?.artifactUrl) lecture.videos.hindi = hin.artifactUrl;
      if (lecture.videos.english && !lecture.videos.hindi) lecture.videos.hindi = lecture.videos.english;
      if (!lecture.videos.english && lecture.videos.hindi) lecture.videos.english = lecture.videos.hindi;

      if (Object.keys(lecture.videos).length > 0) {
        lectures.push(lecture);
        console.log(`  ✓ Class ${t.class} ${t.subject}: ${t.keyword}`);
      }
      await sleep(300);
    }
  }

  // ── Output ──
  fs.writeFileSync('./seed_data/diksha_videos.json', JSON.stringify(lectures, null, 2));
  console.log(`\nDone! ${lectures.length} lectures saved to seed_data/diksha_videos.json`);

  // Summary by class
  const byClass = {};
  for (const l of lectures) {
    const k = `Class ${l.class_level}`;
    if (!byClass[k]) byClass[k] = {};
    if (!byClass[k][l.subject]) byClass[k][l.subject] = 0;
    byClass[k][l.subject]++;
  }
  for (const [cls, subs] of Object.entries(byClass)) {
    console.log(`${cls}: ${Object.entries(subs).map(([s,n]) => `${s}(${n})`).join(', ')}`);
  }
}

main().catch(console.error);
