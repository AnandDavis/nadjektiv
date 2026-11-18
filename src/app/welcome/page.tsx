import type { Metadata } from 'next';

import { WelcomeFlow } from '@/components/welcome/WelcomeFlow';
import { TOPICS } from '@/content';

export const metadata: Metadata = { title: 'Welcome' };

/** The intro shown on first open (see PREFERENCES_SCRIPT), and from About. */
export default function WelcomePage() {
  return <WelcomeFlow topicCount={TOPICS.length} />;
}
