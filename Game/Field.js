import { Transform } from '../lib/threeD.js';

export class Field {
	constructor(m = 2, n = 3, radius = 20) {
		this.numOfPlayers = m;
		this.numOfSides = n;

		this.centerX = 0.0;
		this.centerY = 0.0;
		this.centerZ = -2.0;
		this.radius = radius;
		this.vertexPositions = [];
		this.angleBetweenTwoVertices = 2 * Math.PI / this.numOfSides;

		this.vertexPosition = []; //getting all the vertex positions of the polygon
		this.vertexPositions = [];
		this.updateField();
		this.transform = new Transform()
		this.color=[0.5,0.5,0.5,1];
		this.type="normal";
		console.log(this);
	}
	updateField(){
		//reset vertices and calculate new ones.
		this.vertexPosition=[]
		this.vertexPositions=[];
		for (let i = 0; i < this.numOfSides; i++) {
			let angle = i * this.angleBetweenTwoVertices;
			let v = [this.centerX + this.radius * (Math.cos(angle)), this.centerY + this.radius * (Math.sin(angle)), this.centerZ]
			this.vertexPosition.push(v);
		}
		this.vertexPosition.push([this.centerX + this.radius * (Math.cos(0)), this.centerY + this.radius * (Math.sin(0)), this.centerZ])
		for (let i = 0; i < this.vertexPosition.length - 1; i++) {
			this.vertexPositions = this.vertexPositions.concat(this.centerX, this.centerY, this.centerZ);
			this.vertexPositions = this.vertexPositions.concat(this.vertexPosition[i]);
			this.vertexPositions = this.vertexPositions.concat(this.vertexPosition[i + 1]);
		}
		this.vertexPositions = new Float32Array(this.vertexPositions);
	}
	changeAngleBetweenVertices(){
		this.angleBetweenTwoVertices = 2 * Math.PI / this.numOfSides;
	}
	setNumOfPlayers(numOfPlayers) {
		this.numOfPlayers = numOfPlayers;
	}
	setNumOfSides(numOfSides) {
		this.numOfSides = numOfSides;
		this.changeAngleBetweenVertices();
		this.updateField();
	}
}