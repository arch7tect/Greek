"""Extract assigned pages unchanged; page numbers here are 1-based PDF numbers."""
from pathlib import Path
import shutil
import argparse
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[1]
BOOKS = ROOT / 'materials/books'
MAIN = 'taxidi-stin-ellada-1-revised.pdf'
WORK = 'taxidi-stin-ellada-1-workbook.pdf'
GRAMMAR = 'afto-akrivos-a.pdf'
# Verified assignments and printed/PDF mappings: docs/homework/lesson-*.md.
PACKS = {
    '01': [(MAIN, [14, 15, 18, 19])],
    '02': [(MAIN, [20, 21, 23])],
    '03': [(MAIN, [27, 28]), (WORK, [2, 3]), (GRAMMAR, [101, 102, 132])],
    '04': [(MAIN, [35]), (WORK, [3, 4, 5]), (GRAMMAR, [102, 103, 137, 138])],
    '05': [(MAIN, [41]), (WORK, [6, 7]),
           ('../homework/05/lesson-05-current-worksheet.pdf', [1, 2, 3, 4])],
    '06': [(MAIN, [50, 51])],
    '07': [('../homework/07/lesson-07-current-exercise-05.png', [1])],
    '08': [(MAIN, [59]), (WORK, [11, 13])],
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--lesson', choices=PACKS)
    args = parser.parse_args()
    output = ROOT / 'output/pdf'
    public = ROOT / 'docs/assets/print'
    output.mkdir(parents=True, exist_ok=True)
    public.mkdir(parents=True, exist_ok=True)
    for lesson, sources in PACKS.items():
        if args.lesson and lesson != args.lesson:
            continue
        writer = PdfWriter()
        for name, numbers in sources:
            source = BOOKS / name
            if source.suffix.lower() == '.png':
                # Keep the supplied exercise image intact, fitting it on A4.
                image = ImageReader(str(source))
                iw, ih = image.getSize()
                width, height = A4
                scale = min((width - 48) / iw, (height - 48) / ih)
                stream = BytesIO()
                pdf = canvas.Canvas(stream, pagesize=A4)
                pdf.drawImage(image, (width - iw * scale) / 2,
                              height - 24 - ih * scale,
                              iw * scale, ih * scale)
                pdf.showPage()
                pdf.save()
                stream.seek(0)
                reader = PdfReader(stream)
            else:
                reader = PdfReader(source)
            first = len(writer.pages)
            for number in numbers:
                writer.add_page(reader.pages[number - 1])
            writer.add_outline_item(name.removesuffix('.pdf'), first)
        writer.add_metadata({'/Title': f'Урок {lesson} — листы для домашнего задания'})
        filename = f'lesson-{lesson}-homework.pdf'
        writer.write(output / filename)
        result = PdfReader(output / filename)
        assert len(result.pages) == sum(len(pages) for _, pages in sources)
        shutil.copyfile(output / filename, public / filename)
        print(f'{filename}: {len(result.pages)} pages')

if __name__ == '__main__':
    main()
