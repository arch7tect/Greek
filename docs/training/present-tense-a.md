# Тренажёр первого спряжения

Тренажёр закрепляет окончания настоящего времени из урока 05: соответствие
окончания и лица, формы `μένω` `[ˈmeno]` и подстановку формы в проверенные
фразы упражнения 10. Варианты ответа — всегда формы одного и того же глагола,
поэтому выбирать приходится именно окончание. Ошибочная карточка
возвращается в конец сессии.

В режиме «Фраза с пропуском» транскрипция фразы в задании намеренно не
показывается — пропущенная форма входит в неё. Словарная форма глагола с
транскрипцией видна под фразой, а полная фраза с транскрипцией появляется
в объяснении.

<div id="verbs-a-trainer" class="trainer" aria-label="Тренажёр глаголов первого спряжения">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-verbs-a-mode="endings" aria-pressed="true">Окончание → лицо</button>
        <button type="button" data-verbs-a-mode="meno" aria-pressed="false">Формы μένω</button>
        <button type="button" data-verbs-a-mode="phrases" aria-pressed="false">Фраза с пропуском</button>
      </div>
    </fieldset>
    <button id="verbs-a-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="verbs-a-trainer-progress">Подготовка карточек…</span>
    <span id="verbs-a-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="verbs-a-trainer-prompt-label">
    <p id="verbs-a-trainer-prompt-label" class="trainer__label">Выберите ответ</p>
    <div id="verbs-a-trainer-prompt" class="trainer__prompt"></div>
    <div id="verbs-a-trainer-context" class="trainer__context"></div>
    <div id="verbs-a-trainer-choices" class="trainer__choices"></div>
    <button id="verbs-a-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="verbs-a-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="verbs-a-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/verbs-a-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/verbs-a-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Ошибки сохраняются в этом браузере: слабые карточки появляются в начале новой
сессии и уходят из слабых после двух правильных ответов подряд.

Фразы взяты только из упражнения 10 презентации. Домашние упражнения 11 и 14
в тренажёр сознательно не включены, пока
[домашнее задание](../homework/lesson-05-verbs-and-matching.md) не выполнено
и не проверено — иначе тренажёр подсказал бы ответы.

Правило целиком:
[настоящее время: глаголы первого спряжения](../reference/grammar/present-tense-a.md).
