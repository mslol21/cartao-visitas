"""Validate Next's prerendered HTML without executing browser JavaScript."""
from pathlib import Path
from html.parser import HTMLParser
import json,struct
class Document(HTMLParser):
 def __init__(self,text):
  super().__init__();self.meta={};self.canonical=[];self.titles=0;self.h1=0;self.json=[];self.in_json=False;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='meta':self.meta[a.get('property',a.get('name'))]=a.get('content')
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
  if tag=='title':self.titles+=1
  if tag=='h1':self.h1+=1
  if tag=='script' and a.get('type')=='application/ld+json':self.in_json=True
 def handle_endtag(self,tag):
  if tag=='script':self.in_json=False
 def handle_data(self,data):
  if self.in_json:self.json.append(json.loads(data))
for route in ['index','servicos','servicos/criacao-de-sites','servicos/catalogo-cardapio-digital','login','dashboard','management','streetup','_not-found']:
 p=Path('.next/server/app')/(route+'.html')
 assert p.exists(),p
 d=Document(p.read_text())
 private=route in ['login','dashboard','management','streetup','_not-found']
 if private:assert 'noindex' in d.meta.get('robots',''),route
 else:
  assert d.titles==1 and len(d.canonical)==1,route
  assert d.canonical[0].startswith('https://www.konnexy.com.br'),route
  assert d.meta['og:image']=='https://www.konnexy.com.br/images/konnexy-social.png',route
  assert d.meta['og:image:width']=='1200' and d.meta['og:image:height']=='630'
  assert d.meta['og:image:type']=='image/png'
  assert d.meta['twitter:image:alt']
  if route=='index':assert d.h1==1
  assert d.json
 print(route,'OK',d.canonical,d.meta.get('robots'))
png=Path('public/images/konnexy-social.png').read_bytes();assert png[:8]==b'\x89PNG\r\n\x1a\n';assert struct.unpack('>II',png[16:24])==(1200,630)
assert not Path('public/robots.txt').exists()
print('Cartão PNG 1200×630, JSON-LD e metadados SSR: OK')
