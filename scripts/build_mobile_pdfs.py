"""Package approved phone card images as PDFs, without changing A4 sheets."""
from pathlib import Path
import shutil
import json
from reportlab.pdfgen import canvas
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
for lesson in (1, 2, 3):
    manifest = json.loads((ROOT / f'docs/assets/mobile/lesson-{lesson:02d}/contents.json').read_text())
    count = len(manifest)
    name = f'lesson-{lesson:02d}-phone-cards.pdf'
    target = ROOT / 'output/pdf' / name
    target.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(target), pagesize=(540, 960), pageCompression=1)
    pdf.setTitle(f'Урок {lesson:02d} — карточки для телефона')
    pdf.setAuthor('Greek learning wiki')
    for page in range(1, count + 1):
        pdf.bookmarkPage(f'card-{page}')
        pdf.addOutlineEntry(manifest[page-1]['title'], f'card-{page}', level=0)
        image = ROOT / f'docs/assets/mobile/lesson-{lesson:02d}/lesson-{lesson:02d}-card-{page:02d}.png'
        pdf.drawImage(str(image), 0, 0, width=540, height=960)
        pdf.showPage()
    pdf.save()
    reader = PdfReader(target)
    assert len(reader.pages) == count
    assert all(tuple(p.mediabox) == (0, 0, 540, 960) for p in reader.pages)
    shutil.copyfile(target, ROOT / 'docs/assets/mobile' / name)
    print(f'{name}: {count} pages, {target.stat().st_size} bytes')
