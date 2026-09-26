"""Render the approved 30-question collection into A4, phone PDF and wiki.

Source text is shared by all formats. Provenance: extracted/memory/questions-source-audit.md.
"""
from pathlib import Path
from html import escape
import re
import shutil
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
FONTS = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies/native'
pdfmetrics.registerFont(TTFont('QA', str(FONTS / 'poppler/poppler/fonts/DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('QABold', str(FONTS / 'libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype/DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('QA', normal='QA', bold='QABold')
blocks = []
for line in (ROOT / 'scripts/mobile-data/questions.txt').read_text().splitlines():
    if line.startswith('# '):
        ident, title = line[2:].split(' | ')
        blocks.append(dict(id=ident, title=title, rows=[], notes=[]))
    elif line.startswith('! '):
        blocks[-1]['notes'].append(line[2:])
    elif line.strip():
        row = line.split(' | ')
        assert len(row) == 4, line
        assert row[2] and row[3], line
        blocks[-1]['rows'].append(row)
assert [b['id'] for b in blocks if b['id'].isdigit()] == [f'{i:02d}' for i in range(1,31)]

def para(text, width, size, color='#141414', bold=False):
    obj = Paragraph(text, ParagraphStyle('qa', fontName='QABold' if bold else 'QA',
                    fontSize=size, leading=size*1.18, textColor=colors.HexColor(color)))
    obj.wrap(width, 10000)
    return obj

def draw_block(c, block, x, top, width, size, draw=False):
    y = top
    parts = [(f'{block["id"]} · {escape(block["title"])}', size*1.15, '#166B5E', True, size*.5)]
    for label, greek, trans, ru in block['rows']:
        parts.append((f'<b>{escape(label)}: {escape(greek)}</b><br/>[{escape(trans)}]<br/>{escape(ru)}',
                      size, '#141414', False, size*.4))
    for note in block['notes']:
        parts.append((escape(note), size, '#343434', False, size*.4))
    for text, sz, color, bold, gap in parts:
        obj = para(text, width, sz, color, bold)
        if draw:
            obj.drawOn(c, x, y-obj.height)
        y -= obj.height + gap
    return y

def build(kind):
    phone = kind == 'phone'
    width, height = (540, 960) if phone else A4
    size = 20 if phone else 11.5
    margin, gutter = (26, 0) if phone else (28, 24)
    columns = 1 if phone else 2
    cw = (width-2*margin-gutter)/columns
    top, bottom = height-92, 48
    pages, current, col, y = [], [], 0, top
    for block in blocks:
        needed = top-draw_block(None, block, 0, top, cw, size)
        assert needed <= top-bottom, (kind, block['id'], needed)
        if y-needed < bottom:
            col += 1
            y = top
            if col == columns:
                pages.append(current)
                current, col = [], 0
        current.append((block, margin+col*(cw+gutter), y))
        y -= needed+size*.7
    if current:
        pages.append(current)
    path = ROOT / f'output/pdf/questions-answers-{kind}.pdf'
    path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(path), pagesize=(width,height))
    c.setTitle('Вопросы и ответы · Сквозной сборник')
    ids = []
    for number, page in enumerate(pages, 1):
        header = para('Вопросы и ответы', width-2*margin, 24 if phone else 19, '#166B5E', True)
        header.drawOn(c, margin, height-25-header.height)
        note = para('30 тем · «Ты» и «вы» · Полные ответы' if phone else
                    '30 тем · Полные ответы · Читай левую колонку, затем правую', width-2*margin, size)
        note.drawOn(c, margin, height-58-note.height)
        if not phone:
            c.setStrokeColor(colors.HexColor('#D6E3DE'))
            c.line(width/2, bottom, width/2, top)
        for block, x, y in page:
            c.bookmarkPage('q'+block['id'])
            c.addOutlineEntry(block['id']+' '+block['title'], 'q'+block['id'])
            end = draw_block(c, block, x, y, cw, size, True)
            assert end >= bottom
            ids.append(block['id'])
        f = para(f'Учебные примеры · {number}/{len(pages)}', width-2*margin, 12 if phone else 9)
        f.drawOn(c, margin, 20)
        c.showPage()
    c.save()
    assert ids == [b['id'] for b in blocks]
    reader = PdfReader(path)
    assert len(reader.pages) == len(pages)
    text = '\n'.join(p.extract_text() for p in reader.pages)
    for block in blocks:
        for _, greek, _, _ in block['rows']:
            assert re.sub(r'\s+', '', greek) in re.sub(r'\s+', '', text), (kind,greek)
    dest = ROOT / ('docs/assets/mobile' if phone else 'docs/assets/print') / path.name
    shutil.copy2(path, dest)
    print(kind, len(pages), 'pages;', len(ids), 'blocks')
    return len(pages)

a4 = build('a4')
phone = build('phone')
md = ['# Вопросы и ответы — сквозной сборник', '',
      f'[A4 для печати — {a4} страниц](../assets/print/questions-answers-a4.pdf){{ .md-button }}',
      f'[PDF для телефона — {phone} страниц](../assets/mobile/questions-answers-phone.pdf){{ .md-button }}', '',
      'Все 30 пунктов нашего списка: вопросы на «ты» и «вы», полные ответы, перевод и произношение. '
      'В обоих PDF одинаковое содержание; варианты оценки языка относятся к пункту 19. '
      'Это полный разговорный сборник, отдельно от [9 коротких карточек «Главное»](core.md).', '',
      'Ответы — учебные примеры, а не биография одного человека. Адрес и контакты взяты из учебника. '
      'При вежливом обращении на «вы» один человек отвечает «я». '
      'Вопросы и ответы видны сразу; для проверки прикрой ответ.', '',
      'Разборы: [знакомство](../lessons/lesson-03-introductions-and-eimai.md), '
      '[общение и жильё](../lessons/lesson-04-current.md), '
      '[запись на занятия](../lessons/lesson-05-current.md#registration), '
      '[языки и учёба](../lessons/lesson-06-current.md).', '']
for block in blocks:
    md += [f'## {block["id"]}. {block["title"]} {{ #q{block["id"]} }}', '']
    for label, greek, trans, ru in block['rows']:
        md += [f'**{label}: {greek}**  ', f'`[{trans}]`  ', ru, '']
    md += block['notes'] + ['']
(ROOT / 'docs/memory/questions-answers.md').write_text('\n'.join(md))
