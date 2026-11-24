import asyncio,sys,base64,os
from playwright.async_api import async_playwright
times=[float(a) for a in sys.argv[2:]] if len(sys.argv)>2 else None
out=sys.argv[1]
os.makedirs(out,exist_ok=True)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files'])
    pg=await b.new_page(viewport={'width':960,'height':640})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('file://'+os.path.abspath(os.environ.get('PAGE','tenerife.html')));await pg.evaluate('ready')
    dur=await pg.evaluate('DUR');print('DUR',dur,await pg.evaluate('PLAN'))
    T=times or [i/30 for i in range(int(dur*30))]
    for i,t in enumerate(T):
      d=await pg.evaluate(f"(draw({t}),document.getElementById('c').toDataURL('image/png'))")
      open(f'{out}/f{i:04d}.png','wb').write(base64.b64decode(d.split(',')[1]))
    print('errs',errs[:3],len(T))
    await b.close()
asyncio.run(main())
