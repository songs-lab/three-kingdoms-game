/* 1~20라운드 전용 적군 전투 엔진 (기존 105명 고유기술과 격리) */
const SCENARIO_STATS = {command:'cmd', force:'force', intel:'intel', politics:'pol', hit:'hit', dodge:'dodge'};
function scenarioIsEnemy(unit) { return !!(unit && unit.scenarioTrait && unit.enemyId); }
function scenarioAlive(team) { return (team || []).filter(u=>u && u.hp > 0 && !u.isDead); }
function scenarioNumber(value) { return Number.isFinite(+value) ? +value : 0; }
function scenarioConditions(unit, trait, target, allies, foes, kind, gameTime) {
    if (!trait || unit.hp <= 0 || unit.isDead) return false;
    for (const c of (trait.conditions || [])) {
        let v, expected = c.value;
        if (c.field === 'attack_type') v = kind;
        else if (c.field === 'alive_ally_count') v = scenarioAlive(allies).length;
        else if (c.field === 'ally_named_alive') v = scenarioAlive(allies).some(a=>a.name===expected);
        else {
            const subject = c.subject === 'target' ? target : unit;
            if (!subject) return false;
            if (c.field === 'hp_ratio') v = subject.hp / Math.max(1,subject.maxHp);
            else if (c.field === 'hp_current') v = subject.hp;
            else if (c.field === 'force') v = getStat(subject,'force',c.subject==='target'?foes:allies,gameTime);
            else return false;
            if (typeof expected === 'string' && expected.startsWith('self.')) {
                expected = expected==='self.force' ? getStat(unit,'force',allies,gameTime) : unit.hp;
            }
        }
        const pass = c.operator === '>=' ? v >= expected : c.operator === '<=' ? v <= expected :
              c.operator === '<' ? v < expected : c.operator === '>' ? v > expected : c.operator === '==' ? v == expected : false;
        if(!pass)return false;
    }
    return true;
}
function scenarioTraitEffect(unit, effectType, target, ownTeam, otherTeam, kind, gameTime, opts={}) {
    let total = 0;
    const sourceList = scenarioAlive(ownTeam).filter(scenarioIsEnemy);
    for (const source of sourceList) {
        const t=source.scenarioTrait;
        if (!t || !(t.trigger.type==='passive' || (t.trigger.type==='first_physical_skill' && opts.firstPhysical))) continue;
        if (t.trigger.type === 'first_physical_skill' && (source!==unit || unit.scenarioFirstPhysicalUsed || kind!=='physical'))continue;
        if (!scenarioConditions(source,t,source===unit?target:null,ownTeam,otherTeam,kind,gameTime))continue;
        for (const ef of t.effects||[]) {
            if (ef.type!==effectType)continue;
            if (ef.target==='self' && source!==unit)continue;
            if (ef.target==='all_allies' && !ownTeam.includes(unit))continue;
            if (ef.target==='all_enemies' && ownTeam.includes(unit))continue;
            if (ef.scope && ef.scope!=='all' && ef.scope!==kind)continue;
            total+=scenarioNumber(ef.value);
        }
    }
    return total;
}
function scenarioStatDelta(unit, stat, allAliveUnits, gameTime) {
    const team = unit.id?.startsWith('e_') ? currentEnemyTeam : lastPlayerTeam;
    const opposite = unit.id?.startsWith('e_') ? lastPlayerTeam : currentEnemyTeam;
    let total=0;
    if (scenarioIsEnemy(unit)) {
        const ownTrait=unit.scenarioTrait;
        if (ownTrait?.trigger.type==='passive' && scenarioConditions(unit,ownTrait,null,team,opposite,'',gameTime)) {
            for(const ef of ownTrait.effects||[])if(ef.type==='stat_delta' && ef.target==='self' && SCENARIO_STATS[ef.stat]===stat)total+=ef.value;
        }
        total+=scenarioNumber((unit.scenarioTraitStacks||{})[stat]);
    }
    for(const source of scenarioAlive(team).filter(scenarioIsEnemy)) {
        const t=source.scenarioTrait;
        if(t?.trigger.type!=='passive'||!scenarioConditions(source,t,null,team,opposite,'',gameTime))continue;
        for (const ef of t.effects||[]) {
            if(ef.type==='stat_delta'&&ef.target==='all_allies'&&SCENARIO_STATS[ef.stat]===stat)total+=ef.value;
            if(ef.type==='accuracy_points'&&ef.target==='all_allies'&&stat==='hit')total+=ef.value;
        }
    }
    for (const source of scenarioAlive(opposite).filter(scenarioIsEnemy)) {
        const t=source.scenarioTrait;
        if(t?.trigger.type!=='passive'||!scenarioConditions(source,t,null,opposite,team,'',gameTime))continue;
        for(const ef of t.effects||[])if(ef.type==='stat_delta'&&ef.target==='all_enemies'&&SCENARIO_STATS[ef.stat]===stat)total+=ef.value;
    }
    return total;
}
function scenarioAttackModifier(unit,target,allies,enemies,kind,time,what) {
    let out=0;
    for(const source of scenarioAlive(allies).filter(scenarioIsEnemy)) {
        const tr=source.scenarioTrait;
        if(tr?.trigger.type!=='passive'&&tr?.trigger.type!=='first_physical_skill')continue;
        if(tr.trigger.type==='first_physical_skill'&&(source!==unit||unit.scenarioFirstPhysicalUsed||kind!=='physical'))continue;
        if(!scenarioConditions(source,tr,target,allies,enemies,kind,time))continue;
        for(const ef of tr.effects||[]) {
            if(ef.type!==what || (ef.target==='self'&&source!==unit) || (ef.scope&&ef.scope!=='all'&&ef.scope!==kind))continue;
            out+=ef.value;
        }
    }
    if(what==='final_damage_pct')out+=scenarioNumber((unit.scenarioTraitStacks||{}).physical_damage_pct)*(kind==='physical');
    return out;
}
function scenarioTakenModifier(defender,defTeam,atkTeam,kind,time){
    let percent=0;
    for(const source of scenarioAlive(defTeam).filter(scenarioIsEnemy)){
        const tr=source.scenarioTrait;
        if(tr?.trigger.type!=='passive'||!scenarioConditions(source,tr,null,defTeam,atkTeam,kind,time))continue;
        for(const ef of tr.effects||[]) {
            if(ef.type!=='damage_taken_pct')continue;
            if(ef.target==='self'&&source!==defender)continue;
            if(ef.scope&&ef.scope!=='all'&&ef.scope!==kind)continue;
            percent+=ef.value;
        }
    }
    return Math.max(0,1+percent/100);
}
function scenarioPutBuff(target, stat, amount, duration, time, sourceId, mode='up') {
    if (!target || target.hp<=0) return;
    if(!target.buffs)target.buffs=[];
    const source='scenario:'+sourceId+':'+stat+':'+mode;
    const old=target.buffs.find(b=>b.source===source);
    const buff={stat,amount:Math.abs(amount),type:amount<0?'down':mode,source,expireTime:duration===999?999:time+duration};
    if(old)Object.assign(old,buff);else target.buffs.push(buff);
}
function scenarioHeal(target, amount) {
    if(!target||target.hp<=0||target.buffs?.some(b=>b.stat==='scenario_no_heal'))return 0;
    const before=target.hp;
    target.hp=Math.min(target.maxHp,target.hp+Math.max(0,Math.floor(amount)));
    const actual=Math.max(0,target.hp-before);
    if(actual>0){scenarioHealthBar(target);battleFXHeal(target,actual);}
    return actual;
}
// 이 버프는 기존 플레이어 장수의 패시브/보물 회복에도 적용되어야 한다.
function scenarioGuardHealing(unit){
    if(unit.scenarioHealingGuard)return;
    let hp=unit.hp;
    Object.defineProperty(unit,'hp',{enumerable:true,configurable:true,get(){return hp;},set(value){
        if(!Number.isFinite(value))return;
        if(value>hp&&this.buffs?.some(b=>b.stat==='scenario_no_heal'))return;
        hp=value;
    }});
    unit.scenarioHealingGuard=true;
}
function scenarioEffectApply(effect, caster, target, time, sourceSkill, logParts){
    const who=effect.who==='self'?caster:target;
    const origin=sourceSkill.id;
    if(effect.type==='stat'){
        scenarioPutBuff(who,effect.stat,effect.delta,effect.duration,time,origin);
        logParts.push(`[${who.name} ${effect.stat} ${effect.delta>0?'+':''}${effect.delta}]`);
    } else if(effect.type==='defense'){
        scenarioPutBuff(who,effect.scope==='all'?'dmg_taken_down':effect.scope==='strategy'?'magic_reduce':'phys_reduce',effect.value,effect.duration,time,origin);
        logParts.push(`[${who.name} ${effect.scope} 피해 -${effect.value}%]`);
    } else if(effect.type==='heal_pct_max'){
        const h=scenarioHeal(who,who.maxHp*effect.value/100);logParts.push(`[${who.name} +${h} 회복]`);
    } else if(effect.type==='heal_pct_current'){
        const h=scenarioHeal(who,who.hp*effect.value/100);logParts.push(`[${who.name} +${h} 회복]`);
    } else if(effect.type==='heal_flat'){
        const h=scenarioHeal(who,effect.value);logParts.push(`[${who.name} +${h} 회복]`);
    } else if(effect.type==='cooldown'){
        if(who && !who.buffs?.some(b=>b.stat==='scenario_cooldown_immunity') && !(typeof clinicBlockHarmfulCooldown==='function' && clinicBlockHarmfulCooldown(who))){
            who.currentCooldown=Math.min(effect.cap||10,who.currentCooldown+effect.value);
            logParts.push(`[${who.name} 쿨타임 +${effect.value}초]`);
        }
    } else if(effect.type==='no_heal'){
        if(!who.buffs.some(b=>b.stat==='scenario_no_heal'))who.buffs.push({stat:'scenario_no_heal',source:'scenario:'+origin,expireTime:999});
        logParts.push(`[${who.name} 회복 불가]`);
    } else if(effect.type==='next_damage_down'){
        scenarioPutBuff(who,'next_dmg_down',effect.value,999,time,origin);
        logParts.push(`[${who.name} 다음 스킬 피해 -${effect.value}%]`);
    } else if(effect.type==='magic_vulnerability'){
        scenarioPutBuff(who,'scenario_magic_vuln',effect.value,effect.duration,time,origin);
        logParts.push(`[${who.name} 받는 책략 피해 +${effect.value}%]`);
    } else if(effect.type==='taunt'){
        scenarioPutBuff(caster,'taunt',1,effect.duration,time,origin);
        logParts.push(`[${caster.name} 도발]`);
    } else if(effect.type==='force_diff_damage'){
        const own=getStat(caster,'force',currentEnemyTeam,time),other=getStat(who,'force',lastPlayerTeam,time);
        const extra=Math.max(0,Math.min(100,own-other));
        if(extra){let actual=immuneToPlayerFixedDamage(who,lastPlayerTeam,'고정피해')?0:extra;
            if(isPlayableUnit(who)){
                if(lastPlayerTeam.some(a=>isPlayableUnit(a)&&a.name==='순욱'&&a.hp>0))actual*=.85;
                if(lastPlayerTeam.some(a=>isPlayableUnit(a)&&a.name==='보즐'&&a.hp>0&&a.currentCooldown>0))actual*=.90;
                if(who.name==='한당')actual*=1-.08*Math.min(6,lastPlayerTeam.filter(a=>a.hp>0).length);
            }
            actual=playableLeathalGuard(who,Math.floor(actual),time);who.hp=Math.max(0,who.hp-actual);scenarioHealthBar(who);if(actual)battleFXHit(caster,who,actual,'고정피해');caster.totalDamage+=actual;}
        logParts.push(`[추가 고정 피해 ${extra}]`);
    }
}
function scenarioSkillTargets(caster,skill,allies,enemies){
    const t=skill.target;
    if(t==='self')return [caster];
    if(t==='ally_all')return [...allies];
    if(t==='ally_lowest_hp_ratio')return [[...allies].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0]].filter(Boolean);
    const count=t==='enemy_three'?3:t==='enemy_two'?2:1;
    const mode=t==='enemy_lowest_hp_ratio'?'lowest_hp_ratio':formationRange(caster,skill);
    return formationPickOpponents(caster,skill,enemies,{count,mode});
}
function scenarioOnHitTrait(caster,target,allies,enemies,skill,time){
    const t=caster.scenarioTrait;if(!t)return;
    if(t.trigger.type==='on_any_skill_hit' || (t.trigger.type==='on_strategy_hit' && skill.type==='책략')){
        const key='scenario:'+t.id;
        if(t.trigger.type==='on_any_skill_hit'){
            caster.scenarioTraitStacks.physical_damage_pct=Math.min(16,(caster.scenarioTraitStacks.physical_damage_pct||0)+4);
        }else{
            const repeated=caster.scenarioHitCounts[target.id]||0;
            for(const e of t.effects||[]){
                if(e.type==='dodge_points')scenarioPutBuff(target,'dodge',e.value,e.durationSec,time,key);
                else if(e.type==='remaining_cooldown_seconds' && repeated<2 && !enemies.some(u=>u.name==='왕릉'&&u.hp>0) && !(typeof clinicBlockHarmfulCooldown==='function' && clinicBlockHarmfulCooldown(target)))target.currentCooldown=Math.min(10,target.currentCooldown+e.value);
            }
            caster.scenarioHitCounts[target.id]=repeated+1;
        }
    }
}
function scenarioOnDeathTrait(deadUnit){
    const allies=deadUnit.id?.startsWith('e_')?currentEnemyTeam:lastPlayerTeam;
    const enemies=deadUnit.id?.startsWith('e_')?lastPlayerTeam:currentEnemyTeam;
    const enemyDied=deadUnit.id?.startsWith('p_');
    for(const caster of scenarioAlive(currentEnemyTeam)){
        if(!caster.scenarioTrait)return;
        const tr=caster.scenarioTrait;
        if(tr.trigger.type!==(enemyDied?'on_enemy_defeat':'on_ally_defeat'))continue;
        const stat=SCENARIO_STATS[tr.effects?.[0]?.stat];if(!stat)continue;
        const stacks=caster.scenarioEventStacks||0;
        if(stacks>=2)continue;
        caster.scenarioEventStacks=stacks+1;
        if(!caster.scenarioTraitStacks)caster.scenarioTraitStacks={};
        caster.scenarioTraitStacks[stat]=(caster.scenarioTraitStacks[stat]||0)+tr.effects[0].value;
        addLog(`[특성] ${caster.name} ${tr.name} 발동! ${stat} +${tr.effects[0].value}`,'log-buff');
    }
}
function scenarioPeriodicTrait(caster,time,sec){
    const tr=caster.scenarioTrait;
    if(!tr||tr.trigger.type!=='periodic'||!sec||sec%tr.trigger.intervalSec!==0||caster.scenarioLastPeriodic===sec)return;
    caster.scenarioLastPeriodic=sec;
    const allies=scenarioAlive(currentEnemyTeam);
    const others=tr.effects[0].target==='lowest_hp_other_ally'?allies.filter(a=>a!==caster):allies;
    if(!others.length)return;
    const target=[...others].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
    const actual=scenarioHeal(target,target.maxHp*tr.effects[0].value/100);
    if(actual)addLog(`[특성] ${caster.name} ${tr.name}! ${target.name} 체력 +${actual}`,'log-buff');
}
function scenarioExecuteSkill(unit,skill,allies,enemies,time,playerTeam,enemyTeam){
    const original=unit.scenarioSkill;
    if(!original || unit.hp<=0)return 0;
    const targetList=scenarioSkillTargets(unit,original,allies,enemies);
    if(!targetList.length)return 0;
    const support=['ally_all','ally_lowest_hp_ratio','self'].includes(original.target);
    const kind=original.type==='물리'?'physical':original.type==='책략'?'strategy':'fixed';
    const rowAOE=targetList.length>1;
    const rowAOEMult=({1:1,2:.90,3:.80,4:.70,5:.65})[Math.min(5,targetList.length)]||1;
    let gold=0;const logs=[];
    addLog(`[${unit.name}] 고유 기술 [${original.name}] 발동!`,support?'log-buff':'log-skill');
    showUniqueSkillBanner(unit,{name:original.name,isUnique:true});
    let hitOnceUsed=false;
    for(let strike=0;strike<(support?1:Math.max(1,original.attackCount||1));strike++){
        for(const target of targetList){
            if(!target||target.hp<=0)continue;
            if(support){
                // 아군 대상으로 지정된 기술은 절대 공격/피해 경로를 통과시키지 않는다.
                for(const ef of original.runtimeEffects||[])if(ef.phase==='support')scenarioEffectApply(ef,unit,target,time,original,logs);
                scenarioHealthBar(target);continue;
            }
            const atkHit=getStat(unit,'hit',allies,time);
            const defDodge=getStat(target,'dodge',enemies,time);
            const traitHit=scenarioAttackModifier(unit,target,allies,enemies,kind,time,'accuracy_points');
            const hitRate=Math.min(100,Math.max(20,original.acc+atkHit+traitHit-defDodge));
            if(Math.random()*100>=hitRate){
                battleFXHit(unit,target,0,original.type,false,true);
                if(isPlayableUnit(target)&&target.name==='공손찬'&&unit.hp>0){
                    const targetTeam=playerTeam.includes(unit)?playerTeam:enemyTeam;
                    let reflect=immuneToPlayerFixedDamage(unit,targetTeam,'고정피해')?0:20;
                    reflect=playableLeathalGuard(unit,reflect,time);
                    unit.hp=Math.max(0,unit.hp-reflect);
                    target.totalDamage=(target.totalDamage||0)+reflect;
                    if(reflect>0)addLog(`[특성] 공손찬 회피 반격! [${unit.name}] 고정피해 ${reflect}`,'log-attack');
                    if(unit.hp<=0)gold+=processKillEvents(target,unit,playerTeam,enemyTeam,time);
                }
                continue;
            }
            let val=original.power;
            const force=getStat(unit,'force',allies,time),intel=getStat(unit,'intel',allies,time);
            const targetCmd=getStat(target,'cmd',enemies,time),targetPol=getStat(target,'pol',enemies,time);
            let blockedCommand=scenarioAttackModifier(unit,target,allies,enemies,kind,time,'ignore_target_command_pct');
            if(kind==='physical')val=val*force/(100+targetCmd*(1-blockedCommand/100));
            else if(kind==='strategy')val=val*intel/(100+targetPol);
            let critChance=0.05+scenarioAttackModifier(unit,target,allies,enemies,kind,time,'crit_chance_points')/100;
            for(const b of unit.buffs)if(b.stat==='crit_up')critChance+=b.amount/100;
            let crit=kind!=='fixed'&&Math.random()<critChance;
            if(crit&&(target.buffs.some(b=>b.stat==='anti_crit')||['허저','하후상'].includes(target.name)||(target.name==='고순'&&!isPlayableUnit(target))))crit=false;
            if(crit)val*=1.3;
            val*=1+scenarioAttackModifier(unit,target,allies,enemies,kind,time,'final_damage_pct')/100;
            const buffs=unit.buffs;
            for(let i=buffs.length-1;i>=0;i--){
                const b=buffs[i];
                if(b.stat==='dmg_up')val*=1+b.amount/100;
                if(b.stat==='dmg_dealt_down')val*=Math.max(0,1-b.amount/100);
                if(b.stat==='next_dmg_up'){val*=1+b.amount/100;buffs.splice(i,1);}
                if(b.stat==='next_dmg_down'){val*=Math.max(0,1-b.amount/100);buffs.splice(i,1);}
            }
            if(rowAOE)val*=rowAOEMult;
            val*=scenarioTakenModifier(target,enemies,allies,kind,time);
            for(let i=target.buffs.length-1;i>=0;i--){
                const b=target.buffs[i];
                if(b.stat==='dmg_taken_down')val*=Math.max(0,1-b.amount/100);
                if(b.stat==='dmg_taken_up'||b.stat==='dmg_taken_up_next')val*=1+b.amount/100;
                if(b.stat==='scenario_magic_vuln'&&kind==='strategy')val*=1+b.amount/100;
                if(b.stat==='phys_reduce'&&kind==='physical')val*=Math.max(0,1-(b.amount||20)/100);
                if(b.stat==='magic_reduce'&&kind==='strategy')val*=Math.max(0,1-b.amount/100);
                if(b.stat==='shield_next' && kind!=='fixed'){val*=0.7;target.buffs.splice(i,1);}
                if(b.stat==='next_dmg_taken_down_50'){val*=0.5;target.buffs.splice(i,1);}
            }
            if(target.buffs.some(b=>b.stat==='yileng'))val*=1.1;
            if(target.buffs.some(b=>b.stat==='lianhuan')&&kind==='strategy')val*=1.15;
            if(target.buffs.some(b=>b.stat==='kanze'))val*=0.9;
            if(target.buffs.some(b=>b.stat==='alliance_shield'))val*=Math.pow(.9,target.buffs.filter(b=>b.stat==='alliance_shield').length);
            if(target.name==='장익'&&kind==='physical'&&target.hp/target.maxHp<=.5)val*=.9;
            if(target.name==='왕평'&&kind==='physical'&&target.hp/target.maxHp<=.5)val*=.9;
            if(target.name==='허저'&&kind==='physical'&&target.hp/target.maxHp<=.3)val*=.5;
            if(target.name==='서황'&&kind==='physical'&&target.hp/target.maxHp<=.1)val*=.5;
            if(target.name==='주태'&&!isPlayableUnit(target)&&target.hp/target.maxHp<=.3)val*=.9;
            if(enemies.some(a=>a.name==='순욱'&&a.hp>0))val*=enemies.some(a=>a.name==='순욱'&&isPlayableUnit(a)&&a.hp>0)?.85:.90;
            if(target.id?.startsWith('p_')&&enemies.some(a=>a.name==='보즐'&&isPlayableUnit(a)&&a.hp>0&&a.currentCooldown>0))val*=.90;
            if(isPlayableUnit(target)&&target.name==='한당')val*=1-.08*Math.min(6,enemies.filter(a=>a.hp>0).length);
            if(kind==='strategy'&&enemies.some(a=>a.name==='고옹'&&isPlayableUnit(a)&&a.hp>0))val*=.9;
            if(target.id?.startsWith('p_')&&typeof battleFormationId!=='undefined'&&battleFormationId==='bangwon')val*=.9;
            if(target.id?.startsWith('p_')&&hasTreasure('손자병법'))val*=.95;
            if(target.id?.startsWith('p_')&&typeof hasTreasure==='function'&&hasTreasure('팔진도 진법서')&&scenarioAlive(playerTeam).length>=4)val*=.95;
            if(typeof activeBondsInBattle!=='undefined'){
                if(target.id?.startsWith('p_')&&activeBondsInBattle.includes('도원결의')&&['유비','관우','장비'].includes(target.name))val*=.9;
                if(target.id?.startsWith('p_')&&activeBondsInBattle.includes('합비봉쇄')&&['장료','악진','이전'].includes(target.name))val*=.8;
            }
            let damage=Math.max(0,Math.min(300,Math.floor(val)));
            if(kind==='fixed'&&immuneToPlayerFixedDamage(target,enemies,'고정피해'))damage=0;
            damage=playableLeathalGuard(target,damage,time);
            target.hp=Math.max(0,target.hp-damage);
            if(target.hp>0)triggerGuoHuaiPassive(target,time);
            unit.totalDamage=(unit.totalDamage||0)+damage;
            if(isPlayableUnit(target)&&target.name==='전위'&&damage>0&&unit.hp>0){
                let reflected=Math.floor(damage/3);
                const unitTeam=playerTeam.includes(unit)?playerTeam:enemyTeam;
                if(immuneToPlayerFixedDamage(unit,unitTeam,'고정피해'))reflected=0;
                reflected=playableLeathalGuard(unit,reflected,time);
                unit.hp=Math.max(0,unit.hp-reflected);
                if(reflected){target.totalDamage=(target.totalDamage||0)+reflected;logs.push(`[전위 반격 ${reflected}]`);}
                if(unit.hp<=0)gold+=processKillEvents(target,unit,playerTeam,enemyTeam,time);
            }
            battleFXHit(unit,target,damage,original.type,crit);
            scenarioHealthBar(target);
            logs.push(`[${target.name} ${damage} 피해${crit?' 치명타':''}]`);
            scenarioOnHitTrait(unit,target,allies,enemies,original,time);
            for(const ef of original.runtimeEffects||[])if(ef.phase==='hit')scenarioEffectApply(ef,unit,target,time,original,logs);
            if(!hitOnceUsed){for(const ef of original.runtimeEffects||[])if(ef.phase==='hit_once')scenarioEffectApply(ef,unit,target,time,original,logs);hitOnceUsed=true;}
            if(target.hp<=0){
                gold+=processKillEvents(unit,target,enemyTeam,playerTeam,time);
                for(const ef of original.runtimeEffects||[])if(ef.phase==='kill')scenarioEffectApply(ef,unit,unit,time,original,logs);
            }
            if(!scenarioAlive(playerTeam).length || forcedScenarioVictory)break;
        }
        if(!scenarioAlive(playerTeam).length || forcedScenarioVictory)break;
    }
    for(const ef of original.runtimeEffects||[])if(ef.phase==='use')scenarioEffectApply(ef,unit,unit,time,original,logs);
    if(kind==='physical')unit.scenarioFirstPhysicalUsed=true;
    if(logs.length)addLog(`[${unit.name}] ${logs.join(' ')}`,support?'log-buff':'log-skill');
    scenarioHealthBar(unit);
    updateDamageMeters(playerTeam,enemyTeam);
    return gold;
}
// 이전 버전의 지도 저장 데이터에 남아 있는 적군 기술을 현 버전으로 갱신한다.
function scenarioHydrateSavedEnemies(team, round){
    const slots=CUSTOM_ENEMY_DATA.rounds[String(round)];
    if(!slots||!Array.isArray(team))return;
    const options=slots.flatMap(s=>s.options);
    for(const unit of team){
        if(!unit.enemyId)continue;
        const d=options.find(e=>e.enemyId===unit.enemyId&&e.name===unit.name);
        if(!d)continue;
        const s=d.stats,k=d.skill;
        Object.assign(unit,{name:d.name,tier:d.tier,force:s.force,intel:s.intel,cmd:s.command,pol:s.politics,
            maxHp:s.hp,hp:Number.isFinite(unit.battleRemainingHp)?Math.max(0,Math.min(s.hp,unit.battleRemainingHp)):s.hp,dodge:s.dodge,hit:s.accuracy,cooldown:k.cooldownSec,
            trait:d.trait.description,scenarioTrait:d.trait,scenarioSkill:k,
            skills:[{name:k.name,type:k.type,power:k.power,acc:k.acc,desc:k.desc,
                target:k.target,attackCount:k.attackCount}],
            bounty:({D:0,C:0,B:1,A:2,S:3,SS:4})[d.tier]||0});
    }
}
