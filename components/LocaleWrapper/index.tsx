import { cookies } from 'next/headers';
import { LocaleClientWrapper } from './LocaleWrapper';
import { LocaleValue } from '@/contexts/LocaleContext';

export async function LocaleWrapper({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as LocaleValue) || 'enUs';

  return (
    <LocaleClientWrapper initialLocale={locale}>
      {children}
    </LocaleClientWrapper>
  );
}
