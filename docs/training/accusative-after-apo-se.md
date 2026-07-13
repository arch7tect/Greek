# Тренажёр винительного после `από` `[aˈpo]` и `σε` `[se]`

Тренажёр закрепляет выбор артикля после `από` `[aˈpo]` и слитных форм
`στον / στην / στη / στο` `[ston / stin / sti / sto]` из уроков 02 и 04.
Нужно выбрать форму по роду слова и первому звуку после артикля; после ответа
показывается полная фраза и объяснение, почему форма именно такая.

В задании транскрипция фразы намеренно не показывается — она раскрыла бы
пропущенную форму. Исходное слово с артиклем и транскрипцией видно под фразой,
а полная фраза с транскрипцией появляется в объяснении.

<div id="accusative-trainer" class="trainer" aria-label="Тренажёр винительного падежа после από и σε">
  <div class="trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Режим тренировки</legend>
      <div class="trainer__modes">
        <button type="button" data-accusative-mode="apo" aria-pressed="true">После από</button>
        <button type="button" data-accusative-mode="se" aria-pressed="false">После σε</button>
      </div>
    </fieldset>
    <button id="accusative-trainer-restart" type="button">Начать заново</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="accusative-trainer-progress">Подготовка карточек…</span>
    <span id="accusative-trainer-score"></span>
  </div>

  <section class="trainer__question" aria-labelledby="accusative-trainer-prompt-label">
    <p id="accusative-trainer-prompt-label" class="trainer__label">Выберите форму</p>
    <div id="accusative-trainer-prompt" class="trainer__prompt"></div>
    <div id="accusative-trainer-context" class="trainer__context"></div>
    <div id="accusative-trainer-choices" class="trainer__choices"></div>
    <button id="accusative-trainer-unknown" class="trainer__unknown" type="button">Не знаю</button>
  </section>

  <div id="accusative-trainer-feedback" class="trainer__feedback" aria-live="polite"></div>
  <button id="accusative-trainer-next" class="trainer__next" type="button" hidden>Следующая</button>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/accusative-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/accusative-trainer.js"></script>

Клавиши `1`–`4` выбирают вариант, `Enter` открывает следующую карточку.
Ошибки сохраняются в этом браузере: слабые карточки появляются в начале новой
сессии и уходят из слабых после двух правильных ответов подряд.

## Как выбирать форму

1. Определить род слова по артиклю: `ο` `[o]` — мужской, `η` `[i]` — женский,
   `το` `[to]` — средний. Осторожно с `η Κύπρος` `[i ˈkipros]`: окончание
   `-ος` `[os]` обычно подсказывает мужской род, но это слово женского рода.
2. Для женского рода решить, остаётся ли конечное `ν` `[n]`: оно сохраняется
   перед гласной и перед `κ, π, τ, ξ, ψ` `[k, p, t, ks, ps]`, а также
   `γκ, μπ, ντ, τσ, τζ` `[g, b, d, ts, dz]`; перед остальными звуками
   опускается.
3. После `σε` `[se]` артикль сливается: `στον / στην / στη / στο`
   `[ston / stin / sti / sto]`. Раздельное `σε την` — ошибка.

Полные правила и примеры: [происхождение и место жительства](../reference/grammar/origin-and-residence.md).
