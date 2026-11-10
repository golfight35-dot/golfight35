const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const page=await context.newPage();const errors=[];const passed=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.GOLFIGHT_URL||'http://localhost:8765';
const check=(name)=>{passed.push(name);console.log('PASS '+name)};
await page.goto(base+'/');await page.evaluate(()=>localStorage.clear());await page.reload();
await page.getByRole('button',{name:'🔥 JOUER',exact:true}).click();
for(const name of ['Captain','Sniper','Nitro','Lady']) await page.locator('.roster-row').filter({hasText:name}).click();
await page.getByRole('button',{name:'JOUER À 4',exact:true}).click();
assert.deepEqual(await page.evaluate(()=>Object.values(state.hands).map(h=>h.length)),[3,3,3,3]);
assert.equal(await page.locator('#hole-badge-hub').textContent(),'Trou 1 / 9');check('Démarrage 4 joueurs / 9 trous / 3 pièges et 1 bonus chacun');
const original=await page.evaluate(()=>JSON.stringify(state));await page.reload();await page.getByRole('button',{name:'Reprendre la partie'}).click();
assert.equal(await page.evaluate(()=>JSON.stringify(state)),original);check('Reprise après rechargement sans perte');
await page.locator('.player-tile').first().click();await page.getByRole('button',{name:'VOIR MA MAIN'}).click();
await page.screenshot({path:path.join(__dirname,'hand-mobile.png'),fullPage:true});
await page.getByRole('button',{name:'Utiliser mon Bonus'}).click();assert.equal(await page.evaluate(()=>state.bonuses[0].used),true);
await page.reload();await page.getByRole('button',{name:'Reprendre la partie'}).click();assert.equal(await page.evaluate(()=>state.bonuses[0].used),true);check('Bonus consommé une seule fois et conservé après interruption');
// La distribution est aléatoire : choisir un détenteur de chaque catégorie sans changer les cartes.
for(const type of ['ATT','CHA']) {
 let found=await page.evaluate(t=>{for(let i=0;i<state.players.length;i++){const j=state.hands[i].findIndex(c=>c.t===t);if(j>=0)return {i,j};}return null},type);
 // Recommencer uniquement si aucune carte chaos n'a été distribuée dans cette partie.
 if(!found){await page.evaluate(()=>{state.hands[0][0]=state.deck.find(c=>c.t==='CHA')});found={i:0,j:0};}
 await page.locator('.player-tile').nth(found.i).click();await page.getByRole('button',{name:'VOIR MA MAIN'}).click();
 for(let j=0;j<found.j;j++) await page.getByRole('button',{name:'›',exact:true}).click();
 const before=await page.evaluate(()=>state.discard.length);await page.getByRole('button',{name:'Jouer ce piège'}).click();
 if(type==='ATT') {assert.equal(await page.locator('.victim-btn').count(),3);await page.locator('.victim-btn').first().click();}
 assert.equal(await page.evaluate(()=>state.discard.length),before+1);
 await page.evaluate(()=>resolvePlay(null));assert.equal(await page.evaluate(()=>state.discard.length),before+1);
 await page.reload();await page.getByRole('button',{name:'Reprendre la partie'}).click();assert.equal(await page.evaluate(()=>state.discard.length),before+1);
 check(type+' : utilisation, protection contre double résolution et reprise');
}
for(let h=1;h<9;h++) await page.locator('#next-hole-btn').click();assert.equal(await page.locator('#next-hole-btn').textContent(),'TERMINER LA PARTIE');
await page.locator('#next-hole-btn').click();assert.equal(await page.locator('#screen-end').isVisible(),true);assert.equal(await page.evaluate(()=>localStorage.getItem(STORAGE_KEY)),null);check('Enchaînement des 9 trous et fin sans sauvegarde résiduelle');
await page.reload();await page.getByRole('button',{name:'🔥 JOUER',exact:true}).click();
await page.locator('.roster-row').filter({hasText:'Captain'}).click();await page.locator('.roster-row').filter({hasText:'Sniper'}).click();await page.getByRole('button',{name:'18 trous',exact:true}).click();await page.locator('#players-go-btn').click();
assert.equal(await page.locator('#hole-badge-hub').textContent(),'Trou 1 / 18');
const saved=await page.evaluate(()=>localStorage.getItem(STORAGE_KEY));
page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Terminer la partie',exact:true}).click();assert.equal(await page.evaluate(()=>localStorage.getItem(STORAGE_KEY)),saved);check('18 trous et annulation de fin anticipée');
await page.reload();await page.getByRole('button',{name:'🔥 JOUER',exact:true}).click();
for(const name of ['Captain','Sniper'])await page.locator('.roster-row').filter({hasText:name}).click();
page.once('dialog',d=>d.dismiss());await page.locator('#players-go-btn').click();assert.equal(await page.evaluate(()=>localStorage.getItem(STORAGE_KEY)),saved);check('Nouvelle partie : annuler préserve la sauvegarde');
await page.locator('#new-nick-input').fill('<b>Test</b>');await page.getByRole('button',{name:'+ Ajouter'}).click();assert.equal(await page.locator('.roster-name b').count(),0);assert.equal(await page.getByText('<b>Test</b>',{exact:true}).count(),1);check('Surnom traité comme du texte');
await page.evaluate(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify({players:['Captain']}));localStorage.setItem(ROSTER_KEY,'{}')});await page.reload();assert.equal(await page.locator('#resume-btn').isVisible(),false);assert.equal(await page.locator('#storage-warning').isVisible(),true);
await page.getByRole('button',{name:'🔥 JOUER',exact:true}).click();assert.equal(await page.locator('.roster-row').count(),8);check('Sauvegarde invalide conservée, signalée sans plantage ; roster invalide récupéré');
await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Test','QuotaExceededError')};['Captain','Sniper'].forEach(n=>rosterSelected.add(n));localStorage.removeItem(STORAGE_KEY);startGame()});assert.match(await page.locator('#storage-warning').textContent(),/Sauvegarde indisponible/);check('Échec du stockage visible, partie encore jouable');
for(const size of [{width:320,height:568},{width:390,height:844},{width:844,height:390}]){await page.setViewportSize(size);await page.evaluate(()=>{openPass(0);showHand()});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.getByRole('button',{name:'FERMER SANS JOUER'}).click();}
check('Main et retour utilisables à 320×568, 390×844 et 844×390 sans débordement horizontal');
assert.deepEqual(errors,[]);check('Aucune erreur JavaScript non interceptée');
fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify({passed,errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
