export const fragmentShaderSrc = `      		
    precision mediump float;   	
    uniform vec4 uColor;
		varying vec3 vNormal;

	void main () {   	
		float diffuse=max(dot(vNormal,vec3(0.0,0.0,1.0)),0.8);
		gl_FragColor = vec4(uColor.rgb*diffuse, uColor.a);
	}                            
`;