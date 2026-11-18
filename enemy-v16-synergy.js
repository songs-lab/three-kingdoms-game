/* v16 · 적군 편성 단위 전술 엔진. 105명 플레이어 스탯·고유기술은 변경하지 않는다.
 * 역사적으로 확인 가능한 사건을 각색한 보스전과 전장 역할 기반의 창작 전술을 구분한다.
 * 전술의 효과는 살아 있는 지정 장수, 전후열, 발동 시간, 사망 순서에 종속된다. */
const V16_BATTLE_MODES = {
  cavalry:{name:'기병 충격·추격',description:'전열의 돌격과 후열 지휘가 맞물린다. 돌격 이후 전열에 빈틈이 생긴다.',strategy:'초반 돌격을 버티거나 지휘관을 먼저 노린다. 전열 돌파도 가능하다.'},
  fortress:{name:'전열 수비·후방 보호',description:'전열 호위가 살아 있는 동안 후열 피해를 줄인다. 호위가 쓰러지면 방어선이 흔들린다.',strategy:'전열 호위를 제거하거나 후열 공격으로 보급·지휘를 끊는다.'},
  ambush:{name:'매복과 후열 저격',description:'첫 기습과 후열 협공이 강하지만 선제공격이 끝나면 틈이 생긴다.',strategy:'첫 공격을 방어하거나 후열 기습대를 먼저 제압한다.'},
  fire:{name:'화공 준비·불길 연계',description:'전열의 화상이 후열 책사의 공격과 연계된다. 화공 담당이 쓰러지면 연계가 약해진다.',strategy:'화공 담당을 먼저 막거나 화상을 견디며 지휘관을 집중 공격한다.'},
  supply:{name:'군량·구원 전술',description:'후열 지원이 동료를 치료하지만 지원 담당자는 체력을 소모한다.',strategy:'지원 장수를 끊거나 지속 피해를 이용해 장기전으로 유도한다.'},
  intrigue:{name:'이간·지휘 혼란',description:'후열 책사의 계책으로 상대 핵심 전력을 약화한다. 책사가 쓰러지면 방어선이 불안정해진다.',strategy:'후열 지휘관을 노리거나 장수 역할을 분산해 교란을 버틴다.'},
  navy:{name:'수군 진형·전후열 협공',description:'전열 함대의 엄호와 후열 지원이 맞물린다. 전열 붕괴 시 후열이 취약해진다.',strategy:'전열 방패를 제거하거나 후열 저격으로 지휘를 끊는다.'},
  siege:{name:'공성·수성 방진',description:'전열 보호막과 후열 보급이 버티는 전술. 방진을 깨면 반격 후 약화한다.',strategy:'보호막을 집중 파괴하거나 보급 담당을 먼저 처리한다.'},
  counter:{name:'결사 반격진',description:'호위 장수에게 공격이 누적되면 한 차례 반격한다. 동료 사망 후에도 빈틈이 있다.',strategy:'광역 피해로 압박하거나 방어 장수로 반격을 받아낸다.'},
  command:{name:'대장 지휘·합동 전술',description:'지휘관·호위·공격대가 연동한다. 후열 지휘가 끊기면 강력한 연계가 붕괴한다.',strategy:'지휘관 저격, 전열 돌파, 장기전 중 하나를 선택한다.'}
};
// 21~45R: 같은 전투의 유래와 편성을 근거로 전술 유형을 일일이 지정.
const V16_BATTLE_STYLE = {
 wei:['ambush','fortress','intrigue','ambush','fire','command','ambush','navy','ambush','fire','cavalry','intrigue','cavalry','cavalry','cavalry','ambush','cavalry','cavalry','counter','command','ambush','supply','siege','fire','command'],
 shu:['navy','cavalry','fortress','cavalry','command','navy','navy','fortress','siege','command','fortress','fortress','ambush','fortress','counter','cavalry','fortress','fortress','cavalry','command','fortress','counter','siege','command','command'],
 wu: ['ambush','navy','fortress','navy','navy','fortress','fortress','siege','cavalry','navy','fortress','fortress','counter','cavalry','ambush','supply','siege','fortress','siege','command','ambush','fire','intrigue','siege','command']
};
// 지정 역사 관계: 실존 사건은 전투 모티브, 기술 수치는 게임 창작.
const V16_HISTORICAL_LINKS = {
 'wei/30':{leader:'주유',guard:'정보',vanguard:'황개',support:'방통',name:'적벽 화공·연환',note:'황개·주유의 화공은 정사 모티브. 방통의 연환계 연계는 연의 기반 각색'},
 'shu/30':{leader:'조조',guard:'장료',vanguard:'하후돈',support:'가후',name:'조위 대함대 총지휘',note:'적벽 수군 전투를 전술적으로 각색'},
 'wu/30':{leader:'조조',guard:'장료',vanguard:'문빙',support:'채모',name:'적벽 수군 방어선',note:'적벽대전 정사·연의의 전투 구도를 게임 규칙으로 각색'},
 'wei/35':{leader:'한수',guard:'방덕',vanguard:'마초',support:'마대',name:'관중 연합의 균열',note:'마초·한수의 갈등은 동관 전투 모티브'},
 'shu/35':{leader:'장임',guard:'엄안',vanguard:'유괴',support:'황권',name:'낙성의 결사항전',note:'낙성 전투의 방어를 바탕으로 한 창작 전술'},
 'wu/35':{leader:'장료',guard:'악진',vanguard:'이전',support:'장제',name:'소요진 팔백 결사대',note:'장료의 합비 기습은 정사 모티브'},
 'wei/40':{leader:'유비',guard:'조운',vanguard:'황충',support:'법정',name:'한중왕의 친정 지휘',note:'한중 전투의 역사적 인물 관계를 각색'},
 'shu/40':{leader:'조조',guard:'장합',vanguard:'하후연',support:'곽회',name:'한중 조위 본진',note:'한중 전투의 역사적 인물 관계를 각색'},
 'wu/40':{leader:'관우',guard:'관평',vanguard:'요화',support:'마량',name:'형주 공방과 군율',note:'관우의 형주 공방전 기반 각색'},
 'wei/42':{leader:'마속',guard:'왕평',vanguard:'위연',support:'이엄',name:'가정의 고지·보급 단절',note:'마속의 가정 패전과 왕평의 간언은 정사 모티브'},
 'shu/42':{leader:'장합',guard:'대릉',vanguard:'신탐',support:'곽회',name:'가정 돌파와 추격',note:'장합의 가정 전투 모티브'},
 'shu/43':{leader:'학소',guard:'왕쌍',vanguard:'대릉',support:'곽회',name:'진창 철성 수비',note:'학소의 진창 수비는 정사 모티브'},
 'wei/43':{leader:'강유',guard:'위연',vanguard:'관흥',support:'비의',name:'진창 공성·보급',note:'북벌과 진창 공성 구도를 게임 전술로 각색'},
 'wu/43':{leader:'조휴',guard:'문빙',vanguard:'가규',support:'만총',name:'석정 유인과 매복',note:'석정 전투를 게임 전술로 각색'},
 'wei/44':{leader:'강유',guard:'위연',vanguard:'마대',support:'양의',name:'상방곡의 화공',note:'상방곡 화공은 삼국지연의 기반 창작'},
 'shu/44':{leader:'장합',guard:'사마사',vanguard:'사마소',support:'곽회',name:'위수 정예 호위',note:'관중 방어 전술의 창작 각색'},
 'wu/44':{leader:'사마의',guard:'만총',vanguard:'문빙',support:'유엽',name:'합비 외곽 방어진',note:'합비 지역 수비를 바탕으로 한 창작 전술'},
 'wei/45':{leader:'제갈량',guard:'왕평',vanguard:'강유',support:'비의',name:'출사표·북벌 총력전',note:'오장원의 장기 대치와 군량 부담은 정사 모티브'},
 'shu/45':{leader:'사마의',guard:'장합',vanguard:'사마소',support:'곽회',name:'오장원 지구전',note:'사마의의 방어·지구전은 정사 모티브. 배치·연계는 게임 각색'},
 'wu/45':{leader:'조예',guard:'만총',vanguard:'문빙',support:'사마의',name:'합비신성 황제 친정군',note:'실제 전쟁의 인물을 바탕으로 한 가상 결전 편성'}
};
const V16_ROLE_LABELS={leader:'지휘·전술축',guard:'전열 엄호',vanguard:'돌격·공격축',support:'보급·책략',wild:'후위 변수',member:'합동 전력'};
function v16Subject(name){const word=String(name).replace(/\([^)]*\)$/,'');const c=word.charCodeAt(word.length-1);return name+((c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28!==0)?'이':'가');}
function v16Living(team){return (team||[]).filter(u=>u&&u.hp>0&&!u.isDead);}
function v16RoleUnit(team,name){return v16Living(team).find(u=>u.name===name);}
function v16FindRole(team,exclude,predicate,sort){
 const pool=team.filter(u=>!exclude.has(u.name)&&predicate(u));
 if(sort)pool.sort(sort);
 const chosen=pool[0];if(chosen)exclude.add(chosen.name);return chosen?.name||null;
}
function v16CreatePlan(team,round,side){
 const historical=V16_HISTORICAL_LINKS[`${side}/${round}`]||{};
 const stage=round<=10?1:round<=20?2:round<=30?3:round<=40?4:5;
 const style=round<=20?(round<=10?'counter':(round%4===0?'supply':round%3===0?'ambush':'fortress')):V16_BATTLE_STYLE[side]?.[round-21]||'command';
 const excluded=new Set();const has=n=>team.some(u=>u.name===n);
 const roles={};
 for(const [role,n] of Object.entries(historical))if(['leader','guard','vanguard','support'].includes(role)&&has(n)&&!excluded.has(n)){roles[role]=n;excluded.add(n);}
 const rear=u=>u.battleRow==='rear',front=u=>u.battleRow==='front';
 roles.leader ||=v16FindRole(team,excluded,u=>rear(u)&&u.scenarioSkill?.type==='책략',(a,b)=>(b.intel||0)-(a.intel||0))||v16FindRole(team,excluded,u=>rear(u),(a,b)=>(b.intel||0)-(a.intel||0))||v16FindRole(team,excluded,()=>true,(a,b)=>(b.intel||0)-(a.intel||0));
 roles.guard ||=v16FindRole(team,excluded,front,(a,b)=>(b.cmd||0)-(a.cmd||0))||v16FindRole(team,excluded,()=>true,(a,b)=>(b.cmd||0)-(a.cmd||0));
 roles.vanguard ||=v16FindRole(team,excluded,front,(a,b)=>(b.force||0)-(a.force||0))||v16FindRole(team,excluded,()=>true,(a,b)=>(b.force||0)-(a.force||0));
 roles.support ||=v16FindRole(team,excluded,rear,(a,b)=>(a.force||0)-(b.force||0))||v16FindRole(team,excluded,()=>true,(a,b)=>(a.force||0)-(b.force||0));
 roles.wild=v16FindRole(team,excluded,()=>true,(a,b)=>({D:0,C:1,B:2,A:3,S:4,SS:5,SSS:6}[a.tier]||0)-({D:0,C:1,B:2,A:3,S:4,SS:5,SSS:6}[b.tier]||0));
 const label=historical.name||V16_BATTLE_MODES[style].name;
 return {round,side,stage,style,label,note:historical.note||'전장 역할을 바탕으로 만든 창작 전술',roles,
    state:{lastTick:-1,firstIntercept:false,guardHitCount:0,guardCounterAt:-20,weaknessTriggered:false,deathFired:{},firstCharge:false,supportExhausted:false,leaderFallen:false},
    source:historical.name?'역사·전장 각색':'전장 역할 창작'};
}
function v16GetPlan(team){return (team||[]).find(u=>u?.v16Plan)?.v16Plan||null;}
function v16OwnerTeam(unit){return (unit?.id||'').startsWith('e_')?currentEnemyTeam:null;}
function v16PlanAlive(plan,team,role){return !!(plan?.roles?.[role]&&v16RoleUnit(team,plan.roles[role]));}
function v16RoleOf(plan,u){return Object.entries(plan.roles).find(([,name])=>name===u.name)?.[0]||'member';}
function v16RoleDescription(plan,role){
 const stage=plan.stage;
 return ({leader:'지휘가 유지되는 동안 동료 전술 강화. 제거되면 합동 효과 해제',
 guard:stage>=2?'전열 엄호로 후열 피해 감소. 여러 차례 공격받으면 반격':'전열 방어·반격',
 vanguard:'첫 돌격에 강하지만 공격 직후 노출',
 support:'일정 간격으로 지원. 지원 도중 체력 소모',
 wild:stage>=4?'쓰러지면 1회 전군 기술 준비를 앞당김. 대신 방어선 약화':'후위 보조 및 연계',
 member:'전열·후열의 연결 전력'})[role];
}
function v16EnemyPreview(team,round){
 const plan=v16GetPlan(team);if(!plan)return '';
 const mode=V16_BATTLE_MODES[plan.style];
 const people=team.map(u=>`• ${u.name} [${u.tier}] ${V16_ROLE_LABELS[v16RoleOf(plan,u)]} — ${v16RoleDescription(plan,v16RoleOf(plan,u))}`);
 return `전장 전술: ${plan.label}\n${mode.description}\n${plan.note}\n\n${people.join('\n')}\n\n공략: ${mode.strategy}\n적 전술은 처치 순서·전열 보호·시간 경과에 따라 달라집니다.`;
}

