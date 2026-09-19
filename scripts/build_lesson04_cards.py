"""One reviewed topic dataset -> printable A4 and matching phone cards.

Run with the bundled Python runtime (Pillow, reportlab, pypdf).
Does not rebuild or alter cards for lessons 01-03.
"""
import html
import json
import shutil
import argparse
from PIL import Image, ImageDraw
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.colors import HexColor
from pypdf import PdfReader
from build_mobile_cards import ROOT, DATA, F, font, bold, small, wrap, package

parser = argparse.ArgumentParser()
parser.add_argument('--lesson', type=int, choices=[4, 5], default=4)
lesson = parser.parse_args().lesson
slug = f'lesson-{lesson:02d}'
cards = json.loads((DATA / f'{slug}.json').read_text())
out = ROOT / 'docs/assets/mobile' / slug
out.mkdir(parents=True, exist_ok=True)
pdfout = ROOT / 'output/pdf'
pdfout.mkdir(parents=True, exist_ok=True)


def blocks(card, width):
    items = []
    for row in card['rows']:
        parts = [(row[0], True), ('[' + row[1] + ']', False), (row[2], False)]
        if len(row) == 4:
            parts.append(('мн.: ' + row[3], False))
        items.append([(line, b) for text, b in parts
                      for line in wrap(text, bold if b else font, width)])
    for note in card['notes']:
        items.append([(line, False) for line in wrap(note, font, width)])
    return items


def height(item):
    return len(item) * 48 + 16


manifest = []
for index, card in enumerate(cards, 1):
    wide = blocks(card, 968)
    if sum(map(height, wide)) <= 1584:
        columns, width = [wide], 968
    else:
        narrow = blocks(card, 456)
        best, split = min((max(sum(map(height, narrow[:k])),
                              sum(map(height, narrow[k:]))), k)
                          for k in range(1, len(narrow)))
        assert best <= 1584, (card['title'], best)
        columns, width = [narrow[:split], narrow[split:]], 456
    im = Image.new('RGB', (1080, 1920), '#F5F3ED')
    d = ImageDraw.Draw(im)
    d.text((56, 36), f'ГРЕЧЕСКИЙ · УРОК {lesson:02d}', font=small, fill='#344F51')
    title_lines = wrap(card['title'], bold, 968)
    assert len(title_lines) <= 2
    for j, line in enumerate(title_lines):
        d.text((56, 82 + j * 48), line, font=bold, fill='#18383B')
    d.rounded_rectangle((32, 180, 1048, 1810), radius=24, fill='white')
    if len(columns) == 2:
        d.line((540, 202, 540, 1790), fill='#DCE5E2', width=2)
    for col, items in enumerate(columns):
        x, y = 56 + 516 * col, 202
        for item in items:
            for line, b in item:
                d.text((x, y), line, font=bold if b else font,
                       fill='#166D68' if b else '#18383B')
                y += 48
            y += 8
            d.line((x, y, x + width, y), fill='#DCE5E2', width=2)
            y += 8
        assert y <= 1790, (card['title'], y)
    d.text((56, 1850), f'{index:02d} / {len(cards):02d}', font=small, fill='#344F51')
    name = f'{slug}-card-{index:02d}.png'
    im.save(out / name)
    manifest.append({'title': card['title'], 'file': name})
(out / 'contents.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
package(out, lesson, len(cards))

phone = pdfout / f'{slug}-phone-cards.pdf'
c = canvas.Canvas(str(phone), pagesize=(540, 960), pageCompression=1)
c.setTitle(f'Урок {lesson:02d} - карточки для телефона')
for i, item in enumerate(manifest):
    c.bookmarkPage(str(i))
    c.addOutlineEntry(item['title'], str(i), level=0)
    c.drawImage(str(out / item['file']), 0, 0, 540, 960)
    c.showPage()
c.save()
assert len(PdfReader(phone).pages) == len(cards)
shutil.copyfile(phone, ROOT / 'docs/assets/mobile' / phone.name)

pdfmetrics.registerFont(TTFont('DV', str(F / 'poppler/poppler/fonts/DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('DVB', str(F / 'libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype/DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('DV', normal='DV', bold='DVB')
paper = pdfout / f'{slug}-study-card-a4.pdf'
c = canvas.Canvas(str(paper), pagesize=A4, pageCompression=1)
c.setTitle(f'Урок {lesson:02d} - грамматика и основные слова')
c.setAuthor('Greek learning wiki')
W, H = A4
M = 27
CW = (W - M * 2 - 18) / 2
style = ParagraphStyle('body', fontName='DV', fontSize=10.3, leading=13.4,
                       textColor=HexColor('#18383B'))


def paragraph(text, x, y, width=CW, size=None, gap=3):
    s = style if size is None else ParagraphStyle('s', parent=style,
                                                  fontSize=size, leading=size * 1.3)
    p = Paragraph(text, s)
    _, h = p.wrap(width, H)
    assert y - h >= 42, (text, y, h)
    p.drawOn(c, x, y - h)
    return y - h - gap


layouts = [[[0, 1], [2, 3]], [[4, 5], [6, 7]]]
titles = ['ГЛАГОЛЫ И ОБЩЕНИЕ', 'МЕСТО, ЧИСЛА И СЛОВА']
if lesson == 5:
    layouts = [[[0, 1, 2], [3, 4, 5]], [[6, 7, 8], [9, 10, 11]]]
    titles = ['РОД, АРТИКЛИ И ОБЩЕНИЕ', 'ПОВТОРЕНИЕ И ДОМАШКА']
for page, sections in enumerate(layouts, 1):
    c.setFont('DVB', 17)
    c.setFillColor(HexColor('#18383B'))
    c.drawString(M, H - 35, f'УРОК {lesson:02d} / ' + titles[page - 1])
    paragraph('ˈ перед ударным слогом; θ и ð - межзубные. Словарная форма глагола означает «я».',
              M, H - 46, W - 2 * M, 9, 0)
    for col, indices in enumerate(sections):
        x, y = M + col * (CW + 18), H - 73
        for idx in indices:
            card = cards[idx]
            y = paragraph('<b>' + html.escape(card['title']) + '</b>', x, y,
                          size=10.5, gap=7)
            for row in card['rows']:
                text = f'<b>{html.escape(row[0])}</b> [{html.escape(row[1])}] - {html.escape(row[2])}'
                if len(row) == 4:
                    text += '<br/>мн.: ' + html.escape(row[3])
                y = paragraph(text, x, y)
            for note in card['notes']:
                y = paragraph(html.escape(note), x, y, gap=4)
            y -= 10
    c.setFont('DV', 6.8)
    source = ('Источники: конспект 04 и DOCX; тетрадь с. 11-13; сборник с. 112, 147-148.' if lesson == 4 else
              'Источники: конспект 05; учебник с. 48, 50-52; тетрадь с. 14-15; дополнительное задание.')
    c.drawString(M, 25, source)
    c.drawRightString(W - M, 13, f'{page}/{len(layouts)} · А4 · 100% · двусторонняя печать по длинному краю')
    c.showPage()
c.save()
assert len(PdfReader(paper).pages) == len(layouts)
shutil.copyfile(paper, ROOT / 'docs/assets/print' / paper.name)
print(f'Built {len(cards)} phone cards and {len(layouts)} A4 pages from the same dataset.')
