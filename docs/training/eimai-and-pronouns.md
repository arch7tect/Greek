# Тренажёр `είμαι` `[ˈime]` и личных местоимений

Тренажёр помогает автоматически связывать местоимение с нужной формой
`είμαι` `[ˈime]`. В режиме с фразами форма выбирается уже внутри проверенного
примера из уроков 02–03. Ошибочная карточка возвращается в конец сессии.

<div id="eimai-trainer" class="trainer" aria-label="Тренажёр глагола είμαι и личных местоимений">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-eimai-mode="pronoun-to-form" aria-pressed="true">Местоимение → форма</button>
        <button type="button" data-eimai-mode="form-to-pronoun" aria-pressed="false">Форма → местоимение</button>
        <button type="button" data-eimai-mode="phrases" aria-pressed="false">Фраза с пропуском</button>
      </div>
    </fieldset>
    <button id="eimai-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="eimai-trainer-progress">Подготовка карточек…</span>
    <span id="eimai-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="eimai-trainer-prompt-label">
    <p id="eimai-trainer-prompt-label" class="trainer__label">Выберите ответ</p>
    <div id="eimai-trainer-prompt" class="trainer__prompt"></div>
    <div id="eimai-trainer-context" class="trainer__context"></div>
    <div id="eimai-trainer-choices" class="trainer__choices"></div>
    <button id="eimai-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="eimai-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="eimai-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/eimai-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/eimai-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Ошибки сохраняются в этом браузере: слабые карточки появляются в начале новой
сессии и уходят из слабых после двух правильных ответов подряд.

Перед тренировкой можно повторить таблицу
[`είμαι` `[ˈime]`](../reference/grammar/eimai.md) и
[личные местоимения](../reference/grammar/personal-pronouns.md).

## Что тренируется

- `εγώ είμαι` `[eˈɣo ˈime]` и `εσύ είσαι` `[eˈsi ˈise]`;
- третье лицо `είναι` `[ˈine]` в единственном и множественном числе;
- `εμείς είμαστε` `[eˈmis ˈimaste]` и
  `εσείς είστε / είσαστε` `[eˈsis ˈiste / ˈisaste]`;
- выбор формы внутри короткого предложения.
