export class WebGLRenderer
{
	constructor()
	{
		this.domElement = document.createElement("canvas");		

		this.gl = this.domElement.getContext("webgl") || this.domElement.getContext("experimental-webgl");
		if (!this.gl) throw new Error("WebGL is not supported");

		this.setSize(50,50);
		this.clear(1.0,1.0,1.0,1.0);
	}	

	setSize(width, height)
	{
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	clear(r,g,b,a)
	{
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
	}

	setAnimationLoop(animation) 
	{
		function renderLoop()
		{
			animation();
			window.requestAnimationFrame(renderLoop);
		}	

		renderLoop();
		  
	}

	render(scene, shader) 
	{
		scene.models.forEach( function (model) {
			if(model.type==="Model"){
				model.transform.updateModelTransformMatrix();
				
				shader.bindArrayBuffer(shader.vertexAttributesBuffer, model.vertices);
				shader.fillAttributeData("aPosition", 3,  3 * model.vertices.BYTES_PER_ELEMENT, 0);		
				
				shader.setUniform4f("uColor", model.color);
				
				shader.setUniformMatrix4fv("uModelTransformMatrix", model.transform.modelTransformMatrix);
				shader.setUniformMatrix4fv("uViewMatrix",scene.viewMatrix)
				shader.setUniformMatrix4fv("uProjectionMatrix",scene.projectionMatrix)
				shader.bindIndexBuffer(shader.indexBuffer,model.indices);
				shader.fillAttributeData("aNormal",3,3*model.vertexNormals.BYTES_PER_ELEMENT,0);
				// Draw
				shader.drawElements(model.indices.length);
			}
			else{
				model.transform.updateModelTransformMatrix();
				
				shader.bindArrayBuffer(shader.vertexAttributesBuffer, model.vertexPositions);
				shader.fillAttributeData("aPosition", 3,  3 * model.vertexPositions.BYTES_PER_ELEMENT, 0);		
				
				shader.setUniform4f("uColor", model.color);
				
				shader.setUniformMatrix4fv("uModelTransformMatrix", model.transform.modelTransformMatrix);
				shader.setUniformMatrix4fv("uViewMatrix",scene.viewMatrix)
				shader.setUniformMatrix4fv("uProjectionMatrix",scene.projectionMatrix)
				// Draw
				shader.drawArrays(model.vertexPositions.length / 3);
			}
		});
	}

	glContext()
	{
		return this.gl;
	}

	mouseToClipCoord(mouseX,mouseY) {

		// @ToDo
	}
}