/* v15 · 전장별 적 장수 성격: 역사적 모티브는 특정 사건에 한정하고 나머지는 전투 역할에 기반한 창작 전술이다.
 * 플레이어의 105명 고유 기술/스탯을 덮어쓰지 않는다. */
const V15_TACTIC_ARCHETYPES = {
  charge: {label:'선봉의 빈틈',skill:'맹진 돌파',desc:'첫 돌격의 피해가 높지만 돌격 후 방어가 허술해진다.',counter:'첫 기술을 견디고 돌격 직후 공격',kind:'물리',range:'front_first'},
  protect:{label:'철벽의 대가',skill:'방패 역격',desc:'처음에는 보호막을 얻지만 공격력이 약해지며, 보호막 파괴 후 빈틈이 생긴다.',counter:'보호막을 먼저 제거한 뒤 집중 공격',kind:'물리',range:'front_first'},
  duel:{label:'결사 일기토',skill:'목숨 건 일격',desc:'체력이 낮을수록 공격이 강해지지만 시전 후 체력을 소모한다.',counter:'회피·방어로 반격 타이밍 확보',kind:'물리',range:'front_first'},
  raid:{label:'전열 우회',skill:'후방 기습',desc:'후열을 노리는 첫 기습이 강하지만 이후 자신도 받는 피해가 증가한다.',counter:'후열 보호 및 기습 직후 반격',kind:'물리',range:'rear_first'},
  attrition:{label:'후퇴 없는 방진',skill:'지구전의 창',desc:'동료가 쓰러지면 방어 태세를 갖추지만 공격속도는 느려진다.',counter:'후열 화력부터 제압해 장기전 방지',kind:'물리',range:'front_first'},
  phalanx:{label:'수비선 교대',skill:'교대 방어진',desc:'전열에 보호막을 주지만 자기 자신의 행동 주기는 길어진다.',counter:'지휘관부터 제압하여 보호막 차단',kind:'책략',range:'ally_front_all'},
  scatter:{label:'흩어진 난전',skill:'교란의 창',desc:'상대 통솔을 깎지만 자신도 잠시 명중률이 감소한다.',counter:'명중률 약화 순간 역습',kind:'물리',range:'front_first'},
  pursuit:{label:'추격의 집착',skill:'잔적 추격',desc:'체력이 낮은 적을 노리며, 추격에 실패하면 방어가 취약해진다.',counter:'약한 장수 회복 및 후열 보호',kind:'물리',range:'lowest_hp_ratio'},
  supply:{label:'군량을 태우는 지원',skill:'병참 긴급 보급',desc:'부상한 아군을 치료하는 대신 자기 체력을 소모한다.',counter:'지원 장수를 먼저 제압',kind:'책략',range:'ally_lowest_hp_ratio'},
  omen:{label:'허실의 계책',skill:'허실 교란',desc:'적 기술 준비를 늦추지만 자기 체력도 소모한다.',counter:'쿨타임 면역·신속한 제압',kind:'책략',range:'rear_first'},
  blaze:{label:'화계의 역풍',skill:'연막 화공',desc:'화상을 걸 수 있으나 자신의 기술 재사용 시간도 길어진다.',counter:'화상 유지시간을 견디고 역습',kind:'책략',range:'front_all'},
  morale:{label:'장수의 군율',skill:'기세 재정비',desc:'동료의 공격속도를 올리지만 본인의 공격력은 떨어진다.',counter:'지원 장수를 먼저 끊어 공격속도 버프 해제',kind:'책략',range:'ally_all'},
  signal:{label:'불안한 호령',skill:'진영 정돈',desc:'아군 전열에 보호막을 부여하되 시전 후 자기 방어가 약화된다.',counter:'지휘관부터 공격',kind:'책략',range:'ally_front_all'},
  rally:{label:'패전의 분투',skill:'결사의 기동',desc:'동료가 죽으면 일시적으로 강해지지만 받는 피해도 늘어난다.',counter:'증폭 시간 동안 방어 후 반격',kind:'물리',range:'front_first'},
  sniping:{label:'후방의 빈틈',skill:'정밀 연노',desc:'적 후열을 저격하지만 자신의 전열 방어가 부족하다.',counter:'전열을 돌파해 궁수를 먼저 제거',kind:'물리',range:'rear_first'},
  gamble:{label:'성급한 책략',skill:'승부의 기책',desc:'첫 계책 피해가 크게 증가하지만, 이후 명중률이 떨어진다.',counter:'첫 타격 방어 후 반격',kind:'책략',range:'front_first'},
  bind:{label:'쇠사슬 진형',skill:'연환 압박',desc:'여럿을 동시에 공격하나 자신의 기술 재사용이 느려진다.',counter:'피해 분산 후 빠르게 반격',kind:'책략',range:'front_all'},
  steadfast:{label:'죽음의 저지선',skill:'최후의 수비',desc:'체력이 절반 이하일 때 보호막을 얻지만 공격력이 낮아진다.',counter:'보호막 소진 후 마무리',kind:'물리',range:'front_first'}
};
const V15_HISTORICAL_MOTIFS = {
 'wei/25/제갈량(신야)':{mode:'blaze',label:'박망의 병법',desc:'연의의 박망파 화계에서 착안. 준비가 끝나면 화공 피해가 커지지만 준비 중에는 공격력이 감소한다.',counter:'화공 준비 중 선제 공격',origin:'연의'},
 'wu/25/황조':{mode:'signal',label:'강하의 포위',desc:'강하 수군의 지휘를 유지하는 동안 전열 보호막을 제공하지만 자신은 후방에 노출된다.',counter:'후열의 황조 선제 공격',origin:'정사 모티브'},
 'wei/30/황개':{mode:'huangGai',label:'거짓 항복의 화선',desc:'전투 시작 때 자신의 HP 15%를 희생하고 5초 동안 화선을 준비한다. 준비 이후 화공이 강력해진다.',counter:'처음 5초 동안 황개를 처치하면 화공을 막을 수 있다.',origin:'정사 모티브'},
 'wei/30/주유':{mode:'zhouYu',label:'적벽 화공 지휘',desc:'황개가 살아 있으면 화공 피해가 강해진다. 황개가 먼저 쓰러지면 책략 재사용이 느려진다.',counter:'화공 준비 중 황개부터 제거',origin:'정사 모티브'},
 'wei/35/마초':{mode:'maChao',label:'서량의 균열',desc:'한수 생존 중에는 기술이 느리지만, 한수 사망 직후 폭주한다. 폭주 후 방어가 크게 약화된다.',counter:'마초를 먼저 노리거나 한수 사망 직후 반격',origin:'정사·연의 모티브'},
 'wei/35/한수':{mode:'hanSui',label:'갈라진 연합',desc:'마초가 생존할 때는 동료 방어를 지원하지만 자신이 쓰러지면 마초의 폭주를 촉발한다.',counter:'한수의 처치 순서를 조절',origin:'정사·연의 모티브'},
 'wu/35/장료':{mode:'zhangLiao',label:'팔백 결사대',desc:'처음 5초간 공격속도가 30% 빨라지지만 그동안 받는 피해가 20% 증가한다.',counter:'초반 방어 또는 장료 집중 공격',origin:'정사 모티브'},
 'wei/40/유비':{mode:'morale',label:'한중왕의 군령',desc:'전열이 살아 있을 때는 지원 능력이 강하지만 호위진이 무너지면 자신의 방어가 약화된다.',counter:'전열을 먼저 무너뜨린다.',origin:'정사 모티브'},
 'shu/40/조조':{mode:'signal',label:'위왕의 정병',desc:'아군 전열의 보호막을 강화하는 대신 본인의 기술 간격이 길어진다.',counter:'방어가 빈 순간 집중 공격',origin:'정사 모티브'},
 'wu/40/관우':{mode:'duel',label:'위진화하의 맹공',desc:'초반 강력한 공격을 가하지만 공격 후 빈틈이 생긴다.',counter:'돌진 후 공격',origin:'정사 모티브'},
 'wei/42/마속':{mode:'maSu',label:'고지의 오판',desc:'처음 8초간 책략 피해 +30%. 이후 보급 단절로 4초마다 HP를 잃고 기술이 느려진다.',counter:'초반 공세를 버틴 뒤 장기전으로 유도',origin:'정사 모티브'},
 'wei/42/왕평':{mode:'phalanx',label:'가정의 간언',desc:'마속이 살아 있는 동안에는 방진을 유지하지만, 마속이 쓰러지면 전열을 다시 정비한다.',counter:'마속과 왕평의 연계를 끊는다.',origin:'정사 모티브'},
 'shu/43/학소':{mode:'haoZhao',label:'진창 철성',desc:'처음부터 25% 성벽 보호막을 얻으며 그동안 공격 피해가 낮다. 성벽이 무너지면 한 번 반격한다.',counter:'보호막을 부순 뒤 반격을 견뎌낸다.',origin:'정사 모티브'},
 'wei/44/강유':{mode:'blaze',label:'상방곡의 화염',desc:'연의 속 상방곡 화계를 각색. 화공 피해가 높지만 준비 중 약해진다.',counter:'화공 준비 중 후열을 집중 공격',origin:'연의 모티브'},
 'wei/45/강유':{mode:'jiangWei',label:'와룡의 후계',desc:'제갈량이 살아 있으면 공격력 +20%. 하지만 제갈량이 쓰러지면 방어가 약해진다.',counter:'제갈량 선제 제거',origin:'창작(인물 관계 기반)'},
 'wei/45/제갈량':{mode:'zhugeLiang',label:'북벌의 숙명',desc:'전투 시작 18초 동안 아군의 기술이 빨라지지만, 이후 군량 부담으로 행동이 점차 느려진다.',counter:'초반을 견디고 지구전을 유도',origin:'정사 모티브'},
 'shu/45/장합':{mode:'zhangHe',label:'오장원 철기',desc:'사마의가 살아 있는 동안 강한 돌격을 하지만, 돌격 직후 방어가 약해진다.',counter:'사마의와의 연계를 분리',origin:'창작(정사 인물 관계 기반)'},
 'shu/45/사마의':{mode:'simaYi',label:'견벽청야',desc:'처음 12초는 피해를 줄이는 대신 받는 피해도 줄인다. 이후 지구전 지휘로 아군 기술이 빨라진다.',counter:'12초 이내 방어선을 돌파',origin:'정사 모티브'},
 'wu/45/조예':{mode:'signal',label:'위명제 친정령',desc:'동료 생존 중 수비에 집중하지만 부대가 줄어들면 결사 지휘로 전환한다.',counter:'후열 지휘관부터 노린다.',origin:'창작(군제 모티브)'},
 'wu/45/사마의':{mode:'simaYi',label:'합비신성 견벽',desc:'전투 초반 방어적이지만 12초 이후 전군의 공격 간격이 짧아진다.',counter:'전투 초기 집중 공략',origin:'정사 모티브'}
};
function restorationIdentity(key, rec) {
 const special=V15_HISTORICAL_MOTIFS[key];
 if(special)return {...special, special:true};
 const hash=[...key].reduce((n,c)=>(n*33+c.charCodeAt(0))>>>0,539);
 const rear=rec.row==='rear', support=rec.skillPower===0 || (rear && rec.intel > rec.force+16);
 const choices = support?['supply','omen','blaze','morale','signal','gamble','bind','phalanx']:
      rear?['raid','sniping','pursuit','omen','blaze','gamble','morale']:
      rec.force>=85?['charge','duel','raid','pursuit','rally','scatter','protect','attrition']:
      ['protect','attrition','scatter','charge','phalanx','pursuit','steadfast','rally'];
 const mode=choices[hash%choices.length], a=V15_TACTIC_ARCHETYPES[mode];
 const members=BRANCH_21_25[rec.side]?.[rec.round];
 const companions=members?[...(members.front||[]),...(members.rear||[])].filter(x=>x[0]!==rec.name):[];
 const ally=companions.length?companions[hash%companions.length][0]:null;
 const profile={
   onHit:['cmd','force','hit','dodge'][hash%4], debuff:6+(hash%6)*2,
   duration:2+(hash%4), healthThreshold:(35+hash%4*10)/100,
   bonus:(8+hash%5*2), penalty:(7+hash%4*2),
   weakness:['guard','stamina','exposure'][Math.floor(hash/11)%3], partner:ally,
   isTactical:rec.intel>=75, isVanguard:rec.row==='front'
 };
 const statName={cmd:'통솔',force:'무력',hit:'명중',dodge:'회피'}[profile.onHit];
 const weaknessText=profile.weakness==='guard'?'사용 후 받는 피해 증가':profile.weakness==='stamina'?'기술 사용 시 체력 소모':'사용 후 명중률 감소';
 const partnerText=ally?`${ally} 생존 중 연계 강화, 이탈 시 효율 감소. `:'';
 return {mode,label:rec.name+' · '+a.label,desc:`${partnerText}${a.desc} 적중 시 ${statName} -${profile.debuff} (${profile.duration}초). ${weaknessText}.`,
 counter:`${a.counter}${ally?' · '+ally+'와의 연계 차단':''}`,origin:'전장 역할 기반 창작',special:false,profile};
}
function restorationTacticConfig(tactic){return V15_TACTIC_ARCHETYPES[tactic.mode]||V15_TACTIC_ARCHETYPES.charge;}
function restorationTacticIntro(e){return e?.restorationTactic?`[${e.restorationTactic.label}] ${e.restorationTactic.desc} · 공략: ${e.restorationTactic.counter}`:'';}
function restorationTacticStart(team,players,time=0){
 for(const u of team){
  const t=u.restorationTactic;if(!t||u.hp<=0)continue;
  u.restorationState={started:true, firstSkill:true, prepared:false, broken:false, triggered:false, tick:0};
  const mode=t.mode;
  if(mode==='huangGai'){u.hp=Math.max(1,u.hp-Math.floor(u.maxHp*.15));u.currentCooldown=Math.max(u.currentCooldown,5);u.restorationState.prepareUntil=5;}
  if(mode==='zhangLiao'){restorationBuff(u,'dmg_taken_up',20,5,time,'v15:liao');}
  if(mode==='haoZhao'){branchGrantShield(u,25,999,time,'v15:haozhao');restorationBuff(u,'dmg_dealt_down',15,999,time,'v15:hao');}
  if(mode==='protect'||mode==='steadfast'){branchGrantShield(u,10,7,time,'v15:protect');restorationBuff(u,'dmg_dealt_down',10,7,time,'v15:protect');}
  if(mode==='charge'||mode==='raid'||mode==='sniping')restorationBuff(u,'dmg_taken_up',mode==='charge'?12:10,4,time,'v15:risk');
  if(mode==='morale'||mode==='signal')for(const ally of team.filter(v=>v.hp>0&&v.battleRow==='front'))restorationBuff(ally,'dmg_up',9,5,time,'v15:rally');
  if(mode==='phalanx')for(const ally of team.filter(v=>v.hp>0&&v.battleRow==='front'))branchGrantShield(ally,8,5,time,'v15:phalanx');
  if(mode==='simaYi')restorationBuff(u,'dmg_dealt_down',15,12,time,'v15:sima');
 }
}
function restorationBuff(u,stat,amount,duration,time,source){
 if(!u||u.hp<=0)return;
 u.buffs=u.buffs||[];
 const old=u.buffs.find(b=>b.stat===stat&&b.source===source);
 const buff={stat,amount,source,expireTime:duration===999?999:time+duration};
 if(old)Object.assign(old,buff);else u.buffs.push(buff);
}
function restorationTacticCdMultiplier(u,time,team){
 const t=u?.restorationTactic;if(!t)return 1;
 const n=t.mode;
 if(n==='huangGai'&&time<5)return 1.3;
 if(n==='maChao'&&team.some(x=>x.name==='한수'&&x.hp>0))return 1.10;
 if(n==='zhangLiao')return time<5?.70:1.10;
 if(n==='maSu'&&time>=8)return 1.20;
 if(team.some(x=>x.hp>0&&x.restorationTactic?.mode==='zhugeLiang'))return time<18?.85:1+Math.min(.35,(time-18)*.012);
 if(team.some(x=>x.hp>0&&x.restorationTactic?.mode==='simaYi'))return time<12?1:.85;
 if(n==='haoZhao'&&u.restorationState?.broken)return 1.20;
 if(n==='blaze'||n==='bind'||n==='phalanx'||n==='signal')return 1.10;
 return 1;
}
function restorationTacticSkill(caster,skill,time,allies,enemies){
 const t=caster.restorationTactic;if(!t)return skill;
 const n=t.mode, st=caster.restorationState||{};
 if(n==='huangGai'&&time<5)return null; // 대기 중에는 공격을 발동하지 않음
 const out={...skill,runtimeEffects:[...(skill.runtimeEffects||[])]};
 if(n==='huangGai'){
   out.name='화선 돌격';out.type='책략';out.range='all_both';out.target='enemy_single';out.power=125;out.attackCount=1;
   out.runtimeEffects.push({phase:'hit',type:'burn_2sec',who:'target',damage:11,duration:6});
 }else if(n==='maChao'){
   out.name='금마초 돌격';out.range='front_first';out.type='물리';out.power=Math.max(out.power,118);
 }else if(n==='zhangLiao'){
   out.name='소요진 돌파';out.range='rear_first';out.type='물리';out.power=Math.max(out.power,110);
 }else if(n==='maSu'){
   out.name='고지 화살비';out.type='책략';out.range='all_both';out.power=Math.max(54,out.power);
 }else if(n==='haoZhao'){
   out.name='성벽 수호';out.type='물리';out.range='front_first';out.power=Math.max(out.power,65);
 }else if(n==='zhugeLiang'){
   out.name='오장원 천문진';out.type='책략';out.range='all_both';
 }
 const first=st.firstSkill!==false;
 if(first&&(n==='charge'||n==='raid'||n==='duel'||n==='gamble'))out.power=Math.round(out.power*1.22);
 if(n==='maChao'&&st.frenzy){out.power=Math.round(out.power*1.4);st.frenzy=false;restorationBuff(caster,'dmg_taken_up',20,4,time,'v15:ma_after');}
 if(n==='maSu'&&time<8)out.power=Math.round(out.power*1.30);
 if(n==='zhugeLiang'&&time>18)out.power=Math.round(out.power*.92);
 if(t.profile&&t.profile.partner){
   const alive=allies.some(a=>a!==caster&&a.name===t.profile.partner&&a.hp>0);
   if(alive&&out.power>0)out.power=Math.round(out.power*(1+t.profile.bonus/100));
   if(!alive&&out.power>0)out.power=Math.round(out.power*.94);
 }
 if(n==='jiangWei'&&allies.some(a=>a.name==='제갈량'&&a.hp>0))out.power=Math.round(out.power*1.2);
 if(n==='zhangHe'&&allies.some(a=>a.name==='사마의'&&a.hp>0))out.power=Math.round(out.power*1.22);
 if(n==='zhouYu'&&allies.some(a=>a.name==='황개'&&a.hp>0))out.power=Math.round(out.power*1.2);
 if(n==='simaYi'&&time<12)out.power=Math.round(out.power*.85);
 if(n==='duel')out.power=Math.round(out.power*(1+.22*(1-caster.hp/caster.maxHp)));
 if(n==='pursuit')out.range='lowest_hp_ratio';
 if(n==='sniping'||n==='raid')out.range='rear_first';
 return out;
}
function restorationTacticAfterSkill(caster,skill,allies,enemies,time){
 const t=caster.restorationTactic;if(!t)return;
 const n=t.mode,s=caster.restorationState||(caster.restorationState={});s.firstSkill=false;
 if(n==='duel'||n==='omen'||n==='supply')caster.hp=Math.max(1,caster.hp-Math.max(1,Math.floor(caster.maxHp*(n==='duel'?.05:.025))));
 if(n==='charge'||n==='raid'||n==='zhangHe'||n==='zhangLiao')restorationBuff(caster,'dmg_taken_up',14,3,time,'v15:after');
 if(n==='scatter'||n==='gamble')scenarioPutBuff(caster,'hit',-10,3,time,'v15:after_hit');
 if(n==='maChao')restorationBuff(caster,'dmg_taken_up',10,2,time,'v15:ma_danger');
 if(n==='signal'||n==='morale')restorationBuff(caster,'dmg_dealt_down',12,5,time,'v15:self_cost');
 if(t.profile){
   if(t.profile.weakness==='guard')restorationBuff(caster,'dmg_taken_up',t.profile.penalty,3,time,'v15:weakness');
   else if(t.profile.weakness==='stamina')caster.hp=Math.max(1,caster.hp-Math.max(1,Math.floor(caster.maxHp*t.profile.penalty/400)));
   else scenarioPutBuff(caster,'hit',-t.profile.penalty,3,time,'v15:weakness');
 }
 scenarioHealthBar(caster);
}
function restorationTacticOnHit(caster,target,allies,enemies,skill,time){
 const t=caster.restorationTactic;if(!t||!target||target.hp<=0)return;
 const n=t.mode;
 if(t.profile)scenarioPutBuff(target,t.profile.onHit,-t.profile.debuff,t.profile.duration,time,'v15:personal');
 if(n==='scatter')scenarioPutBuff(target,'cmd',-9,3,time,'v15:scatter');
 if(n==='omen'||n==='gamble')target.currentCooldown=Math.min(10,target.currentCooldown+0.7);
 if(n==='blaze'||n==='huangGai'||n==='zhouYu')branchApplyEffect({type:'burn_2sec',who:'target',damage:n==='huangGai'?11:5,duration:4},caster,target,time,skill,[]);
 if(n==='bind')scenarioPutBuff(target,'dmg_taken_up',9,3,time,'v15:bind');
 if(n==='sniping')scenarioPutBuff(target,'dodge',-7,3,time,'v15:sniping');
 if(n==='raid')scenarioPutBuff(target,'dmg_taken_up',8,3,time,'v15:raid');
}
function restorationTacticTick(unit,team,players,time,sec){
 const t=unit?.restorationTactic,st=unit?.restorationState;
 if(!t||!st||unit.hp<=0)return;
 const n=t.mode;
 if(n==='maSu'&&sec>=8&&sec%4===0&&st.lastLose!==sec){st.lastLose=sec;unit.hp=Math.max(1,unit.hp-Math.floor(unit.maxHp*.05));scenarioHealthBar(unit);addLog(`[보급 단절] 마속 체력 -5%`,'log-attack');}
 if(n==='supply'&&sec>0&&sec%6===0&&st.lastHeal!==sec){st.lastHeal=sec;const ally=team.filter(x=>x.hp>0).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];if(ally)scenarioHeal(ally,Math.floor(ally.maxHp*.06));unit.hp=Math.max(1,unit.hp-Math.floor(unit.maxHp*.025));scenarioHealthBar(unit);}
 if(n==='attrition'&&team.filter(x=>x.hp>0).length<=2&&!st.attrition){st.attrition=true;branchGrantShield(unit,12,7,time,'v15:attrition');restorationBuff(unit,'dmg_dealt_down',12,7,time,'v15:attrition');}
 if(n==='steadfast'&&unit.hp/unit.maxHp<=.5&&!st.lastStand){st.lastStand=true;branchGrantShield(unit,14,8,time,'v15:steadfast');restorationBuff(unit,'dmg_dealt_down',8,8,time,'v15:stand');}
 if(n==='zhugeLiang'&&sec===18){addLog(`[군량 부족] 제갈량의 공세가 점차 느려집니다.`,'log-buff');}
 if(n==='simaYi'&&sec===12){addLog(`[견벽청야] 사마의가 지구전 반격을 시작합니다.`,'log-buff');}
 if(n==='huangGai'&&sec===5){addLog(`[화선 준비 완료] 황개의 화공이 준비되었습니다!`,'log-skill');}
 if(n==='maChao'&&!team.some(x=>x.name==='한수'&&x.hp>0)&&!st.hanGone){st.hanGone=true;st.frenzy=true;addLog(`[서량의 균열] 한수 사망! 마초 다음 기술 강화`,'log-skill');}
}
function restorationTacticDeath(dead,team,players,time){
 if(!dead||!team)return;
 for(const u of team){if(u.hp<=0||!u.restorationTactic)continue;const n=u.restorationTactic.mode;
  if(n==='rally'&&!u.restorationState.triggered){u.restorationState.triggered=true;restorationBuff(u,'dmg_up',16,5,time,'v15:vengeance');restorationBuff(u,'dmg_taken_up',10,5,time,'v15:vengeance');}
  if(n==='intercept'&&!u.restorationState.triggered){u.restorationState.triggered=true;branchGrantShield(u,12,5,time,'v15:intercept');}
  if(n==='maChao'&&dead.name==='한수'){u.restorationState.frenzy=true;u.restorationState.hanGone=true;}
 }
}
function restorationTacticShieldBroken(unit,attacker,time){
 if(!unit?.restorationTactic||unit.restorationTactic.mode!=='haoZhao'||unit.restorationState?.broken)return;
 unit.restorationState.broken=true;
 unit.buffs=(unit.buffs||[]).filter(b=>!(b.source==='v15:hao'&&b.stat==='dmg_dealt_down'));
 const foes=lastPlayerTeam.filter(x=>x.hp>0&&x.battleRow==='front');
 for(const enemy of foes){
  const amount=Math.min(50,Math.max(5,Math.floor(65*unit.force/(100+enemy.cmd))));
  enemy.hp=Math.max(0,enemy.hp-amount);unit.totalDamage=(unit.totalDamage||0)+amount;
  scenarioHealthBar(enemy);battleFXHit(unit,enemy,amount,'물리');
  if(enemy.hp<=0)processKillEvents(unit,enemy,currentEnemyTeam,lastPlayerTeam,time);
 }
 addLog(`[성벽 붕괴] 학소가 전열에 마지막 반격!`,'log-skill');
}
