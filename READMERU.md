# Star Read - Тема для блога Astro

![NPM Version](https://img.shields.io/npm/v/astro-theme-starread?logo=npm)&emsp;![GitHub Tag](https://img.shields.io/github/v/tag/passwordgloo/astro-theme-starread?logo=github)&emsp;![Created At](https://img.shields.io/github/created-at/passwordgloo/astro-theme-starread?logo=markdown)&emsp;![Last Commit](https://img.shields.io/github/last-commit/passwordgloo/astro-theme-starread?logo=Git)

Блестящая, но при этом простая и изысканная тема Astro со звездным качеством

## 📦 Установка

### Метод 1: Инициализация через CLI-инструмент

| Менеджер пакетов | Рекомендуемая команда                          |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` или `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init` (требуется Yarn v2+) |

>[!note]
>Мы предоставляем команду `create` для удобного создания темы в указанной папке

1. Создание проекта: в зависимости от используемого менеджера пакетов выберите одну из следующих команд：

```bash
# Использовать pnpm
pnpm create astro-theme-starread my-blog

# Использовать npm
npx create-astro-theme-starread my-blog

# Использовать yarn
yarn create astro-theme-starread my-blog

# Использовать cnpm
cnpm init astro-theme-starread my-blog

```

2. Перейти в каталог проекта：

```bash

cd my-blog

```

3. Установить зависимости：

```bash
pnpm install
```

4. Запустить сервер разработки：

```bash
pnpm dev
```

### Метод 2: Установка с использованием шаблона `astro`

>[!warning]
>Этот метод требует доступа к репозиторию Github, убедитесь в стабильном интернет-соединении.

| Менеджер пакетов | Команда                                        |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### Метод 3: Установка из исходного кода

>[!warning]
>该方式需访问Github仓库，确保网络畅通。


```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>После завершения установки запустите сервер разработки：
```bash
pnpm dev
```

## 📂 Структура проекта

```text
/
├── src/
│   ├── components/     # Файлы компонентов
│   ├── content/        # Конфигурация контента
│   ├── layouts/        # Шаблоны макетов
│   ├── pages/          # Маршруты страниц
│   └── styles/         # Файлы стилей
├── public/             # Статические ресурсы
└── dist/               # Результат сборки
```

## 🚀 Характеристики

- 🎨 Современный дизайн UI
- 🔍 Поддержка локального поиска (Pagefind) и поиска Algolia
- 📱 Адаптивный дизайн
- 🌙 Переключение темной/светлой темы
- 🏷️ Поддержка тегов и категорий
- 📊 Отображение статистики статей и информации об авторе

## 🔍 Поиск

### Локальный поиск

По умолчанию используется локальный поиск, при первом использовании запустите `pnpm local` для создания локального индекса

### Поиск Algolia

>[!important]
>В рабочей среде рекомендуется использовать настройку через переменные окружения, чтобы избежать раскрытия конфиденциальной информации в коде.

1. Отредактируйте `starread.config.ts` и выберите поиск Algolia
```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // Провайдер сервиса поиска: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. В корневом каталоге создайте и отредактируйте файл `.env`

>[!note]
>Для поиска Algolia требуется идентификатор приложения Algolia, ключ поиска, имя индекса и ключ API администратора.

>[!tip]
>Если у вас нет аккаунта Algolia, вам нужно сначала зарегистрироваться и создать приложение.

```env
PUBLIC_ALGOLIA_APP_ID=Идентификатор вашего приложения Algolia
PUBLIC_ALGOLIA_SEARCH_KEY=Ключ поиска Algolia
PUBLIC_ALGOLIA_INDEX_NAME=Название вашего индекса
ALGOLIA_WRITE_API_KEY=Ключ API для записи (для загрузки индекса)
```

3. Отправить индекс в Algolia

Запустите `pnpm algolia` для отправки локального индекса в Algolia

## ⚙️ Настройка

Вы можете настроить тему, изменив файл `starread.config.ts` в корневом каталоге, включая заголовок сайта, меню навигации, информацию об авторе, отображение компонентов боковой панели и т.д.

Пример конфигурации：
```typescript
// Изменить заголовок сайта
site: {
  title: 'Мой блог',
  // ...дополнительные настройки
}

// Настроить меню навигации
nav: [
  { name: '首页', href: '/' },
  { name: '关于', href: '/about' },
  // ...дополнительные пункты меню
]
```

## 🧞 Команды

| Команда                 | Описание                                       |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | Установить зависимости                         |
| `pnpm dev`               | Запустить локальный сервер разработки `localhost:4321` |
| `pnpm preview`           | Предварительный просмотр результата сборки локально |
| `pnpm local`             | Запустить автоматический скрипт индексирования и собрать производственный сайт |
| `pnpm algolia`           | Отправить данные в поиск Algolia                |
| `pnpm changelog`         | Сгенерировать журнал изменений                  |
| `pnpm release`           | Управление версиями (обновление номера версии, создание коммитов и т.д.) |
