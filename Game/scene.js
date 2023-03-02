import {vec3,mat4} from "../lib/threeD.js";
import {Field} from "./Field.js";
export class Scene
{
	constructor(width, height)
	{
		this.field= new Field(2,3)
		this.primitives = []
		
		//Keeping the view and projection matrices in the scene as they are global properties and apply to all models.
		this.eyeVector=vec3.create();
		vec3.set(this.eyeVector,0,0,5)

		this.upVector=vec3.create();
		vec3.set(this.upVector,0,1,0);

		this.centerVector=vec3.create();
		vec3.set(this.centerVector,0,0,0);

		this.viewMatrix=mat4.create();
		mat4.lookAt(this.viewMatrix,this.eyeVector,this.centerVector,this.upVector);

		this.near=1e-4;
		this.far=1e4;
		this.projectionMatrix=mat4.create();
		mat4.perspective(this.projectionMatrix,75*Math.PI/180,width/height,this.near,this.far);
	}

	add(primitive)
	{
		if( this.primitives && primitive )
		{
			this.primitives.push(primitive)
		}
	}

	centroid()
	{
		// @ToDo : Return the centroid of all the primitives in the scene
	}
}