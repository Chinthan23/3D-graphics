export const fragmentShaderSrc = `      		
    precision mediump float;   	
    uniform vec4 uColor;
		uniform vec3 uLight;
		varying vec3 vNormal;

	void main () {   	
		float diffuse=max(dot(vNormal,uLight),0.8);
		gl_FragColor = vec4(uColor.rgb*diffuse, uColor.a);
	}                            
`;