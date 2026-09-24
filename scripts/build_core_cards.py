"""Build the shared revision set from one reviewed, source-linked dataset.

Use the project document runtime (reportlab, pypdf) and Poppler. Optional
GREEK_FONT_ROOT and PDFTOPPM override the installed runtime paths.
"""
from pathlib import Path
import html
import json
import os
import shutil
import subprocess

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies'
FONT_ROOT = Path(os.environ.get('GREEK_FONT_ROOT', RUNTIME / 'native'))
pdfmetrics.registerFont(TTFont('Core', str(FONT_ROOT / 'poppler/poppler/fonts/DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('CoreBold', str(FONT_ROOT / 'libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype/DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('Core', normal='Core', bold='CoreBold')
CARDS = json.loads((ROOT / 'scripts/mobile-data/core.json').read_text())
OUT = ROOT / 'output/pdf'
PUBLIC = ROOT / 'docs/assets/mobile/core'
OUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)
INK = '#203835'
ACCENT = '#166B5E'


def paragraph(c, text, x, top, width, size, color=INK, draw=True):
    p = Paragraph(text, ParagraphStyle('core', fontName='Core', fontSize=size,
                  leading=size * 1.22, textColor=colors.HexColor(color)))
    _, height = p.wrap(width, 2000)
    if draw:
        p.drawOn(c, x, top - height)
    return top - height


def card(c, data, index, x, top, width, size, draw=True):
    """Identical content at both sizes; measure before drawing, never shrink to fit."""
    y = paragraph(c, f'<b>{index:02d} · {data["title"]}</b>', x, top, width, size * 1.22,
                  ACCENT, draw)
    y -= size * .7
    if data.get('intro'):
        y = paragraph(c, data['intro'], x, y, width, size, draw=draw) - size * .7
    columns = data.get('columns', 1)
    rows = data['rows']
    gap = size * .5
    if data.get('paired_rows'):
        left_width = width * .65
        for left, right in rows:
            left_y = paragraph(c, left, x, y, left_width - size * .5, size, draw=draw)
            right_y = paragraph(c, right, x + left_width, y, width - left_width, size, draw=draw)
            y = min(left_y, right_y) - gap
    elif columns == 2:
        col_width = (width - size) / 2
        split = (len(rows) + 1) // 2
        bottoms = []
        for col, items in enumerate((rows[:split], rows[split:])):
            cy = y
            for item in items:
                cy = paragraph(c, item, x + col * (col_width + size), cy,
                               col_width, size, ACCENT if item.startswith('<b>') else INK,
                               draw) - gap
            bottoms.append(cy)
        y = min(bottoms)
    else:
        for item in rows:
            y = paragraph(c, item, x, y, width, size, draw=draw) - gap
    if data.get('note'):
        y -= size * .35
        y = paragraph(c, data['note'], x, y, width, size, draw=draw)
    return y


def build_phone():
    path = OUT / 'core-phone-cards.pdf'
    c = canvas.Canvas(str(path), pagesize=(540, 960))
    c.setTitle(f'Главное · {len(CARDS)} карточек для повторения')
    c.setAuthor('Греческий — личный курс')
    for i, data in enumerate(CARDS, 1):
        bottom = card(c, data, i, 32, 875, 476, 20, draw=False)
        assert bottom > 55, (data['title'], bottom)
        c.setFillColor(colors.HexColor('#F5F3ED'))
        c.rect(0, 0, 540, 960, fill=1, stroke=0)
        c.setFillColor(colors.HexColor(ACCENT))
        c.setFont('CoreBold', 14)
        c.drawString(32, 918, 'ГЛАВНОЕ · ПОВТОРЯТЬ РЕГУЛЯРНО')
        c.setFillColor(colors.white)
        c.roundRect(16, 38, 508, 853, 16, fill=1, stroke=0)
        c.bookmarkPage(f'card-{i}')
        c.addOutlineEntry(data['title'], f'card-{i}', 0)
        card(c, data, i, 32, 875, 476, 20)
        c.setFont('Core', 12)
        c.setFillColor(colors.HexColor(ACCENT))
        c.drawRightString(508, 19, f'{i} / {len(CARDS)}')
        c.showPage()
    c.save()
    return path


def build_print():
    path = OUT / 'core-study-card-a4.pdf'
    c = canvas.Canvas(str(path), pagesize=A4)
    c.setTitle('Главное · памятка A4')
    page_w, page_h = A4
    # Two topics per column, measured independently; no automatic font shrinking.
    for start in range(0, len(CARDS), 4):
        c.setFont('CoreBold', 15)
        c.setFillColor(colors.HexColor(ACCENT))
        c.drawString(28, page_h - 32, 'ГЛАВНОЕ · ПОВТОРЯТЬ РЕГУЛЯРНО')
        for col in range(2):
            x = 28 + col * ((page_w - 56) / 2 + 6)
            width = (page_w - 68) / 2
            top = page_h - 63
            for row in range(2):
                idx = start + col * 2 + row
                if idx >= len(CARDS):
                    break
                bottom = card(c, CARDS[idx], idx + 1, x, top, width, 10.3, draw=False)
                assert bottom > 40, (CARDS[idx]['title'], bottom)
                card(c, CARDS[idx], idx + 1, x, top, width, 10.3)
                top = bottom - 20
        c.setFont('Core', 10)
        c.drawRightString(page_w - 28, 22, f'{start // 4 + 1} / {(len(CARDS) + 3) // 4}')
        c.showPage()
    c.save()
    return path


def main():
    for data in CARDS:
        for source in data['sources']:
            assert (ROOT / source).is_file(), source
    phone, printed = build_phone(), build_print()
    assert len(PdfReader(phone).pages) == len(CARDS)
    assert len(PdfReader(printed).pages) == (len(CARDS) + 3) // 4
    shutil.copy2(phone, ROOT / 'docs/assets/mobile/core-phone-cards.pdf')
    shutil.copy2(printed, ROOT / 'docs/assets/print/core-study-card-a4.pdf')
    poppler = os.environ.get('PDFTOPPM', str(RUNTIME / 'bin/override/pdftoppm'))
    subprocess.run([poppler, '-scale-to', '1080', '-png', str(phone), str(PUBLIC / 'card')], check=True)
    images = sorted(PUBLIC.glob('card-*.png'))
    assert len(images) == len(CARDS)
    figures = '\n'.join(f'<figure><img src="{p.name}" alt="{html.escape(d["title"])}" loading="lazy"><figcaption>{html.escape(d["title"])}</figcaption></figure>' for p, d in zip(images, CARDS))
    document = '''<!doctype html><html lang="ru"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Главное · карточки</title><style>
body{margin:0;background:#f5f3ed;color:#203835;font:18px system-ui}header{padding:20px;max-width:900px;margin:auto}
a{color:#166b5e}main{max-width:1080px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:16px}
figure{margin:0}img{display:block;width:100%;height:auto}figcaption{padding:8px 20px 24px}
</style><header><h1>Главное</h1><p>Опорные темы для регулярного повторения.</p>
<p><a href="../core-phone-cards.pdf">PDF для телефона</a> · <a href="../../print/core-study-card-a4.pdf">A4 для печати</a> · <a href="../../../memory/core/">К памятке</a></p></header><main>'''+figures+'</main></html>'
    (PUBLIC / 'index.html').write_text(document)
    print(f'Built {phone} ({len(CARDS)} pages), {printed} ({(len(CARDS) + 3) // 4} pages), and online preview.')


if __name__ == '__main__':
    main()
