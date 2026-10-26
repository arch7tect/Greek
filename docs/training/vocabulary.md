# Тренажёр слов по урокам

[Погода, времена года, месяцы и занятия](vocabulary.md?topic=weather) ·
[карточка погоды](../assets/mobile/core/card-18.png) ·
[календарь](../assets/mobile/core/card-16.png).
70 слов и целых выражений: солнце светит, пью холодную воду,
купаюсь в море, катаюсь на лыжах, ем мороженое, природа и занятия из видео.
Все 12 месяцев — названия и формы «в январе», «в феврале» и т. д.;
все четыре сезона и формы «весной», «зимой».
Открывается как обычный набор: «Основные» и «Греческий → русский».
Доступны три направления: перевод в обе стороны и письмо.
Не нужно угадывать сезон по занятию: тренируется перевод конкретной фразы.
Короткие сессии по десять карточек; прогресс каждого направления независим.

[Календарь — отдельный набор](vocabulary.md?topic=calendar) ·
[сквозная карточка 16](../assets/mobile/core/card-16.png).
38 записей: названия семи дней и двенадцати месяцев, вопрос «когда?»
и формы «в понедельник», «в январе» и т. д. Суббота не дублируется:
название и ответ имеют одинаковую форму. Все три направления доступны;
по умолчанию — «Основные» и «Греческий → русский».

[Время — отдельный набор](vocabulary.md?topic=time) ·
[сквозная карточка 15](../assets/mobile/core/card-15.png).
22 опорных слова и формулы: который час, во сколько, ровно, четверть,
половина, без четверти, через полчаса и шесть частей дня.
Перевод в обе стороны и письменный режим.
Открывается с обычным направлением «Греческий → русский»; режим выбираешь сам.

**К диктанту:** [профессии и места работы](vocabulary.md?topic=professions) ·
[шпаргалка A4 и для телефона](../memory/professions.md).
Кнопка «Профессии» рядом с уроком 10 открывает отдельный набор темы без посторонних слов:
женские формы отдельными записями, варианты через косую черту — одной записью.
По умолчанию выбраны «Основные» и «Греческий → русский», как для уроков.
В «Все слова» доступны все 84 записи, включая личное дополнение про IT.
Направление можно переключить:
оба устных, письменное или артикли.

Слова и устойчивые формулы из общего словаря разделены по урокам.
По умолчанию выбраны **«Новые слова»**: только слова, впервые введённые в выбранном уроке.
**«С повторением»** добавляет знакомые слова, которые снова встречаются в материалах этого урока,
а не все слова предыдущих занятий. Под карточкой видно: новое это слово или повторение из другого урока.
Например, урок 11: 56 новых слов или 103 с повторением в режиме «Все слова».
Если новых слов в выбранной части урока нет, включите повторение.
Для тематических наборов этот переключатель не нужен: там единая выборка.
Число на кнопке урока учитывает выбранный состав, набор и направление.

Режим «Основные» даёт
первый разговорный и учебный минимум, а «Все слова» добавляет лексику
фонетических упражнений. Одна сессия содержит до десяти карточек.

Словарь пополняется с каждым уроком, но не выдаётся одной сессией. Текущий
урок 01 открывается в режиме «Основные» с 26 словами; полный набор урока
содержит 57. Старые уроки остаются доступными по отдельным кнопкам.

Для домашнего задания урока 01 цель — прочитать слова и различить звуки и
ударение. Заучивать все 57 переводов за один раз не требуется. Набор из 26
основных слов — приоритет нашей тренировки, а не отдельное требование
преподавателя. Проходите его короткими сессиями по 5–10 слов.

