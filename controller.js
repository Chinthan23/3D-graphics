import { WebGLRenderer, Shader, mat4, vec2,quat } from './lib/threeD.js';
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

		this.t=0;
	}
	updateT(val){
		console.log(val);
		this.t=val;
		if(this.scene.playerSelected>=0){
			let x=(1-this.t)*this.scene.start[0]+this.t*this.scene.dest[0];
			let y=(1-this.t)*this.scene.start[1]+this.t*this.scene.dest[1];
			// let z=(1-this.t)*this.scene.start[0]+this.t*this.scene.dest[0];
			this.scene.modelSelected.transform.translateTo(x,y,-1);
			this.scene.modelSelected.arrows[0].transform.translateTo(x,y,-1);
		}
	}
	processEvent(event){
		if(event.type==='keydown'){
			if(event.key==='m' || event.key==='M'){
				this.guiSelect=!this.guiSelect;
			}
			this.scene.processEvent(event);
		}
		else if (event.type==='mousedown'){
			if(this.guiSelect===false && this.scene.mode===2){
				this.move=true;
				vec2.set(this.mouse,event.x,event.y);
				vec2.set(this.moveMouse,event.x,event.y);
				this.initialMouseCoordinates=this.projectToSphere(this.mouse);
			}
			if(this.guiSelect===false){
				this.shaderPicker.use();
				this.renderer.clear(0.1, 0.1, 0.1, 1);
				this.renderer.render(this.scene,this.shaderPicker);
				this.shader.use();
				let object=this.shaderPicker.readPixel(event.x,this.screenHeight-event.y-1);
				if(this.scene.playerSelected===-1 && object[0]!==200){
					for(let model of this.scene.models){
						if(model.id===object[0]){
							this.scene.playerSelected=model.id;
							this.scene.modelSelected=model;
							model.select();
							this.scene.start=model.position;
							this.scene.configureArrow();
							break;
						}
					}
				}
				else if(this.scene.playerSelected===object[0]){
					this.scene.modelPresent[this.scene.playerSelected]=false;
					this.scene.playerSelected=-1;
					this.scene.modelSelected.deselect();
					this.scene.modelSelected.updateCenter([0,0,-2]);
					this.scene.modelSelected.updatePosition(this.scene.startD,this.scene.catcherID);
					this.scene.modelSelected.clearTranslation();
					this.scene.modelPresent[this.scene.catcherID]=true;
					if(this.scene.modelAtDestination!==""){
						this.scene.modelAtDestination.updateCenter([0,0,-2]);
						this.scene.modelAtDestination.updatePosition(this.scene.destD,this.scene.playerID);
						this.scene.modelAtDestination.clearTranslation();
						this.scene.modelPresent[this.scene.playerID]=true;
					}
					this.scene.modelSelected="";
					this.scene.modelAtDestination="";
					}
				}
			else if(this.playerSelected!==-1 ){
				console.log(t);
			}
		}
		else if (event.type==='mousemove' ){
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
				this.move=false;
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