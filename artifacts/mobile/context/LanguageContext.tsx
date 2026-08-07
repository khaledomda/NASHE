import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Lang, TranslationKey } from '@/constants/i18n';

type LanguageContextType = {
  lang: Lang;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
  row: 'row' | 'row-reverse';
  align: 'left' | 'right';
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = '@nashe_lang_v1';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'ar' || val === 'en') setLangState(val);
    });
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  }, [lang, setLang]);

  const isRTL = lang === 'ar';

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations.ar[key],
    [lang]
  );

  const value: LanguageContextType = {
    lang,
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
    row: isRTL ? 'row-reverse' : 'row',
    align: isRTL ? 'right' : 'left',
    setLang,
    toggleLang,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
