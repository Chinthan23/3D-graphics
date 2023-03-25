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

		this.updateModelTransformMatrix();
		
	}

	updateModelTransformMatrix()
	{
		mat4.identity(this.modelTransformMatrix)
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);	
		mat4.scale(this.modelTransformMatrix,this.modelTransformMatrix,this.scale);
		mat4.rotateX(this.modelTransformMatrix,this.modelTransformMatrix,this.angleX);
		mat4.rotateY(this.modelTransformMatrix,this.modelTransformMatrix,this.angleY)
		mat4.rotateZ(this.modelTransformMatrix,this.modelTransformMatrix,this.angleZ)
	}	
	translateTo(x,y,z){
		vec3.set(this.translate,x,y,z);
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