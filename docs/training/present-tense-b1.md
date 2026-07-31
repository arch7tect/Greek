# Тренажёр глаголов типа Β1

Тренажёр закрепляет материал урока 08: формы `μιλάω` `[miˈlao]`,
спряжение других глаголов на `-άω` `[-ˈao]` и отличие типа Β1 от типа Α.
Ошибочная карточка возвращается в конец сессии.

В режиме «Другие глаголы Β1» видны словарная форма и лицо. Нужно выбрать
окончание; все варианты ответа относятся к одному глаголу. Точные предложения
из назначенных упражнений 5–6 рабочей тетради не воспроизводятся, поэтому
тренажёр не раскрывает домашнюю работу.

<div id="verbs-b1-trainer" class="trainer" aria-label="Тренажёр глаголов типа Β1">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-verbs-b1-mode="milao" aria-pressed="true">Формы μιλάω</button>
        <button type="button" data-verbs-b1-mode="conjugation" aria-pressed="false">Другие глаголы Β1</button>
        <button type="button" data-verbs-b1-mode="contrast" aria-pressed="false">Α или Β1</button>
      </div>
    </fieldset>
    <fieldset class="trainer__mode-fieldset trainer__lesson-fieldset">
      <legend>Материал</legend>
      <select id="verbs-b1-trainer-lesson-filter" class="trainer__lesson-select" aria-label="Ограничить материал по уроку"></select>
    </fieldset>
    <button id="verbs-b1-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="verbs-b1-trainer-progress">Подготовка карточек…</span>
    <span id="verbs-b1-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="verbs-b1-trainer-prompt-label">
    <p id="verbs-b1-trainer-prompt-label" class="trainer__label">Выберите форму</p>
    <div id="verbs-b1-trainer-prompt" class="trainer__prompt"></div>
    <div id="verbs-b1-trainer-context" class="trainer__context"></div>
    <div id="verbs-b1-trainer-choices" class="trainer__choices"></div>
    <button id="verbs-b1-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="verbs-b1-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="verbs-b1-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/verbs-b1-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/verbs-b1-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Слабые карточки сохраняются в браузере и появляются в начале новой сессии.
Фильтр «Материал» общий для всех тренажёров.

## Как выбирать

1. Сначала проверить словарную форму: безударное `-ω` `[o]` указывает на
   тип Α, ударное `-άω / -ώ` `[-ˈao / -ˈo]` — на тип Β1.
2. Определить лицо и число.
3. Выбрать окончание Β1:
   `-άω, -άς, -άει, -άμε, -άτε, -άνε`
   `[-ˈao, -ˈas, -ˈai, -ˈame, -ˈate, -ˈane]`.

Карточки построены по таблице урока 08 и целевым глаголам упражнений 9–10
основного учебника и 5–6 рабочей тетради. Используются только проверенные
словарные формы и регулярная модель.

Правило целиком:
[настоящее время: глаголы типа Β1](../reference/grammar/present-tense-b1.md).
