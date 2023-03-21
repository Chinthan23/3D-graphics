import { WebGLRenderer, Shader, mat4, vec2,quat } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import {Scene} from './Game/scene.js';


export class Controller{
	constructor(renderer){
		this.scene= new Scene(renderer.domElement.width,renderer.domElement.height);
		this.shader = new Shader(renderer.glContext(),vertexShaderSrc,fragmentShaderSrc);
		this.screenWidth=renderer.domElement.width;
		this.screenHeight=renderer.domElement.height;
		this.shader.use();
		this.move=false;
		this.guiSelect=false;
		this.trackballSpehereRadius=1;
		this.initialMouseCoordinates=[0,0,0];
		this.zoomFactor=0.5;

		this.mouse=vec2.create(); //initial mouse coordinates
		vec2.set(this.mouse,0,0)
		this.moveMouse=vec2.create(); // final mouse coordinates
		vec2.set(this.moveMouse,0,0)
	}
	processEvent(event){
		if(event.type==='keydown'){
			if(event.key==='m' || event.key==='M'){
				this.guiSelect=!this.guiSelect;
			}
			this.scene.processEvent(event);
		}
		else if (event.type==='mousedown'){
			if(this.move===true && this.guiSelect===false && this.scene.mode===2){
				vec2.set(this.mouse,event.x,event.y);
				vec2.set(this.moveMouse,event.x,event.y);
				this.initialMouseCoordinates=this.projectToSphere(this.mouse);
			}
		}
		else if (event.type==='mousemove'){
			if(this.move===true && this.guiSelect===false && this.scene.mode===2){
				vec2.set(this.moveMouse,event.x,event.y);
				this.rotateCamera3D();
			}
		}
		else if(event.type==='mouseup'){
			if(this.move===true && this.guiSelect===false && this.scene.mode===2){
				vec2.set(this.mouse,event.x,event.y)
				vec2.set(this.moveMouse,event.x,event.y)
				this.scene.setQuatIdentity();
			}
		}
		else if(event.type==='wheel'){
			if(event.deltaY>0 && this.guiSelect===false && this.scene.mode===2 ){
				this.trackballSpehereRadius+= this.trackballSpehereRadius*this.zoomFactor;
				this.scene.scaleBy(1/this.zoomFactor);
			}
			else if (event.deltaY<0 && this.guiSelect===false && this.scene.mode===2){
				this.trackballSpehereRadius-= this.trackballSpehereRadius*this.zoomFactor;
				this.scene.scaleBy(this.zoomFactor);

			}
		}
	}
	projectToSphere(mouse){
		let normalizedMouseX=(2*mouse[0] - this.screenWidth)/this.screenWidth;
		let normalizedMouseY=(this.screenHeight- 2*mouse[1])/this.screenHeight;
		
		//keeping in between -1 to 1
		normalizedMouseX=normalizedMouseX>1?1:normalizedMouseX;
		normalizedMouseX=normalizedMouseX<-1?-1:normalizedMouseX;
		normalizedMouseY=normalizedMouseY>1?1:normalizedMouseY;
		normalizedMouseY=normalizedMouseY<-1?-1:normalizedMouseY;

		let d=normalizedMouseX*normalizedMouseX + normalizedMouseY*normalizedMouseY;
		let sphereZ=d<this.trackballSpehereRadius? Math.sqrt(this.trackballSpehereRadius-d):0.0;
		let normalizeFinal= 1.0/Math.sqrt(normalizedMouseX*normalizedMouseX +normalizedMouseY*normalizedMouseY + sphereZ*sphereZ);
		normalizedMouseX*=normalizeFinal, normalizedMouseY*=normalizeFinal, sphereZ*=normalizeFinal;
		return [normalizedMouseX, normalizedMouseY,sphereZ]
	}
	rotateCamera3D(){
		if(Math.abs(this.mouse[0] -this.moveMouse[0]) || Math.abs(this.mouse[1] -this.moveMouse[1])){
			let finalMouseCoordinates=this.projectToSphere(this.moveMouse);
			this.scene.globalTrackball(this.initialMouseCoordinates,finalMouseCoordinates);
			this.initialMouseCoordinates=finalMouseCoordinates;
		}

	}
}