import {vec3, mat4} from "./threeD.js";

export class Transform
{
	constructor()
	{
		this.translate = vec3.create();
		vec3.set(this.translate, 0, 0, 0);
		
		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);
		
		this.rotationAngle = 0;
		this.rotationAxis = vec3.create();
		vec3.set(this.rotationAxis, 0, 1, 0);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);
		this.angleX=0;
		this.angleY=0;
		this.angleZ=0;

		this.targetTo=mat4.create();
		this.target=vec3.create();
		vec3.set(this.target,0,0,-3.5);
		this.eye=vec3.create();
		this.up=vec3.create();
		vec3.set(this.up,0,0,1);

		// this.updateModelTransformMatrix();
		
	}

	updateModelTransformMatrix()
	{
		mat4.identity(this.modelTransformMatrix);
		// mat4.multiply(this.modelTransformMatrix,this.targetTo,this.modelTransformMatrix);
		// mat4.scale(this.modelTransformMatrix,this.modelTransformMatrix,this.scale);
		this.calculateTargetToMatrix();
		mat4.rotateX(this.modelTransformMatrix,this.modelTransformMatrix,this.angleX);
		mat4.rotateY(this.modelTransformMatrix,this.modelTransformMatrix,this.angleY);
		mat4.rotateZ(this.modelTransformMatrix,this.modelTransformMatrix,this.angleZ);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);	
	}	
	calculateTargetToMatrix(){
		mat4.identity(this.targetTo);
		mat4.targetTo(this.targetTo,this.eye,this.target,this.up);
		mat4.multiply(this.modelTransformMatrix,this.targetTo,this.modelTransformMatrix);
	}
	translateTo(x,y,z){
		vec3.set(this.translate,x,y,z);
	}
	setEye(x,y,z){
		vec3.set(this.eye,x,y,z);
	}
	setCenter(x,y,z){
		vec3.set(this.target,x,y,z);
	}
	rotX(angle){
		this.angleX=angle;
	}
	rotY(angle){
		this.angleY=angle;
	}
	rotZ(angle){
		this.angleZ=angle;
	}
}