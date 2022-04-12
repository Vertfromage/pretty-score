import { context, PersistentVector, PersistentMap } from "near-sdk-as";

/** 
 * Exporting a new class HighScore so it can be used outside of this file.
 */
 @nearBindgen
 export class HighScore {
   player: string;
   constructor(public score: u32) {
     this.player = context.sender;
   }
 }

 /**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 * // Unsorted array of 10 biggest scores
 */
export const highScoreList = new PersistentVector<HighScore>("s");

export const levelsMap = new PersistentMap<u32,string>("l");