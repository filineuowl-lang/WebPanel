# Enterprise Threat Analyzer

Современная веб-панель для анализа угроз инфраструктуры предприятия с интеграцией Zabbix, OpenAI (Local LLM) и Telegram.

## Архитектура

### Frontend
- **React** + Vite
- **Стиль**: Hi-Tech минимализм с пиксельными элементами
- **Тема**: Только тёмная
- **Адаптивность**: Desktop-first, не оптимизировано для мобильных

### Интеграции
1. **Zabbix API** - получение данных о хостах, триггерах, метриках
2. **OpenAI API** (совместимо с Local LLM) - анализ данных ИИ
3. **Telegram Bot API** - отправка уведомлений

## Структура проекта

```
enterprise-monitor/
├── src/
│   ├── components/
│   │   ├── Header.jsx/css       - Заголовок приложения
│   │   ├── ConfigPanel.jsx/css  - Настройка API подключений
│   │   ├── HostSelector.jsx/css - Выбор групп и узлов
│   │   ├── AnalysisPanel.jsx/css - Конфигурация анализа
│   │   └── LogPanel.jsx/css     - Логирование событий
│   ├── services/
│   │   ├── api.js      - API клиенты (Zabbix, OpenAI, Telegram)
│   │   └── analyzer.js - Логика анализа угроз
│   ├── App.jsx/css     - Главный компонент
│   ├── main.jsx        - Точка входа
│   └── index.css       - Глобальные стили
└── package.json
```

## Установка

```bash
cd enterprise-monitor
npm install
npm run dev
```

## Настройка

### Zabbix
1. Укажите URL API (например: `http://zabbix.example.com/api_jsonrpc.php`)
2. Введите учётные данные администратора
3. Нажмите "Test Connection"

### OpenAI / Local LLM
Для локальной модели (например, Ollama):
- Base URL: `http://localhost:11434`
- API Key: не требуется (или любое значение)

Для OpenAI:
- Base URL: `https://api.openai.com`
- API Key: ваш ключ API

### Telegram Bot
1. Создайте бота через @BotFather
2. Получите токен
3. Узнайте Chat ID через @getmyid_bot
4. Введите данные в панель конфигурации

## Использование

1. **Настройте подключения** к API в панели "API CONFIGURATION"
2. **Выберите цели** - группы хостов или отдельные узлы
3. **Настройте анализ**:
   - Custom Analysis Prompt - специфические инструкции для ИИ
   - System Prompt - переопределение системного промпта
   - Auto-create triggers - создание триггеров по рекомендациям ИИ
   - Send to Telegram - отправка результатов в TG
4. **Запустите анализ** кнопкой "RUN THREAT ANALYSIS"

## Рабочий процесс анализа

1. Сбор статистики из выбранных узлов Zabbix
2. Форматирование данных в промпт
3. Отправка в локальную ИИ-модель
4. Получение анализа угроз
5. Отправка результата в Telegram
6. Создание триггеров в Zabbix (если включено)

## Стиль интерфейса

- **Цветовая схема**: Тёмная с неоновыми акцентами
- **Элементы**: Пиксельные рамки, сканлайны, glow-эффекты
- **Шрифты**: Моноширинные для технических элементов
- **Анимации**: Пульсация, свечение при наведении

## Лицензия

Internal use only
