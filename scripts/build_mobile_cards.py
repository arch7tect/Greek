"""Build compact phone cards from saved A4 text; requires Pillow.

Sources are frozen, reviewed A4 paragraph data under scripts/mobile-data.
Pass --extract-a4 once to refresh data from the local A4 builders.
"""
from pathlib import Path
import ast, html, json, re, sys, zipfile
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'scripts/mobile-data'
F=Path('/Users/arch7tect/.cache/codex-runtimes/codex-primary-runtime/dependencies/native')
font=ImageFont.truetype(str(F/'poppler/poppler/fonts/DejaVuSans.ttf'),40)
bold=ImageFont.truetype(str(F/'libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype/DejaVuSans-Bold.ttf'),40)
small=ImageFont.truetype(str(F/'poppler/poppler/fonts/DejaVuSans.ttf'),28)

def extract(n):
    paragraphs=[]
    class Dummy:
        def __getattr__(self,name):return lambda *a,**k:None
    def p(t,x=0,y=700,*a,**kw):paragraphs.append(t);return y-1
    def head(t,x,y):paragraphs.append('<b>'+t+'</b>');return y-1
    def page(*args):return 700
    def noun(a,b,t,d,e,x,y):return p(f'<b>{a}</b> [{b}] — {t}<br/>мн.: {d} [{e}]',x,y)
    tree=ast.parse((ROOT/f'tmp/pdfs/build_lesson{n:02d}_card.py').read_text())
    nodes=[]
    for node in tree.body:
        if isinstance(node,ast.FunctionDef):continue
        if isinstance(node,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='c' for t in node.targets):
            node.value=ast.Call(func=ast.Name(id='Dummy',ctx=ast.Load()),args=[],keywords=[])
        if isinstance(node,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='ends' for t in node.targets):
            node.value=ast.List(elts=[ast.Constant(700),ast.Constant(700)],ctx=ast.Load())
        if isinstance(node,ast.For) and isinstance(node.target,ast.Name) and node.target.id=='col':continue
        nodes.append(node)
    tree.body=nodes
    env=dict(p=p,head=head,page=page,noun=noun,Dummy=Dummy)
    exec(compile(ast.fix_missing_locations(tree),'a4-capture','exec'),env)
    if n==1:
        paragraphs=[f'<b>{a}</b> — звук [{e}]<br/>{b} [{d}]' for a,b,d,e in env['letters']]+paragraphs
    DATA.mkdir(exist_ok=True)
    (DATA/f'lesson-{n:02d}.json').write_text(json.dumps(paragraphs,ensure_ascii=False,indent=2))

def wrap(t,f,width=456):
    lines=[];line=''
    for word in t.split():
        if f.getlength((line+' '+word).strip())>width and line:
            lines.append(line);line=''
        # Rare long Russian words: explicit continuation rather than clipping.
        while f.getlength(word)>width:
            end=len(word)-1
            while f.getlength(word[:end]+'-')>width:end-=1
            if line:lines.append(line);line=''
            lines.append(word[:end]+'-');word=word[end:]
        line=(line+' '+word).strip()
    if line:lines.append(line)
    return lines

def build(n):
    paragraphs=json.loads((DATA/f'lesson-{n:02d}.json').read_text())
    merged=[];pending=''
    for para in paragraphs:
        if 'Повторение за 5 минут' in para or para.startswith('1. Закрой названия') or para.startswith('Перепиши и прочитай') or '7. Закрепи проверку' in para:continue
        if re.fullmatch(r'<b>[^<]+</b>',para):
            pending+=para+'<br/>'
        else:
            merged.append(pending+para);pending=''
    paragraphs=merged
    pages=[];cols=[[],[]];heights=[0,0];col=0
    for para in paragraphs:
        if 'Повторение за 5 минут' in para or para.startswith('1. Закрой названия') or para.startswith('Перепиши и прочитай'):continue
        lines=[]
        for part in re.split(r'<br\s*/?>',para):
            isheading=bool(re.fullmatch(r'<b>[^<]+</b>',part))
            plain=html.unescape(re.sub('<[^>]+>','',part))
            lines.extend((s,isheading) for s in wrap(plain,bold if isheading else font))
        height=len(lines)*48+16
        assert height<1584,(n,para)
        if heights[col]+height>1584:
            if col==0:col=1
            else:pages.append(cols);cols=[[],[]];heights=[0,0];col=0
        cols[col].append(lines);heights[col]+=height
    pages.append(cols)
    out=ROOT/f'docs/assets/mobile/lesson-{n:02d}';out.mkdir(parents=True,exist_ok=True)
    for i,cols in enumerate(pages,1):
        im=Image.new('RGB',(1080,1920),'#F5F3ED');d=ImageDraw.Draw(im)
        d.text((56,40),f'ГРЕЧЕСКИЙ · УРОК {n:02d}',font=small,fill='#344F51')
        d.text((56,90),'Алфавит и знакомство' if n==1 else 'Чтение и ударение',font=bold,fill='#18383B')
        d.rounded_rectangle((32,170,1048,1810),radius=24,fill='white')
        d.line((540,192,540,1790),fill='#DCE5E2',width=2)
        for col,items in enumerate(cols):
            x=56+516*col;y=192
            for lines in items:
                for s,b in lines:d.text((x,y),s,font=bold if b else font,fill='#166D68' if b else '#18383B');y+=48
                y+=8;d.line((x,y,x+456,y),fill='#DCE5E2',width=2);y+=8
            assert y<=1776
        d.text((56,1850),f'{i:02d} / {len(pages):02d}',font=small,fill='#344F51')
        im.save(out/f'lesson-{n:02d}-card-{i:02d}.png')
    package(out,n,len(pages))
    print(n,len(pages))

def package(out,n,count):
    names=[f'lesson-{n:02d}-card-{i:02d}.png' for i in range(1,count+1)]
    (out/'index.html').write_text('<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Карточки урока '+str(n)+'</title><style>body{margin:0;background:#f5f3ed}main{max-width:540px;margin:auto}img{width:100%;display:block;margin-bottom:16px}</style><main>'+''.join(f'<img loading="lazy" src="{f}" alt="Карточка {i}">' for i,f in enumerate(names,1))+'</main></html>')
    with zipfile.ZipFile(out.parent/f'lesson-{n:02d}-cards.zip','w',zipfile.ZIP_DEFLATED) as z:
        for f in names+['index.html']:z.write(out/f,f)
    for start in range(0,count,4):
        sheet=Image.new('RGB',(1080,1920),'#ddd')
        for j,f in enumerate(names[start:start+4]):
            im=Image.open(out/f);im.thumbnail((540,960));sheet.paste(im,(j%2*540,j//2*960))
        sheet.save(ROOT/f'tmp/mobile-{n:02d}-{start//4+1}.jpg')

if __name__=='__main__':
    for n in (1,2):
        if '--extract-a4' in sys.argv:extract(n)
        build(n)
