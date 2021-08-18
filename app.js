const monsterHealthBar=document.getElementById('monster-health');
const playerHealthBar=document.getElementById('player-health');
const bonusLife=document.getElementById('bonus-life');

const attackBtn=document.getElementById('attack-btn');
const strongAttackBtn=document.getElementById('strong-attack-btn');
const healBtn=document.getElementById('heal-btn');
const logBtn=document.getElementById('log-btn');


/** Functions Adjusting UI  **/

function adjustHealthBars(maxLife)
{
    monsterHealthBar.max=maxLife;
    monsterHealthBar.value=maxLife;
    playerHealthBar.max=maxLife;
    playerHealthBar.value=maxLife;
}

function dealMonsterDamage(damage)
{
    const dealtDamage=Math.random()*damage;
    monsterHealthBar.value= +monsterHealthBar.value-dealtDamage;
    return dealtDamage;
}

function dealPlayerDamage(damage)
{
    const dealtDamage=Math.random()*damage;
    playerHealthBar.value= +playerHealthBar.value-dealtDamage;
    return dealtDamage;
}

function increasePlayerHealth(healValue){
    playerHealthBar.value= +playerHealthBar.value+healValue;
}

function resetGame(value){
    playerHealthBar.value=value;
    monsterHealthBar.value=value;
}

function removeBonusLife()
{
    bonusLife.parentNode.removeChild(bonusLife);
}

function setPlayerHealth(health)
{
    playerHealthBar.value=health;
}
 

/***  Controls ***/

const ATTACK_VALUE=10;
const STRONG_ATTACK_VALUE=15;
const MONSTER_ATTACK_VALUE=14;
const HEAL_VALUE=20;
const MODE_ATTACK='ATTACK';
const MODE_STRONG_ATTACK='STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK='PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK='PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK='MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL='PLAYER_HEAL';
const LOG_EVENT_GAME_OVER='GAME_OVER';

let enteredValue=prompt('Enter max Health value for you and monster','100');
let chosenHealthValue=parseInt(enteredValue);
if(chosenHealthValue<=0 || isNaN(chosenHealthValue))
{
    chosenHealthValue=100;
}

let currentMonsterHealth=chosenHealthValue;
let currentPlayerHealth=chosenHealthValue;
let hasBonusLife=true;

let battleLog=[];
function writeToLog(ev,val,monsterHealth,playerHealth)
{
    let logEntry={
        event:ev,
        value:val,
        finalMonsterHealth:monsterHealth,
        finalPlayerHealth:playerHealth
    };
    if(ev===LOG_EVENT_PLAYER_ATTACK)
    {
        logEntry.target='MONSTER';
    }
    else if(ev===LOG_EVENT_PLAYER_STRONG_ATTACK)
    {
        logEntry.target='MONSTER';
    }
    else if(ev===LOG_EVENT_MONSTER_ATTACK)
    {
        logEntry.target='PLAYER';
    }
    else if(ev===LOG_EVENT_PLAYER_HEAL)
    {
        logEntry.target='PLAYER';
    }
    battleLog.push(logEntry);


}
function reset()
{
    currentPlayerHealth=chosenHealthValue;
    currentMonsterHealth=chosenHealthValue;
    resetGame(chosenHealthValue);
}
function endGame()
{
    let playerDamage=dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth-=playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,currentMonsterHealth,currentPlayerHealth);
    if(currentPlayerHealth<=0 && hasBonusLife)
    {
        hasBonusLife=false;
        removeBonusLife();
        currentPlayerHealth+=playerDamage;
        setPlayerHealth(currentPlayerHealth);
        alert('Bonus Life save you currently');
    }
    if(currentMonsterHealth<=0 && currentPlayerHealth>0)
    {
        alert('You Won!');
        writeToLog(LOG_EVENT_GAME_OVER,'PLAYER WON',currentMonsterHealth,currentPlayerHealth);
    }
    else if(currentPlayerHealth<=0 && currentMonsterHealth>0)
    {
        alert('You Lost!');
        writeToLog(LOG_EVENT_GAME_OVER,'MONSTER WON',currentMonsterHealth,currentPlayerHealth);
    }
    else if(currentMonsterHealth<=0 && currentPlayerHealth<=0)
    {
        alert('It\'s a Draw!');
        writeToLog(LOG_EVENT_GAME_OVER,'A DRAW',currentMonsterHealth,currentPlayerHealth);
    }

    if(currentMonsterHealth<=0 || currentPlayerHealth<=0)
    {
        reset();
    }
}
function attackHelper(mode)
{
    let maxDamage;
    let logEvent;
    if(mode===MODE_ATTACK)
    {
        maxDamage=ATTACK_VALUE;
        logEvent=LOG_EVENT_PLAYER_ATTACK;
    }
    else if(mode===MODE_STRONG_ATTACK)
    {
        maxDamage=STRONG_ATTACK_VALUE;
        logEvent=LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    let damage=dealMonsterDamage(maxDamage);
    currentMonsterHealth-=damage;

    writeToLog(logEvent,damage,currentMonsterHealth,currentPlayerHealth);
    endGame();
}
function onAttack()
{
    attackHelper(MODE_ATTACK);
}

function onStrongAttack()
{
    attackHelper(MODE_STRONG_ATTACK);
}

function healPlayer(){
    let healValue;
    if(currentPlayerHealth+HEAL_VALUE>chosenHealthValue)
    {
        alert('Max Health reached');
        healValue=chosenHealthValue-currentPlayerHealth;
    }
    else
    {
        healValue=HEAL_VALUE;
    }
    currentPlayerHealth+=healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);
    increasePlayerHealth(healValue);
    endGame();
}
function printLog()
{
    console.log(battleLog);
}
attackBtn.addEventListener('click',onAttack);
strongAttackBtn.addEventListener('click',onStrongAttack);
healBtn.addEventListener('click',healPlayer);
logBtn.addEventListener('click',printLog);