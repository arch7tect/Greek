# Тренажёр слов по урокам

Слова и устойчивые формулы из общего словаря разделены по урокам. Режим «Основные» даёт
первый разговорный и учебный минимум, а «Все слова» добавляет лексику
фонетических упражнений. Одна сессия содержит до десяти карточек.

<div id="vocabulary-trainer" class="alphabet-trainer" aria-label="Тренажёр греческих слов">
  <div class="alphabet-trainer__controls vocabulary-trainer__controls">
    <fieldset class="alphabet-trainer__mode-fieldset">
      <legend>Урок</legend>
      <div id="vocabulary-trainer-lessons" class="alphabet-trainer__modes vocabulary-trainer__lessons"></div>
    </fieldset>

    <fieldset class="alphabet-trainer__mode-fieldset">
      <legend>Набор слов</legend>
      <div class="alphabet-trainer__modes vocabulary-trainer__two-modes">
        <button type="button" data-vocabulary-scope="core" aria-pressed="true">Основные</button>
        <button type="button" data-vocabulary-scope="all" aria-pressed="false">Все слова</button>
      </div>
    </fieldset>

    <fieldset class="alphabet-trainer__mode-fieldset">
      <legend>Направление</legend>
      <div class="alphabet-trainer__modes vocabulary-trainer__two-modes">
        <button type="button" data-vocabulary-direction="greek-to-russian" aria-pressed="true">Греческий → русский</button>
        <button type="button" data-vocabulary-direction="russian-to-greek" aria-pressed="false">Русский → греческий</button>
      </div>
    </fieldset>

    <button id="vocabulary-trainer-restart" type="button">Новая сессия</button>
  </div>

  <div class="alphabet-trainer__progress" aria-live="polite">
    <span id="vocabulary-trainer-progress">Подготовка карточек…</span>
    <span id="vocabulary-trainer-learned"></span>
  </div>

  <section class="alphabet-trainer__question" aria-labelledby="vocabulary-trainer-prompt-label">
    <p id="vocabulary-trainer-prompt-label" class="alphabet-trainer__label">Вспомните перевод</p>
    <div id="vocabulary-trainer-prompt" class="alphabet-trainer__prompt"></div>
    <div id="vocabulary-trainer-context" class="alphabet-trainer__context"></div>
    <button id="vocabulary-trainer-hint" class="vocabulary-trainer__action" type="button">Показать транскрипцию</button>
    <div id="vocabulary-trainer-hint-text" class="vocabulary-trainer__hint" aria-live="polite"></div>
    <button id="vocabulary-trainer-reveal" class="vocabulary-trainer__action" type="button">Показать ответ</button>
  </section>

  <div id="vocabulary-trainer-answer" class="vocabulary-trainer__answer" aria-live="polite" hidden></div>
  <div id="vocabulary-trainer-ratings" class="vocabulary-trainer__ratings" hidden>
    <button type="button" data-vocabulary-rating="again">1 · Не помню</button>
    <button type="button" data-vocabulary-rating="unsure">2 · Сомневаюсь</button>
    <button type="button" data-vocabulary-rating="know">3 · Знаю</button>
  </div>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/vocabulary-data.js"></script>
<script src="../../assets/javascripts/vocabulary-trainer.js"></script>

Оценка «Не помню» возвращает карточку в текущую сессию, «Сомневаюсь» — в
следующую, а «Знаю» откладывает её повторение. Прогресс сохраняется только в
этом браузере. Клавиша `Space` показывает ответ, `1`–`3` выбирают оценку.

В направлении **греческий → русский** подсказка показывает транскрипцию. В
обратном направлении её нет: транскрипция раскрыла бы греческий ответ.

Состав наборов автоматически строится из [общего словаря](../vocabulary/all.md).
Имена людей не включаются.