<div id="vocabulary-trainer" class="trainer" aria-label="Тренажёр греческих слов">
  <div class="trainer__controls vocabulary-trainer__controls">
    <fieldset class="trainer__mode-fieldset">
      <legend>Урок или тема</legend>
      <div id="vocabulary-trainer-lessons" class="trainer__modes vocabulary-trainer__lessons"></div>
    </fieldset>

    <fieldset id="vocabulary-trainer-coverage" class="trainer__mode-fieldset">
      <legend>Состав урока</legend>
      <div class="trainer__modes vocabulary-trainer__two-modes">
        <button type="button" data-vocabulary-coverage="new" aria-pressed="true">Новые слова</button>
        <button type="button" data-vocabulary-coverage="review" aria-pressed="false">С повторением</button>
      </div>
    </fieldset>

    <fieldset class="trainer__mode-fieldset">
      <legend>Набор слов</legend>
      <div class="trainer__modes vocabulary-trainer__two-modes">
        <button type="button" data-vocabulary-scope="core" aria-pressed="true">Основные</button>
        <button type="button" data-vocabulary-scope="all" aria-pressed="false">Все слова</button>
      </div>
    </fieldset>

    <fieldset class="trainer__mode-fieldset">
      <legend>Направление</legend>
      <div class="trainer__modes vocabulary-trainer__two-modes">
        <button type="button" data-vocabulary-direction="greek-to-russian" aria-pressed="true">Греческий → русский</button>
        <button type="button" data-vocabulary-direction="russian-to-greek" aria-pressed="false">Русский → греческий</button>
        <button type="button" data-vocabulary-direction="writing" aria-pressed="false">Русский → написать</button>
        <button type="button" data-vocabulary-direction="article" aria-pressed="false">Артикль</button>
      </div>
    </fieldset>

    <button id="vocabulary-trainer-restart" type="button">Новая сессия</button>
    <button id="vocabulary-trainer-reset" type="button" aria-expanded="false" aria-controls="vocabulary-trainer-reset-panel">Сбросить прогресс урока в этом режиме</button>
  </div>

  <div id="vocabulary-trainer-reset-panel" hidden>
    <p id="vocabulary-trainer-reset-description"></p>
    <button id="vocabulary-trainer-reset-confirm" class="vocabulary-trainer__action" type="button">Сбросить и начать заново</button>
    <button id="vocabulary-trainer-reset-cancel" class="vocabulary-trainer__action" type="button">Отмена</button>
  </div>

  <div class="trainer__progress" aria-live="polite">
    <span id="vocabulary-trainer-progress">Подготовка карточек…</span>
    <span id="vocabulary-trainer-learned"></span>
  </div>

  <section class="trainer__question" aria-labelledby="vocabulary-trainer-prompt-label">
    <p id="vocabulary-trainer-prompt-label" class="trainer__label">Вспомните перевод</p>
    <div id="vocabulary-trainer-prompt" class="trainer__prompt"></div>
    <div id="vocabulary-trainer-context" class="trainer__context"></div>
    <button id="vocabulary-trainer-hint" class="vocabulary-trainer__action" type="button">Показать транскрипцию</button>
    <div id="vocabulary-trainer-hint-text" class="vocabulary-trainer__hint" aria-live="polite"></div>
    <button id="vocabulary-trainer-reveal" class="vocabulary-trainer__action" type="button">Показать ответ</button>
  </section>

  <form id="vocabulary-trainer-writing" class="vocabulary-trainer__writing" hidden>
    <label for="vocabulary-trainer-input">Напишите по-гречески</label>
    <input id="vocabulary-trainer-input" type="text" lang="el" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="vocabulary-trainer-writing-help vocabulary-trainer-writing-feedback">
    <p id="vocabulary-trainer-writing-help">Существительное — с артиклем. Если есть несколько словарных вариантов, достаточно одного.</p>
    <div id="vocabulary-trainer-keyboard" class="vocabulary-trainer__keyboard" role="group" aria-label="Греческие буквы по алфавиту"></div>
    <button id="vocabulary-trainer-check" class="vocabulary-trainer__action" type="submit">Проверить</button>
    <div id="vocabulary-trainer-writing-feedback" class="vocabulary-trainer__writing-feedback" aria-live="polite"></div>
    <button id="vocabulary-trainer-next" class="vocabulary-trainer__action" type="button" hidden>Дальше</button>
  </form>

  <div id="vocabulary-trainer-answer" class="vocabulary-trainer__answer" aria-live="polite" hidden></div>
  <div id="vocabulary-trainer-ratings" class="vocabulary-trainer__ratings" hidden>
    <button type="button" data-vocabulary-rating="again">1 · Не помню</button>
    <button type="button" data-vocabulary-rating="unsure">2 · Сомневаюсь</button>
    <button type="button" data-vocabulary-rating="know">3 · Знаю</button>
  </div>

  <noscript>Для работы тренажёра нужно разрешить JavaScript.</noscript>
