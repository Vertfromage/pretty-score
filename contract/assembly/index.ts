import { Context, logging, storage } from 'near-sdk-as'
import { HighScore, highScoreList } from './model';

export function addToScore(value: i32): void {
  const key = Context.sender+"score";
  const newScore = storage.getPrimitive<i32>(key, 0) + value;
  storage.set<i32>(key, newScore);
}
export function subFromScore(value: i32): void {
  const key = Context.sender+"score";
  const newScore = storage.getPrimitive<i32>(key, 0) - value;
  storage.set<i32>(key, newScore);
}
export function getScore(accountId: string): i32 {
  return storage.getPrimitive<i32>(accountId+"score", 0);
}
export function resetScore(): void {
  const key = Context.sender+"score";
  storage.set<i32>(key, 0);
}

// High Score Code

const HIGHSCORE_LIST_SIZE = 10;

/**
 * 
 * @param score 
 * if list length less than 10 add score
 * then find smallest score and compare to newScore if newScore is bigger swap
 */
export function addHighScore(score: u32): void {
  const newScore = new HighScore(score);
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


export function resetHighScoreList(): void{
 while(highScoreList.length>0){
   highScoreList.pop();
 } 
}