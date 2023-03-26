import { WebGLRenderer } from './lib/threeD.js';
import { Controller } from './controller.js';
import * as dat from 'https://cdn.skypack.dev/dat.gui';

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controller= new Controller(renderer,4,5);
const fieldConfigs={
	m: controller.scene.field.numOfPlayers,
	n: controller.scene.field.numOfSides
}
const gui = new dat.GUI();
const Field= gui.addFolder('Field');
Field.add(fieldConfigs, 'm',0,fieldConfigs.n-1 ).step(1).onChange( function (value) {
	if(controller.guiSelect===true){
		controller.scene.setNumOfPlayers(value);
		fieldConfigs.m=value;
	}
})
Field.add(fieldConfigs, 'n', 3, 20).step(1).onChange( function () {
	if(controller.guiSelect===true){
		controller.scene.setNumOfSides(fieldConfigs.n);
		Field.__controllers[0].__max=fieldConfigs.n-1;
		Field.updateDisplay();
	}
})
Field.open();
gui.hide();
document.addEventListener('keydown', (event) =>{
	controller.processEvent(event);
	if(controller.guiSelect===true){
		gui.show();
	}
	else{
		gui.hide();
	}
})
document.addEventListener('mousedown', (event) => {
	controller.processEvent(event);
})
document.addEventListener('mousemove', (event) => {
	controller.processEvent(event);
})
document.addEventListener('mouseup', (event) => {
	controller.processEvent(event);
})
document.addEventListener('wheel', (event)=> {
	event.preventDefault();
	controller.processEvent(event);
})
renderer.setAnimationLoop(animation);
//Draw loop
function animation() 
{
	renderer.clear(0.1, 0.1, 0.1, 1);
	renderer.render(controller.scene, controller.shader);
}
