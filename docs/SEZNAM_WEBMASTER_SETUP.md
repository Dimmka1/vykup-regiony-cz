# Seznam Webmaster Setup — vykoupim-nemovitost.cz

Пошаговая инструкция для владельца сайта по регистрации в Seznam Webmaster Tools.

## Зачем

Seznam.cz — второй по популярности поисковик в Чехии (25-30% рынка). Регистрация в Webmaster Tools даёт:

- Контроль индексации
- Статистику поисковых запросов
- Уведомления о проблемах с сайтом
- Ускоренное сканирование

## Шаги

### 1. Регистрация аккаунта

1. Перейти на [webmaster.seznam.cz](https://webmaster.seznam.cz)
2. Войти через Seznam ID (или создать новый аккаунт на [login.seznam.cz](https://login.seznam.cz))

### 2. Добавление домена

1. В Webmaster Tools нажать **Přidat web** (Добавить сайт)
2. Ввести URL: `https://vykoupim-nemovitost.cz`
3. Нажать **Přidat** (Добавить)

### 3. Верификация домена

Seznam предложит способы верификации. Рекомендуемый — **meta tag**:

1. Скопировать предложенный meta tag, например:
   ```html
   <meta name="seznam-wmt" content="YOUR_VERIFICATION_CODE" />
   ```
2. Добавить его в `src/app/layout.tsx` в блок `metadata`:

   ```tsx
   // src/app/layout.tsx
   export const metadata: Metadata = {
     // ... existing metadata ...
     other: {
       "seznam-wmt": "YOUR_VERIFICATION_CODE",
     },
   };
   ```

3. Сделать коммит, дождаться деплоя
4. Вернуться в Seznam Webmaster Tools и нажать **Ověřit** (Подтвердить)

### 4. Отправка Sitemap

После верификации:

1. Перейти в раздел **Sitemapy**
2. Добавить URL sitemap: `https://vykoupim-nemovitost.cz/sitemap.xml`
3. Опционально добавить: `https://vykoupim-nemovitost.cz/image-sitemap.xml`

## Автоматические пинги

В проекте уже настроен автоматический ping Seznam.cz при каждом деплое:

- **Скрипт:** `scripts/ping-seznam.ts`
- **npm:** `npm run ping:seznam`
- **CI/CD:** Автоматически запускается после deploy в GitHub Actions

## Проверка robots.txt

SeznamBot разрешён явно в `src/app/robots.ts`:

```
User-agent: SeznamBot
Allow: /
```

Проверить можно по адресу: https://vykoupim-nemovitost.cz/robots.txt
