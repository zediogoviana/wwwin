import {
  AGE_EFFECT, ATTACK_FACTOR, FAULT_FACTOR,
  FORM_EFFECT, LUCK_FACTOR, MINIMAL_FORM,
  PLAYING_STYLE_EFFECT,
  RED_CARD_EFFECT, REFEREE_PERSONALITY_FACTOR, REFEREE_RED_CARD, SCORE_FACTOR,
  SUPPORTERS_EFFECT,
  TIME_EFFECT,
} from './ConstantVars';

function sumAge(total, player) {
  return total + new Date().getFullYear() - player.birthYear;
}

function sumAttackers(total, player) {
  return total + player.attack;
}

function sumDefenders(total, player) {
  return total + player.attack;
}

function sumMeanValue(total, player) {
  return total + ((player.attack + player.defense) / 2);
}

function filterAttackers(player) {
  return player.position === 'A';
}

function filterDefenders(player) {
  return player.position === 'D';
}

export function getMeanAge(starting11) {
  const flattenTeam = [].concat(...starting11);
  const sum = flattenTeam.reduce(sumAge, 0);

  return (sum / flattenTeam.length);
}

export function getAttack(starting11) {
  const flattenTeam = [].concat(...starting11);
  const attackers = flattenTeam.filter(filterAttackers);
  const sumAttack = attackers.reduce(sumAttackers, 0);

  return (sumAttack / attackers.length);
}

export function getMeanAttackingValue(starting11) {
  const flattenTeam = [].concat(...starting11);
  const sumAttack = flattenTeam.reduce(sumAttackers, 0);

  return (sumAttack / flattenTeam.length);
}


export function getDefence(starting11) {
  const flattenTeam = [].concat(...starting11);
  const defenders = flattenTeam.filter(filterDefenders);
  const sumDefend = defenders.reduce(sumDefenders, 0);

  return (sumDefend / defenders.length);
}

export function getMeanValue(starting11) {
  const flattenTeam = [].concat(...starting11);
  const sumMean = flattenTeam.reduce(sumMeanValue, 0);

  return (sumMean / flattenTeam.length);
}

export function redCardsEffect(redCards, minute) {
  return redCards * RED_CARD_EFFECT * minute * TIME_EFFECT;
}

export function formEffect(form) {
  return form * FORM_EFFECT;
}

export function playingStyleEffect(playingStyle) {
  return (
    -playingStyle * PLAYING_STYLE_EFFECT // Attack
    + (100 - playingStyle * PLAYING_STYLE_EFFECT) // Defence
  );
}

export function supportersEffect(supporters) {
  return supporters * SUPPORTERS_EFFECT;
}

export function ageEffect(starting11, minute) {
  return (getMeanAge(starting11) * AGE_EFFECT) * (minute * TIME_EFFECT);
}

export function calculateAttack(team, minute, redCards) {
  let attack = 0;
  // Value of Attack
  attack += (getAttack(team.starting11) * 0.75) + (getMeanValue(team.starting11) * 0.25);
  // Time Effect on Age
  attack -= ageEffect(team.starting11, minute);

  // Time Effect on Suspensions
  attack -= redCardsEffect(redCards, minute);

  // Supporters Rate Effect
  attack += supportersEffect(team.supporters);

  // Form Rate Effect - High Form increases chances of goal
  // If form good it increases chances of scoring/starting attack
  if (team.form > MINIMAL_FORM) attack += formEffect(team.form);
  else attack -= formEffect(team.form);

  // Playing Style Effect
  // 0: Super Defensive
  // 100: Super Attacking
  attack += playingStyleEffect(team.playingStyle);

  return attack;
}

export function calculateGoal(team, minute, redCards) {
  let goal = 0;

  // Value of Scoring
  goal += (getAttack(team.starting11) * 0.75)
    + (getMeanAttackingValue(team.starting11) * 0.25);

  // Time Effect on Age with time
  goal -= ageEffect(team.starting11, minute);

  // Time Effect on Suspensions
  goal -= redCardsEffect(redCards, minute);

  // Form Rate Effect - High Form increases chances of goal
  // If form good it increases chances of scoring/starting attack
  if (team.form > MINIMAL_FORM) goal += formEffect(team.form);
  else goal -= formEffect(team.form);

  return goal;
}

