"""Collect official SSA source metadata; temporary readable text stays outside repo."""
import concurrent.futures, hashlib, json, re, urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SLUGS = [
 (7,'extending-service-level-agreement-configurations',7,'92306/92316'),
 (8,'parallel-processing',7,'92306/92316'), (9,'managing-concurrent-case-access',7,'92306/92316'),
 (10,'flow-action-processing',7,'92306/92316'), (11,'organization-records',8,'92306/92316'),
 (12,'field-values',9,'92306/92336'), (13,'validating-data-against-pattern',6,'92306/92336'),
 (14,'keyed-data-pages',7,'92306/92336'), (15,'exchanging-data-other-applications',7,'92306/92336'),
 (16,'integration-errors',7,'92306/92336'), (17,'access-control',4,'92306'),
 (18,'securing-and-auditing-data',5,'92306'), (19,'define-run-time-settings',7,'92306'),
 (20,'activities-and-automations',7,'92306'), (21,'background-processing',8,'92306'),
 (22,'measuring-system-performance',8,'92306'), (23,'reviewing-log-files',7,'92306'),
 (24,'debugging-system-performance',7,'92306'), (25,'extending-ui-options',3,'92306')]

class MainParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.depth=0; self.parts=[]; self.links=[]; self.link=None; self.ignored=0
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='main': self.depth+=1
        if not self.depth: return
        if tag in ('script','style'): self.ignored+=1
        if tag=='a': self.link={'url':attrs.get('href',''),'title':''}
        if tag in ('p','div','h1','h2','h3','li','br'): self.parts.append('\n')
    def handle_endtag(self,tag):
        if tag=='a' and self.link:
            self.links.append(self.link); self.link=None
        if tag in ('script','style') and self.ignored: self.ignored-=1
        if tag=='main': self.depth=max(0,self.depth-1)
    def handle_data(self,data):
        if self.depth and not self.ignored:
            self.parts.append(data)
            if self.link: self.link['title']+=data

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Quilyn content review (local)'}),timeout=45) as response:
        raw=response.read(); final=response.url
    parser=MainParser();parser.feed(raw.decode())
    body=re.sub(r'\n\s*\n+', '\n', ''.join(parser.parts)).strip()
    return {'url':url,'finalUrl':final,'sha256':hashlib.sha256(raw).hexdigest(),
            'links':[dict(url=urllib.parse.urljoin(final,l['url']),title=' '.join(l['title'].split())) for l in parser.links],
            'text':body}

if __name__=='__main__':
    import urllib.parse
    out=Path('/tmp/quilyn-sources');out.mkdir(exist_ok=True)
    def module(item):
        n,slug,v,context=item; url=f'https://academy.pega.com/module/{slug}/v{v}/in/{context}'
        data=fetch(url); (out/f'm{n:02}.txt').write_text(data.pop('text'))
        data['id']=f'SSA-M{n:02}'; data['checkedOn']='2026-10-01'
        data['topics']=[l for l in data['links'] if '/topic/' in l['url']]
        data['quiz']=next((l['url'] for l in data['links'] if '/quiz/' in l['url']),None)
        print(data['id'],len(data['topics']),'topics',flush=True)
        return data
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: modules=list(pool.map(module,SLUGS))
    (ROOT/'data/review/ssa-sources.json').write_text(json.dumps(modules,indent=2)+'\n')
    urls=sorted({l['url'] for m in modules for l in m['topics']})
    def topic(url):
        data=fetch(url); filename=hashlib.sha256(url.encode()).hexdigest()[:12]+'.txt'
        (out/filename).write_text(data.pop('text')); data['textFile']=filename; data['checkedOn']='2026-10-01'
        return data
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: topics=list(pool.map(topic,urls))
    (ROOT/'data/review/ssa-topic-sources.json').write_text(json.dumps(topics,indent=2)+'\n')
    print('Collected',len(modules),'modules and',len(topics),'topics')
