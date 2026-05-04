/**
 * Seed lectures and lecture_videos into Supabase.
 * Run: node seed_lectures.js
 *
 * Requires .env (or Frontend/.env) with:
 *   REACT_APP_SUPABASE_URL=https://...
 *   REACT_APP_SUPABASE_ANON_KEY=...
 *   SUPABASE_SERVICE_KEY=...  (recommended for seeding to bypass RLS)
 */

require('dotenv').config({ path: './Frontend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL / REACT_APP_SUPABASE_URL or key in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// YouTube video IDs by (class_level, subject, chapter_no)
// Key format: `${class_level}-${subject}-${chapter_no}`
// Videos object: { english: 'videoId', hindi: 'videoId', ... }
// These IDs should be replaced with real curated YouTube video IDs.
// Sources: NCERT official, Magnet Brains, LearnoHub, Physics Wallah, Khan Academy India
const videoMap = {
  // CLASS 6 MATHEMATICS
  '6-Mathematics-1':  { english: 'OmJ-4B-mS-Y', hindi: 'KMRzM_Mk6JE' },
  '6-Mathematics-2':  { english: 'bQTSMXK93ME', hindi: 'Ck2DKACD6Xs' },
  '6-Mathematics-3':  { english: 'rnbUiXwlpAo', hindi: 'pNMzqPWIr7E' },
  '6-Mathematics-4':  { english: 'gE-YDSMjZj4', hindi: 'sHY3G_g5vNQ' },
  '6-Mathematics-5':  { english: 'nLknkBiMzb4', hindi: 'aUnRKL6Z1_U' },
  '6-Mathematics-6':  { english: '9tvbBbDJiQE', hindi: 'KLVQ6jm4nzQ' },
  '6-Mathematics-7':  { english: 'n0FZhQ_GkKw', hindi: 'mKGJW5yHMUk' },
  '6-Mathematics-8':  { english: 'lGQKWaRYFVM', hindi: 'Bt4EMKPKSuQ' },
  '6-Mathematics-9':  { english: 'gFjEEaRMqOA', hindi: 'yWlSCJzomSo' },
  '6-Mathematics-10': { english: 'KoZyq8bJaOs', hindi: 'IJKL1234568' },
  '6-Mathematics-11': { english: 'l3XzepN03KQ', hindi: 'pq_z2ZbbXcA' },
  '6-Mathematics-12': { english: 'H6NUq1FKDSI', hindi: 'RvFO-Hs8pTw' },
  '6-Mathematics-13': { english: 'Rn3Ow7f8e7w', hindi: 'wgWpM-7PKRY' },
  '6-Mathematics-14': { english: 'gE-YDSMjZj4', hindi: '4mE6ABCD999' },

  // CLASS 6 SCIENCE
  '6-Science-1':  { english: 'T2H6rVDMq6c', hindi: 'mE3T1XFTF7Y' },
  '6-Science-2':  { english: 'eTxTOerFJcU', hindi: 'QKRUiSbxzS4' },
  '6-Science-3':  { english: 'YwLd77DKWNU', hindi: 'L0OlOm4VGGY' },
  '6-Science-4':  { english: 'bq6u-9D4qJw', hindi: 'IuaBm5Ri4aU' },
  '6-Science-5':  { english: 'yt7IukFC56o', hindi: 'cknqHXOCO8Y' },
  '6-Science-6':  { english: 'L4jK2DKMQCA', hindi: 'bYIJx6U4rao' },
  '6-Science-7':  { english: 'SIfk5uPL88E', hindi: 'JR3eLJk4l_s' },
  '6-Science-8':  { english: 'VEwkrFkSIbY', hindi: 'bKlCHWcq5Cg' },
  '6-Science-9':  { english: 'fkGCLIQx1MI', hindi: '9mJ6ABCD999' },
  '6-Science-10': { english: 'gE_YD9ABCDE', hindi: 'Vm66ABCD999' },
  '6-Science-11': { english: '5gGLkfbhvBs', hindi: 'ABCD9999444' },
  '6-Science-12': { english: 'nJ2b9ABCDEF', hindi: 'MmN6ABCD999' },
  '6-Science-13': { english: 'ABCD9999777', hindi: 'ABCD9999888' },
  '6-Science-14': { english: 'DpHtlxGtyp8', hindi: '9mJ6ABCD999' },
  '6-Science-15': { english: 'EcEBKCJv2Lw', hindi: 'EcEBKCJv2Lw' },
  '6-Science-16': { english: 'CjLHZtMDM_Y', hindi: 'AmK6ABCD999' },

  // CLASS 6 SOCIAL SCIENCE
  '6-Social Science-1':  { english: 'WYCrLrm4-L0', hindi: '6aRdz-XKqnA' },
  '6-Social Science-2':  { english: 'IHdwRhCj1to', hindi: '6M7W_8X4RJM' },
  '6-Social Science-3':  { english: 'SifTQiYvuBY', hindi: 'gS1U5SP4bBs' },
  '6-Social Science-4':  { english: '9wRaEf7ABWY', hindi: 'nklLjWxmgTA' },
  '6-Social Science-5':  { english: '2Y7v_XBJFfA', hindi: 'E4OqWqnoCPs' },
  '6-Social Science-6':  { english: 'Yocja_N5s2Y', hindi: 'MlpLCjMp20Y' },
  '6-Social Science-7':  { english: 'zfT4bwt3VQk', hindi: '8kC3hVjSq2A' },
  '6-Social Science-8':  { english: '8Nn5uqE3C9w', hindi: 'ABCD1234567' },
  '6-Social Science-9':  { english: '3XK8cFi6bIo', hindi: 'm5H6VBOy4nA' },
  '6-Social Science-10': { english: 'FyQLVHZEfuA', hindi: '9BcVnDqVkrA' },

  // CLASS 6 ENGLISH
  '6-English-1': { english: '2yBge4bJnkA', hindi: 'YPNp1y7KzZA' },
  '6-English-2': { english: 'lGQKWaRYFVM', hindi: 'CjPeXBlNpIo' },
  '6-English-3': { english: 'T2Kqs1z7XdQ', hindi: '8bCUx6u2QYo' },
  '6-English-4': { english: 'QzJ9ZrLFPMk', hindi: 'fVyMGSjv8no' },
  '6-English-5': { english: 'JxWmDuYQvJs', hindi: 'TpkXWzm0yiA' },
  '6-English-6': { english: 'nIMYaS6uZkA', hindi: 'ABCD7654321' },
  '6-English-7': { english: 'FyQLVHZEfuA', hindi: '9BcVnDqVkrA' },
  '6-English-8': { english: '3XK8cFi6bIo', hindi: 'm5H6VBOy4nA' },

  // CLASS 6 HINDI
  '6-Hindi-1': { hindi: '9mPDjFxNAMI' },
  '6-Hindi-2': { hindi: 'K1BcWJPxYB4' },
  '6-Hindi-3': { hindi: 'VHt7XzAdtbA' },
  '6-Hindi-4': { hindi: 'MNOP1234567' },
  '6-Hindi-5': { hindi: 'QRST9876543' },
  '6-Hindi-6': { hindi: 'UVWX5432109' },
  '6-Hindi-7': { hindi: 'YZAB1234560' },
  '6-Hindi-8': { hindi: 'CDEF9876540' },

  // CLASS 7 MATHEMATICS
  '7-Mathematics-1':  { english: 'q7T_6m7YWVE', hindi: 'EHpDNMb2lf4' },
  '7-Mathematics-2':  { english: 'H6NUq1FKDSI', hindi: 'RvFO-Hs8pTw' },
  '7-Mathematics-3':  { english: 'gFjEEaRMqOA', hindi: 'yWlSCJzomSo' },
  '7-Mathematics-4':  { english: 'l3XzepN03KQ', hindi: 'pq_z2ZbbXcA' },
  '7-Mathematics-5':  { english: 'Rn3Ow7f8e7w', hindi: 'wgWpM-7PKRY' },
  '7-Mathematics-6':  { english: 'IvLpN1G9Wr8', hindi: 'ABCD1234568' },
  '7-Mathematics-7':  { english: 'vLEjCBCE5W4', hindi: 'EFGH1234568' },
  '7-Mathematics-8':  { english: 'KoZyq8bJaOs', hindi: 'IJKL1234568' },
  '7-Mathematics-9':  { english: '0SBYPYFqkDY', hindi: '1mB6ABCD999' },
  '7-Mathematics-10': { english: 'gE-YDSMjZj4', hindi: '4mE6ABCD999' },
  '7-Mathematics-11': { english: 'nLknkBiMzb4', hindi: 'aUnRKL6Z1_U' },
  '7-Mathematics-12': { english: 'ybNsYPZCQGk', hindi: 'ImS6ABCD999' },
  '7-Mathematics-13': { english: 'EgZILNMwZAA', hindi: 'HmR6ABCD999' },
  '7-Mathematics-14': { english: 'Rn3Ow7f8e7w', hindi: 'LmV6ABCD999' },
  '7-Mathematics-15': { english: 'nLknkBiMzb4', hindi: 'NmX6ABCD999' },

  // CLASS 7 SCIENCE
  '7-Science-1':  { english: 'RSBtBHi4arM', hindi: 'ABCD9999111' },
  '7-Science-2':  { english: 'FqW8dOyCfN4', hindi: 'ABCD9999222' },
  '7-Science-3':  { english: 'I5NpteSIBm0', hindi: 'ABCD9999333' },
  '7-Science-4':  { english: '5gGLkfbhvBs', hindi: 'ABCD9999444' },
  '7-Science-5':  { english: 'WVqO0hjbHfQ', hindi: 'ABCD9999555' },
  '7-Science-6':  { english: 'VDePLWRLMXo', hindi: 'ABCD9999666' },
  '7-Science-7':  { english: 'fkGCLIQx1MI', hindi: 'ABCD9999777' },
  '7-Science-8':  { english: 'EcEBKCJv2Lw', hindi: 'ABCD9999888' },
  '7-Science-9':  { english: 'DpHtlxGtyp8', hindi: 'ABCD9999999' },
  '7-Science-10': { english: 'FqW8dOyCfN4', hindi: 'JmK6ABCD999' },
  '7-Science-11': { english: 'ABCD_CTRL_01', hindi: 'KmL6ABCD999' },
  '7-Science-12': { english: 'ABCD_REPR_01', hindi: 'LmM6ABCD999' },
  '7-Science-13': { english: 'gE_YD9ABCDE', hindi: 'Vm66ABCD999' },
  '7-Science-14': { english: 'nJ2b9ABCDEF', hindi: 'MmN6ABCD999' },
  '7-Science-15': { english: 'SIfk5uPL88E', hindi: 'FmP6ABCD999' },
  '7-Science-16': { english: 'DpHtlxGtyp8', hindi: '9mJ6ABCD999' },
  '7-Science-17': { english: 'SIfk5uPL88E', hindi: 'FmP6ABCD999' },
  '7-Science-18': { english: 'yt7IukFC56o', hindi: 'cknqHXOCO8Y' },

  // CLASS 8 MATHEMATICS
  '8-Mathematics-1':  { english: '0SBYPYFqkDY', hindi: '1mB6ABCD999' },
  '8-Mathematics-2':  { english: 'l3XzepN03KQ', hindi: '2mC6ABCD999' },
  '8-Mathematics-3':  { english: 'nLknkBiMzb4', hindi: '3mD6ABCD999' },
  '8-Mathematics-4':  { english: 'gFjEEaRMqOA', hindi: '5mF6ABCD999' },
  '8-Mathematics-5':  { english: 'mMsj-p9ABCD', hindi: '6mG6ABCD999' },
  '8-Mathematics-6':  { english: 'nNsj-p9ABCE', hindi: '7mH6ABCD999' },
  '8-Mathematics-7':  { english: 'KoZyq8bJaOs', hindi: '8mI6ABCD999' },
  '8-Mathematics-8':  { english: 'ybNsYPZCQGk', hindi: 'ImS6ABCD999' },
  '8-Mathematics-9':  { english: 'nLknkBiMzb4', hindi: 'NmX6ABCD999' },
  '8-Mathematics-10': { english: 'EgZILNMwZAA', hindi: 'HmR6ABCD999' },
  '8-Mathematics-11': { english: 'H6NUq1FKDSI', hindi: 'RvFO-Hs8pTw' },
  '8-Mathematics-12': { english: 'ybNsYPZCQGk', hindi: 'ImS6ABCD999' },
  '8-Mathematics-13': { english: 'gFjEEaRMqOA', hindi: 'yWlSCJzomSo' },
  '8-Mathematics-14': { english: 'rnbUiXwlpAo', hindi: 'pNMzqPWIr7E' },

  // CLASS 8 SCIENCE
  '8-Science-1':  { english: 'DpHtlxGtyp8', hindi: '9mJ6ABCD999' },
  '8-Science-2':  { english: 'CjLHZtMDM_Y', hindi: 'AmK6ABCD999' },
  '8-Science-3':  { english: 'I5NpteSIBm0', hindi: 'BmL6ABCD999' },
  '8-Science-4':  { english: 'ZZkz_fEFCRo', hindi: 'CmM6ABCD999' },
  '8-Science-5':  { english: 'A5mE7f9ABCD', hindi: 'DmN6ABCD999' },
  '8-Science-6':  { english: 'VDePLWRLMXo', hindi: 'EmO6ABCD999' },
  '8-Science-7':  { english: 'SIfk5uPL88E', hindi: 'FmP6ABCD999' },
  '8-Science-8':  { english: 'URUJD5NEXC8', hindi: 'GmQ6ABCD999' },
  '8-Science-9':  { english: 'ABCD_REPR_01', hindi: 'LmM6ABCD999' },
  '8-Science-10': { english: 'ABCD_CTRL_01', hindi: 'KmL6ABCD999' },
  '8-Science-11': { english: 'kKKM8Y-u7ds', hindi: 'Wm76ABCD999' },
  '8-Science-12': { english: 'gE_YD9ABCDE', hindi: 'Vm66ABCD999' },
  '8-Science-13': { english: 'EcEBKCJv2Lw', hindi: 'ABCD9999888' },
  '8-Science-14': { english: 'nJ2b9ABCDEF', hindi: 'MmN6ABCD999' },
  '8-Science-15': { english: '5gGLkfbhvBs', hindi: 'ABCD9999444' },
  '8-Science-16': { english: '5gGLkfbhvBs', hindi: 'ABCD9999444' },
  '8-Science-17': { english: 'ZM8ECpBuQYE', hindi: 'VmW6ABCD999' },
  '8-Science-18': { english: 'CjLHZtMDM_Y', hindi: 'AmK6ABCD999' },

  // CLASS 9 MATHEMATICS
  '9-Mathematics-1':  { english: 'EgZILNMwZAA', hindi: 'HmR6ABCD999' },
  '9-Mathematics-2':  { english: 'ybNsYPZCQGk', hindi: 'ImS6ABCD999' },
  '9-Mathematics-3':  { english: '3fB9ABCD123', hindi: 'JmT6ABCD999' },
  '9-Mathematics-4':  { english: 'l3XzepN03KQ', hindi: 'KmU6ABCD999' },
  '9-Mathematics-5':  { english: 'Rn3Ow7f8e7w', hindi: 'LmV6ABCD999' },
  '9-Mathematics-6':  { english: 'Rn3Ow7f8e7w', hindi: 'LmV6ABCD999' },
  '9-Mathematics-7':  { english: 'IvLpN1G9Wr8', hindi: 'MmW6ABCD999' },
  '9-Mathematics-8':  { english: 'nLknkBiMzb4', hindi: 'NmX6ABCD999' },
  '9-Mathematics-9':  { english: 'gE-YDSMjZj4', hindi: 'OmY6ABCD999' },
  '9-Mathematics-10': { english: 'rnbUiXwlpAo', hindi: 'pNMzqPWIr7E' },
  '9-Mathematics-11': { english: 'gE-YDSMjZj4', hindi: 'sHY3G_g5vNQ' },
  '9-Mathematics-12': { english: 'nLknkBiMzb4', hindi: 'aUnRKL6Z1_U' },
  '9-Mathematics-13': { english: 'nLknkBiMzb4', hindi: 'NmX6ABCD999' },
  '9-Mathematics-14': { english: 'gFjEEaRMqOA', hindi: 'yWlSCJzomSo' },
  '9-Mathematics-15': { english: 'gFjEEaRMqOA', hindi: 'yWlSCJzomSo' },

  // CLASS 9 SCIENCE
  '9-Science-1':  { english: 'QxMzbKB8F4Y', hindi: 'PmZ6ABCD999' },
  '9-Science-2':  { english: 'WVqO0hjbHfQ', hindi: 'Qm16ABCD999' },
  '9-Science-3':  { english: 'm1F3ABCD567', hindi: 'Rm26ABCD999' },
  '9-Science-4':  { english: 'ZZkz_fEFCRo', hindi: 'Sm36ABCD999' },
  '9-Science-5':  { english: 'URUJD5NEXC8', hindi: 'Tm46ABCD999' },
  '9-Science-6':  { english: 'CjLHZtMDM_Y', hindi: 'Um56ABCD999' },
  '9-Science-7':  { english: 'gE_YD9ABCDE', hindi: 'Vm66ABCD999' },
  '9-Science-8':  { english: 'kKKM8Y-u7ds', hindi: 'Wm76ABCD999' },
  '9-Science-9':  { english: 'ZM8ECpBuQYE', hindi: 'VmW6ABCD999' },
  '9-Science-10': { english: 'W8ABCD12345', hindi: 'Am26ABCD999' },
  '9-Science-11': { english: 'EcEBKCJv2Lw', hindi: 'ABCD9999888' },
  '9-Science-12': { english: 'DpHtlxGtyp8', hindi: '9mJ6ABCD999' },

  // CLASS 10 MATHEMATICS
  '10-Mathematics-1':  { english: 'EgZILNMwZAA', hindi: 'Xm86ABCD999' },
  '10-Mathematics-2':  { english: 'ybNsYPZCQGk', hindi: 'Ym96ABCD999' },
  '10-Mathematics-3':  { english: 'l3XzepN03KQ', hindi: 'ZmA6ABCD999' },
  '10-Mathematics-4':  { english: '2ZzuZvz33X0', hindi: 'AmB6ABCD999' },
  '10-Mathematics-5':  { english: 'gE_YD9ABCDF', hindi: 'BmC6ABCD999' },
  '10-Mathematics-6':  { english: 'IvLpN1G9Wr8', hindi: 'CmD6ABCD999' },
  '10-Mathematics-7':  { english: '3fB9ABCD124', hindi: 'DmE6ABCD999' },
  '10-Mathematics-8':  { english: 'F3ABCD12345', hindi: 'EmF6ABCD999' },
  '10-Mathematics-9':  { english: 'F3ABCD12345', hindi: 'EmF6ABCD999' },
  '10-Mathematics-10': { english: 'rnbUiXwlpAo', hindi: 'pNMzqPWIr7E' },
  '10-Mathematics-11': { english: 'gE-YDSMjZj4', hindi: 'OmY6ABCD999' },
  '10-Mathematics-12': { english: 'nLknkBiMzb4', hindi: 'NmX6ABCD999' },
  '10-Mathematics-13': { english: 'gFjEEaRMqOA', hindi: 'yWlSCJzomSo' },
  '10-Mathematics-14': { english: 'gFjEEaRMqOA', hindi: 'yWlSCJzomSo' },

  // CLASS 10 SCIENCE
  '10-Science-1':  { english: 'VDePLWRLMXo', hindi: 'FmG6ABCD999' },
  '10-Science-2':  { english: 'WVqO0hjbHfQ', hindi: 'GmH6ABCD999' },
  '10-Science-3':  { english: 'ZZkz_fEFCRo', hindi: 'HmI6ABCD999' },
  '10-Science-4':  { english: 'A5mE7f9ABCE', hindi: 'ImJ6ABCD999' },
  '10-Science-5':  { english: 'FqW8dOyCfN4', hindi: 'JmK6ABCD999' },
  '10-Science-6':  { english: 'ABCD_CTRL_01', hindi: 'KmL6ABCD999' },
  '10-Science-7':  { english: 'ABCD_REPR_01', hindi: 'LmM6ABCD999' },
  '10-Science-8':  { english: 'rnbUiXwlpAo', hindi: 'pNMzqPWIr7E' },
  '10-Science-9':  { english: '5gGLkfbhvBs', hindi: 'ABCD9999444' },
  '10-Science-10': { english: '5gGLkfbhvBs', hindi: 'ABCD9999444' },
  '10-Science-11': { english: 'nJ2b9ABCDEF', hindi: 'MmN6ABCD999' },
  '10-Science-12': { english: 'kKKM8Y-u7ds', hindi: 'Wm76ABCD999' },
  '10-Science-13': { english: 'SIfk5uPL88E', hindi: 'FmP6ABCD999' },
  '10-Science-14': { english: 'SIfk5uPL88E', hindi: 'FmP6ABCD999' },

  // CLASS 11 - PHYSICS sample
  '11-Physics-1':  { english: 'ZM8ECpBuQYE', hindi: 'VmW6ABCD999' },
  '11-Physics-2':  { english: 'hSFALELnJvM', hindi: 'WmX6ABCD999' },
  '11-Physics-3':  { english: 'SifTQiYvuBZ', hindi: 'XmY6ABCD999' },
  '11-Physics-4':  { english: 'V8ABCD12345', hindi: 'YmZ6ABCD999' },
  '11-Physics-5':  { english: 'kKKM8Y-u7dt', hindi: 'Zm16ABCD999' },
  '11-Physics-6':  { english: 'W8ABCD12345', hindi: 'Am26ABCD999' },
  '11-Physics-7':  { english: 'X8ABCD12345', hindi: 'Bm36ABCD999' },
  '11-Physics-8':  { english: 'Y8ABCD12345', hindi: 'Cm46ABCD999' },
  '11-Physics-9':  { english: 'ZM8ECpBuQYE', hindi: 'VmW6ABCD999' },
  '11-Physics-10': { english: 'ZM8ECpBuQYE', hindi: 'VmW6ABCD999' },
  '11-Physics-11': { english: '5gGLkfbhvBs', hindi: 'ABCD9999444' },
  '11-Physics-12': { english: 'QxMzbKB8F4Y', hindi: 'PmZ6ABCD999' },
  '11-Physics-13': { english: 'QxMzbKB8F4Y', hindi: 'PmZ6ABCD999' },
  '11-Physics-14': { english: 'EcEBKCJv2Lw', hindi: 'ABCD9999888' },
  '11-Physics-15': { english: 'EcEBKCJv2Lw', hindi: 'ABCD9999888' },

  // CLASS 11 CHEMISTRY sample
  '11-Chemistry-1':  { english: 'm1F3ABCD568', hindi: 'Dm56ABCD999' },
  '11-Chemistry-2':  { english: 'ZZkz_fEFCRp', hindi: 'Em66ABCD999' },
  '11-Chemistry-3':  { english: 'Z8ABCD12345', hindi: 'Fm76ABCD999' },
  '11-Chemistry-4':  { english: 'A9ABCD12345', hindi: 'Gm86ABCD999' },
  '11-Chemistry-5':  { english: 'QxMzbKB8F5Y', hindi: 'Hm96ABCD999' },
  '11-Chemistry-6':  { english: 'B9ABCD12345', hindi: 'ImA6ABCD999' },
  '11-Chemistry-7':  { english: 'C9ABCD12345', hindi: 'JmB6ABCD999' },
  '11-Chemistry-8':  { english: 'D9ABCD12345', hindi: 'KmC6ABCD999' },
};

// Full lecture content by class-subject
const lectureContent = {
  '6-Mathematics': [
    {ch:1, title:'Knowing Our Numbers', desc:'Understanding large numbers, place value, comparing and ordering numbers', dur:32},
    {ch:2, title:'Whole Numbers', desc:'Number line, properties of whole numbers, patterns', dur:28},
    {ch:3, title:'Playing with Numbers', desc:'Factors, multiples, HCF, LCM, prime and composite numbers', dur:35},
    {ch:4, title:'Basic Geometrical Ideas', desc:'Points, lines, line segments, angles, curves, polygons and circles', dur:30},
    {ch:5, title:'Understanding Elementary Shapes', desc:'Measuring line segments, angles, triangles, quadrilaterals and polygons', dur:33},
    {ch:6, title:'Integers', desc:'Negative numbers, number line, addition and subtraction of integers', dur:30},
    {ch:7, title:'Fractions', desc:'Proper, improper and mixed fractions, equivalent fractions, operations', dur:38},
    {ch:8, title:'Decimals', desc:'Tenths, hundredths, comparing decimals, addition and subtraction', dur:29},
    {ch:9, title:'Data Handling', desc:'Recording data, pictograph, bar graph, interpretation', dur:28},
    {ch:10, title:'Mensuration', desc:'Perimeter of rectangles, squares, triangles and area', dur:30},
    {ch:11, title:'Algebra', desc:'Introduction to variables, expressions and simple equations', dur:28},
    {ch:12, title:'Ratio and Proportion', desc:'Ratio, proportion, unitary method', dur:25},
    {ch:13, title:'Symmetry', desc:'Line of symmetry, lines of symmetry in regular polygons', dur:22},
    {ch:14, title:'Practical Geometry', desc:'Drawing lines, circles, angles using compass and ruler', dur:25},
  ],
  '6-Science': [
    {ch:1, title:'Food: Where Does It Come From?', desc:'Sources of food, plant and animal products, herbivores and carnivores', dur:25},
    {ch:2, title:'Components of Food', desc:'Nutrients, carbohydrates, proteins, fats, vitamins, minerals and water', dur:28},
    {ch:3, title:'Fibre to Fabric', desc:'Plant fibres, cotton and jute, spinning and weaving', dur:24},
    {ch:4, title:'Sorting Materials into Groups', desc:'Properties of materials, transparency, solubility, grouping objects', dur:22},
    {ch:5, title:'Separation of Substances', desc:'Methods of separation: hand picking, threshing, winnowing, sieving, evaporation', dur:27},
    {ch:6, title:'Changes Around Us', desc:'Reversible and irreversible changes, physical and chemical changes', dur:26},
    {ch:7, title:'Getting to Know Plants', desc:'Herbs, shrubs, trees, roots, stems, leaves, flowers', dur:30},
    {ch:8, title:'Body Movements', desc:'Types of joints, human skeleton, movement in animals', dur:25},
    {ch:9, title:'The Living Organisms and Their Surroundings', desc:'Habitat, adaptation, biotic and abiotic components', dur:27},
    {ch:10, title:'Motion and Measurement of Distances', desc:'Standard units, measuring length, types of motion', dur:25},
    {ch:11, title:'Light, Shadows and Reflections', desc:'Sources of light, transparent and opaque objects, shadows, mirrors', dur:28},
    {ch:12, title:'Electricity and Circuits', desc:'Electric cell, bulb, switch, conductors and insulators', dur:27},
    {ch:13, title:'Fun with Magnets', desc:'Magnetic and non-magnetic materials, poles, compass', dur:25},
    {ch:14, title:'Water', desc:'Water cycle, sources of water, conservation and management', dur:26},
    {ch:15, title:'Air Around Us', desc:'Composition of air, wind, oxygen and nitrogen', dur:24},
    {ch:16, title:'Garbage In, Garbage Out', desc:'Waste management, composting, recycling, reducing garbage', dur:22},
  ],
  '6-Social Science': [
    {ch:1, title:'What, Where, How and When?', desc:'Sources of history, finding out about the past, manuscripts and inscriptions', dur:25},
    {ch:2, title:'From Hunting-Gathering to Growing Food', desc:'Early humans, the Neolithic age, domestication of animals', dur:28},
    {ch:3, title:'In the Earliest Cities', desc:'Harappan civilisation, town planning, trade and crafts', dur:30},
    {ch:4, title:'What Books and Burials Tell Us', desc:'The Vedas, megalithic burials, iron tools', dur:26},
    {ch:5, title:'Kingdoms, Kings and an Early Republic', desc:'Janapadas, Mahajanapadas, republics', dur:24},
    {ch:6, title:'The Earth in the Solar System', desc:'Planets, sun, moon, stars, constellations, the solar system', dur:28},
    {ch:7, title:'Globe: Latitudes and Longitudes', desc:'Rotation, parallels of latitude, meridians of longitude, time zones', dur:30},
    {ch:8, title:'Motions of the Earth', desc:'Rotation, revolution, seasons, solstice and equinox', dur:28},
    {ch:9, title:'Maps', desc:'Types of maps, components: distance, direction, symbol', dur:24},
    {ch:10, title:'Major Domains of the Earth', desc:'Lithosphere, hydrosphere, atmosphere, biosphere', dur:26},
  ],
  '6-English': [
    {ch:1, title:"A Tale of Two Birds", desc:'Reading comprehension, vocabulary and grammar exercises', dur:20},
    {ch:2, title:'The Friendly Mongoose', desc:'Story comprehension, character analysis, adjectives', dur:18},
    {ch:3, title:"The Shepherd's Treasure", desc:'Honesty and values, comprehension, past tense verbs', dur:20},
    {ch:4, title:'The Old Clock Shop', desc:'Narrative reading, comprehension, question formation', dur:18},
    {ch:5, title:'Tansen', desc:"Biography, great musician of Akbar's court, comprehension", dur:22},
    {ch:6, title:'The Monkey and the Crocodile', desc:'Fable, moral lesson, comprehension and vocabulary', dur:18},
    {ch:7, title:'The Wonder Called Sleep', desc:'Informational text, facts about sleep, comprehension', dur:20},
    {ch:8, title:'A Pact with the Sun', desc:'Story of Saeeda and her mother, comprehension, values', dur:19},
  ],
  '6-Hindi': [
    {ch:1, title:'वह चिड़िया जो', desc:'कविता - वसंत भाग 1, भावार्थ और प्रश्नोत्तर', dur:18},
    {ch:2, title:'बचपन', desc:'संस्मरण, कृष्णा सोबती, बचपन की यादें', dur:20},
    {ch:3, title:'नादान दोस्त', desc:'कहानी, प्रेमचंद, दोस्ती और समझदारी', dur:22},
    {ch:4, title:'चाँद से थोड़ी सी गप्पें', desc:'कविता, शमशेर बहादुर सिंह, भावार्थ', dur:16},
    {ch:5, title:'अक्षरों का महत्व', desc:'निबंध, लेखन कला का इतिहास', dur:20},
    {ch:6, title:'पार नज़र के', desc:'कहानी, जयंत विष्णु नार्लीकर, विज्ञान कथा', dur:22},
    {ch:7, title:'साथी हाथ बढ़ाना', desc:'गीत, साहित्य अकादमी, श्रम और सहयोग', dur:15},
    {ch:8, title:'ऐसे–ऐसे', desc:'एकांकी, विनोद रस और हास्य', dur:20},
  ],
  '7-Mathematics': [
    {ch:1, title:'Integers', desc:'Properties of integers, multiplication and division of integers', dur:32},
    {ch:2, title:'Fractions and Decimals', desc:'Multiplication and division of fractions and decimals', dur:35},
    {ch:3, title:'Data Handling', desc:'Mean, median, mode, bar graphs, chance and probability', dur:30},
    {ch:4, title:'Simple Equations', desc:'Setting up equations, solving linear equations', dur:28},
    {ch:5, title:'Lines and Angles', desc:'Related angles, pairs of lines, transversal, parallel lines', dur:30},
    {ch:6, title:'The Triangle and Its Properties', desc:'Medians, altitudes, exterior angle, angle sum property, Pythagoras', dur:33},
    {ch:7, title:'Congruence of Triangles', desc:'Criteria for congruence: SSS, SAS, ASA, RHS', dur:32},
    {ch:8, title:'Comparing Quantities', desc:'Ratios, percentages, profit, loss, simple interest', dur:35},
    {ch:9, title:'Rational Numbers', desc:'Need for rational numbers, positive and negative rationals, number line', dur:30},
    {ch:10, title:'Practical Geometry', desc:'Construction of triangles with given conditions', dur:25},
    {ch:11, title:'Perimeter and Area', desc:'Area of parallelogram, triangle, circle, converting units', dur:32},
    {ch:12, title:'Algebraic Expressions', desc:'Terms, factors, coefficients, like and unlike terms, addition', dur:28},
    {ch:13, title:'Exponents and Powers', desc:'Laws of exponents, expressing large numbers in standard form', dur:28},
    {ch:14, title:'Symmetry', desc:'Lines of symmetry, rotational symmetry, centre of rotation', dur:22},
    {ch:15, title:'Visualising Solid Shapes', desc:'3D shapes, nets, vertices, edges, faces, cross sections', dur:25},
  ],
  '7-Science': [
    {ch:1, title:'Nutrition in Plants', desc:'Mode of nutrition, photosynthesis, other modes of nutrition', dur:28},
    {ch:2, title:'Nutrition in Animals', desc:'Digestion in humans, grass-eating animals, feeding in amoeba', dur:30},
    {ch:3, title:'Fibre to Fabric', desc:'Wool, silk, rearing and breeding of silkworms', dur:25},
    {ch:4, title:'Heat', desc:'Hot and cold, measuring temperature, conduction, convection, radiation', dur:28},
    {ch:5, title:'Acids, Bases and Salts', desc:'Natural indicators, neutralisation, everyday uses', dur:30},
    {ch:6, title:'Physical and Chemical Changes', desc:'Rusting, crystallisation, types of changes', dur:25},
    {ch:7, title:'Weather, Climate and Adaptations', desc:'Weather, climate zones, adaptation in animals', dur:27},
    {ch:8, title:'Winds, Storms and Cyclones', desc:'Air pressure, wind patterns, thunderstorms, cyclones', dur:29},
    {ch:9, title:'Soil', desc:'Soil profile, types of soil, absorption of water, soil erosion', dur:25},
    {ch:10, title:'Respiration in Organisms', desc:'Breathing, respiration, aerobic and anaerobic respiration', dur:28},
    {ch:11, title:'Transportation in Animals and Plants', desc:'Circulatory system, blood, heart, excretion, transport in plants', dur:30},
    {ch:12, title:'Reproduction in Plants', desc:'Modes of reproduction, vegetative propagation, pollination, seed dispersal', dur:28},
    {ch:13, title:'Motion and Time', desc:'Slow and fast, speed, distance-time graph, measuring time', dur:27},
    {ch:14, title:'Electric Current and Its Effects', desc:'Symbols, heating effect, magnetic effect, electromagnet', dur:28},
    {ch:15, title:'Light', desc:'Light travels in straight line, reflection, mirrors, lenses, sunlight', dur:30},
    {ch:16, title:'Water: A Precious Resource', desc:'Groundwater, water cycle, water management', dur:25},
    {ch:17, title:'Forests: Our Lifeline', desc:'Forest ecosystem, canopy, decomposers, biodiversity', dur:25},
    {ch:18, title:'Wastewater Story', desc:'Sewage, treatment of wastewater, sanitation', dur:22},
  ],
  '8-Mathematics': [
    {ch:1, title:'Rational Numbers', desc:'Properties of rational numbers, number line, between two rational numbers', dur:30},
    {ch:2, title:'Linear Equations in One Variable', desc:'Solving equations with variables on both sides, reducing equations', dur:32},
    {ch:3, title:'Understanding Quadrilaterals', desc:'Polygons, sum of angles, parallelogram, rectangle, rhombus, square', dur:28},
    {ch:4, title:'Data Handling', desc:'Pie charts, probability, chance, organising data', dur:30},
    {ch:5, title:'Squares and Square Roots', desc:'Properties of square numbers, Pythagorean triplets, finding square roots', dur:35},
    {ch:6, title:'Cubes and Cube Roots', desc:'Finding cube roots through prime factorisation', dur:28},
    {ch:7, title:'Comparing Quantities', desc:'Recalling ratios and percentages, finding increase/decrease, compound interest', dur:35},
    {ch:8, title:'Algebraic Expressions and Identities', desc:'Monomials, binomials, polynomials, multiplication, standard identities', dur:30},
    {ch:9, title:'Mensuration', desc:'Area of trapezium, general quadrilateral, polygons, surface area, volume', dur:35},
    {ch:10, title:'Exponents and Powers', desc:'Powers with negative exponents, scientific notation, expressing in standard form', dur:28},
    {ch:11, title:'Direct and Inverse Proportions', desc:'Direct and inverse variation, solving problems', dur:28},
    {ch:12, title:'Factorisation', desc:'Factors of natural numbers and algebraic expressions, division of polynomials', dur:30},
    {ch:13, title:'Introduction to Graphs', desc:'Bar graphs, pie charts, histograms, line graphs, coordinates', dur:28},
    {ch:14, title:'Playing with Numbers', desc:'Numbers in general form, games with numbers, letters for digits', dur:25},
  ],
  '8-Science': [
    {ch:1, title:'Crop Production and Management', desc:'Agricultural practices, kharif and rabi crops, irrigation, fertilizers', dur:28},
    {ch:2, title:'Microorganisms: Friend and Foe', desc:'Types of microorganisms, useful and harmful microbes, food preservation', dur:30},
    {ch:3, title:'Synthetic Fibres and Plastics', desc:'Types of synthetic fibres, properties, plastics and environment', dur:25},
    {ch:4, title:'Materials: Metals and Non-Metals', desc:'Physical and chemical properties, uses, displacement reactions', dur:30},
    {ch:5, title:'Coal and Petroleum', desc:'Natural resources, coal, petroleum, natural gas, conservation', dur:27},
    {ch:6, title:'Combustion and Flame', desc:'Conditions for combustion, types of combustion, flame, fire control', dur:28},
    {ch:7, title:'Conservation of Plants and Animals', desc:'Deforestation, biodiversity, wildlife sanctuary, national parks', dur:26},
    {ch:8, title:'Cell: Structure and Functions', desc:'Discovery of cell, cell organelles, plant and animal cells', dur:32},
    {ch:9, title:'Reproduction in Animals', desc:'Sexual and asexual reproduction, human reproductive organs', dur:28},
    {ch:10, title:'Reaching the Age of Adolescence', desc:'Puberty, hormones, reproductive health, personal hygiene', dur:26},
    {ch:11, title:'Force and Pressure', desc:'Types of forces, pressure, atmospheric pressure, pressure in fluids', dur:30},
    {ch:12, title:'Friction', desc:'Factors affecting friction, advantages and disadvantages, rolling friction', dur:25},
    {ch:13, title:'Sound', desc:'Production, propagation, reflection of sound, echo, noise pollution', dur:28},
    {ch:14, title:'Chemical Effects of Electric Current', desc:'Electrolytes, electroplating, LED, applications', dur:26},
    {ch:15, title:'Some Natural Phenomena', desc:'Lightning, earthquakes, seismic zones, cyclone, precautions', dur:28},
    {ch:16, title:'Light', desc:'Laws of reflection, regular and irregular reflection, multiple images', dur:28},
    {ch:17, title:'Stars and the Solar System', desc:'Moon, stars, solar system, comets, man-made satellites', dur:30},
    {ch:18, title:'Pollution of Air and Water', desc:'Air and water pollutants, potable water, Ganga pollution', dur:26},
  ],
  '9-Mathematics': [
    {ch:1, title:'Number Systems', desc:'Irrational numbers, real numbers, real number line, surds, laws of exponents', dur:35},
    {ch:2, title:'Polynomials', desc:'Polynomials in one variable, zeroes, remainder theorem, factor theorem', dur:38},
    {ch:3, title:'Coordinate Geometry', desc:'Cartesian system, plotting points, naming quadrants', dur:30},
    {ch:4, title:'Linear Equations in Two Variables', desc:'Solutions, graph of linear equations, equations of lines parallel to axes', dur:30},
    {ch:5, title:"Introduction to Euclid's Geometry", desc:"Euclid's definitions, axioms, postulates, equivalent versions", dur:28},
    {ch:6, title:'Lines and Angles', desc:'Basic terms, intersecting lines, parallel lines, angle sum property of triangle', dur:28},
    {ch:7, title:'Triangles', desc:'Congruence criteria, properties of isosceles triangle, inequalities', dur:35},
    {ch:8, title:'Quadrilaterals', desc:'Angle sum property, properties of parallelogram, midpoint theorem', dur:30},
    {ch:9, title:'Areas of Parallelograms and Triangles', desc:'Figures on same base and between same parallels', dur:28},
    {ch:10, title:'Circles', desc:'Chord properties, angle subtended, equal chords, arc and angles', dur:32},
    {ch:11, title:'Constructions', desc:'Bisecting angles, perpendicular bisector, constructing triangles', dur:25},
    {ch:12, title:"Heron's Formula", desc:"Area of triangle using Heron's formula, quadrilateral areas", dur:28},
    {ch:13, title:'Surface Areas and Volumes', desc:'Cuboid, cube, right cylinder, right cone, sphere, hemisphere', dur:35},
    {ch:14, title:'Statistics', desc:'Collection and presentation of data, mean, median, mode, bar graphs', dur:30},
    {ch:15, title:'Probability', desc:'Experimental probability, complementary events', dur:28},
  ],
  '9-Science': [
    {ch:1, title:'Matter in Our Surroundings', desc:'Physical nature of matter, states of matter, evaporation', dur:30},
    {ch:2, title:'Is Matter Around Us Pure?', desc:'Mixtures, solutions, colloids, separating mixtures, physical changes', dur:30},
    {ch:3, title:'Atoms and Molecules', desc:'Laws of chemical combination, atoms, molecules, ions, mole concept', dur:35},
    {ch:4, title:'Structure of the Atom', desc:"Charged particles, Thomson's and Rutherford's models, Bohr model, valency", dur:32},
    {ch:5, title:'The Fundamental Unit of Life', desc:'Cell, plasma membrane, nucleus, cell organelles, plant vs animal cell', dur:30},
    {ch:6, title:'Tissues', desc:'Plant and animal tissues, functions', dur:32},
    {ch:7, title:'Motion', desc:'Distance, displacement, velocity, acceleration, equations of motion, graphs', dur:35},
    {ch:8, title:'Force and Laws of Motion', desc:"Newton's three laws, inertia, momentum, conservation", dur:35},
    {ch:9, title:'Gravitation', desc:"Universal law of gravitation, free fall, mass, weight, Archimedes' principle", dur:33},
    {ch:10, title:'Work and Energy', desc:'Work done, energy, kinetic and potential energy, conservation of energy, power', dur:32},
    {ch:11, title:'Sound', desc:'Production and propagation, speed, reflection, echo, sonar, human ear', dur:30},
    {ch:12, title:'Improvement in Food Resources', desc:'Crop improvement, manure, fertilizers, crop protection, animal husbandry', dur:28},
  ],
  '10-Mathematics': [
    {ch:1, title:'Real Numbers', desc:"Euclid's division lemma, fundamental theorem of arithmetic, irrational numbers", dur:35},
    {ch:2, title:'Polynomials', desc:'Geometrical meaning of zeroes, relationship between zeroes and coefficients', dur:33},
    {ch:3, title:'Pair of Linear Equations in Two Variables', desc:'Graphical and algebraic methods of solution, consistency', dur:38},
    {ch:4, title:'Quadratic Equations', desc:'Standard form, factorisation, completing the square, quadratic formula', dur:38},
    {ch:5, title:'Arithmetic Progressions', desc:'AP, nth term, sum of n terms, applications', dur:32},
    {ch:6, title:'Triangles', desc:'Similarity, criteria for similarity, areas, Pythagoras theorem', dur:35},
    {ch:7, title:'Coordinate Geometry', desc:'Distance formula, section formula, area of triangle', dur:30},
    {ch:8, title:'Introduction to Trigonometry', desc:'Trigonometric ratios, complementary angles, identities', dur:38},
    {ch:9, title:'Some Applications of Trigonometry', desc:'Heights and distances, angle of elevation and depression', dur:32},
    {ch:10, title:'Circles', desc:'Tangent to circle, number of tangents from external point', dur:28},
    {ch:11, title:'Areas Related to Circles', desc:'Area of sector, segment, combinations of plane figures', dur:30},
    {ch:12, title:'Surface Areas and Volumes', desc:'Combination of solids, conversion of one solid to another', dur:32},
    {ch:13, title:'Statistics', desc:'Mean, median, mode of grouped data, cumulative frequency, ogive', dur:30},
    {ch:14, title:'Probability', desc:'Classical definition, simple problems, complementary events', dur:28},
  ],
  '10-Science': [
    {ch:1, title:'Chemical Reactions and Equations', desc:'Chemical equations, types of reactions, oxidation and reduction', dur:32},
    {ch:2, title:'Acids, Bases and Salts', desc:'Properties, pH scale, salts, plaster of Paris, baking soda', dur:30},
    {ch:3, title:'Metals and Non-metals', desc:'Physical and chemical properties, reactivity series, ionic bonds', dur:32},
    {ch:4, title:'Carbon and Its Compounds', desc:'Covalent bonds, versatile nature of carbon, important compounds, soaps', dur:35},
    {ch:5, title:'Life Processes', desc:'Nutrition, respiration, transportation and excretion in organisms', dur:35},
    {ch:6, title:'Control and Coordination', desc:'Animals: nervous system, reflex actions. Plants: tropisms, hormones', dur:33},
    {ch:7, title:'How do Organisms Reproduce?', desc:'Asexual and sexual reproduction, human reproductive system', dur:32},
    {ch:8, title:'Heredity and Evolution', desc:"Variation, Mendel's laws, sex determination, evolution, natural selection", dur:35},
    {ch:9, title:'Light: Reflection and Refraction', desc:'Reflection, mirrors, refraction, lenses, sign convention', dur:38},
    {ch:10, title:'The Human Eye and the Colourful World', desc:'Human eye, power of accommodation, defects, refraction through prism', dur:30},
    {ch:11, title:'Electricity', desc:"Electric current, potential difference, Ohm's law, circuits, power", dur:38},
    {ch:12, title:'Magnetic Effects of Electric Current', desc:"Magnetic field, Fleming's rules, electric motor, generator, domestic wiring", dur:35},
    {ch:13, title:'Our Environment', desc:'Ecosystem, food chain, environmental problems, ozone layer', dur:28},
    {ch:14, title:'Management of Natural Resources', desc:'Forests, water, coal, petroleum, the 3Rs', dur:26},
  ],
  '11-Mathematics': [
    {ch:1, title:'Sets', desc:'Sets and their representations, types of sets, Venn diagrams, operations', dur:30},
    {ch:2, title:'Relations and Functions', desc:'Ordered pairs, Cartesian product, relations, types of functions', dur:35},
    {ch:3, title:'Trigonometric Functions', desc:'Angles, trigonometric functions, identities, signs in quadrants', dur:40},
    {ch:4, title:'Complex Numbers and Quadratic Equations', desc:'Complex numbers, modulus, conjugate, quadratic equations with complex roots', dur:35},
    {ch:5, title:'Linear Inequalities', desc:'Algebraic and graphical solutions, system of linear inequalities', dur:30},
    {ch:6, title:'Permutations and Combinations', desc:'Fundamental principle, permutations, combinations, applications', dur:35},
    {ch:7, title:'Binomial Theorem', desc:'Binomial theorem for positive integral index, general and middle terms', dur:30},
    {ch:8, title:'Sequences and Series', desc:'AP and GP, relationships between AM and GM', dur:32},
    {ch:9, title:'Straight Lines', desc:'Slope, equations of lines, angle between lines, distance from a point', dur:33},
    {ch:10, title:'Conic Sections', desc:'Circle, parabola, ellipse, hyperbola, standard equations', dur:38},
    {ch:11, title:'Introduction to Three-Dimensional Geometry', desc:'Coordinate axes, distance formula, section formula in 3D', dur:28},
    {ch:12, title:'Limits and Derivatives', desc:'Intuitive idea of derivatives, limits, algebra of limits, derivatives', dur:38},
    {ch:13, title:'Statistics', desc:'Measures of dispersion, mean deviation, variance, standard deviation', dur:30},
    {ch:14, title:'Probability', desc:'Random experiments, events, axiomatic approach, addition rule', dur:28},
  ],
  '11-Physics': [
    {ch:1, title:'Physical World', desc:'Physics, technology and society, scope and excitement of physics', dur:25},
    {ch:2, title:'Units and Measurements', desc:'International System of Units, measurement of length, mass, time, errors', dur:32},
    {ch:3, title:'Motion in a Straight Line', desc:'Position, path length, displacement, velocity, acceleration, kinematic equations', dur:38},
    {ch:4, title:'Motion in a Plane', desc:'Scalars and vectors, resolution, projectile motion, circular motion', dur:40},
    {ch:5, title:'Laws of Motion', desc:"Aristotle's fallacy, Newton's three laws, momentum, conservation", dur:40},
    {ch:6, title:'Work, Energy and Power', desc:'Work-energy theorem, potential energy, conservation of mechanical energy', dur:38},
    {ch:7, title:'System of Particles and Rotational Motion', desc:'Centre of mass, moment of inertia, theorems, rolling motion', dur:40},
    {ch:8, title:'Gravitation', desc:"Kepler's laws, universal gravitation, acceleration due to gravity, satellites", dur:38},
    {ch:9, title:'Mechanical Properties of Solids', desc:"Elastic behaviour, stress, strain, Hooke's law, moduli of elasticity", dur:32},
    {ch:10, title:'Mechanical Properties of Fluids', desc:"Pressure, viscosity, surface tension, Bernoulli's theorem", dur:35},
    {ch:11, title:'Thermal Properties of Matter', desc:'Temperature, heat, thermal expansion, specific heat, calorimetry, conduction', dur:33},
    {ch:12, title:'Thermodynamics', desc:'Thermal equilibrium, laws of thermodynamics, heat engines, refrigerators', dur:38},
    {ch:13, title:'Kinetic Theory', desc:'Molecular nature of matter, kinetic theory of gases, degrees of freedom', dur:30},
    {ch:14, title:'Oscillations', desc:'Periodic and oscillatory motion, SHM, energy in SHM, pendulum', dur:35},
    {ch:15, title:'Waves', desc:'Transverse and longitudinal waves, speed, superposition, standing waves, beats', dur:38},
  ],
  '11-Chemistry': [
    {ch:1, title:'Some Basic Concepts of Chemistry', desc:'Importance of chemistry, properties of matter, atoms and molecules, mole concept', dur:38},
    {ch:2, title:'Structure of Atom', desc:'Sub-atomic particles, atomic models, quantum mechanics, orbitals, electronic configuration', dur:40},
    {ch:3, title:'Classification of Elements and Periodicity', desc:"Mendeleev's and modern periodic table, trends in properties", dur:35},
    {ch:4, title:'Chemical Bonding and Molecular Structure', desc:"Ionic, covalent, metallic bonds, VSEPR, hybridisation, molecular orbital theory", dur:40},
    {ch:5, title:'States of Matter', desc:'Intermolecular forces, gas laws, kinetic theory, liquids', dur:35},
    {ch:6, title:'Thermodynamics', desc:'System and surroundings, enthalpy, entropy, Gibbs energy, spontaneity', dur:40},
    {ch:7, title:'Equilibrium', desc:"Chemical and ionic equilibrium, Le Chatelier's principle, pH, buffer solutions", dur:40},
    {ch:8, title:'Redox Reactions', desc:'Oxidation and reduction, electrode reactions, balancing redox equations', dur:30},
  ],
  '11-Biology': [
    {ch:1, title:'The Living World', desc:'What is living, taxonomy, systematics, classification of living organisms', dur:28},
    {ch:2, title:'Biological Classification', desc:'Kingdoms, Monera, Protista, Fungi, Plantae, Animalia', dur:35},
    {ch:3, title:'Plant Kingdom', desc:'Algae, bryophytes, pteridophytes, gymnosperms, angiosperms, plant life cycles', dur:38},
    {ch:4, title:'Animal Kingdom', desc:'Basis of classification, invertebrates to vertebrates, salient features', dur:40},
    {ch:5, title:'Morphology of Flowering Plants', desc:'Root, stem, leaf, flower, fruit, seed, semi-technical descriptions', dur:35},
    {ch:6, title:'Anatomy of Flowering Plants', desc:'Tissues, tissue systems, internal organisation of stem, leaf, root', dur:35},
    {ch:7, title:'Structural Organisation in Animals', desc:'Morphology and anatomy of frog, earthworm, cockroach', dur:38},
    {ch:8, title:'Cell: The Unit of Life', desc:'Cell theory, prokaryotic and eukaryotic cells, cell organelles in detail', dur:40},
  ],
  '11-English': [
    {ch:1, title:'The Portrait of a Lady', desc:'Khushwant Singh, relationship with grandmother, change over time', dur:22},
    {ch:2, title:"We're Not Afraid to Die", desc:'Sea voyage, survival, courage and teamwork', dur:22},
    {ch:3, title:'Discovering Tut: the Saga Continues', desc:'King Tut, CT scan, Egyptology', dur:20},
    {ch:4, title:'Landscape of the Soul', desc:'Chinese painting, art and perspective, the eye of the beholder', dur:20},
    {ch:5, title:'The Ailing Planet: the Green Movement Role', desc:'Environment, sustainable development, green movement', dur:22},
    {ch:6, title:'The Browning Version', desc:"Terence Rattigan drama, a teacher's private life and self-realisation", dur:22},
    {ch:7, title:'The Adventure', desc:'Science fiction, Prof Gaitonde, parallel universe, history', dur:20},
    {ch:8, title:'Silk Road', desc:'Nick Middleton, travel in Tibet, Kailash Mansarovar yatra', dur:20},
  ],
  '12-Mathematics': [
    {ch:1, title:'Relations and Functions', desc:'Types of relations, types of functions, composition, invertible functions', dur:35},
    {ch:2, title:'Inverse Trigonometric Functions', desc:'Basic concepts, properties, principal value branch', dur:32},
    {ch:3, title:'Matrices', desc:'Matrix order, types, operations, transpose, invertible matrices', dur:35},
    {ch:4, title:'Determinants', desc:'Determinant of a matrix, cofactors, adjoint, inverse, applications', dur:38},
    {ch:5, title:'Continuity and Differentiability', desc:'Continuity, differentiability, exponential and logarithmic functions, MVT', dur:40},
    {ch:6, title:'Application of Derivatives', desc:'Rate of change, increasing/decreasing functions, maxima and minima', dur:40},
    {ch:7, title:'Integrals', desc:'Integration as inverse of differentiation, methods of integration, definite integral', dur:40},
    {ch:8, title:'Application of Integrals', desc:'Area under simple curves, area between two curves', dur:32},
    {ch:9, title:'Differential Equations', desc:'Basic concepts, order, degree, formation, methods of solving', dur:35},
    {ch:10, title:'Vector Algebra', desc:'Types of vectors, addition, multiplication by scalar, dot and cross product', dur:33},
    {ch:11, title:'Three-Dimensional Geometry', desc:'Direction cosines, equations of lines and planes, angle between them', dur:35},
    {ch:12, title:'Linear Programming', desc:'Linear programming problem, graphical method, simplex method', dur:30},
    {ch:13, title:'Probability', desc:"Conditional probability, multiplication rule, Bayes' theorem, random variable", dur:38},
  ],
  '12-Physics': [
    {ch:1, title:'Electric Charges and Fields', desc:"Electric charge, Coulomb's law, electric field, Gauss's law", dur:40},
    {ch:2, title:'Electrostatic Potential and Capacitance', desc:'Electric potential, capacitors, energy stored, dielectrics', dur:40},
    {ch:3, title:'Current Electricity', desc:"Electric current, Ohm's law, EMF, Kirchhoff's laws, Wheatstone bridge", dur:38},
    {ch:4, title:'Moving Charges and Magnetism', desc:"Oersted's experiment, Biot-Savart law, Ampere's law, cyclotron", dur:40},
    {ch:5, title:'Magnetism and Matter', desc:"Bar magnet, Gauss's law for magnetism, properties of magnetic materials", dur:30},
    {ch:6, title:'Electromagnetic Induction', desc:"Faraday's and Lenz's law, motional EMF, eddy currents, inductance", dur:38},
    {ch:7, title:'Alternating Current', desc:'AC voltage applied to resistor, LC oscillations, transformer, power factor', dur:40},
    {ch:8, title:'Electromagnetic Waves', desc:"Displacement current, Maxwell's equations, EM spectrum", dur:30},
    {ch:9, title:'Ray Optics and Optical Instruments', desc:'Reflection, refraction, total internal reflection, lenses, optical instruments', dur:40},
    {ch:10, title:'Wave Optics', desc:"Wavefront, Huygens' principle, interference, diffraction, polarisation", dur:38},
    {ch:11, title:'Dual Nature of Radiation and Matter', desc:'Photoelectric effect, de Broglie wavelength', dur:32},
    {ch:12, title:'Atoms', desc:'Alpha particle scattering, Rutherford model, Bohr model, energy levels', dur:30},
    {ch:13, title:'Nuclei', desc:'Atomic masses, nuclear binding energy, radioactivity, nuclear reactions', dur:32},
    {ch:14, title:'Semiconductor Electronics', desc:'Semiconductors, p-n junction, transistor, logic gates, integrated circuits', dur:35},
  ],
  '12-Chemistry': [
    {ch:1, title:'The Solid State', desc:'General characteristics, crystal systems, imperfections, electrical properties', dur:38},
    {ch:2, title:'Solutions', desc:"Types of solutions, concentration, Raoult's law, colligative properties, osmosis", dur:38},
    {ch:3, title:'Electrochemistry', desc:'Electrochemical cells, Nernst equation, EMF, batteries, corrosion', dur:40},
    {ch:4, title:'Chemical Kinetics', desc:'Rate of reaction, factors affecting rate, activation energy, catalysis', dur:38},
    {ch:5, title:'Surface Chemistry', desc:'Adsorption, colloids, emulsions, catalysis', dur:30},
    {ch:6, title:'General Principles of Isolation of Elements', desc:'Occurrence, extraction methods, refining', dur:32},
    {ch:7, title:'The p-Block Elements', desc:'Groups 15-18: nitrogen family, oxygen family, halogens, noble gases', dur:40},
    {ch:8, title:'The d and f Block Elements', desc:'Transition elements, inner transition elements, lanthanoids, actinoids', dur:35},
  ],
  '12-Biology': [
    {ch:1, title:'Reproduction in Organisms', desc:'Modes of reproduction, asexual reproduction, sexual reproduction', dur:30},
    {ch:2, title:'Sexual Reproduction in Flowering Plants', desc:'Flower structure, pollination, fertilisation, seeds, fruits', dur:38},
    {ch:3, title:'Human Reproduction', desc:'Male and female reproductive system, gametogenesis, fertilisation, pregnancy', dur:40},
    {ch:4, title:'Reproductive Health', desc:'Problems and strategies, population explosion, birth control, STIs', dur:28},
    {ch:5, title:'Principles of Inheritance and Variation', desc:"Mendel's laws, chromosomal theory, sex determination, mutation", dur:40},
    {ch:6, title:'Molecular Basis of Inheritance', desc:'DNA structure, replication, transcription, translation, gene regulation', dur:40},
    {ch:7, title:'Evolution', desc:'Origin of life, theories of evolution, evidence, adaptive radiation, human evolution', dur:35},
    {ch:8, title:'Human Health and Disease', desc:'Pathogens, immunity, AIDS, cancer, drugs and alcohol abuse', dur:35},
  ],
  '12-English': [
    {ch:1, title:'The Last Lesson', desc:'Alphonse Daudet, French identity, war and language', dur:22},
    {ch:2, title:'Lost Spring', desc:'Anees Jung, poverty, child labour in India', dur:22},
    {ch:3, title:'Deep Water', desc:'William Douglas, fear and courage, swimming', dur:20},
    {ch:4, title:'The Rattrap', desc:'Selma Lagerlof, kindness transforms a cynical person', dur:20},
    {ch:5, title:'Indigo', desc:'Louis Fischer, Gandhi and Champaran Satyagraha', dur:22},
    {ch:6, title:'Poets and Pancakes', desc:'Asokamitran, film industry, Gemini Studios', dur:20},
    {ch:7, title:'The Interview', desc:'Christopher Silvester, forms and purposes of interview', dur:18},
    {ch:8, title:'Going Places', desc:'A.R. Barton, teenage fantasies, unrealistic dreams', dur:20},
  ],
};

async function getSubjectId(name) {
  const { data, error } = await supabase.from('subjects').select('id').eq('name', name).single();
  if (error || !data) throw new Error(`Subject not found: "${name}". Run v2 migration first.`);
  return data.id;
}

async function seedLectures() {
  console.log('\n📚 EdUmbrella Lecture Seeder\n');

  // Pre-fetch all unique subject IDs
  const uniqueSubjects = [...new Set(Object.keys(lectureContent).map(k => k.split('-').slice(1).join('-')))];
  const subjectMap = {};
  for (const name of uniqueSubjects) {
    subjectMap[name] = await getSubjectId(name);
  }
  console.log('✅ Subject map loaded');

  let totalInserted = 0;
  let totalVideos = 0;

  for (const [key, chapters] of Object.entries(lectureContent)) {
    const dashIdx = key.indexOf('-');
    const classLevel = parseInt(key.substring(0, dashIdx));
    const subjectName = key.substring(dashIdx + 1);
    const subjectId = subjectMap[subjectName];

    if (!subjectId) {
      console.warn(`  ⚠️  Subject not found: ${subjectName}`);
      continue;
    }

    for (const chapter of chapters) {
      // Upsert lecture
      const { data: lectureRow, error: lectureError } = await supabase
        .from('lectures')
        .upsert({
          subject_id: subjectId,
          class_level: classLevel,
          chapter_no: chapter.ch,
          title: chapter.title,
          description: chapter.desc,
          duration_minutes: chapter.dur || 30,
          display_order: chapter.ch,
          is_active: true,
        }, { onConflict: 'class_level,subject_id,chapter_no' })
        .select('id')
        .single();

      if (lectureError) {
        console.error(`  ❌ [${key} Ch${chapter.ch}]: ${lectureError.message}`);
        continue;
      }

      totalInserted++;
      const lectureId = lectureRow.id;

      // Look up video IDs
      const videoKey = `${classLevel}-${subjectName}-${chapter.ch}`;
      const videos = videoMap[videoKey] || {};

      const videoEntries = Object.entries(videos).map(([language, youtube_video_id]) => ({
        lecture_id: lectureId,
        language,
        youtube_video_id,
        is_default: language === 'english',
      }));

      if (videoEntries.length > 0) {
        const { error: videoError } = await supabase
          .from('lecture_videos')
          .upsert(videoEntries, { onConflict: 'lecture_id,language' });

        if (videoError) {
          console.warn(`  ⚠️  Video upsert failed for lecture ${lectureId}: ${videoError.message}`);
        } else {
          totalVideos += videoEntries.length;
        }
      }
    }

    console.log(`  ✅ ${key}: ${chapters.length} lectures`);
  }

  console.log(`\n🎉 Complete! ${totalInserted} lectures seeded, ${totalVideos} video entries created.`);
  console.log('📌 Remember: Update videoMap with real YouTube video IDs before launch!');
}

seedLectures().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
