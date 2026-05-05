require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const dikshaVideos = require('./seed_data/diksha_videos.json');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Normalize subject names to match what's in the DB subjects table
const SUBJECT_ALIASES = {
  'Environmental Studies': 'Science',
  'Social Studies': 'Social Science',
  'Maths': 'Mathematics',
};

function normalizeSubject(s) {
  return SUBJECT_ALIASES[s] || s;
}

async function main() {
  // Load subjects map
  const { data: subjects, error: subErr } = await supabase.from('subjects').select('id, name');
  if (subErr) { console.error('Failed to fetch subjects:', subErr.message); process.exit(1); }
  const subjectMap = {};
  for (const s of subjects) subjectMap[s.name] = s.id;

  console.log('Available subjects:', Object.keys(subjectMap).join(', '));

  let inserted = 0, skipped = 0, errors = 0;

  for (const lec of dikshaVideos) {
    const subjectName = normalizeSubject(lec.subject);
    const subjectId = subjectMap[subjectName];
    if (!subjectId) {
      console.warn(`  Subject not found: "${lec.subject}" (normalized: "${subjectName}") — skipping`);
      skipped++;
      continue;
    }

    // Upsert lecture row
    const { data: existing } = await supabase
      .from('lectures')
      .select('id')
      .eq('class_level', lec.class_level)
      .eq('subject_id', subjectId)
      .eq('chapter_number', lec.chapter_no)
      .maybeSingle();

    let lectureId;
    if (existing) {
      // Update thumbnail if provided
      if (lec.thumbnail_url) {
        await supabase.from('lectures').update({ thumbnail_url: lec.thumbnail_url, title: lec.title }).eq('id', existing.id);
      }
      lectureId = existing.id;
    } else {
      const { data: newLec, error: insErr } = await supabase
        .from('lectures')
        .insert({
          subject_id: subjectId,
          class_level: lec.class_level,
          chapter_number: lec.chapter_no,
          title: lec.title,
          description: lec.description,
          duration_minutes: lec.duration_minutes || 15,
          display_order: lec.chapter_no,
          thumbnail_url: lec.thumbnail_url || null,
          is_active: true,
        })
        .select('id')
        .single();

      if (insErr) {
        console.error(`  Error inserting "${lec.title}":`, insErr.message);
        errors++;
        continue;
      }
      lectureId = newLec.id;
    }

    // Delete old video rows and re-insert
    await supabase.from('lecture_videos').delete().eq('lecture_id', lectureId);

    const videoRows = [];
    for (const [lang, url] of Object.entries(lec.videos || {})) {
      if (!url) continue;
      videoRows.push({
        lecture_id: lectureId,
        language: lang,
        video_url: url,
        youtube_video_id: null,
        subtitle_urls: null,
        is_default: lang === 'english',
      });
    }

    if (videoRows.length > 0) {
      const { error: vidErr } = await supabase.from('lecture_videos').insert(videoRows);
      if (vidErr) {
        console.error(`  Error inserting videos for "${lec.title}":`, vidErr.message);
        errors++;
        continue;
      }
    }

    inserted++;
    console.log(`  ✓ Class ${lec.class_level} ${subjectName} Ch${lec.chapter_no}: ${lec.title.slice(0, 50)} [${Object.keys(lec.videos).join(', ')}]`);
  }

  console.log(`\nDone! Inserted/updated: ${inserted}, Skipped: ${skipped}, Errors: ${errors}`);
}

main().catch(console.error);
