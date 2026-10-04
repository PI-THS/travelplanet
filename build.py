#!/usr/bin/env python3
# 將 src/ 砌成單一 index.html（淨係寫 Game/index.html）
import pathlib
root=pathlib.Path(__file__).parent; src=root/'src'; k=src/'kids'
rd=lambda p:p.read_text(encoding='utf-8')
head=rd(src/'head.html')
css=rd(k/'base.css')+'\n'+rd(k/'game.css')+'\n'+rd(src/'hippo.css')
order=[src/'kshim.js',src/'world.js',k/'icons.js',k/'icons2.js',k/'questions_v1.js',src/'chars.js',src/'main.js']
js='\n'.join(rd(p) for p in order)
out=head.replace('/*__CSS__*/',css).replace('/*__SYMBOLS__*/',rd(src/'symbols.html')).replace('//__JS__',js)
(root/'index.html').write_text(out,encoding='utf-8'); print('built index.html',len(out),'bytes')
