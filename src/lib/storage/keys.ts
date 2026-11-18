/** localStorage keys for saved progress. Baked into learners' data: never rename. */
import { STORAGE_CONFIG } from '@/config/app';

export const PROGRESS_KEY = `${STORAGE_CONFIG.keyPrefix}:progress`;
export const BACKUP_KEY_PREFIX = `${STORAGE_CONFIG.keyPrefix}:progress-backup:`;
