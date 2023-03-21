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
		
		this.updateModelTransformMatrix();
		
	}

	updateModelTransformMatrix()
	{
		mat4.identity(this.modelTransformMatrix);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle, this.rotationAxis);	
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);	
	}	
	translateTo(x,y,z){
		vec3.set(this.translate,x,y,z);
	}
}