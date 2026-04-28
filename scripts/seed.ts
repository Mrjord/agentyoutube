import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { db } from '../lib/db';
import { users, searchKeywords } from '../lib/db/schema';
import { V1_USER_ID, V1_USER_EMAIL, SEED_KEYWORDS } from '../lib/constants';

async function seed() {
  console.log('Seeding database...');

  await db.insert(users).values({
    id: V1_USER_ID,
    email: V1_USER_EMAIL,
  }).onConflictDoNothing();
  console.log('  ✓ User created');

  for (const kw of SEED_KEYWORDS) {
    await db.insert(searchKeywords).values(kw).onConflictDoNothing();
  }
  console.log(`  ✓ ${SEED_KEYWORDS.length} keywords seeded`);

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
