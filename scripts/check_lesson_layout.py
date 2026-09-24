"""Guard the shared layout and self-contained links of current lessons."""
from pathlib import Path
import re
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
LESSONS = [
    'lesson-01-alphabet-and-greetings.md',
    'lesson-02-reading-and-stress.md',
    'lesson-03-introductions-and-eimai.md',
    'lesson-04-current.md',
    'lesson-05-current.md',
    'lesson-06-current.md',
]
EXPECTED = ['Что освоить', 'Разбор', 'Практика перед домашкой',
            'Домашнее задание']

def main():
    for number, name in enumerate(LESSONS, 1):
        path = DOCS / 'lessons' / name
        text = path.read_text()
        headings = [re.sub(r'\s*\{.*', '', h) for h in re.findall(r'^## (.+)$', text, re.M)]
        assert headings == EXPECTED, (name, headings)
        assert 'Материалы и качество' not in text, name
        assert '**Статус:**' not in text, name
        assert 'первого прохода' not in text, name
        for target in re.findall(r'\]\(([^)]+)\)', text):
            if target.startswith('https://'):
                assert urlparse(target).hostname in {'www.youtube.com', 'youtube.com', 'youtu.be'}, target
            elif not target.startswith('#'):
                assert (path.parent / target.split('#')[0]).exists(), (name, target)
        assert text.count('.md-button') == 3, name
        assert '.md-button download' not in text, name
        assert f'lesson-{number:02}-phone-cards.pdf' in text, name
        assert f'lesson-{number:02}-homework.pdf' in text, name
    print(f'Lesson layout: {len(LESSONS)}/{len(LESSONS)}; downloads and internal links OK')

if __name__ == '__main__':
    main()
