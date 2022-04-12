import { Context, logging, storage } from 'near-sdk-as'
import { HighScore, highScoreList, levelsMap } from './model';


const ADMIN = 'vertfromage.testnet';

/**
 * adds value to the score
 * @param value
 */
export function addToScore(value: i32): void {
  const key = Context.sender+"score";
  const newScore = storage.getPrimitive<i32>(key, 0) + value;
  storage.set<i32>(key, newScore);
}

/**
 * gets the score
 * @param accountId
 */
export function getScore(accountId: string): i32 {
  return storage.getPrimitive<i32>(accountId+"score", 0);
}


/**
 * Resets the score
 * @param accountId
 * This should be only reset by me.. and only as necessary
 */
export function resetScore(accountId: string): void {
  if(Context.sender==ADMIN){
    const key = accountId+"score";
    storage.set<i32>(key, 0);
  }
}

// Don't feel like I need this.
// export function subFromScore(value: i32): void {
//   const key = Context.sender+"score";
//   const newScore = storage.getPrimitive<i32>(key, 0) - value;
//   storage.set<i32>(key, newScore);
// }

/* 
* High Score Code
*/
const HIGHSCORE_LIST_SIZE = 10;

/**
 * @param score 
 * if list length less than 10 add score
 * then find smallest score and compare to newScore if newScore is bigger swap
 * 
 */
export function addHighScore(): void {
  // Only add your own highscore
  const key = Context.sender+"score";
  const currScore = storage.getPrimitive<i32>(key, 0);
  const newScore = new HighScore(currScore);
  // until list up to size add score
  if(highScoreList.length < HIGHSCORE_LIST_SIZE){
    highScoreList.push(newScore);
    return;
  }
  // find smallest score in array
  let smallestScoreIndex = 0;
  for(let i=1;i<highScoreList.length;i++){
    if(highScoreList[i].score < highScoreList[smallestScoreIndex].score){
      smallestScoreIndex = i;
    }
  }
  //compare smallest to newScore if newScore is bigger swap
  if(highScoreList[smallestScoreIndex].score<newScore.score){
    highScoreList.replace(smallestScoreIndex,newScore);
  }
}

/*
* Returns an array of highscores, unsorted.
*/
export function getHighScoreList(): HighScore[]{
  const result = new Array<HighScore>(highScoreList.length);
  for(let i = 0; i < highScoreList.length; i++) {
    result[i] = highScoreList[i];
  }
  return result;
}

/**
 * Resets the highscore list by popping all values 
 * should only be called by me.
 */
export function resetHighScoreList(): void{
if(Context.sender==ADMIN){
  while(highScoreList.length>0){
    highScoreList.pop();
  } 
  logging.log("highscore list emptied");
}else{
  logging.log("You aren't the admin.");
}
}

/*
* LEVEL STORING
*/
// idea is to store as strings and in game expand to 2D arrays.
// see jsfiddle for method: https://jsfiddle.net/Vertfromage/3mjac294/6/
const MAXLEVELS = 500;


/**
 * @param level
 * @param levelNum
 * 
 * Sets the level string matching certain levelNum in the levelMap
 * Passes in a level string '0120011913012...' representing a 2D level map
 * TODO check to make sure the context sender owns the pretty punk that matches the level
 */
export function setLevel(level:string,levelNum:u32): void{
  if(levelNum<MAXLEVELS){
    levelsMap.set(levelNum, level);
  }
  logging.log("Level set");
}


/*
* returns level string representing 2D array
*/
export function getLevel(levelNum:u32): string{
  let result = levelsMap.getSome(levelNum);
  return result;
}