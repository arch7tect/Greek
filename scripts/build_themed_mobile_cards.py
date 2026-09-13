"""Explicit topic boundaries: never flow unrelated material onto a card."""
import json, re, html
from pathlib import Path
from PIL import Image, ImageDraw
from build_mobile_cards import ROOT, DATA, font, bold, small, package, wrap

def read(n):return json.loads((DATA/f'lesson-{n:02d}.json').read_text())
def chunks(para):
    return [(html.unescape(re.sub('<[^>]+>','',s)),bool(re.fullmatch('<b>[^<]+</b>',s))) for s in re.split(r'<br\s*/?>',para)]
def select(data,ids):return [chunks(data[i]) for i in ids]

one=read(1);two=read(2);three=read(3)
groups={1:[],2:[],3:[]}
def add(n,title,items):groups[n].append((title,items))
add(1,'Алфавит: буквы, названия, звуки',select(one,range(24)))
add(1,'Похожие буквы и особые звуки',select(one,[25,26,28,30]))
add(1,'Слова: повседневная жизнь',select(one,range(32,40)))
add(1,'Слова: учёба и класс',select(one,range(40,53)))
add(1,'Действия и вежливость',select(one,range(54,59)))
add(1,'Приветствие: «ты» и «вы»',select(one,[60,61,62,63,70]))
add(1,'Знакомство и прощание',select(one,range(64,70)))

add(2,'«п / б / в»: правило и примеры',select(two,[1,24,25,26,27,28]))
add(2,'«т / д» и межзубные звуки',select(two,[2,3,30,31,32]))
add(2,'«к / г / х»: правило и примеры',select(two,[4,34,35,36,37,38,39]))
add(2,'Согласные внутри слова',select(two,[7,8,10,11]))
add(2,'«ц / дз»: правило и примеры',select(two,[5,41,42,43,44]))
add(2,'Две буквы — один гласный',select(two,[13,46,47,48]))
add(2,'Как выбрать «в» или «ф»',select(two,[15,16,49]))
add(2,'Ударение: где ставить знак',select(two,[18,19,20]))
add(2,'Раздельное чтение гласных',select(two,[22,51]))

def titems(ids):
    return [[(text,weight=='b') for text,size,weight,color in item] for i in ids for item in three[i][1]]
add(3,'Местоимения и «быть»',[]) # approved table, preserved separately
for title,ids in [
 ('«Быть»: отрицание, род и число',[0,1,2]),
 ('Чья вещь: мой, наш, ваш',[3]),
 ('Как зовут: вопрос и ответ',[4,5]),
 ('Меня, тебя, вас. Обращение',[6,7]),
 ('Откуда я и где живу',[8,9,10]),
 ('Вопросы и связующие слова',[11,12]),
 ('Приветствия и короткие реплики',[13,14]),
 ('Знакомство, встреча и прощание',[15,16]),
 ('Слова: ученики и преподаватели',[17,18]),
 ('Слова: люди и учёба',[19,20]),
 ('Слова: учебные принадлежности',[21,22]),
 ('Слова: класс, места и транспорт',[23,24]),
 ('Страны',[25,26,27])]:add(3,title,titems(ids))

def layout(items,width):
    result=[]
    for item in items:
        lines=[]
        for text,b in item:
            text=text.replace('преподавательница','преподават. (ж.)').replace('преподаватель','преподават. (м.)')
            lines.extend((s,b) for s in wrap(text,bold if b else font,width))
        result.append(lines)
    return result
def height(lines):return len(lines)*48+16

counts={}
for n,cards in groups.items():
    out=ROOT/f'docs/assets/mobile/lesson-{n:02d}'
    manifest=[]
    for index,(title,items) in enumerate(cards,1):
        name=f'lesson-{n:02d}-card-{index:02d}.png'
        manifest.append({'title':title,'file':name})
        if n==3 and index==1:continue
        wide=layout(items,968)
        if sum(map(height,wide))<=1584:cols=[wide];width=968
        else:
            narrow=layout(items,456)
            candidates=[(max(sum(map(height,narrow[:k])),sum(map(height,narrow[k:]))),k) for k in range(1,len(narrow))]
            best,k=min(candidates)
            assert best<=1584,(n,title,best)
            cols=[narrow[:k],narrow[k:]];width=456
        im=Image.new('RGB',(1080,1920),'#F5F3ED');d=ImageDraw.Draw(im)
        d.text((56,36),f'ГРЕЧЕСКИЙ · УРОК {n:02d}',font=small,fill='#344F51')
        for j,line in enumerate(wrap(title,bold,968)):d.text((56,82+j*48),line,font=bold,fill='#18383B')
        d.rounded_rectangle((32,180,1048,1810),radius=24,fill='white')
        if len(cols)==2:d.line((540,202,540,1790),fill='#DCE5E2',width=2)
        for col,blocks in enumerate(cols):
            x=56+516*col;y=202
            for lines in blocks:
                for line,b in lines:d.text((x,y),line,font=bold if b else font,fill='#166D68' if b else '#18383B');y+=48
                y+=8;d.line((x,y,x+width,y),fill='#DCE5E2',width=2);y+=8
            assert y<=1790
        d.text((56,1850),f'{index:02d} / {len(cards):02d}',font=small,fill='#344F51')
        im.save(out/name)
    (out/'contents.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    package(out,n,len(cards))
    counts[str(n)]=len(cards)
(DATA/'counts.json').write_text(json.dumps(counts))
print(counts)
