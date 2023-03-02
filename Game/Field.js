import {Transform} from '../lib/threeD.js';

export class Field{
	constructor(m=2,n=3){
		this.numOfPlayers=m;
		this.numOfSides=n;

	}
	setNumOfPlayers(numOfPlayers){
		this.numOfPlayers=numOfPlayers;
	}
	setNumOfSides(numOfSides){
		this.numOfSides=numOfSides;
	}
}