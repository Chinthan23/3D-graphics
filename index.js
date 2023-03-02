import { Cube, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import {Scene} from './Game/scene.js';
import * as dat from 'https://cdn.skypack.dev/dat.gui';

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


const scene= new Scene(renderer.domElement.width,renderer.domElement.height);

const shader = new Shader(renderer.glContext(),vertexShaderSrc,fragmentShaderSrc);
shader.use();

// const cube = new Cube(0,0);

const fieldConfigs={
	m: scene.field.numOfPlayers,
	n: scene.field.numOfSides,
	// translateZ: 0,
	// rotateAngle: 0
}
const gui = new dat.GUI();
const Field= gui.addFolder('Field')
Field.add(fieldConfigs, 'm',0,fieldConfigs.n-1 ).step(1).onChange( function (value) {
	scene.field.setNumOfPlayers(value);
	fieldConfigs.m=value;
})
Field.add(fieldConfigs, 'n', 3, 20).step(1).onChange( function () {
	scene.field.setNumOfSides(fieldConfigs.n);
	Field.__controllers[0].__max=fieldConfigs.n-1;
	Field.updateDisplay();
})
// Field.add(fieldConfigs, 'translateZ', -100,100).step(0.1).onChange(function () {
// 	cube.transform.translate= [cube.transform.translate[0],cube.transform.translate[1],fieldConfigs.translateZ]
// })
// Field.add(fieldConfigs, 'rotateAngle', -Math.PI,Math.PI).step(0.1).onChange(function () {
// 	cube.transform.rotationAngle = fieldConfigs.rotateAngle;
// })
Field.open()
// scene.add(cube);
renderer.setAnimationLoop(animation);
//Draw loop
function animation() 
{
	renderer.clear(0.9, 0.9, 0.9, 1);
	renderer.render(scene, shader);
}
