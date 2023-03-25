import {vec3,mat4, quat} from "../lib/threeD.js";
import {Field} from "./Field.js";
import {Model} from "../models/Model.js";

export class Scene
{
	constructor(width, height,numPlayers,numSides)
	{
		this.field= new Field(numPlayers,numSides,5);
		this.numPlayers=numPlayers;
		this.models = []
		this.mode=1;
		this.cameraChange=false;

		this.zoom=vec3.create();
		vec3.set(this.zoom,1,1,1);
		//Keeping the view and projection matrices in the scene as they are global properties and apply to all models.
		this.eyeVector=vec3.create();
		this.eyeVector2=vec3.create();
		vec3.set(this.eyeVector,0,0,10)
		vec3.set(this.eyeVector2,0,-10,0)

		this.upVector=vec3.create();
		this.upVector2=vec3.create();
		vec3.set(this.upVector,0,1,0);
		vec3.set(this.upVector2,0,0,1);

		this.centerVector=vec3.create();
		this.centerVector2=vec3.create();
		vec3.set(this.centerVector,0,0,0);
		vec3.set(this.centerVector2,0,0,0);

		this.globalRotationAxis=vec3.create();
		this.localViewMatrix=mat4.create();
		this.globalViewMatrix=mat4.create();
		mat4.lookAt(this.localViewMatrix,this.eyeVector,this.centerVector,this.upVector);
		mat4.lookAt(this.globalViewMatrix,this.eyeVector2,this.centerVector2,this.upVector2);
		this.viewMatrix=mat4.create();

		this.rotationQuaternion=quat.create();
		this.near=1e-4;
		this.far=1e10;
		this.projectionMatrix=mat4.create();
		mat4.perspective(this.projectionMatrix,75*Math.PI/180,width/height,this.near,this.far);
		
		this.modelPresent=new Array(numSides).fill(false);
		this.modelPathname=["../models-blender/Sculpt/Sculpt.obj","../models-blender/Intersection/Intersection.obj","../models-blender/CutExtrude/CutExtrude.obj"]
		this.initialiseField();
		this.loadAllModels();
		this.playerSelected=-1;

		this.modelSelected="";
		this.modelAtDestination="";
		this.start=-1;
		this.startD=-1;
		this.destD=-1;
		this.catcherLength=-1;
		this.playerLength=-1;
	}
	getFreePositionInField(num=0){
		let pos=Math.floor(Math.random()*this.modelPresent.length);
		while(this.modelPresent[pos]===true){
			pos=Math.floor(Math.random()*this.modelPresent.length);
		}
		num===0?this.modelPresent[pos]=true:"";
		return pos;
	}
	initialiseField(){
		for(let i=0;i<this.numPlayers;i++){
			let pos=this.getFreePositionInField();
			this.add(new Model([Math.random(),Math.random(),Math.random(),1],this.modelPathname[Math.floor(Math.random()*3)],
			this.field.vertexPosition[pos],pos));
		}
	}
	addExtraModels(m){
		for(let i=0;i<m;i++){
			let pos=this.getFreePositionInField();
			this.add(new Model([Math.random(),Math.random(),Math.random(),1],this.modelPathname[Math.floor(Math.random()*3)],
			this.field.vertexPosition[pos],pos));
		}
	}
	setNumOfSides(n){
		this.field.setNumOfSides(n);
		this.modelPresent=new Array(n).fill(false);
		for(let i=0;i<this.models.length;i++){
			let pos=this.getFreePositionInField();
			this.models[i].updatePosition(this.field.vertexPosition[pos],pos);
		}
	}
	setNumOfPlayers(m){
		this.field.setNumOfPlayers(m);
		if(m===this.numPlayers){
			return;
		}
		else if(m<this.numPlayers){
			let excess=this.numPlayers-m;
			this.numPlayers=m;
			for(let i=0;i<excess; i++){
				let temp=this.models.pop();
				for(let j=0;j<this.field.vertexPosition.length-1;j++){
					if(temp.position===this.field.vertexPosition[j]){
						this.modelPresent[j]=false;
					}
				}
			}
		}
		else if(m>this.numPlayers){
			let excess=m-this.numPlayers;
			this.addExtraModels(excess);
			this.allModelsLoaded=false;
			this.loadExtraModels(excess);
			this.numPlayers=m;
		}
	}
	async loadAllModels(){
		for(let i=0;i<this.models.length;i++){
			const response=await this.models[i].loadModel();
			console.log(response);
			if(i===0) this.modelsLoaded=response;
			else this.modelsLoaded&=response;
		}
		this.allModelsLoaded=true & this.modelsLoaded;
		// return response;
	}
	async loadExtraModels(excess){
		for(let i=this.numPlayers;i<this.models.length;i++){
			const response=await this.models[i].loadModel();
			this.modelsLoaded&=response;
		}
		this.allModelsLoaded=true & this.modelsLoaded;
		// return response;
	}

