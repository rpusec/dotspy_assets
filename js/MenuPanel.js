if(typeof Math.randomInt === 'undefined')
{
	Math.randomInt = function(min, max)
	{
		return Math.floor(Math.random()*(max-min+1)+min);
	}
}

(function(){
	/**
	 * MenuPanels are composed of a certain number of MenuParticles. 
	 * @param {createjs.Point} point 		The panel's coordinates.
	 * @param {Double} width 				The width of the panel.
	 * @param {Double} height 				The height of the panel.
	 * @param {Integer} particleXAmount	The amount of MenuParticles from the X coordinate, that is, the amount of columns. 
	 * @param {Integer} particleYAmount	The amount of MenuParticles from the Y coordinate, that is, the amount of rows.
	 * @param {Color/Array} color 			The color(s) of each MenuParticle. If specified as an array of colors, each next MenuParticle will have the next color in the array.
	 * @param {Integer} rotationAmount		Defines how much should each MenuParticle be rotated at the beginning of its display. 
	 * @param {Milliseconds} appearDelay	The display delay in milliseconds of each second MenuParticle.
	 * @param {Double, [0, 1]}	mpAlpha		The maximum alpha value for the MenuParticle.
	 * @param {String}	borderColor			The color of the border of the MenuParticle. 
	 * @param {Integer} strokeStyle 		The thickness of the border. 
	 * @param {Integer} rotationDecrAmount For what amount should the rotation of each individual MenuParticle be decreased.  
	 * @param {Boolean} automaticallyStart	True if we want the panel to be automatically constructed. False if we want to manually start constructing the panel.
	 * @author Roman Pusec
	 * @see MenuParticle
	 * @augments {createjs.Container}
	 */
	function MenuPanel(point, width, height, particleXAmount, particleYAmount, color, rotationAmount, appearDelay, mpAlpha, borderColor, strokeStyle, rotationDecrAmount, automaticallyStart){
		this.Container_constructor();

		var menuParticleArr = [];
		var isBlownUp = false;

		this.x = point.x;
		this.y = point.y;

		//calculating the width and height of each particle
		var particleWidth = width / particleXAmount;
		var particleHeight = height / particleYAmount;

		/* we need to adjust the regX and regY values since 
		we changed these properties in the MenuParticles */ 
		this.regX = (particleWidth/2) * -1;
		this.regY = (particleHeight/2) * -1;

		this.setBounds(0, 0, width, height);

		if(typeof automaticallyStart === 'undefined')
			automaticallyStart = true;

		this.openPanel = function(){
			if(Object.prototype.toString.call(color) !== '[object Array]')
				color = [color];

			isBlownUp = false;

			var currColorInd = 0;
			var currDelay = 0;

			//adds the menu particles to the container
			for(var row = 0; row < particleYAmount; row++)
			{
				for(var col = 0; col < particleXAmount; col++)
				{
					var menuParticle = new MenuParticle(new createjs.Point(col * particleWidth, row * particleHeight), particleWidth, particleHeight, color[currColorInd], rotationAmount, appearDelay * currDelay, mpAlpha, borderColor, strokeStyle, rotationDecrAmount);
					this.addChild(menuParticle);
					menuParticleArr.push(menuParticle);
					currDelay++;
					if(currColorInd != color.length-1)
						currColorInd++;
				}
			}
		};

		this.getParticleBounds = function(){
			return{width: particleWidth, height: particleHeight};
		};

		this.getBlownUp = function(){
			return isBlownUp;
		};

		this.setBlownUp = function(bool){
			isBlownUp = bool;
		};

		this.setWidth = function(newWidth){
			width = newWidth;
			particleWidth = width / particleXAmount;
			this.regX = (particleWidth/2) * -1;
		};

		this.setHeight = function(newHeight){
			height = newHeight;
			particleHeight = height / particleYAmount;
			this.regY = (particleHeight/2) * -1;
		};

		this.getParticleArr = function(){
			return menuParticleArr;
		};

		this.getParticleWH = function(){
			return {width: particleWidth, height: particleHeight};
		};

		this.addParticle = function(newParticle){
			menuParticleArr.push(newParticle);
		}

		/**
		 * All of the MenuParticle objects stop rotating and immediately 
		 * are set to their final state. 
		 */
		this.speedUpParticles = function(){
			menuParticleArr.forEach(function(particle){
				if(particle.toString() === '[object MenuParticle]')
					particle.speedUp();
			});
		};

		if(automaticallyStart)
			this.openPanel();
	}

	var p = createjs.extend(MenuPanel, createjs.Container);

	/**
	 *	Triggers the blowUp() function on all MenuParticles
	 *	and removes the container itself. 
	 *	@return {Boolean} Returns whether the particles were blown. 
	 */
	p.blowUp = function(shouldDeleteObj){
		if(this.getBlownUp())
			return false;

		if(typeof shouldDeleteObj === 'undefined')
			shouldDeleteObj = true;

		this.setBlownUp(true);

		//blowing up all MenuParticles
		this.getParticleArr().forEach(function(mp){
			mp.blowUp();
		});

		var parent = this;

		this.addEventListener("tick", onEliminate);

		/**
		 *	Deletes the main container if all MenuParticles 
		 *	are deleted. 
		 */
		function onEliminate()
		{
			//assuming that all particles are deleted
			var allParticlesDeleted = true;

			//if there's one single particle still present, then the boolean is set to false
			parent.getParticleArr().forEach(function(mp){
				if(mp.isVisible())
				{
					allParticlesDeleted = false;
					return;
				}
			});

			//deletes the main container and removes the listener
			if(allParticlesDeleted)
			{
				if(shouldDeleteObj)
					parent.parent.removeChild(parent);
				parent.removeAllEventListeners();
			}
		}

		return true;
	};

	window.MenuPanel = createjs.promote(MenuPanel, "Container");
}());