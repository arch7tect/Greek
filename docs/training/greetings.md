# Тренажёр приветствий и знакомства

Тренажёр закрепляет формулы уроков 01–04 по ситуации: как поздороваться и
попрощаться в зависимости от времени и адресата, как познакомиться и как
спросить о делах. Задание описывает ситуацию по-русски, выбрать нужно
греческую реплику; после ответа показывается объяснение с контрастной парой.
Ошибочная карточка возвращается в конец сессии.

<div id="greetings-trainer" class="trainer" aria-label="Тренажёр греческих приветствий и формул знакомства">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-greetings-mode="greet" aria-pressed="true">Приветствие и прощание</button>
        <button type="button" data-greetings-mode="meet" aria-pressed="false">Знакомство</button>
        <button type="button" data-greetings-mode="how-are-you" aria-pressed="false">Как дела</button>
      </div>
    </fieldset>
    <button id="greetings-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="greetings-trainer-progress">Подготовка карточек…</span>
    <span id="greetings-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="greetings-trainer-prompt-label">
    <p id="greetings-trainer-prompt-label" class="trainer__label">Выберите реплику</p>
    <div id="greetings-trainer-prompt" class="trainer__prompt"></div>
    <div id="greetings-trainer-context" class="trainer__context"></div>
    <div id="greetings-trainer-choices" class="trainer__choices"></div>
    <button id="greetings-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="greetings-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="greetings-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/greetings-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/greetings-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Ошибки сохраняются в этом браузере: слабые карточки появляются в начале новой
сессии и уходят из слабых после двух правильных ответов подряд.

Тренажёр специально сталкивает похожие формулы: `Γεια σου / Γεια σας`
`[ya su / ya sas]`, `Καλησπέρα` `[kaliˈspera]` против `Καλό βράδυ`
`[kaˈlo ˈvraði]`, `Χαίρω πολύ` `[ˈhero poˈli]` против `Χάρηκα πολύ`
`[ˈharika poˈli]`, `Καλώς ήρθες / ήρθατε` `[kaˈlos ˈirθes / ˈirθate]` —
выбор всегда зависит от адресата и момента разговора.

Полные таблицы с употреблением:
[приветствия и знакомство](../reference/greetings-and-introductions.md).
