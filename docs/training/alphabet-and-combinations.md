# Тренажёр букв и буквосочетаний

Тренажёр помогает узнавать 24 греческие буквы, вспоминать их основные звуки и
читать сочетания из урока 01. Ошибочная карточка возвращается в конец сессии,
пока не будет отвечена правильно.

<div id="alphabet-trainer" class="trainer" aria-label="Тренажёр греческого алфавита">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-mode="letter-to-sound" aria-pressed="true">Буква → звук</button>
        <button type="button" data-mode="sound-to-letter" aria-pressed="false">Звук → буква</button>
        <button type="button" data-mode="combinations" aria-pressed="false">Буквосочетания</button>
      </div>
    </fieldset>
    <fieldset class="trainer__mode-fieldset trainer__lesson-fieldset">
      <legend>Материал</legend>
      <select id="alphabet-trainer-lesson-filter" class="trainer__lesson-select" aria-label="Ограничить материал по уроку"></select>
    </fieldset>
    <button id="alphabet-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="alphabet-trainer-progress">Подготовка карточек…</span>
    <span id="alphabet-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="alphabet-trainer-prompt-label">
    <p id="alphabet-trainer-prompt-label" class="trainer__label">Выберите ответ</p>
    <div id="alphabet-trainer-prompt" class="trainer__prompt"></div>
    <div id="alphabet-trainer-context" class="trainer__context"></div>
    <div id="alphabet-trainer-choices" class="trainer__choices"></div>
    <button id="alphabet-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="alphabet-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="alphabet-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/alphabet-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/alphabet-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Ошибки сохраняются в этом браузере: слабые карточки появляются в начале новой
сессии и уходят из слабых после двух правильных ответов подряд.
Фильтр «Материал» ограничивает карточки пройденными уроками; выбор общий для
всех тренажёров и хранится в этом браузере.

Правила и спорные случаи можно повторить в справочнике
[«Алфавит и чтение»](../reference/alphabet-and-reading.md). Транскрипция следует
[учебной системе проекта](../reference/transcription.md).

## Область тренировки

- все 24 буквы и их названия;
- несколько букв для одинаковых гласных `[i]` и `[o]`;
- `αι, ει, οι, υι, ου` `[e, i, i, i, u]`;
- позиционное чтение `αυ` `[av/af]` и `ευ` `[ev/ef]`;
- `μπ, ντ, γκ, γγ, τσ, τζ` `[b/mb, d/nd, g/ŋg, ŋg, ts, dz/ndz]`.
