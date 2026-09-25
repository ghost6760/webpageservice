#!/usr/bin/env python3
"""Imágenes para compartir (1200x630): images/og-image.png (EN) y og-image-es.png (ES).

  python3 tools/sitio/og-image.py        # necesita Playwright con Chromium

Deja og-en.png y og-es.png en /tmp/og-hachi/og/; cópialas a images/ como
og-image.png / twitter-image.png y og-image-es.png / twitter-image-es.png.
"""
import sys, subprocess, time, glob
from playwright.sync_api import sync_playwright
import os
R = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
S = sys.argv[1] if len(sys.argv) > 1 else "/tmp/og-hachi"
os.makedirs(S + "/og", exist_ok=True)
import shutil
shutil.copy(R + "/icons/icon-512x512.png", S + "/og/disco.png")
for f in glob.glob(R + "/assets/fonts/Inter-*.woff2"): shutil.copy(f, S + "/og/")
# En el entorno de Claude Code hay un Chromium preinstalado; en otro sitio, el de Playwright.
HS = (glob.glob("/opt/pw-browsers/chromium_headless_shell-*/*/headless_shell") or [None])[0]
TEXTOS = {
  'en': dict(ceja='HACHI · AI RECEPTIONIST', t1='Answers, calls and books.', t2='Without inventing slots or prices.',
             sub='WhatsApp · SMS · Phone calls · Messenger', g='Guardrails enforced in code, not in the prompt'),
  'es': dict(ceja='HACHI · RECEPCIONISTA CON IA', t1='Atiende, llama y agenda.', t2='Sin inventar horas ni precios.',
             sub='WhatsApp · Teléfono · Messenger · 24/7', g='Reglas críticas impuestas en código, no en el prompt'),
}
def html(t):
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Inter;src:url(Inter-Regular.woff2);font-weight:400}}
@font-face{{font-family:Inter;src:url(Inter-SemiBold.woff2);font-weight:600}}
@font-face{{font-family:Inter;src:url(Inter-Bold.woff2);font-weight:700}}
*{{margin:0;box-sizing:border-box}}
body{{width:1200px;height:630px;background:#0a0a0f;font-family:Inter,sans-serif;color:#E5E7EB;
 background-image:radial-gradient(circle at 18% 30%,rgba(139,92,246,.22),transparent 45%),radial-gradient(circle at 85% 85%,rgba(6,182,212,.16),transparent 45%);
 display:flex;align-items:center;padding:0 80px;gap:64px}}
img{{width:380px;height:380px;flex:none;filter:drop-shadow(0 0 40px rgba(139,92,246,.25))}}
.ceja{{font-size:22px;letter-spacing:.14em;color:#A78BFA;font-weight:600;margin-bottom:22px}}
h1{{font-size:56px;line-height:1.1;font-weight:700;color:#fff;letter-spacing:-.02em}}
h1 span{{display:block;background:linear-gradient(135deg,#8B5CF6,#06B6D4);-webkit-background-clip:text;color:transparent}}
.sub{{font-size:25px;margin-top:28px;color:#D1D5DB}}
.g{{font-size:21px;margin-top:12px;color:#9CA3AF}}
.url{{font-size:22px;margin-top:34px;color:#fff;font-weight:600}}
</style></head><body><img src="disco.png"><div>
<div class="ceja">{t['ceja']}</div><h1>{t['t1']}<span>{t['t2']}</span></h1>
<div class="sub">{t['sub']}</div><div class="g">{t['g']}</div><div class="url">hachi.live</div></div></body></html>'''
for lang, t in TEXTOS.items():
    open(f'{S}/og/{lang}.html', 'w').write(html(t))
srv = subprocess.Popen(["python3","-m","http.server","8766","-d",S+"/og"],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=HS) if HS else p.chromium.launch()
        pg = b.new_page(viewport={"width":1200,"height":630})
        for lang in TEXTOS:
            pg.goto(f"http://localhost:8766/{lang}.html", wait_until="networkidle"); time.sleep(0.3)
            pg.screenshot(path=f"{S}/og/og-{lang}.png")
        b.close()
finally:
    srv.terminate()
print('ok')
