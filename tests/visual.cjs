const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const base=process.env.GOLFIGHT_URL||'http://localhost:8765';
const results=[];
const colors=[['Texte / fond','#F5F2E4','#111014',4.5],['Bouton rose / texte sombre','#FF2994','#111014',4.5],['Attaque corail / texte sombre','#E82C64','#08070A',4.5],['Chaos violet / texte clair','#722FE3','#F5F2E4',4.5],['Bonus citron / texte sombre','#D6F46A','#111014',4.5],['Texte secondaire / fond','#c4bec6','#111014',4.5]];
const lum=h=>{const c=h.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722};
for(const [name,a,b,min] of colors){const x=lum(a),y=lum(b);const ratio=(Math.max(x,y)+.05)/(Math.min(x,y)+.05);assert(ratio>=min,`${name}: ${ratio}`);results.push({test:name,ratio:Math.round(ratio*100)/100,status:'PASS'});}
for(const [width,height] of [[320,568],[390,844]]){
const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base);await page.evaluate(()=>document.fonts.ready);
assert(await page.evaluate(()=>document.fonts.check('800 24px "Barlow Condensed"')));
const bounds=async()=>{assert(await page.evaluate(()=>{const s=document.querySelector('.screen.active');return document.documentElement.scrollWidth<=innerWidth && s.scrollWidth<=s.clientWidth}));};
await bounds();
const crest=await page.locator('.club-crest').evaluate(img=>({loaded:img.complete&&img.naturalWidth===640&&img.naturalHeight===616,box:img.getBoundingClientRect().toJSON()}));
assert(crest.loaded&&crest.box.width>=128&&crest.box.y>=0&&crest.box.bottom<=height);
const play=page.getByRole('button',{name:'🔥 JOUER',exact:true});const playBox=await play.boundingBox();assert(playBox.height>=44&&playBox.y+playBox.height<=height);
const fanBottom=await page.locator('.fan-card').evaluateAll(cards=>Math.max(...cards.map(el=>el.getBoundingClientRect().bottom)));assert(fanBottom<playBox.y);
const hook=page.locator('#screen-home .hook');if(await hook.isVisible())assert(fanBottom<(await hook.boundingBox()).y);
results.push({test:`${width}px : écusson original chargé et visible, action entièrement visible, aucun chevauchement de l'éventail`,status:'PASS'});
await play.click();
for(const name of ['Captain','Sniper','Nitro','Lady'])await page.locator('.roster-row').filter({hasText:name}).click();await page.locator('#players-go-btn').click();
const saved=await page.evaluate(()=>localStorage.getItem(STORAGE_KEY));
await page.locator('.player-tile').first().click();assert(await page.locator('#screen-pass').isVisible());assert(!(await page.locator('#screen-hand').isVisible()));
await page.getByRole('button',{name:'VOIR MA MAIN'}).click();await page.getByRole('button',{name:'FERMER SANS JOUER'}).click();assert(!(await page.locator('#screen-hand').isVisible()));assert.equal(await page.evaluate(()=>localStorage.getItem(STORAGE_KEY)),saved);
results.push({test:`${width}px : main masquée avant ouverture et après fermeture, sauvegarde inchangée`,status:'PASS'});
for(const cardName of ['Grip inversé','Une main','Club imposé']){
await page.evaluate(n=>{state.hands[0][0]={...DECK_BASE.find(c=>c.n===n)};openPass(0);showHand()},cardName);
await page.getByRole('button',{name:'Jouer ce piège'}).click();await page.locator('.victim-btn').first().click();await bounds();assert(!(await page.locator('#screen-hand').isVisible()));const ok=page.getByRole('button',{name:'OK',exact:true});await ok.scrollIntoViewIfNeeded();const r=await ok.boundingBox();assert(r.height>=44&&r.width>=44&&r.y>=0&&r.y+r.height<=height);await ok.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert.equal(await ok.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');await ok.click();assert(await page.locator('#screen-hub').isVisible());}
results.push({test:`${width}px : accueil et 3 attaques dont effet long, sans débordement, confirmation tactile et clavier`,status:'PASS'});
await page.evaluate(()=>{state.hands[0][0]={...DECK_BASE[0]};openPass(0);showHand();chooseCard(0);resolvePlay(1)});
let duration=await page.locator('#trap-card-face').evaluate(el=>getComputedStyle(el).animationDuration);assert.equal(duration,'0.22s');
await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#trap-card-face').evaluate(el=>getComputedStyle(el).animationName),'none');assert.equal(await page.locator('#trap-card-face').evaluate(el=>getComputedStyle(el).opacity),'1');
assert.deepEqual(errors,[]);results.push({test:`${width}px : animation 220ms, mouvement réduit sans animation, aucune erreur JS`,status:'PASS'});
await context.close();
}
fs.writeFileSync(path.join(__dirname,'visual-results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
