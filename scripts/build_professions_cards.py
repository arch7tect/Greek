"""Build topic revision sheets from existing vocabulary ids, never duplicate lemmas."""
from pathlib import Path
import html
import json
import re
import shutil
import subprocess

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from pypdf import PdfReader
from build_vocabulary_data import ROOT, read_lessons, read_topics, plain

RUNTIME = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies'
pdfmetrics.registerFont(TTFont('Topic', str(RUNTIME / 'native/poppler/poppler/fonts/DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('TopicBold', str(RUNTIME / 'native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype/DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('Topic', normal='Topic', bold='TopicBold')
OUT = ROOT / 'output/pdf'
PUBLIC = ROOT / 'docs/assets/mobile/professions'
OUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)
LESSONS, _ = read_lessons()
read_topics(LESSONS)
WORDS = {word.greek: word for rows in LESSONS.values() for word in rows}
DATA = json.loads((ROOT / 'scripts/topic-data/professions.json').read_text())


def compact(word):
    greek = re.sub(r'^ο (.+) / η \1$', r'ο / η \1', word.greek)
    transcription = plain(word.transcription_md)
    transcription = re.sub(r'^\[o (.+) / i \1\]$', r'[o / i \1]', transcription)
    return greek, transcription, plain(word.meaning_md)


def para(c, text, x, y, width, size, draw=True):
    p = Paragraph(text, ParagraphStyle('topic', fontName='Topic', fontSize=size,
                  leading=size * 1.22, textColor=HexColor('#18383B')))
    _, h = p.wrap(width, 3000)
    if draw:
        p.drawOn(c, x, y-h)
    return y-h


def group(c, data, x, y, width, size, columns=1, draw=True):
    y = para(c, '<b>'+html.escape(data['title'])+'</b>', x, y, width, size*1.15, draw)-size*.7
    rows = [compact(WORDS[item]) for item in data['ids']]
    split = (len(rows)+1)//2
    chunks = (rows[:split], rows[split:]) if columns == 2 else (rows,)
    bottoms = []
    cw = (width-18)/2 if columns == 2 else width
    for col, chunk in enumerate(chunks):
        cy = y
        for greek, trans, meaning in chunk:
            content = f'<b>{html.escape(greek)}</b><br/>{html.escape(trans)}<br/>{html.escape(meaning)}'
            cy = para(c, content, x+col*(cw+18), cy, cw, size, draw)-size*.55
        bottoms.append(cy)
    return min(bottoms)


def main():
    phone = OUT / 'professions-phone-cards.pdf'
    c = canvas.Canvas(str(phone), pagesize=(540, 960))
    c.setTitle('Профессии и места работы - к диктанту')
    for i, data in enumerate(DATA['groups'], 1):
        bottom = group(c, data, 28, 875, 484, 18, columns=2, draw=False)
        assert bottom > 50, (data['title'], bottom)
        c.setFillColor(HexColor('#F5F3ED'))
        c.rect(0, 0, 540, 960, fill=1, stroke=0)
        c.setFillColor(HexColor('#166D68'))
        c.setFont('TopicBold', 14)
        c.drawString(28, 918, 'ПРОФЕССИИ И МЕСТА · К ДИКТАНТУ')
        c.bookmarkPage(str(i))
        c.addOutlineEntry(data['title'], str(i), 0)
        group(c, data, 28, 875, 484, 18, columns=2)
        c.setFont('Topic', 11)
        c.drawString(28, 25, 'Читай левую колонку, затем правую.')
        c.drawRightString(512, 25, f'{i} / {len(DATA["groups"])}')
        c.showPage()
    c.save()
    paper = OUT / 'professions-a4.pdf'
    c = canvas.Canvas(str(paper), pagesize=A4)
    c.setTitle('Профессии и места работы - памятка A4')
    w, h = A4
    for page in range(3):
        c.setFillColor(HexColor('#166D68'))
        c.setFont('TopicBold', 16)
        c.drawString(28, h-32, 'ПРОФЕССИИ И МЕСТА РАБОТЫ')
        for col in range(2):
            data = DATA['groups'][page*2+col]
            bottom = group(c, data, 28+col*(w/2-10), h-62, (w-100)/2, 10.8, draw=False)
            assert bottom > 42, (data['title'], bottom)
            group(c, data, 28+col*(w/2-10), h-62, (w-100)/2, 10.8)
        c.setFont('Topic', 9)
        c.drawString(28, 25, 'Существительное учим с артиклем и ударением. Печать 100%.')
        c.drawRightString(w-28, 25, f'{page+1} / 3')
        c.showPage()
    c.save()
    assert len(PdfReader(phone).pages) == 6
    assert len(PdfReader(paper).pages) == 3
    shutil.copy2(phone, ROOT / 'docs/assets/mobile' / phone.name)
    shutil.copy2(paper, ROOT / 'docs/assets/print' / paper.name)
    poppler = RUNTIME / 'native/poppler/poppler/bin/pdftoppm'
    subprocess.run([str(poppler), '-scale-to', '1920', '-png', str(phone), str(PUBLIC/'card')], check=True)
    images = ''.join(f'<figure><img src="card-{i}.png" alt="{html.escape(data["title"])}" loading="lazy"></figure>' for i, data in enumerate(DATA['groups'], 1))
    (PUBLIC/'index.html').write_text('<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Профессии и места работы</title><style>body{margin:0;background:#f5f3ed;font:18px system-ui}header{padding:20px}main{max-width:1080px;margin:auto}figure{margin:0 0 20px}img{width:100%;display:block}</style><header><h1>Профессии и места работы</h1><a href="../../../memory/professions/">К памятке и тренажёру</a></header><main>'+images+'</main></html>')
    page = ROOT / 'docs/memory/professions.md'
    text = page.read_text().split('<!-- vocabulary:start -->')[0]+'<!-- vocabulary:start -->\n'
    for data in DATA['groups']:
        text += '\n## '+data['title']+'\n\n| Слово | Произношение | Значение |\n|---|---|---|\n'
        for item in data['ids']:
            text += '| '+' | '.join(compact(WORDS[item]))+' |\n'
    page.write_text(text)
    print(f'Built 6 phone cards, 3 A4 pages, {sum(len(g["ids"]) for g in DATA["groups"])} vocabulary entries.')


if __name__ == '__main__':
    main()
