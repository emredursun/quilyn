"""Create three disjoint, blueprint-balanced practice forms from the SSA bank.
Module overlap is intentional and disclosed; these are not unseen readiness tests.
Stable source question IDs make question lineage auditable.
"""
import collections,json,random
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
registry=json.loads((ROOT/'data/registry.json').read_text());track=next(t for t in registry['tracks'] if t['trackId']=='PSSA')
pools=collections.defaultdict(list)
for meta in track['modules']:
    module=json.loads((ROOT/meta['file']).read_text())
    for q in module['practiceQuiz']: pools[meta['examDomain']].append((meta,q))
counts={d:round(w*track['exam']['questionCount']/100) for d,w in track['exam']['blueprint'].items()}
for d,count in counts.items(): assert len(pools[d])>=count*3,(d,len(pools[d]),count*3)
# Interleave module questions to give each form topic breadth, with no repeats
# between forms. This preserves the existing bank's correctness and provenance.
for domain,questions in pools.items():
    questions.sort(key=lambda pair:(int(pair[1]['questionId'].split('-Q')[-1]),pair[0]['id']))
forms={};lineage=[]
for form in range(3):
    selected=[]
    for domain,count in counts.items():
        for meta,q in pools[domain][form::3][:count]:
            option_ids=[o['id'] for o in q['options']]
            selected.append(dict(d=domain,t='single' if len(q['correctOptions'])==1 else 'multi',q=q['scenario'],
                o=[o['text'] for o in q['options']],a=[option_ids.index(a) for a in q['correctOptions']],r=q['rationale'],
                src=q['sourceUrl'],sourceModuleId=meta['id'],sourceQuestionId=q['questionId']))
    random.Random(2500+form).shuffle(selected)
    for i,q in enumerate(selected,1): q['questionId']=f'SSA-MOCK{form+1}-Q{i:02}'
    forms[f'Mock Exam {form+1}']=selected
    lineage.append(dict(name=f'Mock Exam {form+1}',questions=len(selected),domains=counts,
        moduleCoverage=sorted(set(q['sourceModuleId'] for q in selected))))
bank=json.loads((ROOT/'data/mock-exams.json').read_text());bank['PSSA']=forms
(ROOT/'data/mock-exams.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
report=dict(examCode=track['exam']['code'],builtOn='2026-10-01',kind='Blueprint-balanced practice forms',
    disclosure='These forms reuse original module practice questions. Forms do not repeat questions between each other; scores are practice feedback, not an unseen exam-readiness estimate.',
    source='https://academy.pega.com/exam/certified-pega-senior-system-architect-6',forms=lineage)
(ROOT/'data/review/ssa-mock-design.json').write_text(json.dumps(report,indent=2)+'\n')
print('Built 3 SSA practice mock forms, 60 questions each; no cross-form duplicates')
