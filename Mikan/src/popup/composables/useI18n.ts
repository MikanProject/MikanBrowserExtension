import enLocale from '../_locales/en/messages.json';
import zhcnLocale from '../_locales/zh_CN/messages.json';

let i18nextAlreadyInit = false;
const i18n = {} as Record<string, Record<string, string>>;

export default function useI18n() {
  if (!i18nextAlreadyInit) {
    i18n['en-US'] = Object.keys(enLocale).reduce((acc, cur) => {
      acc[cur] = enLocale[cur as keyof typeof enLocale].message;
      return acc;
    }, {} as Record<string, string>);
    i18n['zh-CN'] = Object.keys(zhcnLocale).reduce((acc, cur) => {
      acc[cur] = zhcnLocale[cur as keyof typeof zhcnLocale].message;
      return acc;
    }, {} as Record<string, string>);
    i18nextAlreadyInit = true;
  }

  return {
    getKey: (key: string) => {
      try {
        const { language } = navigator;
        if (Object.keys(i18n).includes(language)) {
          return i18n[language][key];
        }
        return i18n['en-US'][key];
      } catch (e) {
        return `${e}`;
      }
    },
  };
}