	add(model)
	{
		if( this.models && model )
		{
			this.models.push(model)
			// console.log(model)
		}
	}
	globalTrackball(initialCoordinates,finalCoordinates){
		let theta=vec3.angle(initialCoordinates,finalCoordinates)*2.5;
		vec3.cross(this.globalRotationAxis,initialCoordinates,finalCoordinates);
		let tempquat=quat.create();
		quat.setAxisAngle(tempquat,this.globalRotationAxis,theta);
		quat.normalize(tempquat,tempquat);
		quat.multiply(this.rotationQuaternion,this.rotationQuaternion,tempquat);
		quat.normalize(this.rotationQuaternion,this.rotationQuaternion);
		const tempMatrix=mat4.create();
		mat4.fromQuat(tempMatrix,this.rotationQuaternion)
		mat4.multiply(this.globalViewMatrix,this.globalViewMatrix,tempMatrix);
	}
	scaleBy(factor){
		vec3.set(this.zoom,factor,factor,factor);
	}
	updateViewMatrix(){
		mat4.identity(this.viewMatrix);
		if(this.mode===1){
			mat4.copy(this.viewMatrix,this.localViewMatrix);
		}
		else{
			mat4.copy(this.viewMatrix,this.globalViewMatrix);
			mat4.scale(this.viewMatrix,this.viewMatrix,this.zoom);
		}
	}
	setQuatIdentity(){
		quat.identity(this.rotationQuaternion);
	}
	processEvent(event){
		console.log(event);
		if(event.key === 'c'){
			this.mode= this.mode===1? 2:1;
			this.cameraChange=true;
		}
		else if(event.key==='x' && this.playerSelected>=0){
			this.modelSelected.transform.rotX(this.modelSelected.transform.angleX+(10*Math.PI/180));
			this.modelSelected.arrows[0].transform.rotX(this.modelSelected.transform.angleX+(10*Math.PI/180));
		}
		else if(event.key==='y' && this.playerSelected>=0){
			this.modelSelected.transform.rotY(this.modelSelected.transform.angleY+(10*Math.PI/180));
			this.modelSelected.arrows[0].transform.rotY(this.modelSelected.transform.angleY+(10*Math.PI/180));
		}
		else if(event.key==='z' && this.playerSelected>=0){
			this.modelSelected.transform.rotZ(this.modelSelected.transform.angleZ+(10*Math.PI/180));
			this.modelSelected.arrows[0].transform.rotZ(this.modelSelected.transform.angleZ+(10*Math.PI/180));
		}
		else if(event.key==='r' && this.playerSelected>=0){
			this.modelSelected.reset();
		}
	}
	configureArrow(){
		this.catcherID=Math.floor(Math.random()*(this.modelPresent.length));
		this.startD=this.field.vertexPosition[this.catcherID];
		while(this.startD===this.start){
			this.catcherID=Math.floor(Math.random()*(this.modelPresent.length));
			this.startD=this.field.vertexPosition[this.catcherID];
		}
		if(this.modelPresent[this.catcherID]===true){
			for( let model of this.models){
				if(model.id===this.catcherID){
					this.modelAtDestination=model;
					break;
				}
			}
		}
		this.playerID=this.getFreePositionInField(1);
		this.destD=this.field.vertexPosition[this.playerID];
		this.catcherLength=vec3.distance(this.start,this.startD)
		this.playerLength=vec3.distance(this.startD,this.destD)
		if(this.modelAtDestination!==""){
			this.modelAtDestination.updateCenter(this.destD);
			this.modelAtDestination.transform.translateTo(0,0,-this.playerLength);
			this.modelAtDestination.arrows[0].transform.translateTo(0,0,-this.playerLength);
		}
		this.modelSelected.updateCenter(this.startD);
		this.modelSelected.transform.translateTo(0,0,-this.catcherLength);
		this.modelSelected.arrows[0].transform.translateTo(0,0,-this.catcherLength);
	}
}