export function calculateDefend(team, minute, redCards) {
  let defense = 0;

  // Value of Defence
  defense += (getDefence(team.starting11) * 0.75)
    + (getMeanValue(team.starting11) * 0.25);

  // Time Effect on Age with time
  defense -= ageEffect(team.starting11, minute);

  // Time Effect on Suspensions
  defense -= redCardsEffect(redCards, minute);

  // Supporters Rate Effect
  defense += supportersEffect(team.supporters);

  // Form Rate Effect
  defense += formEffect(team.form);

  // Playing Style Effect
  // 0: Super Defensive
  // 100: Super Attacking
  // More attack less defense
  defense += playingStyleEffect(team.playingStyle);

  return defense;
}

// Calculate what team starts an attack
export function startsAttack(teams, game) {
  // Value of attack of each team
  const homeTeamStartAttack = calculateAttack(teams.home, game.minute, game.home.redCards);
  const awayTeamStartAttack = calculateAttack(teams.away, game.minute, game.away.redCards);

  // Random Factoring
  const probHome = homeTeamStartAttack / (Math.random() * 100);
  const probAway = awayTeamStartAttack / (Math.random() * 100);

  if ((probHome > probAway) && probHome > SCORE_FACTOR) {
    return 'home';
  } if ((probAway > probHome) && probAway > SCORE_FACTOR) {
    return 'away';
  }
  return null;
}


// Calculate if defending team is able to stop goal
export function defendAttack(attackingTeam, defendingTeam, game) {
  const attSuspensions = game[attackingTeam.type].redCards;
  const defSuspensions = game[defendingTeam.type].redCards;

  // Value of team defending attack
  const defend = calculateDefend(defendingTeam, game.minute, defSuspensions);

  // Value of team scoring goal
  const score = calculateGoal(attackingTeam, game.minute, attSuspensions);

  // Random factoring and Luck factor
  const scoreProb = score / (Math.random() * 100);
  const defendProb = defend / (Math.random() * 100) + LUCK_FACTOR;

  return !(scoreProb > defendProb) || !(scoreProb > SCORE_FACTOR);
}


export function faultEvent(referee, teams, game) {
  // TODO set state do game
  const redCard = referee * Math.random() * REFEREE_PERSONALITY_FACTOR;

  // If is likely to send off
  if (redCard > REFEREE_RED_CARD) {
    // Randomly Pick Team
    if (Math.random() > 0.5) {
      // eslint-disable-next-line no-param-reassign
      game.home.redCards += 1;
      game.log.push({ type: 'red', value: `${game.minute}'' [RED CARD] ${teams.home.name}` });
    } else {
      // eslint-disable-next-line no-param-reassign
      game.away.redCards += 1;
      game.log.push({ type: 'red', value: `${game.minute}'' [RED CARD] ${teams.away.name}` });
    }
  }
}


export function attackEvent(teams, game) {
  // TODO set state do game
  // Get team that starts an attack
  const attackingTeam = startsAttack(teams, game);
  const defendingTeam = attackingTeam === 'away' ? 'home' : 'away';

  // If there will start an attack
  if (attackingTeam != null) {
    if (!defendAttack(teams[attackingTeam], teams[defendingTeam], game)) {
      game.log.push({ type: 'goal', value: `${game.minute}'' [GOAL] ${teams[attackingTeam].name}` });
      // eslint-disable-next-line no-param-reassign
      game[attackingTeam].goals += 1;
    } else {
      game.log.push({ type: 'failed', value: `${game.minute}'' [FAILED] ${teams[attackingTeam].name}` });
    }
  }
}

// Game Simulation
export function startSimulation(teams, game, referee) {
  game.log.push({ type: 'game', value: '[GAME STARTED]' });
  // 90 minutes Game
  // eslint-disable-next-line no-plusplus
  for (let minute = 0; minute < 90; minute++) {
    // eslint-disable-next-line no-param-reassign
    game.minute = minute;
    // What happens in this minute?
    const action = Math.random();
    // Fault
    if (action < FAULT_FACTOR) {
      faultEvent(referee, teams, game);
    }
    // Attack
    if (action > ATTACK_FACTOR) {
      attackEvent(teams, game);
    }
    // Otherwise nothing happens
    if (minute === 45) {
      game.log.push({ type: 'game', value: '[BREAK]' });
    }
  }
  game.log.push({ type: 'game', value: '[GAME ENDED]' });
}
