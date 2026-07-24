# Тренажёр анкеты и секретариата

Тренажёр закрепляет проверенный диалог урока 06: вопросы секретаря, подходящие
ответы посетителя и лексику регистрации и электронного адреса. Карточки
воспроизводят модели диалога, но не ответы аудирования с неуверенно
распознанными личными данными.

<div id="registration-trainer" class="trainer" aria-label="Тренажёр анкеты и диалога в секретариате">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-registration-mode="ask" aria-pressed="true">Вопрос секретаря</button>
        <button type="button" data-registration-mode="reply" aria-pressed="false">Ответ посетителя</button>
        <button type="button" data-registration-mode="form" aria-pressed="false">Анкета и e-mail</button>
      </div>
    </fieldset>
    <fieldset class="trainer__mode-fieldset trainer__lesson-fieldset">
      <legend>Материал</legend>
      <select id="registration-trainer-lesson-filter" class="trainer__lesson-select" aria-label="Ограничить материал по уроку"></select>
    </fieldset>
    <button id="registration-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="registration-trainer-progress">Подготовка карточек…</span>
    <span id="registration-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="registration-trainer-prompt-label">
    <p id="registration-trainer-prompt-label" class="trainer__label">Выберите реплику</p>
    <div id="registration-trainer-prompt" class="trainer__prompt"></div>
    <div id="registration-trainer-context" class="trainer__context"></div>
    <div id="registration-trainer-choices" class="trainer__choices"></div>
    <button id="registration-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="registration-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="registration-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/registration-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/registration-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Ошибочная карточка возвращается в конец сессии, а прогресс сохраняется в этом
браузере.

## Что различать

- `Πώς λέγεστε;` `[pos ˈleyeste?]` — официальный вопрос об имени;
  `Πώς σε λένε;` `[pos se ˈlene?]` — одному человеку на «ты».
- `Από πού είστε;` `[aˈpo pu ˈiste?]` спрашивает о происхождении;
  `Τώρα πού μένετε;` `[ˈtora pu ˈmenete?]` — о текущем месте жительства.
- `Ορίστε` `[oˈriste]` сопровождает передачу вещи, а
  `Μάλιστα` `[ˈmalista]` вежливо подтверждает сказанное.

Источник: диалог `Είστε Ισπανίδα;` `[ˈiste ispaˈniða?]` из
[урока 06](../lessons/lesson-06-numbers-and-prepositions.md#lesson-06-materials),
основной учебник, печатная страница 40 (PDF 39).
