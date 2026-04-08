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
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${label}] Status: ${res.statusCode}`);
        if (res.statusCode >= 400) {
          console.error(`[${label}] Error:`, data.substring(0, 500));
          reject(new Error(`HTTP ${res.statusCode}`));
        } else {
          console.log(`[${label}] OK`);
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // Phase 1: Schema
  await runSQL(`
    INSERT INTO subjects (name, description, icon, color) VALUES
    ('Hindi', 'Hindi language and literature', 'hindi', 'from-pink-500 to-pink-700'),
    ('Social Science', 'History, Geography, Civics and Economics', 'social', 'from-amber-500 to-amber-700')
    ON CONFLICT (name) DO NOTHING;
  `, 'add-subjects');

  await runSQL(`
    CREATE TABLE IF NOT EXISTS public.class_level_subjects (
      id SERIAL PRIMARY KEY,
      class_level INT NOT NULL CHECK (class_level BETWEEN 6 AND 12),
      subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      display_order INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(class_level, subject_id)
    );
  `, 'create-class-level-subjects');

  await runSQL(`ALTER TABLE class_level_subjects ENABLE ROW LEVEL SECURITY;`, 'rls-cls');
  await runSQL(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='class_level_subjects' AND policyname='Public read class_level_subjects') THEN
        CREATE POLICY "Public read class_level_subjects" ON class_level_subjects FOR SELECT USING (true);
      END IF;
    END $$;
  `, 'policy-cls');
  await runSQL(`CREATE INDEX IF NOT EXISTS idx_cls_class_level ON class_level_subjects(class_level);`, 'index-cls');

  await runSQL(`
    CREATE TABLE IF NOT EXISTS public.lectures (
      id SERIAL PRIMARY KEY,
      subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      class_level INT NOT NULL CHECK (class_level BETWEEN 6 AND 12),
      chapter_number INT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      cbse_chapter VARCHAR(255),
      duration_minutes INT DEFAULT 30,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'create-lectures');

  await runSQL(`ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;`, 'rls-lectures');
  await runSQL(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='lectures' AND policyname='Public read lectures') THEN
        CREATE POLICY "Public read lectures" ON lectures FOR SELECT USING (is_active = true);
      END IF;
    END $$;
  `, 'policy-lectures');
  await runSQL(`CREATE INDEX IF NOT EXISTS idx_lectures_subject_class ON lectures(subject_id, class_level);`, 'index-lectures-1');
  await runSQL(`CREATE INDEX IF NOT EXISTS idx_lectures_class_level ON lectures(class_level);`, 'index-lectures-2');

  // Seed class_level_subjects
  await runSQL(`
    INSERT INTO class_level_subjects (class_level, subject_id, display_order)
    SELECT t.lvl, s.id, t.ord FROM (VALUES
      (6,'Mathematics',1),(6,'Science',2),(6,'Social Science',3),(6,'English',4),(6,'Hindi',5),
      (7,'Mathematics',1),(7,'Science',2),(7,'Social Science',3),(7,'English',4),(7,'Hindi',5),
      (8,'Mathematics',1),(8,'Science',2),(8,'Social Science',3),(8,'English',4),(8,'Hindi',5),
      (9,'Mathematics',1),(9,'Science',2),(9,'Social Science',3),(9,'English',4),(9,'Hindi',5),
      (10,'Mathematics',1),(10,'Science',2),(10,'Social Science',3),(10,'English',4),(10,'Hindi',5),
      (11,'Mathematics',1),(11,'Physics',2),(11,'Chemistry',3),(11,'Biology',4),(11,'English',5),
      (12,'Mathematics',1),(12,'Physics',2),(12,'Chemistry',3),(12,'Biology',4),(12,'English',5)
    ) AS t(lvl, sname, ord)
    JOIN subjects s ON s.name = t.sname
    ON CONFLICT (class_level, subject_id) DO NOTHING;
  `, 'seed-class-level-subjects');

  console.log('\n✅ Phase 1 complete: Schema + class-subject mapping done');
}

main().catch(e => { console.error(e); process.exit(1); });
