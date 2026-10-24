"""Extract assigned pages unchanged; page numbers here are 1-based PDF numbers."""
from pathlib import Path
import shutil
import argparse
import subprocess
from tempfile import TemporaryDirectory
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
    '15': [('../lessons/15/lesson-15-workbook-revised.pdf', [2, 12]), (WORK, [21, 19])],
    '14': [(WORK, [20]), ('../homework/14/lesson-14-season-activities.png', [1])],
    '13': [(WORK, [18]), ('../homework/13/lesson-13-exercises-14-16.png', [1])],
    '12': [(WORK, [13, 14]), (MAIN, [67])],
    '11': [(WORK, [13, 14])],
    '01': [(MAIN, [14, 15, 18, 19])],
    '02': [(MAIN, [20, 21, 23])],
    '03': [(MAIN, [27, 28]), (WORK, [2, 3]), (GRAMMAR, [101, 102, 132])],
    '04': [(MAIN, [35]), (WORK, [3, 4, 5]), (GRAMMAR, [102, 103, 137, 138])],
    '05': [(MAIN, [41]), (WORK, [6, 7]),
           ('../homework/05/lesson-05-current-worksheet.pdf', [1, 2, 3, 4])],
    '06': [(MAIN, [50, 51])],
    '07': [('../homework/07/lesson-07-current-exercise-05.png', [1])],
    '08': [(MAIN, [59]), (WORK, [11, 13])],
    '09': [(MAIN, [64, 65]), ('../homework/09/lesson-09-current-exercise-18.png', [1])],
    '10': [(WORK, [12]), ('../homework/10/lesson-10-about-me.png', [1]),
           ('../../docs/assets/print/lesson-10-tongue-twisters.pdf', [1])],
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
                if lesson == '15' and name.endswith('lesson-15-workbook-revised.pdf') and number == 12:
                    # Only assigned exercise 24 + frequency table; omit unrelated
                    # exercise 25 and the embedded private classroom screenshot.
                    # Rasterize the clipped page: a crop box alone would leave
                    # the private image recoverable inside the published PDF.
                    with TemporaryDirectory(prefix='greek-homework-') as temporary:
                        folder = Path(temporary)
                        clipped = PdfWriter()
                        page = clipped.add_page(reader.pages[number - 1])
                        page.cropbox.lower_left = (page.mediabox.left, float(page.mediabox.height) * .50)
                        clipped.write(folder / 'clipped.pdf')
                        poppler = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/pdftoppm'
                        subprocess.run([str(poppler), '-cropbox', '-r', '170', '-singlefile', '-png',
                                        str(folder / 'clipped.pdf'), str(folder / 'clipped')], check=True)
                        image = ImageReader(str(folder / 'clipped.png'))
                        iw, ih = image.getSize()
                        width, height = A4
                        scale = min((width - 48) / iw, (height - 48) / ih)
                        stream = BytesIO()
                        pdf = canvas.Canvas(stream, pagesize=A4)
                        pdf.drawImage(image, (width - iw * scale) / 2,
                                      height - 24 - ih * scale, iw * scale, ih * scale)
                        pdf.showPage()
                        pdf.save()
                        stream.seek(0)
                        writer.add_page(PdfReader(stream).pages[0])
                else:
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