// 일반 장수에게 임의의 이름 해시로 특성을 배정하지 않는다. 편성에서 맡은 역할과 전장 전술로 고유기술을 연결한다.
function v16RoleIdentity(unit,plan,rec){
 const role=unit.v16Role;
 const modeByRole={
   leader:{fire:'blaze',intrigue:'omen',command:'morale',siege:'phalanx',fortress:'phalanx',navy:'signal',supply:'supply',ambush:'gamble',cavalry:'morale',counter:'signal'},
   guard:{fire:'protect',intrigue:'attrition',command:'protect',siege:'protect',fortress:'protect',navy:'protect',supply:'steadfast',ambush:'scatter',cavalry:'protect',counter:'attrition'},
   vanguard:{fire:'blaze',intrigue:'scatter',command:'charge',siege:'charge',fortress:'duel',navy:'raid',supply:'pursuit',ambush:'raid',cavalry:'charge',counter:'duel'},
   support:{fire:'bind',intrigue:'omen',command:'signal',siege:'supply',fortress:'supply',navy:'supply',supply:'supply',ambush:'sniping',cavalry:'morale',counter:'supply'},
   wild:{fire:'rally',intrigue:'gamble',command:'rally',siege:'steadfast',fortress:'rally',navy:'sniping',supply:'rally',ambush:'pursuit',cavalry:'pursuit',counter:'rally'},
   member:{fire:'scatter',intrigue:'scatter',command:'charge',siege:'steadfast',fortress:'protect',navy:'sniping',supply:'attrition',ambush:'pursuit',cavalry:'charge',counter:'protect'}
 };
 const mode=modeByRole[role]?.[plan.style]||'protect';
 const arch=V15_TACTIC_ARCHETYPES[mode];
 const partner=(role==='leader'?plan.roles.guard:role==='guard'?plan.roles.leader:role==='vanguard'?plan.roles.leader:role==='support'?plan.roles.guard:plan.roles.leader);
 const hasPartner=partner&&partner!==unit.name;
 const weakness=role==='vanguard'?'guard':role==='support'?'stamina':role==='leader'?'exposure':'guard';
 const onHit=role==='vanguard'?'cmd':role==='guard'?'force':role==='leader'?'hit':'dodge';
 const statKo={cmd:'통솔',force:'무력',hit:'명중',dodge:'회피'}[onHit];
 const desc=`[${V16_ROLE_LABELS[role]}] ${arch.desc} ${hasPartner?partner+'와 협동할 때 연계가 강화된다. ':''}명중 시 상대 ${statKo} 약화. ${v16RoleDescription(plan,role)}`;
 return {mode,label:`${unit.name} · ${arch.label}`,desc,counter:`${arch.counter}. ${V16_BATTLE_MODES[plan.style].strategy}`,
     origin:'전장 역할 기반 창작',special:false,profile:{onHit,debuff:Math.min(11,3+plan.stage*2),duration:3,bonus:Math.min(12,4+plan.stage*2),penalty:9,
       weakness,partner:hasPartner?partner:null}};
}

