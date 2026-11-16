/* v8 · 26~30R 국가별 확정 적군 편성. v7의 21~25R 시스템과 전투 계산을 재사용. */
const BRANCH_26_30 = {
  wei: {
    26:{title:'시상·하구 외교 및 선봉대',front:[['진무','A'],['송겸','B']],rear:[['노숙','A'],['제갈근','A'],['엄준','B']]},
    27:{title:'하구 유비군 별동대 기습',front:[['관평','S'],['진도','A'],['유봉','A']],rear:[['손건','B'],['이적','B']]},
    28:{title:'강동 수군 야습대 (금범적)',front:[['감녕','S'],['능통','A'],['동습','A']],rear:[['반장','A'],['서성','B']]},
    29:{title:'화용도·남군 매복 포위선',front:[['관우','S'],['장비','S'],['조운','A']],rear:[['방통','A'],['미방','B'],['간옹','B']]},
    30:{title:'적벽의 화염 — 손유동맹 총력전',front:[['황개','S'],['정보','A'],['한당','B']],rear:[['주유','S'],['제갈량','S'],['방통','A']]}
  },
  shu: {
    26:{title:'형주 수군 접경 돌파',front:[['문빙','A'],['장윤','B']],rear:[['채모','A'],['괴월','A'],['왕찬','B']]},
    27:{title:'삼강구·적벽 전초 수군',front:[['장합','S'],['주령','A']],rear:[['모개','A'],['노초','B'],['장간','B']]},
    28:{title:'오림·강릉 외곽 조위 수비대',front:[['서황','S'],['우금','A'],['조홍','S']],rear:[['만총','A'],['동소','B']]},
    29:{title:'남군(강릉) 철벽 방어선',front:[['조인','S'],['우금','A'],['악진','A']],rear:[['가후','S'],['정욱','A'],['유엽','B']]},
    30:{title:'적벽 대함대 — 조조 본대 결전',front:[['장료','S'],['허저','B'],['하후돈','S']],rear:[['조조','SS'],['가후','A'],['정욱','B']]}
  },
  wu: {
    26:{title:'합비 방면 조위 견제군',front:[['악진','A'],['이전','A'],['장패','A']],rear:[['주광','B'],['유복','B']]},
    27:{title:'적벽 초전 조위 수군 방어선',front:[['문빙','S'],['장윤','B'],['장석','B']],rear:[['채모','A'],['왕위','B']]},
    28:{title:'남군(강릉) 외성 조인 방어선',front:[['조인','S'],['조홍','S'],['우금','A']],rear:[['만총','A'],['진교','B']]},
    29:{title:'오림 대진영 호위군 돌파',front:[['서황','S'],['하후연','S'],['조순','A'],['장합','A']],rear:[['가후','A'],['순유','B']]},
    30:{title:'적벽 수전 — 조조 수군 대함대',front:[['장료','S'],['문빙','S'],['서황','A'],['장윤','B']],rear:[['조조','S'],['채모','S']]}
  }
};
for(const side of ['wei','shu','wu'])Object.assign(BRANCH_21_25[side],BRANCH_26_30[side]);

// 기존 v7 보통 장수의 기술을 변경하지 않고, v8에서 새로 필요한 인물만 보강.
Object.assign(BRANCH_MINOR_SKILLS,{
 '송겸':['강동 지원창','물리','front_first',39],
 '제갈근':['화친의 계책','책략','ally_all',0],
 '엄준':['강동 모략','책략','front_first',35],
 '능통':['절충의 강습','물리','front_first',53],
 '동습':['수군의 기습','물리','front_first',49],
 '반장':['강동 맹습','물리','rear_first',48],
 '서성':['강동 방진','물리','front_first',39],
 '정보':['노장의 방어','물리','front_first',50],
 '방통':['연환의 계책','책략','front_first',54],
 '왕찬':['형주 문책','책략','front_first',35],
 '모개':['군선 지원','책략','ally_all',0],
 '노초':['전함 견제','물리','front_first',36],
 '장간':['유세의 혼란','책략','front_first',36],
 '동소':['철벽 군략','책략','front_first',40],
 '유엽':['기계 책략','책략','front_first',39],
 '장패':['청주병 강습','물리','front_first',50],
 '주광':['합비 보급 지원','책략','ally_all',0],
 '유복':['합비 진수','책략','front_first',37],
 '진교':['남군 보좌','책략','front_first',40]
});

