/* v15 · v13 적군 능력치·공용 스킬 복원 + 전장 전술 연결. */
function restorationSideKey(){const f=String(document.getElementById('faction-title')?.textContent||'');return f.includes('위')?'wei':f.includes('촉')?'shu':'wu';}
function restorationRowKey(round,side,slot){return round<=20?`01-20/${round}/${slot}/1`:`branch/${side}/${round}/${slot}`;}
function restorationPickCommonSkills(tier,previous){
 const rules=RESTORE_V13_COMMON_CHANCES[tier]||RESTORE_V13_COMMON_CHANCES.D;
 if(Array.isArray(previous))return previous.map(name=>commonSkillsData.find(x=>x.name===name)).filter(Boolean).map(x=>({...x}));
 const n=Math.random();const count=n<rules[0]?0:n<rules[0]+rules[1]?1:2;
 const allowed=new Set(String(rules[3]||'').split(',').map(x=>x.trim()).filter(Boolean));
 const pool=commonSkillsData.filter(x=>allowed.has(x.name));
 const picked=[];
 for(let i=0;i<count&&pool.length;i++){
  const idx=Math.floor(Math.random()*pool.length);
  const x=pool.splice(idx,1)[0];picked.push({...x,isUnique:false});
 }
 return picked;
}
function restorationBuildSkill(rec,identity,isNew){
 const base={id:`restoration:${rec.side}:${rec.round}:${rec.slot}`,isUnique:true,name:rec.skillName,type:rec.skillType,
  range:rec.skillRange,target:['ally_all','ally_front_all','ally_lowest_hp_ratio','self'].includes(rec.skillRange)?rec.skillRange:'enemy_single',
  power:rec.skillPower,acc:rec.skillAcc,attackCount:rec.skillHits,cooldownSec:rec.cooldown,desc:rec.skillDesc,runtimeEffects:(rec.skillEffects||[]).map(x=>({...x}))};
 const generic=/체력 50% 이상이면 (?:무력|지력) \+5|아군을 지원한다\.|체력 50% 이상이면 무력 \+5\./.test(rec.traitDesc||'');
 if(generic&&!identity.special){
  const a=restorationTacticConfig(identity);
  base.name=rec.name+' · '+a.skill;
  base.type=a.kind;base.range=a.range;
  base.target=a.range.startsWith('ally_')?a.range:'enemy_single';
  base.power=a.range.startsWith('ally_')?0:Math.max(25,rec.skillPower||Math.max(34,Math.floor((rec.force+rec.intel)/2)));
  base.runtimeEffects=[];
  if(a.range==='ally_lowest_hp_ratio')base.runtimeEffects.push({phase:'support',type:'heal_pct_max',who:'target',value:10});
  if(a.range==='ally_front_all')base.runtimeEffects.push({phase:'support',type:'shield_front_pct',who:'target',value:10,duration:5});
  if(a.range==='ally_all')base.runtimeEffects.push({phase:'support',type:'damage_dealt',who:'target',value:10,duration:5});
  base.desc=identity.desc;
 }
 if(identity.mode==='maSu'){base.name='고지 화살비';base.range='all_both';base.type='책략';base.target='enemy_single';base.power=Math.max(55,base.power);base.runtimeEffects=[];}
 if(identity.mode==='haoZhao'){base.name='성벽 수호';base.range='front_first';base.type='물리';base.target='enemy_single';base.power=Math.max(65,base.power);base.runtimeEffects=[];}
 if(identity.mode==='maChao'){base.name='금마초 돌격';base.range='front_first';base.type='물리';base.target='enemy_single';base.power=Math.max(115,base.power);base.runtimeEffects=[];}
 if(identity.mode==='zhangLiao'){base.name='소요진 돌파';base.range='rear_first';base.type='물리';base.target='enemy_single';base.power=Math.max(110,base.power);base.runtimeEffects=[];}
 if(identity.mode==='huangGai'){base.name='화선 돌격';base.range='all_both';base.type='책략';base.target='enemy_single';base.power=Math.max(110,base.power);base.runtimeEffects=[];}
 return base;
}
function restorationApplyBranchTeam(team,round,side=restorationSideKey()){
 if(!Array.isArray(team))return team;
 for(let i=0;i<team.length;i++){
  const rec=RESTORE_V13_ROWS[restorationRowKey(round,side,i+1)];if(!rec)continue;
  const unit=team[i],identity=restorationIdentity(`${side}/${round}/${rec.name}`,rec);
  const previousCommon=unit.restorationCommonNames;
  const unique=restorationBuildSkill(rec,identity,round>=31);
  const common=restorationPickCommonSkills(rec.tier,previousCommon);
  Object.assign(unit,{name:rec.name,tier:rec.tier,cmd:rec.cmd,force:rec.force,intel:rec.intel,pol:rec.pol,
   hp:rec.hp,maxHp:rec.hp,difficultyBaseHp:rec.hp,dodge:rec.dodge||0,hit:rec.hit||0,cooldown:rec.cooldown,
   scenarioSkill:unique,skills:[unique,...common],restorationCommonNames:common.map(x=>x.name),
   restorationTactic:identity,restorationRowId:restorationRowKey(round,side,i+1),
   scenarioTrait:{id:`tactic:${side}:${round}:${i}`,name:identity.label,description:identity.desc,trigger:{type:'passive'},conditions:[],effects:[]},
   trait:identity.desc,branchBattleKey:`${side}/${round}`,branchTrait:round>=31?{}:{...(unit.branchTrait||{})},
   battleRow:rec.row,battleRowLocked:true,bounty:{D:0,C:0,B:1,A:2,S:3,SS:4,SSS:5}[rec.tier]||0});
  unit.scenarioTraitDescription=identity.desc;
 }
 return team;
}
function restorationApplyScenarioTeam(team,round){
 if(!Array.isArray(team)||round>20)return team;
 for(let i=0;i<team.length;i++){
  const unit=team[i];
  const prefix=`01-20/${round}/${i+1}/`;
  const found=Object.entries(RESTORE_V13_ROWS).find(([key,rec])=>key.startsWith(prefix)&&rec.name===unit.name);
  if(!found)continue;
  const [rid,r]=found;
  const common=restorationPickCommonSkills(r.tier,unit.restorationCommonNames);
  unit.tier=r.tier;unit.force=r.force;unit.cmd=r.cmd;unit.intel=r.intel;unit.pol=r.pol;
  unit.hp=r.hp;unit.maxHp=r.hp;unit.difficultyBaseHp=r.hp;unit.dodge=r.dodge||0;unit.hit=r.hit||0;unit.cooldown=r.cooldown;
  unit.scenarioSkill={...unit.scenarioSkill,power:r.skillPower,acc:r.skillAcc,attackCount:r.skillHits,cooldownSec:r.cooldown};
  unit.skills=[unit.scenarioSkill,...common];unit.restorationCommonNames=common.map(x=>x.name);unit.restorationRowId=rid;
  unit.bounty={D:0,C:0,B:1,A:2,S:3,SS:4,SSS:5}[r.tier]||0;
 }
 return team;
}
function restorationExecuteCommonSkill(unit,skill,allies,enemies,time,playerTeam,enemyTeam){
 if(!skill)return 0;
 const name=skill.name,kind=skill.type==='책략'?'strategy':skill.type==='고정피해'?'fixed':'physical';
 const own=allies.filter(x=>x.hp>0),foes=enemies.filter(x=>x.hp>0);
 if(!foes.length)return 0;
 let support=[];
 if(['격려','사기진작'].includes(name))support=own;
 else if(['철벽'].includes(name))support=[unit];
 else if(['구원병'].includes(name))support=own.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp).slice(0,1);
 if(support.length){
  for(const target of support){
   if(name==='구원병')scenarioHeal(target,Math.floor((target.maxHp-target.hp)/4));
   else if(name==='철벽')restorationBuff(target,'phys_reduce',20,5,time,'common:wall');
   else if(name==='격려')restorationBuff(target,'dmg_up',10,10,time,'common:encourage');
   else if(name==='사기진작')restorationBuff(target,'dmg_up',12,10,time,'common:morale');
  }
  addLog(`[${unit.name}] 공용 기술 [${name}] 지원`, 'log-buff');battleFXSupport(unit,support,skill);
  return 0;
 }
 if(name==='도발'){
  restorationBuff(unit,'taunt',1,5,time,'common:taunt');addLog(`[${unit.name}] 공용 기술 [도발]`, 'log-buff');return 0;
 }
 const wide=['난무','연화','화공','수공','허보','도발'].includes(name);
 const range=REVIEWED_SKILL_RANGES.common[name]||'front_first';
 const targets=formationPickOpponents(unit,{...skill,name,range},foes,{mode:range,count:wide?99:1});
 let reward=0;
 for(const target of targets){
  if(!target||target.hp<=0)continue;
  let acc=(skill.acc||80)+(unit.hit||0)-(target.dodge||0);
  if(['매복','화공','혼란','화계','허보','유언비어'].includes(name))acc+=Math.max(0,unit.intel-target.intel);
  acc=Math.max(20,Math.min(100,acc));
  if(Math.random()*100>=acc){battleFXHit(unit,target,0,skill.type,false,true,name);continue;}
  let power=skill.power||0;
  if(name==='맹공'&&target.hp/target.maxHp>.7)power*=1.2;
  if(name==='추격'&&target.hp/target.maxHp<=.5)power*=1.2;
  if(name==='반격')power*=1+Math.min(.5,(1-unit.hp/unit.maxHp)*.5);
  if(name==='급습'&&!unit.restorationCommonFirstUse?.includes(name))power*=1.2;
  if(name==='절명'&&target.hp/target.maxHp<=.3)power*=1.5;
  if(name==='연화')power*=.82;
  if(wide)power*=.70;
  const def=kind==='physical'?target.cmd:kind==='strategy'?target.pol:0;
  let damage=kind==='fixed'?power:power*(kind==='physical'?unit.force:unit.intel)/(100+def);
  if(kind==='physical'&&name==='분쇄')damage*=1.06;
  if(target.buffs?.some(b=>b.stat==='dmg_taken_up'))damage*=1.10;
  const isCrit=kind!=='fixed'&&Math.random()<.05;if(isCrit)damage*=1.3;
  damage=Math.min(300,Math.max(0,Math.floor(damage)));
  if(kind==='fixed'&&immuneToPlayerFixedDamage(target,enemies,'고정피해'))damage=0;
  damage=playableLeathalGuard(target,damage,time);
  damage=branchAbsorbShield(target,damage,time);
  target.hp=Math.max(0,target.hp-damage);unit.totalDamage=(unit.totalDamage||0)+damage;
  battleFXHit(unit,target,damage,skill.type,isCrit,false,name);scenarioHealthBar(target);
  if(name==='쇄갑'||name==='파갑')scenarioPutBuff(target,'cmd',name==='쇄갑'?-10:-18,5,time,'common:armor');
  if(name==='유언비어')scenarioPutBuff(target,'force',-15,5,time,'common:rumor');
  if(name==='허보')scenarioPutBuff(target,'hit',-15,5,time,'common:feint');
  if(name==='화계')branchApplyEffect({type:'burn_2sec',who:'target',damage:5,duration:5},unit,target,time,skill,[]);
  if(['매복','혼란'].includes(name))target.currentCooldown=Math.min(10,target.currentCooldown+1);
  if(target.hp<=0){reward+=processKillEvents(unit,target,enemyTeam,playerTeam,time);branchOnKill(unit,time);}
 }
 unit.restorationCommonFirstUse=unit.restorationCommonFirstUse||[];
 if(!unit.restorationCommonFirstUse.includes(name))unit.restorationCommonFirstUse.push(name);
 addLog(`[${unit.name}] 공용 기술 [${name}] 사용`, 'log-skill');
 updateDamageMeters(playerTeam,enemyTeam);
 return reward;
}

