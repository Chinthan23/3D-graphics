import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import {vec3,mat4, quat} from "../lib/threeD.js";
import {Field} from "./Field.js";
import {Model} from "../models/Model.js";

export class Scene
{
	constructor(width, height,numPlayers,numSides)
	{
		this.field= new Field(numPlayers,numSides,8);
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
		vec3.set(this.eyeVector2,0,-15,0)

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
		this.modelText=new Array(this.modelPathname.length);
		this.loadAllModels();

		this.modelSelected="";
		this.modelAtDestination="";
		console.log(this);
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
			this.add(new Model([Math.random(),Math.random(),Math.random(),1],this.modelText[Math.floor(Math.random()*3)],this.field.vertexPosition[pos],pos));
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
			for(let i=0;i<excess; i++){
				let temp=this.models.pop();
				this.modelPresent[temp.id]=false;
			}
		}
		else if(m>this.numPlayers){
			let excess=m-this.numPlayers;
			for(let i=0;i<excess;i++){
				let pos=this.getFreePositionInField();
				this.add(new Model([Math.random(),Math.random(),Math.random(),1],this.modelText[Math.floor(Math.random()*3)],this.field.vertexPosition[pos],pos));
			}
		}
		this.numPlayers=m;
	}
	async loadAllModels(){
		for(let i=0;i<this.modelPathname.length;i++){
			const response= await fetch(this.modelPathname[i]);
			const text=await response.text();
			this.modelText[i]=text;
			if(i===0) this.modelsLoaded=response.ok;
			else this.modelsLoaded&=response.ok;
		}
		if(this.modelsLoaded) this.initialiseField();
	}
	add(model)
	{
		if( this.models && model ) this.models.push(model)
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
		else if(event.key==='x' && typeof this.modelSelected === 'object'){
			this.modelSelected.transform.rotX(this.modelSelected.transform.angleX+(10*Math.PI/180));
		}
		else if(event.key==='y' && typeof this.modelSelected === 'object'){
			this.modelSelected.transform.rotY(this.modelSelected.transform.angleY+(10*Math.PI/180));
		}
		else if(event.key==='z' && typeof this.modelSelected === 'object'){
			this.modelSelected.transform.rotZ(this.modelSelected.transform.angleZ+(10*Math.PI/180));
		}
		else if(event.key==='r' && typeof this.modelSelected === 'object'){
			this.modelSelected.reset();
		}
	}
	configurePlayers(model){
		this.modelSelected=model;
		this.modelSelected.configureCatcherMove(this.field.vertexPosition,this.field.numOfSides);
		if(this.modelPresent[this.modelSelected.destID]===true){
			for( let model of this.models){
				if(model.id===this.modelSelected.destID){
					this.modelAtDestination=model;
					this.modelAtDestination.configureFreeCorner(this.field.vertexPosition,this.getFreePositionInField(1));
					break;
				}
			}
		}
	}
	clearPlayerConfigurations(){
		this.modelPresent[this.modelSelected.id]=false;
		this.modelPresent[this.modelSelected.destID]=true;
		this.modelSelected.clearConfiguration();
		if(this.modelAtDestination!==""){
			this.modelAtDestination.clearConfiguration();
			this.modelPresent[this.modelAtDestination.destID]=true;
		}
		this.modelSelected="";
		this.modelAtDestination="";
	}
	movePlayers(fraction){
		this.modelSelected.move(fraction);
		if(this.modelAtDestination!=="") this.modelAtDestination.move(fraction);
	}
}