// 별표 장수: 각 진영/라운드에 독립된 고유 기술과 특성.
// power는 기존 scenarioExecuteSkill의 공격계산에 들어가는 기초 위력.
Object.assign(BRANCH_MAJOR,{
 'wei/26/진무':{
  s:branchSkill('강동 선봉쇄격','물리','front_first',78,[{phase:'hit',type:'stat',who:'target',stat:'cmd',delta:-12,duration:4}],7),
  t:['선봉의 결기','체력 50% 이상이면 무력 +12. 첫 물리 공격 피해 +15%.',{hpAbove:.5,hpAboveForce:12,firstPhysical:15}]},
 'wei/26/노숙':{
  s:branchSkill('손유 동맹의 결속','책략','ally_all',0,[{phase:'support',type:'attack_speed',who:'target',value:10,duration:5},{phase:'support',type:'shield_pct',who:'target',value:8,duration:5}],9),
  t:['대도독의 중재','아군이 4명 이상 생존한 동안 받는 피해 -12%.',{minAlliesTaken:4,takenPct:-12}]},
 'wei/27/관평':{
  s:branchSkill('청룡의 선봉','물리','front_first',94,[{phase:'hit',type:'stat',who:'target',stat:'cmd',delta:-16,duration:3}],7),
  t:['관가의 용맹','첫 물리 공격 피해 +20%. 적 체력 40% 이하일 때 추가 피해 +15%.',{firstPhysical:20,finisherBelow:.4,finisherBonus:15}]},
 'wei/28/감녕':{
  s:branchSkill('금범 야습','물리','rear_lowest_hp',92,[{phase:'hit',type:'taken_up',who:'target',value:12,duration:4}],7),
  t:['금범의 추격','후열 공격 시 피해 +15%. 적 처치 시 공격속도 +20% (5초).',{rearBonusPct:15,killSpeed:20}]},
 'wei/29/관우':{
  s:branchSkill('화용도 청룡격','물리','front_first',102,[{phase:'hit',type:'damage_dealt',who:'target',value:-12,duration:3}],7),
  t:['화용도의 위압','전투 시작 시 적 전열의 공격 피해 -10% (6초). 체력 50% 이하 적에게 피해 +20%.',{startFrontDamageDown:10,finisherBelow:.5,finisherBonus:20}]},
 'wei/30/황개':{
  s:branchSkill('고육계·화선 돌격','물리','front_all',79,[{phase:'hit',type:'taken_up',who:'target',value:12,duration:5},{phase:'use',type:'self_cost_pct',who:'self',value:10}],8),
  t:['고육의 결의','기술 사용 시 현재 최대 체력의 10%를 소모한다. 체력 50% 이하에서는 공격 피해 +20%.',{hpBelow:.5,hpBelowDamagePct:20}]},
 'wei/30/주유':{
  s:branchSkill('적벽 대화계','책략','all_both',57,[{phase:'hit',type:'burn_2sec',who:'target',damage:9,duration:6}],9),
  t:['동남풍의 기세','화상 중인 적을 공격하면 추가 피해 +20%. 아군 2명 사망 시 기술 쿨타임 1회 초기화.',{againstBurnBonus:20,resetOnTwoAlliesDead:true}]},
 'shu/26/채모':{
  s:branchSkill('형주 수군 압박','책략','front_all',60,[{phase:'hit',type:'attack_speed',who:'target',value:-12,duration:4}],8),
  t:['수군의 전열','전열 아군이 생존한 동안 통솔 +15. 체력 50% 이상에서 지력 +8.',{frontAliveCmd:15,hpAbove:.5,hpAboveIntel:8}]},
 'shu/27/장합':{
  s:branchSkill('삼강구 연속 돌격','물리','front_first',99,[{phase:'hit',type:'stat',who:'target',stat:'cmd',delta:-15,duration:3}],7),
  t:['교전의 달인','첫 물리 공격 피해 +20%. 체력 50% 이상이면 무력 +10.',{firstPhysical:20,hpAbove:.5,hpAboveForce:10}]},
 'shu/28/서황':{
  s:branchSkill('오림 파진격','물리','front_all',73,[{phase:'hit',type:'taken_up',who:'target',value:10,duration:4}],8),
  t:['노련한 철벽','체력 50% 이상에서 통솔 +18. 자신 체력이 50% 이하일 때 공격속도 +12%.',{hpAbove:.5,hpAboveCmd:18,hpBelow:.5,hpBelowSpeed:12}]},
 'shu/29/조인':{
  s:branchSkill('남군 철벽진','책략','ally_all',0,[{phase:'support',type:'defense',who:'target',scope:'all',value:18,duration:5},{phase:'support',type:'shield_front_pct',who:'target',value:10,duration:5}],9),
  t:['난공불락','전열 아군이 생존하면 통솔 +20. 자신의 체력 50% 이하에서 보호막 12%를 1회 얻음.',{frontAliveCmd:20,shieldBelow:.5,shieldPct:12}]},
 'shu/29/가후':{
  s:branchSkill('독심의 이간책','책략','rear_first',75,[{phase:'hit',type:'magic_vulnerability',who:'target',value:15,duration:5},{phase:'hit',type:'cooldown',who:'target',value:1,cap:10}],8),
  t:['심리전의 책사','전투 시작 시 무력이 가장 높은 적이 받는 책략 피해 +12% (5초).',{startStrongestMagicVuln:12}]},
 'shu/30/장료':{
  s:branchSkill('대함대 선봉돌격','물리','front_all',78,[{phase:'hit',type:'stat',who:'target',stat:'cmd',delta:-13,duration:4}],7),
  t:['오자양장의 선봉','적 처치 시 공격속도 +15% (5초). 체력 50% 이상에서 무력 +12.',{killSpeed:15,hpAbove:.5,hpAboveForce:12}]},
 'shu/30/조조':{
  s:branchSkill('위무 대함대 군령','책략','ally_all',0,[{phase:'support',type:'damage_dealt',who:'target',value:22,duration:6},{phase:'support',type:'attack_speed',who:'target',value:12,duration:6}],9),
  t:['패자의 통솔','생존 아군이 3명 이하가 되면 1회 전군 공격 피해 +20% (6초).',{onceLowAllies:3,onceAlliesDamage:20}]},
 'wu/26/악진':{
  s:branchSkill('합비 선봉쇄','물리','front_first',87,[{phase:'hit',type:'stat',who:'target',stat:'cmd',delta:-15,duration:3}],7),
  t:['선등의 맹장','첫 물리 공격 피해 +20%. 체력 50% 이상에서 무력 +10.',{firstPhysical:20,hpAbove:.5,hpAboveForce:10}]},
 'wu/27/문빙':{
  s:branchSkill('조위 수군 방진','책략','ally_front_all',0,[{phase:'support',type:'defense',who:'target',scope:'all',value:20,duration:5},{phase:'support',type:'shield_pct',who:'target',value:8,duration:5}],9),
  t:['수전의 노장','전열 아군이 생존해 있는 동안 통솔 +18.',{frontAliveCmd:18}]},
 'wu/28/조인':{
  s:branchSkill('강릉 수성진','책략','ally_all',0,[{phase:'support',type:'defense',who:'target',scope:'all',value:18,duration:5},{phase:'support',type:'shield_front_pct',who:'target',value:8,duration:5}],9),
  t:['강릉의 성벽','자신의 체력 50% 이상에서 통솔 +20. 전열 아군의 피격 시 12% 확률로 피해 20% 감소.',{hpAbove:.5,hpAboveCmd:20,frontBlockChance:12,frontBlockPct:20}]},
 'wu/29/서황':{
  s:branchSkill('대진영 도끼 강습','물리','front_all',78,[{phase:'hit',type:'taken_up',who:'target',value:12,duration:4}],8),
  t:['파진의 노장','잃은 체력 비율에 따라 기술 피해 최대 +25%.',{lostHpSkillBonus:25}]},
 'wu/29/하후연':{
  s:{...branchSkill('질풍 연노격','물리','rear_first',60,[{phase:'hit_once',type:'taken_up',who:'target',value:10,duration:4}],8),attackCount:2},
  t:['신속의 명궁','후열 공격 시 피해 +20%. 체력이 50% 이하이면 공격속도 +15%.',{rearBonusPct:20,hpBelow:.5,hpBelowSpeed:15}]},
 'wu/30/장료':{
  s:branchSkill('조위 함대 돌격','물리','front_all',78,[{phase:'hit',type:'stat',who:'target',stat:'cmd',delta:-12,duration:4}],8),
  t:['합비의 위압','체력이 50% 이상이면 무력 +12. 적 체력이 50% 이하인 대상에게 피해 +15%.',{hpAbove:.5,hpAboveForce:12,finisherBelow:.5,finisherBonus:15}]},
 'wu/30/조조':{
  s:branchSkill('조위 수군 총공세','책략','all_both',62,[{phase:'hit',type:'attack_speed',who:'target',value:-15,duration:5}],9),
  t:['패업의 독전','아군 2명 사망 시 기술 쿨타임 1회 초기화. 체력 50% 이상이면 지력 +12.',{resetOnTwoAlliesDead:true,hpAbove:.5,hpAboveIntel:12}]}
});