/* v12 저장 호환: 과거 1×3/3×1 유비·비의·미축을 2×2로 이동한다. */
function restorationMigrateLegacyGeneralCards(){
 const changedNames=new Set(['유비','비의','미축']);
 let moved=0;
 for(const el of Array.from(document.querySelectorAll('#inventory-container .placed-item.type-general,#storage-container .placed-item.type-general'))){
  const d=el.itemData;
  if(!d||!changedNames.has(d.name)||((d.w!==1||d.h!==3)&&(d.w!==3||d.h!==1)))continue;
  d.w=2;d.h=2;if(d.stats){d.stats.w=2;d.stats.h=2;}
  const anchor=el.closest('#inventory-container .slot');
  if(!anchor){el.innerHTML=generalPlacedMarkup(d);continue;}
  const uid=el.dataset.uid;
  clearOccupied(uid);
  const r=Number(anchor.dataset.r),c=Number(anchor.dataset.c),cells=[];
  for(let row=r;row<r+2;row++)for(let col=c;col<c+2;col++)cells.push(getInvSlot(row,col));
  const fits=cells.length===4&&cells.every(slot=>slot&&!slot.classList.contains('locked')&&(!slot.children.length||slot===anchor)&&!slot.dataset.occupiedBy);
  if(fits){for(const slot of cells)if(slot!==anchor)slot.dataset.occupiedBy=uid;
   el.innerHTML=generalPlacedMarkup(d);sizeDeployedCard(el,d);
  }else{
   el.remove();
   const available=Array.from(document.querySelectorAll('#storage-container .slot')).find(slot=>!slot.children.length);
   if(available)placeSavedGeneral(available,d,uid,false);
   else pendingRecruits.push(d);
   moved++;
  }
 }
 return moved;
}
