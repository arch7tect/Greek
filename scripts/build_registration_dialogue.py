"""Two-page study handout, sourced from the reviewed lesson 05 wiki text."""
from pathlib import Path
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
pdfmetrics.registerFont(TTFont('Study', str(FONTS / 'poppler/poppler/fonts/DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('StudyBold', str(FONTS / 'libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype/DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('Study', normal='Study', bold='StudyBold')
source = (ROOT / 'docs/lessons/lesson-05-current.md').read_text()
OUT = ROOT / 'output/pdf/lesson-05-registration-dialogue.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(OUT), pagesize=A4)
c.setTitle('Запись на занятия: диалог и словарная шпаргалка')
W, H = A4

def p(text, x, top, width, size=10.5, color='#203835'):
    text = text.replace('`', '').replace('—', '-').replace('→', ' / ')
    para = Paragraph(text, ParagraphStyle('s', fontName='Study', fontSize=size,
                     leading=size*1.2, textColor=colors.HexColor(color)))
    _, height = para.wrap(width, 1200)
    para.drawOn(c, x, top-height)
    return top-height

def header(title, subtitle):
    p(title, 34, H-30, W-68, 19, '#166B5E')
    return p(subtitle, 34, H-58, W-68, 10.5)-15

def footer(number):
    p('Запись на занятия • Учебник, с. 48 • Урок 05 / повторение к уроку 06', 34, 27, W-90, 8)
    p(str(number), W-45, 27, 20, 9)

y = header('Диалог для запоминания', 'Секретарь и Ане. Закрой перевод и восстанови реплики по памяти.')
part = source.split('#### Диалог целиком: имя, страна и учёба')[1].split('#### Как устроены реплики')[0]
rows = []
for line in part.splitlines():
    if line.startswith('| Секретарь |') or line.startswith('| Ане |'):
        role, phrase, meaning = [v.strip() for v in line.split('|')[1:-1]]
        phrase = phrase.replace('` `[', '<br/>[').replace('`', '')
        rows.append((role, phrase, meaning))
assert len(rows) == 21, len(rows)
for role, phrase, meaning in rows:
    bottom1 = p(phrase, 47, y, 320, 10)
    bottom2 = p(meaning, 380, y, W-414, 10)
    c.setFillColor(colors.HexColor('#166B5E' if role == 'Секретарь' else '#9C6725'))
    c.circle(38, y-5, 2, fill=1, stroke=0)
    y = min(bottom1, bottom2)-5
assert y > 45, y
footer(1)
c.showPage()
y = header('Слова и опоры к диалогу', 'Имя / учёба / страна / специальность / адрес / контакты / фото / аудитория')

groups = [
 ('Вопросы и ответы', [
 ('πώς [pos]', 'как'), ('πού [pu]', 'где'), ('τι [ti]', 'что'),
 ('τώρα [ˈtora]', 'сейчас'), ('από [aˈpo]', 'из'),
 ('στην / στο [stin / sto]', 'в: где живу или учусь'),
 ('μάλιστα [ˈmalista]', 'да, вежливое подтверждение'),
 ('μου / σας [mu / sas]', 'мой / ваш; после предмета'),
 ('με λένε [me ˈlene]', 'меня зовут'),
 ('σπουδάζω [spuˈðazo]', 'изучаю, учусь в вузе'),
 ('μένω [ˈmeno]', 'живу'), ('έχετε [ˈehete]', 'у вас есть'),
 ('είστε [ˈiste]', 'вы есть / являетесь'),
 ('η Ιστορία [i istoˈria]', 'история'),
 ('η Αρχαιολογία [i arheoloˈyia]', 'археология'),
 ('το Πανεπιστήμιο [to panepiˈstimio]', 'университет'),
 ]),
 ('Адрес, документы и вежливость', [
 ('η φοιτήτρια [i fiˈtitria]', 'студентка'),
 ('η διεύθυνση [i ðiˈefθinsi]', 'адрес'),
 ('το τηλέφωνο [to tiˈlefono]', 'телефон'),
 ('το κινητό [to kiniˈto]', 'мобильный телефон'),
 ('το μέιλ [to meil]', 'электронная почта'),
 ('η φωτογραφία [i fotoɣraˈfia]', 'фотография'),
 ('η κάρτα [i ˈkarta]', 'карточка'),
 ('το μάθημα [to ˈmaθima]', 'занятие'),
 ('η τάξη [i ˈtaksi]', 'класс; здесь аудитория'),
 ('παρακαλώ [parakaˈlo]', 'пожалуйста'),
 ('ορίστε [oˈriste]', 'вот, пожалуйста'),
 ('πολύ ωραία [poˈli oˈrea]', 'очень хорошо'),
 ('καλή αρχή [kaˈli arˈhi]', 'хорошего начала'),
 ('ευχαριστώ πολύ [efhariˈsto poˈli]', 'большое спасибо'),
 ('γεια σας [ya sas]', 'здравствуйте / до свидания'),
 ])]
bottoms = []
for col, (title, items) in enumerate(groups):
    x = 34 + col*270
    cy = p('<b>'+title+'</b>', x, y, 250, 12, '#166B5E')-12
    for greek, meaning in items:
        cy = p('<b>'+greek.split(' [')[0]+'</b> ['+greek.split(' [')[1]+'<br/>'+meaning,
               x, cy, 250, 11)-9
    bottoms.append(cy)
y = min(bottoms)-10
y = p('<b>Как учить</b><br/>1. Прочитай диалог с переводом. 2. Закрой русский столбец. '
      '3. Отвечай за Ане, глядя только на вопросы. 4. Повтори обе роли без листа.',
      34, y, W-68, 11)
assert y > 45, y
footer(2)
c.save()
assert len(PdfReader(OUT).pages) == 2
shutil.copy2(OUT, ROOT / 'docs/assets/print' / OUT.name)
print(OUT)
