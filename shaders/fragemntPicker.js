export const fragmentPickerShaderSrc = `      		
    precision mediump float;   	
    uniform vec4 uID;

	void main () {   	
		gl_FragColor =  uID;
	}                            
`;