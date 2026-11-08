import sys, re, json, importlib
mod = importlib.import_module(sys.argv[1])
only = sys.argv[2] if len(sys.argv) > 2 else None
strip = lambda h: re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', h)).strip()
for c in mod.CASES:
    if only and only.lower() not in c['title'].lower(): continue
    print('=' * 8, c['title'], '|', c['type'], c['diff'])
    for i, q in enumerate(c['questions']):
        ex = q['exhibit']
        if ex and ex['kind'] == 'table':
            print(f'  [T{i+1}]', ex['headers']); [print('     ', row) for row in ex['rows']]
        print(f'  Q{i+1}:', q['q']); print('   A:', strip(q['answer']))
    print('  RECO:', c['reco'])
