# Тренажёр чисел

Тренажёр закрепляет числа уроков 04 и 06: от 0 до 10, от 11 до 100,
составные числа и чтение коротких адресов. Ошибочная карточка возвращается
в конец сессии, пока не будет отвечена правильно.

<div id="numbers-trainer" class="trainer" aria-label="Тренажёр греческих чисел">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-numbers-mode="digit-to-word" aria-pressed="true">0–10: цифра → слово</button>
        <button type="button" data-numbers-mode="word-to-digit" aria-pressed="false">0–10: слово → цифра</button>
        <button type="button" data-numbers-mode="digit-to-word-100" aria-pressed="false">11–100: цифра → слово</button>
        <button type="button" data-numbers-mode="word-to-digit-100" aria-pressed="false">11–100: слово → цифра</button>
        <button type="button" data-numbers-mode="composite" aria-pressed="false">Составные числа</button>
        <button type="button" data-numbers-mode="addresses" aria-pressed="false">Адреса и номера</button>
      </div>
    </fieldset>
    <fieldset class="trainer__mode-fieldset trainer__lesson-fieldset">
      <legend>Материал</legend>
      <select id="numbers-trainer-lesson-filter" class="trainer__lesson-select" aria-label="Ограничить материал по уроку"></select>
    </fieldset>
    <button id="numbers-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="numbers-trainer-progress">Подготовка карточек…</span>
    <span id="numbers-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="numbers-trainer-prompt-label">
    <p id="numbers-trainer-prompt-label" class="trainer__label">Выберите ответ</p>
    <div id="numbers-trainer-prompt" class="trainer__prompt"></div>
    <div id="numbers-trainer-context" class="trainer__context"></div>
    <div id="numbers-trainer-choices" class="trainer__choices"></div>
    <button id="numbers-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="numbers-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="numbers-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/numbers-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/numbers-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Ошибки сохраняются в этом браузере: слабые карточки появляются в начале новой
сессии и уходят из слабых после двух правильных ответов подряд.
Фильтр «Материал» ограничивает карточки пройденными уроками; выбор общий для
всех тренажёров и хранится в этом браузере.

## Про `εφτά` `[eˈfta]` и `επτά` `[eˈpta]`

Для 7, 8 и 9 учебник даёт по два нормативных варианта:
`εφτά / επτά` `[eˈfta / eˈpta]`, `οχτώ / οκτώ` `[oˈhto / oˈkto]`,
`εννιά / εννέα` `[eˈnya / eˈnea]`. Первый вариант каждой пары разговорный и
особенно частотный в устной речи, второй — нейтральный и обычный для
официальной речи. Оба варианта правильные, но части разных вариантов нельзя
смешивать внутри одного слова.

Полные таблицы с примерами: [числа от 0 до 10](../reference/numbers-0-10.md)
и [числа от 11 до 100](../reference/numbers-11-100.md).
