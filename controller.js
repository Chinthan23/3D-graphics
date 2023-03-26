import { WebGLRenderer, Shader, mat4, vec2, vec4,quat, vec3 } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import {fragmentPickerShaderSrc} from './shaders/fragemntPicker.js'
import {Scene} from './Game/scene.js';


export class Controller{
	constructor(renderer,numPlayers=3,numSides=5){
		this.scene= new Scene(renderer.domElement.width,renderer.domElement.height,numPlayers,numSides);
		this.shader = new Shader(renderer.glContext(),vertexShaderSrc,fragmentShaderSrc,"normal");
		this.shaderPicker= new Shader(renderer.glContext(),vertexShaderSrc,fragmentPickerShaderSrc,"picker");
		this.screenWidth=renderer.domElement.width;
		this.screenHeight=renderer.domElement.height;
		this.shader.use();
		
		this.move=false;
		this.guiSelect=false;
		this.play=false;
		this.playerMove=false;
		
		this.trackballSpehereRadiusOg=1;
		this.trackballSpehereRadius=1;
		this.initialMouseCoordinates=[0,0,0];
		this.zoomFactor=0.1;
		this.zoom=1;
		this.renderer=renderer;

		this.mouse=vec2.create(); //initial mouse coordinates
		vec2.set(this.mouse,0,0)
		this.moveMouse=vec2.create(); // final mouse coordinates
		vec2.set(this.moveMouse,0,0);
	}
	processEvent(event){
		if(event.type==='keydown'){
			if((event.key==='m' || event.key==='M') && this.play===false){
				this.guiSelect=!this.guiSelect;
			}
			this.scene.processEvent(event);
		}
		else if (event.type==='mousedown'){
			if(this.guiSelect===false && this.scene.mode===2 && this.play===false){
				this.move=true;
				vec2.set(this.mouse,event.x,event.y);
				vec2.set(this.moveMouse,event.x,event.y);
				this.initialMouseCoordinates=this.projectToSphere(this.mouse);
			}
			if(this.guiSelect===false && this.play===true){
				this.playerMove=true;
				let normalizedMouseX=(2*event.x - this.screenWidth)/this.screenWidth;
				let normalizedMouseY=(this.screenHeight- 2*event.y)/this.screenHeight;
				this.playerStart=[normalizedMouseX,normalizedMouseY];
				this.playerEnd=[normalizedMouseX,normalizedMouseY];
				this.mouseDirection=[this.playerEnd[0]-this.playerStart[0],this.playerEnd[1]-this.playerStart[1]];
			}
		}
		else if (event.type==='mousemove' ){
			if(this.move===true && this.guiSelect===false && this.scene.mode===2 && this.play===false){
				vec2.set(this.moveMouse,event.x,event.y);
				this.rotateCamera3D();
			}
			else if(this.guiSelect===false && this.playerMove===true){
				let normalizedMouseX=(2*event.x - this.screenWidth)/this.screenWidth;
				let normalizedMouseY=(this.screenHeight- 2*event.y)/this.screenHeight;
				this.playerEnd=[normalizedMouseX,normalizedMouseY];
				this.mouseDirection=[this.playerEnd[0]-this.playerStart[0],this.playerEnd[1]-this.playerStart[1]];
				let a=vec2.len(this.mouseDirection);
				let theta=vec2.angle(this.mouseDirection,this.scene.moveDirection);
				if((theta <Math.PI/6)||(theta> 5*(Math.PI/6))){
					let projectionValue=(a*Math.cos(theta));
					// *(this.scene.modelSelected.moveLength/4);
					this.scene.configureFraction(projectionValue);
					this.scene.resetModel();
					this.scene.movePlayers();
				}
			}
		}
		else if(event.type==='mouseup'){
			if(this.move===true && this.guiSelect===false && this.scene.mode===2 && this.play===false){
				vec2.set(this.mouse,event.x,event.y)
				vec2.set(this.moveMouse,event.x,event.y)
				this.scene.setQuatIdentity();
				this.move=false;
			}
			else if(this.guiSelect===false && this.play===true && this.playerMove===true){
				this.playerMove=false;
				let normalizedMouseX=(2*event.x - this.screenWidth)/this.screenWidth;
				let normalizedMouseY=(this.screenHeight- 2*event.y)/this.screenHeight;
				this.playerStart=[normalizedMouseX,normalizedMouseY];
				this.playerEnd=[normalizedMouseX,normalizedMouseY];
			}
		}
		else if(event.type==='wheel'){
			if(this.guiSelect===false && this.scene.mode===2 ){
				this.zoom+=event.deltaY>0?this.zoomFactor: -this.zoomFactor;
				if(this.zoom<0) this.zoom=0;
				if(this.zoom>15) this.zoomFactor=2;
				else this.zoomFactor=0.1;
				this.trackballSpehereRadius= this.trackballSpehereRadiusOg*this.zoom;
				this.scene.scaleBy(this.zoom);
			}
		}
		else if(event.type==='click'){
			if(this.guiSelect===false){
				this.shaderPicker.use();
				this.renderer.clear(0.1, 0.1, 0.1, 1);
				this.renderer.render(this.scene,this.shaderPicker);
				this.shader.use();
				let object=this.shaderPicker.readPixel(event.x,this.screenHeight-event.y-1);
				if(this.scene.modelSelected.id=== undefined && object[0]!==200){
					for(let model of this.scene.models){
						if(model.id===object[0]){
							model.select();
							this.scene.configurePlayers(model);
							this.play=true;
							break;
						}
					}
				}
				else if(this.scene.modelSelected.id===object[0] && this.play===true){
					this.scene.clearPlayerConfigurations();
					this.play=false;
					this.playerMove=false;
				}
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