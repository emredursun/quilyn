"""Assemble authored SSA lessons. Sources are collected, never inferred from slugs.

Compact authoring rows: [topic index, scenario, correct answer(s), distractors,
rationale]. Option positions rotate deterministically; question IDs stay stable.
"""
import json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
SOURCES={int(m['id'][-2:]):m for m in json.loads((ROOT/'data/review/ssa-sources.json').read_text())}
LESSONS={}

def lesson(n, title, domain, notes, examples, pitfalls, questions):
    LESSONS[n]=dict(title=title,domain=domain,notes=notes,examples=examples,pitfalls=pitfalls,questions=questions)

def question(n, i, row, mock=False):
    topic, scenario, correct, distractors, rationale=row
    if isinstance(correct,str): correct=[correct]
    raw=[(s,True) for s in correct]+[(s,False) for s in distractors]
    assert len(raw) in (4,5) and len(set(s for s,_ in raw))==len(raw)
    offset=(n+i)%len(raw); raw=raw[offset:]+raw[:offset]
    options=[dict(id=chr(65+j),text=s) for j,(s,_) in enumerate(raw)]
    answers=[o['id'] for o,(_,is_correct) in zip(options,raw) if is_correct]
    src=SOURCES[n]['topics'][topic]['url']
    return dict(questionId=f'SSA-M{n:02}-Q{i:02}',type='single-select' if len(correct)==1 else 'multi-select',
        scenario=scenario, options=options, correctOptions=answers, rationale=rationale,
        hint='Identify the requirement, then compare the scope and timing of each proposed mechanism.', sourceUrl=src)

def build():
    registry=json.loads((ROOT/'data/registry.json').read_text());track=next(t for t in registry['tracks'] if t['trackId']=='PSSA')
    for n,l in sorted(LESSONS.items()):
        source=SOURCES[n]; topics=[dict(title=re.sub(r'\s*\d+\s*mins?\s*$','',t['title']),url=t['url']) for t in source['topics']]
        assert len(l['notes'])==len(topics)==len(l['examples']), (n,'topic coverage')
        guide=[]
        for topic,note,example in zip(topics,l['notes'],l['examples']):
            guide.append(dict(sectionTitle=topic['title'],elements=[
                dict(type='concept',term='Choose the right mechanism',description=note),
                dict(type='text',text='Worked example: '+example),
                dict(type='links',title='Official reference',items=[dict(label=topic['title'],url=topic['url'])])]))
        guide.append(dict(sectionTitle='Apply and explain',elements=[dict(type='list',title='Training environment checklist',items=[
            'Implement the worked example in a training application; use synthetic data.',
            'Test the expected path and at least one failure or boundary condition.',
            'Explain why the alternative mechanism would not meet the requirement.',
            'Revisit incorrect answers in Smart Review rather than memorizing option positions.']),
            dict(type='note',text="These notes target the '25 exam. Shared Academy pages may show newer labels with '25 applicability; verify screens in your training environment.")]))
        quiz=[question(n,i,row) for i,row in enumerate(l['questions'],1)]
        assert len(quiz)>=8
        assert all(any(q['sourceUrl']==t['url'] for q in quiz) for t in topics)
        data=dict(moduleId=f'SSA-M{n:02}',moduleTitle=l['title'],moduleUrl=source['url'],moduleQuizUrl=source['quiz'],
            learningObjectives=[f"Select and justify {t['title'].lower()} in a business scenario." for t in topics],
            estTime='20–35 min + practice',examDomain=l['domain'],platformVersion='25',sourceReviewedOn='2026-10-01',
            reviewScope='Official topic comparison and original-question editorial review; not vendor endorsement.',
            topics=topics,studyGuide=guide,examPitfalls=[dict(title=p[0],trapDescription=p[1],bestPractice=p[2]) for p in l['pitfalls']],
            practiceQuiz=quiz,quickRecap=[dict(key=t['title'],value=note) for t,note in zip(topics,l['notes'])])
        slug=re.sub(r'[^a-z0-9]+','_',l['title'].lower()).strip('_');file=f'data/senior-system-architect/m{n:02}_{slug}.json'
        (ROOT/file).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
        existing=next((m for m in track['modules'] if m['id']==data['moduleId']),None)
        entry=dict(id=data['moduleId'],name=l['title'],file=file,ready=True,examDomain=l['domain'])
        if existing: existing.update(entry)
        else: track['modules'].append(entry)
    (ROOT/'data/registry.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
    print('Built',len(LESSONS),'SSA lessons;',sum(len(l['questions']) for l in LESSONS.values()),'original questions')

# Authored lesson specifications are loaded without executing external content.
if __name__=='__main__':
    for path in sorted((ROOT/'scripts/content').glob('ssa_lessons_*.json')):
        for item in json.loads(path.read_text()): lesson(**item)
    build()
