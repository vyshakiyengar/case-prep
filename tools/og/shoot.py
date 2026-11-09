# Turns tools/og/out/*.html into public/og/*.jpg (1200 x 630). Needs Python Playwright.
import asyncio, glob, os
from playwright.async_api import async_playwright
ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
async def run():
    os.makedirs(os.path.join(ROOT, 'public/og'), exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 1200, 'height': 630})
        files = sorted(glob.glob(os.path.join(ROOT, 'tools/og/out/*.html')))
        for f in files:
            await pg.goto('file://' + os.path.abspath(f)); await pg.evaluate('document.fonts.ready')
            name = os.path.basename(f)[:-5]
            await pg.screenshot(path=os.path.join(ROOT, 'public/og', name + '.jpg'), type='jpeg', quality=80)
        await b.close(); print('shot', len(files))
asyncio.run(run())
