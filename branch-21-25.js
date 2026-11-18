/* 21~25R: 국가별 고정 적 편성 / 고유 기술 및 특성. 기존 1~20R와 105명 기술을 변경하지 않는다. */
const BRANCH_21_25 = {
  wei: {
    21:{title:'백랑산 오환 잔당',front:[['답돈','A'],['누반','B']],rear:[['원상','A'],['원희','B']]},
    22:{title:'형주 수군 및 양양 방어선',front:[['문빙','S'],['왕위','B']],rear:[['채모','A'],['장윤','B'],['괴월','B']]},
    23:{title:'신야·번성 유격대',front:[['진도','A'],['유봉','B']],rear:[['서서','S'],['미축','B'],['손건','B']]},
    24:{title:'당양 장판 후위 저지선',front:[['장비','S'],['조운','S'],['미방','B']],rear:[['간옹','B'],['이적','B']]},
    25:{title:'박망파의 화공',front:[['관우','S'],['장비','A'],['관평','B']],rear:[['제갈량(신야)','SS'],['유비','A'],['조운','A']]}
  },
  shu: {
    21:{title:'형주 호족 견제',front:[['장윤','B'],['한숭','B']],rear:[['채모','A'],['괴월','B']]},
    22:{title:'박망파 조조 선봉대',front:[['하후돈','S'],['이전','A'],['우금','A']],rear:[['한호','B'],['조진','B']]},
    23:{title:'번성·신야 조위 방어선',front:[['조홍','A'],['문빙','A']],rear:[['조인','S'],['만총','A'],['악진','B']]},
    24:{title:'당양 장판 호표기 추격대',front:[['조순','S'],['서황','A'],['주령','B']],rear:[['정욱','A'],['가후','A']]},
    25:{title:'장판파 대추격 — 조조 본대',front:[['허저','S'],['하후돈','A'],['장합','A']],rear:[['조조','SS'],['하후연','A'],['순유','B']]}
  },
  wu: {
    21:{title:'강동 토착 세력 평정',front:[['조랑','A'],['엄백호','B']],rear:[['엄여','B'],['왕랑','B']]},
    22:{title:'강하 외곽 수군 전초전',front:[['등룡','A'],['진취','A'],['장호','B']],rear:[['소비','A'],['진생','B']]},
    23:{title:'면구·영릉 형주 지원군',front:[['문빙','S'],['장석','B'],['왕위','B']],rear:[['채모','A'],['괴월','B']]},
    24:{title:'하구 외성 몽충선 돌파전',front:[['감녕(강하)','S'],['등룡','A'],['진취','B']],rear:[['소비','A'],['채훈','B']]},
    25:{title:'강하 원수 토벌 — 황조 본진',front:[['감녕(강하)','S'],['문빙','A'],['소비','B']],rear:[['황조','SS'],['채모','A'],['장윤','B']]}
  }
};
const BRANCH_21_25_HP = {B:115,A:150,S:190,SS:245,SSS:300};
const BRANCH_MINOR_SKILLS = {
 '누반':['오환 협공','물리','front_first',42], '원상':['원씨의 반격','물리','rear_first',45], '원희':['원씨 지원사격','책략','front_first',33],
 '왕위':['양양 방어','물리','front_first',34], '채모':['수군 지휘검','책략','front_first',37], '장윤':['수군 견제','물리','front_first',34], '괴월':['호족 계략','책략','front_first',40],
 '진도':['백이병 돌격','물리','front_first',47], '유봉':['신야 수비','물리','front_first',35], '미축':['군량 원조','책략','ally_lowest_hp_ratio',0], '손건':['외교 교란','책략','front_first',35],
 '미방':['장판 방패','물리','front_first',35], '간옹':['후방 지휘','책략','ally_all',0], '이적':['진군 보좌','책략','front_first',33],
 '장비':['장팔사모','물리','front_first',55], '관평':['청룡 보좌','물리','front_first',37], '유비':['인덕의 격려','책략','ally_all',0], '조운':['백마 돌격','물리','front_first',47],
 '한숭':['형주 교섭','책략','front_first',32], '이전':['박망파 선봉','물리','front_first',48], '우금':['진형 정비','물리','front_first',46], '한호':['기병 지원','물리','front_first',34], '조진':['선봉 추격','물리','rear_first',36],
 '조홍':['조위 수비','물리','front_first',46], '문빙':['방어 진격','물리','front_first',44], '만총':['경계 전술','책략','front_first',44], '악진':['견고한 진격','물리','front_first',35],
 '서황':['도끼 강습','물리','front_first',46], '주령':['기병 견제','물리','front_first',35], '정욱':['결단의 계책','책략','front_first',44], '가후':['독심 계략','책략','rear_first',46],
 '하후돈':['독안의 창','물리','front_first',53], '장합':['진형 교란','물리','front_first',47], '하후연':['질풍 궁격','물리','rear_first',49], '순유':['군략 지휘','책략','ally_all',0],
 '엄백호':['백호의 돌진','물리','front_first',34], '엄여':['산월의 무리','물리','front_first',33], '왕랑':['회계의 계책','책략','front_first',34],
 '진취':['수군 압박','물리','front_first',45], '장호':['강하 돌파','물리','front_first',35], '소비':['강하 화살비','물리','rear_first',45], '진생':['강하 후위','책략','front_first',33],
 '장석':['형주 호위','물리','front_first',36], '채훈':['몽충선 엄호','책략','front_first',32]
};
function branchKey(faction,round,name){return `${faction}/${round}/${name}`;}
function branchSkill(name,type,range,power,effects=[],cooldown=7){
  return {name,type,range,power,acc:90,attackCount:1,cooldownSec:cooldown,effects};
}
// 핵심 장수는 플레이 국가와 라운드에 맞춘 별도 스킬/특성을 사용한다.
const BRANCH_MAJOR = {
 'wei/21/답돈':{s:branchSkill('오환 기습','물리','front_first',66,[{phase:'hit',type:'stat',who:'target',stat:'dodge',delta:-15,duration:2}]),t:['초원의 기마대','첫 물리 공격 피해 +25%. 누반 생존 중 공격속도 +10%.',{firstPhysical:25,speedAlly:'누반',speedAllyPct:10}]},
 'wei/22/문빙':{s:branchSkill('양양 철벽','책략','ally_front_all',0,[{phase:'support',type:'defense',who:'target',scope:'all',value:20,duration:5}]),t:['수성의 명장','아군 전열이 생존하면 통솔 +20. HP 50% 이하에서 보호막 15% 1회.',{frontAliveCmd:20,shieldBelow:.5,shieldPct:15}]},
 'wei/23/서서':{s:branchSkill('팔문금쇄진','책략','all_both',36,[{phase:'hit',type:'attack_speed',who:'target',value:-15,duration:4}],8),t:['진법의 간파','전투 시작 시 가장 무력이 높은 적이 받는 책략 피해 +15% (5초).',{startStrongestMagicVuln:15}]},
 'wei/24/장비':{s:branchSkill('장판교의 포효','물리','front_all',64,[{phase:'hit',type:'damage_dealt',who:'target',value:-20,duration:2}],7),t:['만인지적','아군이 쓰러질 때마다 공격 피해 +12%, 최대 2회.',{allyDeathDamagePct:12,maxStacks:2}]},
 'wei/24/조운':{s:branchSkill('칠진칠출','물리','lowest_hp_ratio',80,[{phase:'kill',type:'heal_pct_max',who:'self',value:15}],7),t:['상산의 용장','체력 40% 이하에서 회피 +20.',{hpBelow:.4,hpBelowDodge:20}]},
 'wei/25/관우':{s:branchSkill('청룡참','물리','front_first',96,[],7),t:['무성의 위압','전투 시작 시 적 전열 공격 피해 -10% (6초).',{startFrontDamageDown:10,finisherBelow:.5,finisherBonus:25}]},
 'wei/25/제갈량(신야)':{s:branchSkill('박망파 화계','책략','all_both',52,[{phase:'hit',type:'burn_2sec',who:'target',damage:8,duration:6}],8),t:['와룡의 계책','아군 2명 사망 시 화계 쿨타임 초기화 (1회).',{resetOnTwoAlliesDead:true}]},
 'shu/21/채모':{s:branchSkill('형주 수군 지휘','책략','ally_all',0,[{phase:'support',type:'attack_speed',who:'target',value:15,duration:5}],8),t:['호족의 결속','아군이 4명 모두 생존하면 받는 피해 -15%.',{minAlliesTaken:4,takenPct:-15}]},
 'shu/22/하후돈':{s:branchSkill('발시의 맹진','물리','front_first',81,[],7),t:['독안의 투혼','체력 50% 이하가 되면 공격속도 +20%. 손실 체력에 따라 기술 피해 최대 +30%.',{hpBelow:.5,hpBelowSpeed:20,lostHpSkillBonus:30}]},
 'shu/23/조인':{s:branchSkill('팔문금쇄진','책략','ally_all',0,[{phase:'support',type:'defense',who:'target',scope:'all',value:20,duration:5},{phase:'support',type:'front_command',who:'target',value:15,duration:5}],8),t:['철벽의 조인','전열 아군 피격 시 15% 확률로 피해 20% 감소.',{frontBlockChance:15,frontBlockPct:20}]},
 'shu/24/조순':{s:branchSkill('호표기 돌격','물리','front_all',67,[{phase:'hit',type:'stat',who:'target',stat:'cmd',delta:-20,duration:3}],7),t:['정예 기병','전투 시작 5초간 아군 전열 공격속도 +15%.',{startFrontSpeed:15}]},
 'shu/25/허저':{s:branchSkill('호치의 수호','물리','front_first',84,[{phase:'use',type:'named_shield',name:'조조',value:20,duration:5}],7),t:['친위대장','조조 생존 동안 받는 피해 -20%.',{namedProtector:'조조',takenPct:-20}]},
 'shu/25/조조':{s:branchSkill('위무의 호령','책략','ally_all',0,[{phase:'support',type:'damage_dealt',who:'target',value:20,duration:6},{phase:'support',type:'attack_speed',who:'target',value:15,duration:6}],8),t:['간웅의 계략','아군 사망 시 책략 피해 +10%, 최대 3중첩.',{allyDeathStrategyPct:10,maxStacks:3}]},
 'wu/21/조랑':{s:branchSkill('산월 기습','물리','rear_first',67,[],7),t:['토착 세력의 저항','아군 사망 시 회피 +8, 최대 3중첩.',{allyDeathDodge:8,maxStacks:3}]},
 'wu/22/등룡':{s:branchSkill('강하 수군 돌격','물리','front_all',58,[{phase:'hit',type:'taken_up',who:'target',value:10,duration:3}],7),t:['수군 선봉','전열 아군이 3명 이상 살아 있으면 공격 피해 +15%.',{minFrontDamage:3,damagePct:15}]},
 'wu/23/문빙':{s:branchSkill('형주 방어진','책략','ally_front_all',0,[{phase:'support',type:'defense',who:'target',scope:'all',value:20,duration:5}],8),t:['견고한 수비','자신의 체력이 50% 이상이면 통솔 +20.',{hpAbove:.5,hpAboveCmd:20}]},
 'wu/24/감녕(강하)':{s:branchSkill('금범 수적의 습격','물리','rear_lowest_hp',88,[],7),t:['금범의 위세','적 처치 시 공격속도 +20% (5초).',{killSpeed:20}]},
 'wu/25/감녕(강하)':{s:branchSkill('금범 난격','물리','rear_first',85,[],7),t:['강하의 맹장','황조 생존 중 공격 피해 +20%. 후열 공격 시 추가 +20%.',{namedDamageAlly:'황조',damagePct:20,rearBonusPct:20}]},
 'wu/25/황조':{s:branchSkill('강하 수군 총공세','물리','all_both',58,[{phase:'hit',type:'attack_speed',who:'target',value:-15,duration:5}],8),t:['강하의 지배자','아군 생존자 3명 이하에서 전체 공격 피해 +20% (6초, 1회).',{onceLowAllies:3,onceAlliesDamage:20}]}
};
function branchPlayerKey(){const f=String(document.getElementById('faction-title')?.textContent||'').trim();return f==='위나라'?'wei':f==='촉나라'?'shu':'wu';}
function branchRoundData(round,faction=branchPlayerKey()){return BRANCH_21_25[faction]?.[Number(round)]||null;}
function branchIsUnit(unit){return !!unit?.branchTrait&&!!unit?.scenarioSkill&&String(unit.enemyId||'').startsWith('enemy_branch:');}
function branchDefaultPlan(name,row){
 const found=BRANCH_MINOR_SKILLS[name]||[name+'의 일격',row==='front'?'물리':'책략','front_first',row==='front'?36:35];
 const [skillName,type,range,power]=found;
 const effects=range==='ally_all'?[{phase:'support',type:'damage_dealt',who:'target',value:8,duration:5}]
  :range==='ally_lowest_hp_ratio'?[{phase:'support',type:'heal_pct_max',who:'target',value:10}]:[];
 const trait=range.startsWith('ally_')?{allySupport:true}:type==='책략'?{hpAbove:.5,hpAboveIntel:5}:{hpAbove:.5,hpAboveForce:5};
 const traitName=range.startsWith('ally_')?'전장의 보좌':type==='책략'?'책사의 침착':'선봉의 기세';
 const traitDescription=range.startsWith('ally_')?'아군을 지원한다.':type==='책략'?'체력 50% 이상이면 지력 +5.':'체력 50% 이상이면 무력 +5.';
 return {s:branchSkill(skillName,type,range,power,effects,range.startsWith('ally_')?9:8),t:[traitName,traitDescription,trait]};
}
function createBranchEnemies(round,faction=branchPlayerKey()){
 const config=branchRoundData(round,faction);if(!config)return null;
 const members=[...config.front.map(x=>[...x,'front']),...config.rear.map(x=>[...x,'rear'])];
 const team=members.map(([name,tier,row],idx)=>{
   const baseName=name.replace(/\([^)]*\)$/,'');
   const general=allGenerals.find(g=>g.name===baseName);
   const plan=BRANCH_MAJOR[branchKey(faction,round,name)]||branchDefaultPlan(name,row);
   const baseStats={B:[70,65,58,52],A:[82,78,74,68],S:[92,88,83,78],SS:[98,93,97,90],SSS:[100,98,100,95]}[tier];
   const cmd=general?.cmd??baseStats[0],force=general?.force??baseStats[1],intel=general?.intel??baseStats[2],pol=general?.pol??baseStats[3];
   const k={...plan.s,id:`branch_skill:${faction}:${round}:${name}`,isUnique:true,target:plan.s.range.startsWith('ally_')?plan.s.range:'enemy_single',desc:plan.s.name+' — '+plan.t[1],runtimeEffects:plan.s.effects||[]};
   const trait={id:`branch_trait:${faction}:${round}:${name}`,name:plan.t[0],description:plan.t[1],trigger:{type:'passive'},conditions:[],effects:[]};
   const hp=BRANCH_21_25_HP[tier];
   return {name,enemyId:`enemy_branch:${faction}:${round}:${idx}`,tier,force,intel,cmd,pol,hp,maxHp:hp,
     hit:0,dodge:0,cooldown:k.cooldownSec,trait:trait.description,scenarioTrait:trait,scenarioSkill:k,
     branchTrait:{...plan.t[2]},branchBattleKey:`${faction}/${round}`,battleRow:row,battleRowLocked:true,
     skills:[{name:k.name,type:k.type,power:k.power,acc:k.acc,target:k.target,attackCount:1}],
     bounty:{B:1,A:2,S:3,SS:4}[tier]||0};
 });
 restorationApplyBranchTeam(team,round,faction);
 return {team,title:config.title,listStr:`[${config.title}]  전열: ${config.front.map(([n,t])=>`[${t}] ${n}`).join(', ')}  /  후열: ${config.rear.map(([n,t])=>`[${t}] ${n}`).join(', ')}`};
}
function branchHydrateSavedEnemies(team,round,faction=branchPlayerKey()){
 const generated=createBranchEnemies(round,faction);if(!generated||!Array.isArray(team))return;
 team.forEach((unit,i)=>{
   const standard=generated.team[i];if(!standard)return;
   const retainedHp=Number.isFinite(unit.battleRemainingHp)?unit.battleRemainingHp:null;
    const retainedCommons=Array.isArray(unit.restorationCommonNames)?unit.restorationCommonNames.slice():null;
   // 해당 라운드의 확정 기술과 대형을 복원. 재도전의 잔존 HP는 유지한다.
   Object.assign(unit,standard);
   if(retainedCommons){unit.restorationCommonNames=retainedCommons;unit.skills=[unit.scenarioSkill,...restorationPickCommonSkills(unit.tier,retainedCommons)];}
    if(retainedHp!==null)unit.battleRemainingHp=Math.max(0,Math.min(standard.maxHp,retainedHp));
 });
}
function branchCount(team){return (team||[]).filter(u=>u?.hp>0&&!u.isDead).length;}
function branchFriendAlive(unit,allies,name){return (allies||[]).some(u=>u.hp>0&&!u.isDead&&u.name===name&&u!==unit);}
function branchSpeedModifier(unit,allies,time){
 const t=unit?.branchTrait||{};let bonus=0;
 if(t.speedAlly&&branchFriendAlive(unit,allies,t.speedAlly))bonus+=t.speedAllyPct||0;
 if(t.hpBelowSpeed&&unit.hp/unit.maxHp<=t.hpBelow)bonus+=t.hpBelowSpeed;
 for(const b of unit.buffs||[])if(b.stat==='branch_attack_speed'&&b.expireTime>time)bonus+=b.amount;
 return Math.max(.5,Math.min(2,100/(100+bonus)));
}
function branchStatDelta(unit,stat,team){
 const t=unit?.branchTrait;if(!t)return 0;const ratio=unit.hp/Math.max(1,unit.maxHp);let value=0;
 if(t.hpAbove!=null&&ratio>=t.hpAbove){if(stat==='cmd')value+=t.hpAboveCmd||0;if(stat==='force')value+=t.hpAboveForce||0;if(stat==='intel')value+=t.hpAboveIntel||0;}
 if(t.hpBelow!=null&&ratio<=t.hpBelow&&stat==='dodge')value+=t.hpBelowDodge||0;
 if(t.frontAliveCmd&&stat==='cmd'&&team.some(x=>x.hp>0&&x.battleRow==='front'))value+=t.frontAliveCmd;
 if(stat==='dodge')value+=(unit.branchDeaths||0)*(t.allyDeathDodge||0);
 return value;
}
function branchAttackModifier(unit,target,allies,kind){
 const t=unit?.branchTrait;if(!t)return 0;let pct=0;
 if(kind==='physical'&&t.firstPhysical&&!unit.scenarioFirstPhysicalUsed)pct+=t.firstPhysical;
 if(t.finisherBelow!=null&&target.hp/target.maxHp<=t.finisherBelow)pct+=t.finisherBonus||0;
 if(t.lostHpSkillBonus)pct+=(1-unit.hp/unit.maxHp)*t.lostHpSkillBonus;
 if(t.rearBonusPct&&target.battleRow==='rear')pct+=t.rearBonusPct;
 if(t.hpBelowDamagePct&&unit.hp/unit.maxHp<=t.hpBelow)pct+=t.hpBelowDamagePct;
 if(t.againstBurnBonus&&target.buffs?.some(b=>b.stat==='branch_fire'))pct+=t.againstBurnBonus;
 if(t.minFrontDamage!=null&&allies.filter(x=>x.hp>0&&x.battleRow==='front').length>=t.minFrontDamage)pct+=t.damagePct||0;
 if(t.namedDamageAlly&&branchFriendAlive(unit,allies,t.namedDamageAlly))pct+=t.damagePct||0;
 if(t.allyDeathDamagePct)pct+=t.allyDeathDamagePct*(unit.branchDeaths||0);
 if(kind==='strategy'&&t.allyDeathStrategyPct)pct+=t.allyDeathStrategyPct*(unit.branchDeaths||0);
 return pct;
}
function branchDamageTakenModifier(unit,defTeam){
 const t=unit?.branchTrait||{};let percent=0;
 if(t.minAlliesTaken!=null&&branchCount(defTeam)>=t.minAlliesTaken)percent+=t.takenPct||0;
 if(t.namedProtector&&branchFriendAlive(unit,defTeam,t.namedProtector))percent+=t.takenPct||0;
 if(unit.battleRow==='front')for(const u of defTeam){const tr=u.branchTrait||{};if(u.hp>0&&tr.frontBlockChance&&Math.random()*100<tr.frontBlockChance)percent-=tr.frontBlockPct||0;}
 return Math.max(.2,1+percent/100);
}
function branchSkillTarget(caster,skill,allies,enemies){
 if(skill.range==='rear_lowest_hp'){
   const rear=enemies.filter(x=>x.hp>0&&x.battleRow==='rear');const pool=rear.length?rear:enemies.filter(x=>x.hp>0);
   return pool.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp).slice(0,1);
 }
 if(skill.target==='ally_front_all')return allies.filter(x=>x.hp>0&&x.battleRow==='front');
 if(skill.target==='ally_all')return allies.filter(x=>x.hp>0);
 return null;
}
function branchGrantShield(target,pct,duration,time,source){
 if(!target||target.hp<=0)return;
 const before=target.buffs?.filter(b=>b.stat==='branch_shield')||[];
 const newAmount=Math.max(1,Math.floor(target.maxHp*pct/100));
 target.buffs=target.buffs||[];
 target.buffs=target.buffs.filter(b=>b.stat!=='branch_shield'||b.source!==source);
 target.buffs.push({stat:'branch_shield',amount:newAmount,expireTime:time+duration,source});
}
// 위 전투 엔진과 일반 장수 엔진 모두 동일하게 보호막을 소모한다.
function branchAbsorbShield(unit,damage,time){
 if(!unit||damage<=0)return damage;
  let remaining=v16Mitigate(unit,damage,time);
  const hadChencang=(unit.buffs||[]).some(b=>b.stat==='branch_shield'&&b.source==='v15:haozhao'&&b.amount>0);
  for(const buff of (unit.buffs||[])){
   if(buff.stat!=='branch_shield'||buff.expireTime<=time||remaining<=0)continue;
   const blocked=Math.min(remaining,Math.max(0,buff.amount));buff.amount-=blocked;remaining-=blocked;
 }
  unit.buffs=(unit.buffs||[]).filter(b=>b.stat!=='branch_shield'||b.amount>0);
  if(hadChencang&&!unit.buffs.some(b=>b.stat==='branch_shield'&&b.source==='v15:haozhao'))restorationTacticShieldBroken(unit,null,time);
  return remaining;
}
function branchApplyEffect(effect,caster,target,time,origin,logs){
 if(!effect)return false;
 const who=effect.who==='self'?caster:target;
 if(effect.type==='attack_speed'&&who?.hp>0){
   who.buffs=who.buffs||[];const source='branch_speed:'+origin.id;
   const prev=who.buffs.find(b=>b.stat==='branch_attack_speed'&&b.source===source);
   if(prev){prev.amount=effect.value;prev.expireTime=time+effect.duration;}
   else who.buffs.push({stat:'branch_attack_speed',amount:effect.value,source,expireTime:time+effect.duration});
   logs.push(`[${who.name} 공격속도 ${effect.value>0?'+':''}${effect.value}%]`);return true;
 }
 if(effect.type==='damage_dealt'&&who?.hp>0){
   scenarioPutBuff(who,effect.value<0?'dmg_dealt_down':'dmg_up',Math.abs(effect.value),effect.duration,time,origin.id);
   logs.push(`[${who.name} 공격 피해 ${effect.value>0?'+':''}${effect.value}%]`);return true;
 }
 if(effect.type==='taken_up'&&who?.hp>0){scenarioPutBuff(who,'dmg_taken_up',effect.value,effect.duration,time,origin.id);logs.push(`[${who.name} 받는 피해 +${effect.value}%]`);return true;}
 if(effect.type==='front_command'&&who?.hp>0){if(who.battleRow==='front')scenarioPutBuff(who,'cmd',effect.value,effect.duration,time,origin.id);return true;}
 if(effect.type==='shield_pct'&&who?.hp>0){
   branchGrantShield(who,effect.value,effect.duration,time,origin.id);
   logs.push(`[${who.name} 보호막 +${effect.value}% 최대 HP]`);return true;
 }
 if(effect.type==='shield_front_pct'&&who?.hp>0){
   if(who.battleRow==='front'){
     branchGrantShield(who,effect.value,effect.duration,time,origin.id);
     logs.push(`[${who.name} 전열 보호막 +${effect.value}% 최대 HP]`);
   }return true;
 }
 if(effect.type==='self_cost_pct'&&who?.hp>0){
   const cost=Math.max(1,Math.floor(who.maxHp*effect.value/100));
   who.hp=Math.max(1,who.hp-cost);
   scenarioHealthBar(who);
   logs.push(`[${who.name} 고육계 HP -${cost}]`);return true;
 }
 if(effect.type==='named_shield'){
   const ally=(currentEnemyTeam||[]).find(u=>u.name===effect.name&&u.hp>0);
   if(ally){branchGrantShield(ally,effect.value,effect.duration,time,origin.id);logs.push(`[${ally.name} 보호막 +${effect.value}% 최대 HP]`);}return true;
 }
 if(effect.type==='burn_2sec'&&who?.hp>0){
   who.buffs=who.buffs||[];const source='branch_fire:'+origin.id;
   const prev=who.buffs.find(b=>b.stat==='branch_fire'&&b.source===source);
   const buff={stat:'branch_fire',amount:effect.damage,source,sourceId:caster.id,expireTime:time+effect.duration,nextTick:Math.ceil(time+2)};
   if(prev)Object.assign(prev,buff);else who.buffs.push(buff);
   logs.push(`[${who.name} 화상 ${effect.duration}초]`);return true;
 }
 return false;
}
function branchOnBattleStart(enemies,players,time=0){
 for(const unit of enemies){if(!branchIsUnit(unit)||unit.hp<=0)continue;
  const t=unit.branchTrait;unit.branchDeaths=0;unit.branchTriggered={};
  if(t.startStrongestMagicVuln){const alive=players.filter(u=>u.hp>0);const victim=alive.sort((a,b)=>b.force-a.force)[0];if(victim)scenarioPutBuff(victim,'scenario_magic_vuln',t.startStrongestMagicVuln,5,time,unit.scenarioTrait.id);}
  if(t.startFrontDamageDown)for(const enemy of players.filter(u=>u.hp>0&&u.battleRow==='front'))scenarioPutBuff(enemy,'dmg_dealt_down',t.startFrontDamageDown,6,time,unit.scenarioTrait.id);
  if(t.startFrontSpeed)for(const ally of enemies.filter(u=>u.hp>0&&u.battleRow==='front')){
    branchApplyEffect({type:'attack_speed',who:'target',value:t.startFrontSpeed,duration:5},unit,ally,time,unit.scenarioSkill,[]);
  }
 }
}
function branchOnDeath(dead,team,gameTime){
 if(!dead)return;
 const alliedDead=String(dead.id||'').startsWith('e_');
 for(const u of team){if(!branchIsUnit(u)||u.hp<=0||u===dead)continue;
   const t=u.branchTrait;
   if(alliedDead){
     if(t.allyDeathDamagePct||t.allyDeathStrategyPct||t.allyDeathDodge)u.branchDeaths=Math.min(t.maxStacks||2,(u.branchDeaths||0)+1);
     if(t.resetOnTwoAlliesDead){u.branchAllyDeaths=(u.branchAllyDeaths||0)+1;if(u.branchAllyDeaths>=2&&!u.branchTriggered.reset){u.branchTriggered.reset=true;u.currentCooldown=0;addLog(`[특성] ${u.name} 와룡의 계책! 화계 재사용 준비`, 'log-buff');}}
     if(t.onceLowAllies&&!u.branchTriggered.lowAllies&&branchCount(team)<=t.onceLowAllies){u.branchTriggered.lowAllies=true;
       for(const ally of team.filter(x=>x.hp>0))scenarioPutBuff(ally,'dmg_up',t.onceAlliesDamage||20,6,gameTime,u.scenarioTrait.id);
       addLog(`[특성] ${u.name} 강하의 지배자! 아군 공격 피해 +20%`, 'log-buff');
     }
   }
 }
}
function branchOnKill(killer,gameTime){
 if(!branchIsUnit(killer)||!killer.branchTrait.killSpeed||killer.hp<=0)return;
 branchApplyEffect({type:'attack_speed',value:killer.branchTrait.killSpeed,duration:5,who:'self'},killer,killer,gameTime,killer.scenarioSkill,[]);
}
function branchCheckThresholds(team,time){
 for(const u of team){if(!branchIsUnit(u)||u.hp<=0)continue;
 const t=u.branchTrait;
 if(t.shieldBelow!=null&&u.hp/u.maxHp<=t.shieldBelow&&!u.branchTriggered?.shield){
   u.branchTriggered=u.branchTriggered||{};u.branchTriggered.shield=true;
   branchGrantShield(u,t.shieldPct,999,time,u.scenarioTrait.id);
   addLog(`[특성] ${u.name} 수성의 명장 보호막 발동`, 'log-buff');
 }
 }
}
