
## WWWin

**Who Would Win** is a football simulation engine developed in *React*.

Based on my previous *Java* experience [soccer-simulation-engine](https://github.com/zediogoviana/soccer-simulation-engine).

It takes account the overall value of the players roster, players age, 
the form of the teams, supporters present on the stadium between each teams 
and the team playing style. The referee it is also taken in account, with its personality value.

You can also add your custom players one by one or chunk upload from a ```csv``` file.

### Player variables

* **Overall value:** Highest values, higher chance of scoring or defending with success.
* **Age:** The older the roster, the more "weak" the players get with game time passing by, reducing the chance of scoring or defending. 

### Team variables definition

* **Team form:** `Integer between 0-100`, being `0` the lowest form possible and `100` the highest.
	* Highest values gives more chances of scoring goals and winning.
* **Supporters:** `Integer between 0-100`, being `0` the lowest supporting from fans possible and `100` the highest. 
	* The team with most supporters has some advantage.
* **Playing Style:** `Integer between 0-100`, being `0`the most defensive possible, and `100` the most attacking.
	* A team with a high attacking playing style has more chance of attacking and scoring, but is more vulnerable on the defence side.
	
### Referee variables
* **Personality:** `Integer between 0-100`. The higher a personality value of a referee the stricter he is, and higher the chance of giving a red card to a team.
	* A team with sent off players is eavily penalised.


## Roster Upload

### One by One

You just need to fill in the form with the following info:

* Name
* Position
* Attack Value
* Defence Value
* Year of Birth

### Chunk upload

In order to run you need to use a `csv` file with the infos of each team's players. 
In `resources` folder there is the corresponding files to test.

The `csv` has the following composition:

```
PlayerName,Position,Attack,Defence,DateOfBirth
(...) 
```

Where:
* Position: 
    * ```G```: goal-keeper
    * ```D```: defender
    * ```M```: midfielder
    * ```A```: attacker
    
## Screenshots

**Place screenshots here**

## Future work

* Substitutions
* More realistic simulation 
* Injuries
* Yellow cards and Red cards with accumulation