function v16BindPlan(team,round,side){
 if(!Array.isArray(team)||!team.length||!team.some(u=>u.enemyId))return;
 const plan=v16CreatePlan(team,round,side);
 team.forEach(u=>{
   // 계획과 전투 진행 중 상태는 저장할 필요가 없다. 다시 진입할 때 고정 편성으로 복원한다.
   Object.defineProperty(u,'v16Plan',{value:plan,configurable:true,writable:true,enumerable:false});
   u.v16Role=v16RoleOf(plan,u);u.v16RoleDesc=v16RoleDescription(plan,u.v16Role);
   const rec=RESTORE_V13_ROWS[u.restorationRowId];
   if(!rec||round<=10||u.restorationTactic?.special)return;
   const identity=v16RoleIdentity(u,plan,rec);
   u.restorationTactic=identity;
   u.scenarioTrait={id:`v16:${side}:${round}:${rec.slot}`,name:identity.label,description:identity.desc,trigger:{type:'passive'},conditions:[],effects:[]};
   u.trait=identity.desc;u.scenarioTraitDescription=identity.desc;
   const skill=restorationBuildSkill(rec,identity,round>=31);
   u.scenarioSkill=skill;
   u.skills=[skill,...(u.skills||[]).filter(s=>s.isUnique===false)];
 });
 return plan;
}
function v16Buff(unit,stat,value,duration,time,source){if(unit?.hp>0)restorationBuff(unit,stat,value,duration,time,source);}
function v16Start(team,players,time=0){
 const plan=v16GetPlan(team);if(!plan)return;
 plan.state={lastTick:-1,firstIntercept:false,guardHitCount:0,guardCounterAt:-20,weaknessTriggered:false,deathFired:{},firstCharge:false,supportExhausted:false,leaderFallen:false};
 const roles=plan.roles,guard=v16RoleUnit(team,roles.guard),leader=v16RoleUnit(team,roles.leader),vanguard=v16RoleUnit(team,roles.vanguard);
 if(plan.stage>=2&&guard&&(plan.style==='fortress'||plan.style==='siege'||plan.style==='navy'))branchGrantShield(guard,plan.stage>=5?12:8,7,time,'v16:front_shield');
 if(plan.stage>=3&&leader&&(plan.style==='command'||plan.style==='cavalry'||plan.style==='ambush')){
   if(vanguard){v16Buff(vanguard,'dmg_up',plan.stage>=5?11:8,5,time,'v16:opening');v16Buff(vanguard,'dmg_taken_up',8,5,time,'v16:opening-risk');}
 }
 if(plan.stage>=4&&(plan.style==='intrigue'||plan.style==='fire')&&leader){
   v16Buff(leader,'dmg_dealt_down',8,5,time,'v16:concentrate');
 }
 addLog(`[전장 전술] ${plan.label} — ${V16_BATTLE_MODES[plan.style].description}`,'log-buff');
 if(plan.stage>=2&&guard&&leader)addLog(`[적군 연계] ${guard.name}의 엄호 ↔ ${leader.name}의 지휘. 둘 중 하나를 끊으면 효과가 약화됩니다.`,'log-buff');
 if(plan.stage>=4&&roles.support)addLog(`[적군 보급] ${roles.support}가 후방에서 지원 중. 제거하면 보급이 끊기지만 최후 명령이 발동할 수 있습니다.`,'log-buff');
}
// 일반·공용 기술·플레이어 105명 모두 같은 보호막 계산 경로를 통과한다.
function v16Mitigate(target,damage,time){
 if(!(target?.id||'').startsWith('e_')||!Number.isFinite(damage)||damage<=0)return damage;
 const team=currentEnemyTeam,plan=v16GetPlan(team);if(!plan)return damage;
 const roles=plan.roles,guard=v16RoleUnit(team,roles.guard),leader=v16RoleUnit(team,roles.leader);
 let value=damage;
 if(plan.stage>=2&&guard&&leader&&target.battleRow==='rear'&&target!==guard){
   const pct=plan.style==='fortress'||plan.style==='siege'?18:plan.style==='navy'?15:plan.stage>=5?14:10;
   value*=1-pct/100;
   if(!plan.state.firstIntercept){plan.state.firstIntercept=true;addLog(`[전술 발동] ${v16Subject(guard.name)} 후열을 엄호! 후열 피해 -${pct}%. 전열 돌파나 후열 저격으로 대응할 수 있습니다.`,'log-buff');}
 }
 if(plan.stage>=3&&guard&&target===guard){
   plan.state.guardHitCount++;
   if(plan.state.guardHitCount>=4&&time-plan.state.guardCounterAt>=5){
      plan.state.guardHitCount=0;plan.state.guardCounterAt=time;
      const player=v16Living(lastPlayerTeam).sort((a,b)=>b.force-a.force)[0];
      if(player){let d=Math.min(26,Math.max(9,Math.floor(guard.force*.2)));d=playableLeathalGuard(player,d,time);
       player.hp=Math.max(0,player.hp-d);guard.totalDamage=(guard.totalDamage||0)+d;scenarioHealthBar(player);battleFXHit(guard,player,d,'물리');
       addLog(`[전술 반격] ${guard.name}: 4회 피격 후 ${player.name}에게 ${d} 피해!`,'log-attack');
       if(player.hp<=0)processKillEvents(guard,player,currentEnemyTeam,lastPlayerTeam,time);
      }
   }
 }
 return Math.max(0,Math.floor(value));
}
function v16CustomizeSkill(caster,skill,time,allies,enemies){
 if(!skill||!(caster?.id||'').startsWith('e_'))return skill;
 const plan=v16GetPlan(allies);if(!plan||plan.stage<2)return skill;
 const role=caster.v16Role,leader=v16RoleUnit(allies,plan.roles.leader);
 const out={...skill,runtimeEffects:[...(skill.runtimeEffects||[])]};
 // '연환계'·화공 등은 실제 타격 대상이 아닌 이미 적용된 화상 상태를 확인하고 보너스를 적용한다.
 if(plan.style==='fire'&&plan.stage>=3&&role==='vanguard'&&out.power>0&&out.type==='책략'){
    out.runtimeEffects.push({phase:'hit',type:'burn_2sec',who:'target',damage:4,duration:4});
 }
 if(plan.style==='ambush'&&role==='vanguard'&&caster.restorationState?.firstSkill&&out.power>0){out.power=Math.round(out.power*1.12);}
 if(plan.style==='cavalry'&&role==='vanguard'&&caster.restorationState?.firstSkill&&out.power>0){out.power=Math.round(out.power*1.10);}
 if(plan.stage>=3&&role==='vanguard'&&leader&&out.power>0&&plan.style!=='fire')out.power=Math.round(out.power*1.08);
 if(plan.stage>=4&&role==='leader'&&out.power>0&&plan.style==='intrigue'){out.power=Math.round(out.power*1.07);}
 return out;
}
function v16Hit(caster,target,allies,enemies,skill,time){
 if(!(caster?.id||'').startsWith('e_')||target.hp<=0)return;
 const plan=v16GetPlan(allies);if(!plan||plan.stage<2)return;
 const role=caster.v16Role,leader=v16RoleUnit(allies,plan.roles.leader);
 if(role==='vanguard'&&leader&&plan.stage>=3&&plan.style!=='fire'){
   v16Buff(target,'dmg_taken_up',plan.stage>=5?10:7,3,time,`v16:pressure:${caster.name}`);
   if(!caster.v16MarkedLogged){caster.v16MarkedLogged=true;addLog(`[연계 타격] ${caster.name}의 표식으로 ${target.name} 받는 피해 증가 (3초)`,'log-attack');}
 }
 if(plan.style==='fire'&&plan.stage>=3&&role==='vanguard'&&skill.type==='물리'){
   branchApplyEffect({type:'burn_2sec',who:'target',damage:4,duration:4},caster,target,time,skill,[]);
   if(!caster.v16FireLogged){caster.v16FireLogged=true;addLog(`[화공 연계] ${v16Subject(caster.name)} 불길을 만들었습니다. 책사의 화공이 강해집니다.`,'log-skill');}
 }
 if(plan.style==='intrigue'&&role==='leader'&&plan.stage>=3){
   v16Buff(target,'dmg_dealt_down',10,3,time,`v16:intrigue:${caster.name}`);
 }
}
function v16AttackFactor(unit,target,allies,kind,time){
 const plan=v16GetPlan(allies);if(!plan||!(unit?.id||'').startsWith('e_'))return 1;
 if(plan.style==='fire'&&plan.stage>=3&&['leader','support'].includes(unit.v16Role)&&target?.buffs?.some(b=>b.stat==='branch_fire'&&b.expireTime>time)&&v16RoleUnit(allies,plan.roles.vanguard))return 1.15;
 return 1;
}
function v16Tick(team,players,time,sec){
 const plan=v16GetPlan(team);if(!plan||!Number.isInteger(sec)||sec<1||plan.state.lastTick===sec)return;
 plan.state.lastTick=sec;
 const roles=plan.roles,support=v16RoleUnit(team,roles.support),leader=v16RoleUnit(team,roles.leader);
 if(plan.stage>=3&&support&&sec%7===0&&['supply','fortress','siege','navy','command'].includes(plan.style)){
   const patient=v16Living(team).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
   if(patient&&patient.hp<patient.maxHp){const healed=scenarioHeal(patient,Math.max(1,Math.floor(patient.maxHp*.06)));
    const cost=Math.max(1,Math.floor(support.maxHp*.025));support.hp=Math.max(1,support.hp-cost);scenarioHealthBar(support);
    if(healed)addLog(`[후방 보급] ${v16Subject(support.name)} ${patient.name} HP +${healed} 회복, 자신 HP -${cost}`,'log-buff');
   }
 }
 if(plan.stage>=4&&leader&&v16RoleUnit(team,roles.support)&&sec%11===0&&['intrigue','command','fortress'].includes(plan.style)){
   const target=v16Living(players).sort((a,b)=>(b.force||0)-(a.force||0))[0];
   if(target){v16Buff(target,'dmg_dealt_down',8,4,time,`v16:order:${leader.name}`);
    addLog(`[지휘 교란] ${v16Subject(leader.name)} ${target.name}의 공격을 견제 (4초 공격 피해 -8%)`,'log-buff');
   }
 }
 if(plan.style==='cavalry'&&plan.stage>=4&&sec===6){
   const rider=v16RoleUnit(team,roles.vanguard);
   if(rider){v16Buff(rider,'dmg_taken_up',12,4,time,'v16:cavalry-after');addLog(`[기병의 빈틈] ${rider.name}이(가) 돌격 후 받는 피해 +12% (4초)`,'log-attack');}
 }
}
function v16Death(dead,team,players,time){
 if(!dead||(dead.id||'').startsWith('p_'))return;
 const plan=v16GetPlan(team);if(!plan||plan.state.deathFired[dead.id])return;
 plan.state.deathFired[dead.id]=true;
 const role=dead.v16Role,roles=plan.roles;
 if(role==='guard'&&plan.stage>=2){
   for(const u of v16Living(team).filter(u=>u.battleRow==='rear'))v16Buff(u,'dmg_taken_up',12,5,time,'v16:guard-broken');
   addLog(`[방진 붕괴] ${dead.name} 전사! 후열 엄호 해제·후열 받는 피해 +12% (5초)`,'log-attack');
 }
 if(role==='leader'&&plan.stage>=2){
   for(const u of v16Living(team))v16Buff(u,'dmg_dealt_down',8,5,time,'v16:leader-lost');
   addLog(`[지휘 단절] ${dead.name} 전사! 연계 공격 종료·생존 적 공격 피해 -8% (5초)`,'log-attack');
 }
 if(role==='support'&&plan.stage>=3){
   addLog(`[보급 차단] ${dead.name} 전사! 지원 회복·계책 연계가 중단됩니다.`,'log-attack');
 }
 // 낮은 등급의 보조 장수를 무조건 먼저 처치하는 것이 정답이 되지 않도록, 제한적 최후 명령.
 if(role==='wild'&&plan.stage>=4&&v16RoleUnit(team,roles.leader)){
   for(const u of v16Living(team))u.currentCooldown=Math.min(Math.max(0,u.currentCooldown||0),1.8);
   addLog(`[최후의 전령] ${dead.name} 전사! 적군 기술 준비 1.8초 이하로 단축 (1회). 이후 추가 발동 없음.`,'log-skill');
 }
}
function v16PrintBattleAnalysis(team){
 const plan=v16GetPlan(team);if(!plan)return '';
 const lines=[];lines.push(`전술: ${plan.label}`);
 for(const [role,name] of Object.entries(plan.roles)){if(name)lines.push(`${V16_ROLE_LABELS[role]}: ${name}`);}
 lines.push(`공략: ${V16_BATTLE_MODES[plan.style].strategy}`);
 return lines.join('\n');
}
