export const vertexShaderSrc = `      
	attribute vec3 aPosition;
	uniform mat4 uModelTransformMatrix;
	uniform mat4 uProjectionMatrix;
	uniform mat4 uViewMatrix;

	void main () {             
		gl_Position = uProjectionMatrix * uViewMatrix * uModelTransformMatrix * vec4(aPosition, 1.0); 
	}                          
`;