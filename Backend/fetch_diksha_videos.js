require('dotenv').config();
const https = require('https');

// DIKSHA search configuration
const CLASSES = [6, 7, 8, 9, 10, 11, 12];

const CLASS_SUBJECTS = {
  6:  ['Science', 'Mathematics', 'Social Science', 'English'],
  7:  ['Science', 'Mathematics', 'Social Science', 'English'],
  8:  ['Science', 'Mathematics', 'Social Science', 'English'],
  9:  ['Science', 'Mathematics', 'Social Science', 'English'],
  10: ['Science', 'Mathematics', 'Social Science', 'English'],
  11: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
  12: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
};

const SUBJECT_TOPICS = {
  'Science':        ['Food', 'Motion', 'Nutrition', 'Respiration', 'Cell', 'Light', 'Force', 'Life Processes', 'Electricity', 'Chemical Reactions'],
  'Mathematics':    ['Number System', 'Fractions', 'Integers', 'Algebra', 'Geometry', 'Triangle', 'Quadrilateral', 'Statistics', 'Probability', 'Real Numbers'],
  'Social Science': ['History', 'Geography', 'Civics', 'Resources', 'Democracy', 'Climate', 'Diversity'],
  'English':        ['Grammar', 'Comprehension', 'Writing', 'Literature'],
  'Physics':        ['Motion', 'Laws of Motion', 'Work Energy', 'Gravitation', 'Thermodynamics', 'Waves', 'Optics'],
  'Chemistry':      ['Structure of Atom', 'Chemical Bonding', 'States of Matter', 'Electrochemistry', 'Organic Chemistry'],
  'Biology':        ['Cell', 'Genetics', 'Evolution', 'Human Physiology', 'Plant Physiology', 'Reproduction'],
};

function httpPost(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'Mozilla/5.0',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve(null); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve(null); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function searchDiksha(classLevel, subject, medium) {
  const gradeLabel = `Class ${classLevel}`;
  try {
    const result = await httpPost('https://diksha.gov.in/api/content/v1/search', {
      request: {
        filters: {
          contentType: ['ExplanationResource'],
          mimeType: ['video/mp4'],
          medium: [medium],
          gradeLevel: [gradeLabel],
          subject: [subject],
          status: ['Live'],
        },
        fields: ['name', 'gradeLevel', 'subject', 'medium', 'artifactUrl', 'posterImage', 'identifier', 'streamingUrl'],
        limit: 10,
        sort_by: { 'me_totalPlaySessionCount.portal': 'desc' },
      }
    });
    const contents = result?.result?.content || [];
    // Filter: must have a direct MP4 artifactUrl
    return contents.filter(c => c.artifactUrl && c.artifactUrl.includes('.mp4'));
  } catch(e) {
    return [];
  }
}

async function main() {
  const catalog = {}; // { "class_subject": { hindi: [...], english: [...] } }

  for (const classLevel of CLASSES) {
    const subjects = CLASS_SUBJECTS[classLevel];
    for (const subject of subjects) {
      const key = `${classLevel}_${subject}`;
      console.log(`Fetching Class ${classLevel} ${subject}...`);

      const [hindiResults, englishResults] = await Promise.all([
        searchDiksha(classLevel, subject, 'Hindi'),
        searchDiksha(classLevel, subject, 'English'),
      ]);

      catalog[key] = {
        classLevel,
        subject,
        hindi: hindiResults.slice(0, 2),
        english: englishResults.slice(0, 2),
      };

      console.log(`  Hindi: ${hindiResults.length}, English: ${englishResults.length}`);
      await sleep(300); // be nice to the API
    }
  }

  // Now build seed-friendly structure: group by (class, subject, chapter)
  const lectures = [];

  for (const [key, data] of Object.entries(catalog)) {
    const { classLevel, subject } = data;
    const allVideos = [];

    // Pair english[i] with hindi[i] as language variants of same lecture
    const maxPairs = Math.max(data.english.length, data.hindi.length, 0);
    for (let i = 0; i < Math.min(maxPairs, 2); i++) {
      const eng = data.english[i];
      const hin = data.hindi[i];
      const primary = eng || hin;
      if (!primary) continue;

      const lecture = {
        class_level: classLevel,
        subject,
        chapter_no: i + 1,
        title: (eng?.name || hin?.name || '').replace(/\s*\|\s*Hindi\s*/i, '').replace(/\s*\|\s*English\s*/i, '').trim(),
        description: `NCERT CBSE ${subject} for Class ${classLevel}`,
        duration_minutes: 15,
        thumbnail_url: (eng?.posterImage || hin?.posterImage || ''),
        videos: {},
      };

      if (eng?.artifactUrl) lecture.videos.english = eng.artifactUrl;
      if (hin?.artifactUrl) lecture.videos.hindi = hin.artifactUrl;

      // Cross-link: if one is missing, use the other as fallback with note
      if (!lecture.videos.english && lecture.videos.hindi) {
        lecture.videos.english = lecture.videos.hindi;
      }

      if (Object.keys(lecture.videos).length > 0) {
        lectures.push(lecture);
      }
    }
  }

  const fs = require('fs');
  fs.writeFileSync('./seed_data/diksha_videos.json', JSON.stringify(lectures, null, 2));
  console.log(`\nSaved ${lectures.length} lectures to seed_data/diksha_videos.json`);
}

main().catch(console.error);