</div>

<script src="../../assets/data/vocabulary-data.js"></script>
<script src="../../assets/javascripts/trainer-engine.js"></script>
<script src="../../assets/javascripts/vocabulary-writing.js"></script>
<script src="../../assets/javascripts/vocabulary-selection.js"></script>
<script src="../../assets/javascripts/vocabulary-trainer.js"></script>

Оценка «Не помню» возвращает карточку в текущую сессию, «Сомневаюсь» — в
следующую, а «Знаю» откладывает её повторение. Прогресс сохраняется только в
этом браузере. Клавиша `Space` показывает ответ, `1`–`3` выбирают оценку.

**Каждое направление имеет собственный прогресс:** понимание греческого,
вспоминание греческого по переводу, письмо и артикли тренируются независимо.
«Новая сессия» берёт до десяти ещё не изученных или подошедших к повторению
слов. **«Сбросить прогресс набора в этом режиме»** после подтверждения возвращает
слова выбранного состава урока («Новые слова» или «С повторением») либо темы
к началу обучения только в текущем направлении, включая дополнительные слова.
Другие слова и направления не меняются; знакомые слова, общие с другими
наборами, имеют общий прогресс внутри одного направления. Короткие сессии по десять
слов сохраняются; проходите их одну за другой, чтобы повторить весь набор.

Результаты, сохранённые до разделения направлений, оставлены в режиме
«Греческий → русский»: старый формат не записывал, в какую сторону был ответ.
Ранее сохранённые результаты письма также сохранены. Остальные направления
начинаются независимо с нуля.

В направлении **греческий → русский** подсказка показывает транскрипцию. В
обратном направлении её нет: транскрипция раскрыла бы греческий ответ.

Направление **«Артикль»** показывает слово с пропуском на месте артикля:
нужно вспомнить `ο` `[o]`, `η` `[i]` или `το` `[to]` (во множественном числе
`οι` `[i]` или `τα` `[ta]`). В набор попадают только слова, записанные с
артиклем; транскрипция в задании не показывается, потому что она начинается
с артикля и раскрыла бы ответ. Род существительного — основа для выбора
винительных форм в
[тренажёре `από` `[aˈpo]` и `σε` `[se]`](accusative-after-apo-se.md).

В направлении **«Русский → написать»** введите греческое слово или фразу и
нажмите «Проверить» либо `Enter`. Гласные с ударением и двумя точками стоят
рядом с обычными; конечная сигма — рядом с обычной. Экранная клавиатура
добавляет букву в место курсора и заменяет выделенный текст. Пробел, удаление,
знаки и заглавные вводятся обычной клавиатурой.

Проверка различает ошибку в буквах и ошибку только в ударении; показывает
правильное написание и выделяет отличающийся участок. Регистр и лишние
пробелы не учитываются, но артикль, ударение и две точки важны.
Варианты, записанные через косую черту в словаре, принимаются по одному.
После ошибки можно исправить ответ; слово всё равно вернётся в конце сессии.
«Показать ответ» также оставляет слово для повторения. Прогресс письма
сохраняется отдельно от устного вспоминания; оценка результата автоматическая.

Состав наборов автоматически строится из словарей уроков. Если знакомое слово
снова задано, оно может входить в несколько наборов без дублирования в
[общем словаре](../vocabulary/all.md). Первое появление и прогресс слова
сохраняются. При сбросе такое слово вернётся к началу в выбранном направлении
и в других наборах, где оно повторяется. Имена людей не включаются.
То же относится к тематическому набору: это выборка слов, а не копия словаря.
Если всё уже изучено, кнопка «Сбросить прогресс набора в этом режиме» позволяет
после подтверждения пройти всю тему сначала.
