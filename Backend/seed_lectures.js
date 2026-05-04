require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const lectures = require('./seed_data/lectures.json');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

async function main() {
  console.log(`Seeding ${lectures.length} lectures...`);

  // Load subject name -> id map
  const { data: subjects, error: subErr } = await supabase
    .from('subjects')
    .select('id, name');
  if (subErr) { console.error('Failed to fetch subjects:', subErr.message); process.exit(1); }

  const subjectMap = {};
  for (const s of subjects) subjectMap[s.name] = s.id;

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const lec of lectures) {
    const subjectId = subjectMap[lec.subject];
    if (!subjectId) {
      console.warn(`  Subject not found: "${lec.subject}" — skipping`);
      skipped++;
      continue;
    }

    // Check if lecture already exists
    const { data: existing } = await supabase
      .from('lectures')
      .select('id')
      .eq('class_level', lec.class_level)
      .eq('subject_id', subjectId)
      .eq('chapter_number', lec.chapter_no)
      .maybeSingle();

    let lecRow = existing;
    if (!existing) {
      const { data: inserted, error: lecErr } = await supabase
        .from('lectures')
        .insert({
          subject_id: subjectId,
          class_level: lec.class_level,
          chapter_number: lec.chapter_no,
          title: lec.title,
          description: lec.description,
          duration_minutes: lec.duration_minutes,
          display_order: lec.chapter_no,
          is_active: true,
        })
        .select('id')
        .single();

      if (lecErr) {
        console.error(`  Error inserting "${lec.title}":`, lecErr.message);
        errors++;
        continue;
      }
      lecRow = inserted;
    }

    // Upsert lecture_videos rows for each language
    const videoEntries = Object.entries(lec.videos || {});
    if (videoEntries.length > 0) {
      const videoRows = videoEntries.map(([lang, ytId]) => ({
        lecture_id: lecRow.id,
        language: lang,
        youtube_video_id: ytId,
        is_default: lang === 'english',
      }));

      // Delete existing video rows for this lecture first, then re-insert
      await supabase.from('lecture_videos').delete().eq('lecture_id', lecRow.id);
      const { error: vidErr } = await supabase
        .from('lecture_videos')
        .insert(videoRows);

      if (vidErr) {
        console.error(`  Error inserting videos for "${lec.title}":`, vidErr.message);
      }
    }

    inserted++;
    if (inserted % 20 === 0) console.log(`  ${inserted} lectures seeded...`);
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}, Errors: ${errors}`);
}

main().catch(console.error);
