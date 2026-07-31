# Тренажёр семьи и форм принадлежности

Тренажёр закрепляет урок 09: родственные связи, выбор
`μου / σου / του / της / μας / σας / τους`
`[mu / su / tu / tis / mas / sas / tus]` и дополнительное ударение перед
безударной формой принадлежности.

В режиме «Вставить форму» транскрипция полной фразы появляется только после
ответа, потому что заранее показанная форма раскрыла бы пропуск.

<div id="family-possessives-trainer" class="trainer" aria-label="Тренажёр семьи и форм принадлежности">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-family-possessives-mode="relations" aria-pressed="true">Кто кому?</button>
        <button type="button" data-family-possessives-mode="possessives" aria-pressed="false">Вставить форму</button>
        <button type="button" data-family-possessives-mode="stress" aria-pressed="false">Второе ударение</button>
      </div>
    </fieldset>
    <fieldset class="trainer__mode-fieldset trainer__lesson-fieldset">
      <legend>Материал</legend>
      <select id="family-possessives-trainer-lesson-filter" class="trainer__lesson-select" aria-label="Ограничить материал по уроку"></select>
    </fieldset>
    <button id="family-possessives-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="family-possessives-trainer-progress">Подготовка карточек…</span>
    <span id="family-possessives-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="family-possessives-trainer-prompt-label">
    <p id="family-possessives-trainer-prompt-label" class="trainer__label">Выберите ответ</p>
    <div id="family-possessives-trainer-prompt" class="trainer__prompt"></div>
    <div id="family-possessives-trainer-context" class="trainer__context"></div>
    <div id="family-possessives-trainer-choices" class="trainer__choices"></div>
    <button id="family-possessives-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="family-possessives-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="family-possessives-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/family-possessives-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/family-possessives-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Ошибочные карточки возвращаются в текущую сессию и сохраняются как слабые
до двух правильных ответов подряд.

## Как выбирать форму

1. Определить владельца, а не род предмета:
   `εγώ → μου` `[eˈɣo → mu]`,
   `αυτή → της` `[afˈti → tis]`,
   `αυτοί → τους` `[afˈti → tus]`.
2. Поставить короткую форму после существительного:
   `η μητέρα μου` `[i miˈtera mu]`.
3. Проверить ударение. У слова с ударением на третьем слоге от конца
   появляется второе:
   `η οικογένεια → η οικογένειά μου`
   `[i ikoˈyenia → i ikoˈyeniˈa mu]`.

Карточки родственных связей взяты из диалога, схем семьи и упражнения 1
рабочей тетради. Режим принадлежности строится по проверенной таблице урока.
Точные ответы назначенного упражнения 4 не воспроизводятся.

Правило целиком:
[личные местоимения и формы принадлежности](../reference/grammar/personal-pronouns.md).