// 보스 보조진의 기존 역할도 재사용하면서, 핵심 연계기만 라운드 전용으로 보강.
Object.assign(BRANCH_MAJOR,{
 'wei/30/제갈량':{s:branchSkill('동남풍의 보좌','책략','ally_all',0,[{phase:'support',type:'attack_speed',who:'target',value:10,duration:5}],9),t:['연합 책략','아군 4명 이상 생존 시 받는 피해 -10%.',{minAlliesTaken:4,takenPct:-10}]},
 'wei/30/방통':{s:branchSkill('연환계','책략','front_all',50,[{phase:'hit',type:'magic_vulnerability',who:'target',value:12,duration:4}],9),t:['연환의 모략','체력 50% 이상에서 지력 +8.',{hpAbove:.5,hpAboveIntel:8}]},
 'shu/30/가후':{s:branchSkill('후방 교란','책략','rear_first',57,[{phase:'hit',type:'cooldown',who:'target',value:1}],9),t:['독심의 조언','체력 50% 이상이면 지력 +8.',{hpAbove:.5,hpAboveIntel:8}]},
 'wu/30/채모':{s:branchSkill('수군 정비','책략','ally_all',0,[{phase:'support',type:'defense',who:'target',scope:'all',value:12,duration:5}],9),t:['장강의 수비','아군 4명 이상 생존 시 받는 피해 -10%.',{minAlliesTaken:4,takenPct:-10}]}
});
