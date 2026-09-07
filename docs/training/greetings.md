# Тренажёр приветствий и знакомства

Начните с **«8 фраз урока 01»**: это небольшой набор из памятки преподавателя —
поздороваться, спросить имя на «ты» или «вы», представиться, выразить радость
от знакомства, ответить взаимностью и попрощаться.

Сначала произнесите ответ вслух, затем выберите греческую реплику. Транскрипция
рядом поможет проверить чтение. После первого круга включите **«Ответ в диалоге»**:
шесть коротких ситуаций, где нужно ответить собеседнику. В реплике «меня зовут …»
произносите своё имя. Тренажёр проверяет выбор реплики; произношение здесь не оценивается.

После ответа появляется объяснение, а ошибочная карточка возвращается в конец
сессии. Другие режимы сохраняют более широкий материал прежних уроков.

<div id="greetings-trainer" class="trainer" aria-label="Тренажёр греческих приветствий и формул знакомства">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-greetings-mode="lesson-01" aria-pressed="true">8 фраз урока 01</button>
        <button type="button" data-greetings-mode="lesson-01-dialogue" aria-pressed="false">Ответ в диалоге</button>
        <button type="button" data-greetings-mode="greet" aria-pressed="false">Приветствие и прощание</button>
        <button type="button" data-greetings-mode="meet" aria-pressed="false">Знакомство</button>
        <button type="button" data-greetings-mode="how-are-you" aria-pressed="false">Как дела</button>
      </div>
    </fieldset>
    <fieldset class="trainer__mode-fieldset trainer__lesson-fieldset">
      <legend>Материал</legend>
      <select id="greetings-trainer-lesson-filter" class="trainer__lesson-select" aria-label="Ограничить материал по уроку"></select>
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
Фильтр «Материал» ограничивает карточки пройденными уроками; выбор общий для
всех тренажёров и хранится в этом браузере.

В расширенных режимах тренажёр сталкивает похожие формулы: `Γεια σου / Γεια σας`
`[ya su / ya sas]`, `Καλησπέρα` `[kaliˈspera]` против `Καλό βράδυ`
`[kaˈlo ˈvraði]`, `Χαίρω πολύ` `[ˈhero poˈli]` против `Χάρηκα πολύ`
`[ˈharika poˈli]`, `Καλώς ήρθες / ήρθατε` `[kaˈlos ˈirθes / ˈirθate]` —
выбор всегда зависит от адресата и момента разговора.

Полные таблицы с употреблением:
[приветствия и знакомство](../reference/greetings-and-introductions.md).

Источник набора «8 фраз урока 01» и диалогов:
[памятка с приветствиями из текущего урока](../lessons/lesson-01-alphabet-and-greetings.md#lesson-01-materials).
На её основе составлены учебные ситуации; они не являются записью реального разговора.
