# Тренажёр артиклей и разговора об учёбе

Тренажёр закрепляет новые темы урока 07: род и выбор между определённым и
неопределённым артиклем, реплики об учёбе и различие между страной,
национальностью человека и языком.

<div id="articles-studies-trainer" class="trainer" aria-label="Тренажёр артиклей и разговора об учёбе">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-articles-studies-mode="articles" aria-pressed="true">Известный или новый</button>
        <button type="button" data-articles-studies-mode="studies" aria-pressed="false">Разговор об учёбе</button>
        <button type="button" data-articles-studies-mode="country" aria-pressed="false">Страна, человек, язык</button>
      </div>
    </fieldset>
    <fieldset class="trainer__mode-fieldset trainer__lesson-fieldset">
      <legend>Материал</legend>
      <select id="articles-studies-trainer-lesson-filter" class="trainer__lesson-select" aria-label="Ограничить материал по уроку"></select>
    </fieldset>
    <button id="articles-studies-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="articles-studies-trainer-progress">Подготовка карточек…</span>
    <span id="articles-studies-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="articles-studies-trainer-prompt-label">
    <p id="articles-studies-trainer-prompt-label" class="trainer__label">Выберите форму</p>
    <div id="articles-studies-trainer-prompt" class="trainer__prompt"></div>
    <div id="articles-studies-trainer-context" class="trainer__context"></div>
    <div id="articles-studies-trainer-choices" class="trainer__choices"></div>
    <button id="articles-studies-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="articles-studies-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="articles-studies-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/articles-studies-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/articles-studies-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Ошибочная карточка возвращается в конец сессии. В заданиях с пропуском
транскрипция появляется только после ответа, чтобы не раскрывать форму.

## Как выбирать

- Сначала вспомнить род: `ο` `[o]`, `η` `[i]` или `το` `[to]`.
- Для известного предмета выбрать определённый артикль; для одного нового —
  `ένας / μία / ένα` `[ˈenas / ˈmia / ˈena]`.
- После `είμαι από` `[ˈime aˈpo]` нужна страна, после `είμαι` `[ˈime]` —
  национальность человека, после `μιλάω` `[miˈlao]` — язык.

Карточки взяты из [урока 07](../lessons/lesson-07-classroom-studies-and-articles.md):
основной учебник, печатные страницы 42–46 (PDF 41–45). Точные соответствия
из заданного упражнения рабочей тетради и ответы упражнения 15 не включены,
поэтому тренажёр не подсказывает домашнюю работу.

Полные правила:
[артикли в именительном](../reference/grammar/nominative-articles.md) и
[происхождение и место жительства](../reference/grammar/origin-and-residence.md).
