# Running the code
	Install live-server using npm install live-server
	Setup live-server by opening terminal in the code directory and running the command "live-server".

Note: Please ensure the canvas takes full screen size, if not reload.
# Game 
	-Consists of a field which is a n-sided regular polygon and m players. m<n;
	- m and n can be adjusted dynamically by going into modify mode.
	-A player is player is selected who is known as the catcher and he is then dragged towards the corner which is randomly selected. 
	-If the corner has another player to which the catcher is moving. This player then moves towards a free corner.

# Modes
	- Modify mode: change m and n.
	- View modes: 
    	- Top view: default view, look at field from z axis.
    	- 3D view: view the scene from any direction. Implemented as a trackball.
	- Play mode: A player is selected, on which Euler Rotation about x/y/z axes and scaling can be performed.

# Interactions:
<ul>
	<li>
	<strong>KeyBoard:</strong>
		<ul>
		<li> <strong>c</strong>: Toggle between view modes, top and 3D. </li>
		<li> <strong>m</strong>: Modify mode on or off. </li>
		<li> <strong>x</strong>: Rotate about x-axis when player is selected, before the player starts moving. </li>
		<li> <strong>y</strong>: Rotate about y-axis when player is selected, before the player starts moving. </li>
		<li> <strong>z</strong>: Rotate about z-axis when player is selected, before the player starts moving. </li>
		<li> <strong>&uarr;</strong>: Scale up the object after player is selected. </li>
		<li> <strong>&darr;</strong>: Scale down the object after player is selected. </li>
	</ul>
	</li>
	<li>
	<strong>Mouse:</strong>
		<ul>
		<li> <strong>drag</strong>:  
		<ul>
		<li>In 3D view, rotates the scene using quaternions and trackball.</li>
		<li>In Play mode, dragging the mouse in the direction of the catcher movement, moves the catcher and the player at the destination if one is present.</li>
		</ul>
		</li>
		<li> <strong>click</strong>: If clicked on a player, that player will be selected. </li>
	</ul>
	</li>
</ul>


# Note
	- Play and Modify mode are exclusive of each other, i.e. they can't be done simultaneously.
	- Play mode can exist along with top and 3D view, but the movement of the mouse drag is compared with the direction of movement obtained in top view.