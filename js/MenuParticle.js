if(typeof Math.randomInt === 'undefined')
{
	Math.randomInt = function(min, max)
	{
		return Math.floor(Math.random()*(max-min+1)+min);
	}
}

(function(){
	/**
	 * Represents an animated "block" of a menu panel. 
	 * @param {createjs.Point} point 		The coordinates of the particle.
	 * @param {Integer} width				The width of the particle. 
	 * @param {Integer} height				The height of the particle.
	 * @param {String} color 				The color of the particle.
	 * @param {Integer} rotationAmount		Defines how much should the particle be rotated at the beginning. 
	 * @param {Milliseconds} delay			The delay in milliseconds of the particle's display. If the delay is 1000, it would take one minute for the particle to display itself. 
	 * @param {Double, [0, 1]}				The maximum alpha value for the MenuParticle.
	 * @param {String}	borderColor			The color of the border of the MenuParticle. 
	 * @param {Integer} strokeStyle 		The thickness of the border. 
	 * @author Roman Pusec
	 * @augments {createjs.Shape}
	 */
	function MenuParticle(point, width, height, color, rotationAmount, delay, mpAlpha, borderColor, strokeStyle, rotationDecrAmount){
		this.Shape_constructor();
		if(strokeStyle != 0 && strokeStyle != null && borderColor != null && borderColor != "")
			this.graphics.setStrokeStyle(strokeStyle).beginStroke(borderColor);
		this.graphics.beginFill(color).drawRect(0, 0, width, height).endFill();
		this.x = point.x;
		this.y = point.y;
		this.rotation = rotationAmount;
		var parent = this;

		this.regX = width/2;
		this.regY = height/2;

		this.alpha = 0;

		this.scaleX = 0;
		this.scaleY = 0;

		var scaleXIncr = 1 / width;
		var scaleYIncr = 1 / height;

		//starts the listeners which animate the particle
		var addListenersTimeout = setTimeout(function(){
			parent.addEventListener("tick", onRotation);
			parent.addEventListener("tick", onAlpha);
			parent.addEventListener("tick", onScale);
			addListenersTimeout = -1;
		}, delay);

		/**
		 * 	Rotates the particle.  
		 */
		function onRotation()
		{
			parent.rotation /= rotationDecrAmount;

			if(Math.floor(parent.rotation) == 0)
			{
				parent.removeEventListener("tick", onRotation);
				parent.rotation = 0;
			}
		}

		/**
		 *	Increments the particle. 
		 */
		function onScale()
		{
			parent.scaleX < 1 ? parent.scaleX += scaleXIncr : '';
			parent.scaleY < 1 ? parent.scaleY += scaleYIncr : '';
		}

		/**
		 * 	Increases the alpha value. 
		 */
		function onAlpha()
		{
			if(parent.alpha < mpAlpha)
				parent.alpha += 0.015;
			else
			{
				parent.alpha = mpAlpha;
				parent.removeEventListener("tick", onAlpha);
			}
		}

		/**
		 *	The purpose of this function is to
		 *	make the particle disappear. 
		 */
		this.blowUp = function(){
			//removes the initial listeners
			this.removeAllEventListeners();

			//if the timeout function was never executed, it removes its listener
			if(addListenersTimeout != -1)
				clearTimeout(addListenersTimeout);

			this.rotation = 0;

			this.addEventListener("tick", onBlowUp);
		};

		var blowPointer = Math.randomInt(0, 360); //degrees
		blowPointer = blowPointer * Math.PI / 180; //to radians
		var speed = Math.randomInt(3, 6);

		/**
		 *	Function which animates the 
		 *	disappearance of the particle. 
		 */
		function onBlowUp()
		{
			if(parent.alpha > 0)
			{
				parent.x -= Math.cos(blowPointer) * speed;
				parent.y -= Math.sin(blowPointer) * speed;
				parent.rotation += speed;
				parent.alpha -= 0.025;
			}
			else
			{
				parent.parent.removeChild(parent);
				parent.removeEventListener("tick", onBlowUp);
			}
		}

		/**
		 *	Removes all possible listeners. 
		 */
		this.removeListeners = function(){
			parent.removeAllEventListeners();
			clearTimeout(addListenersTimeout);
		};

		/**
		 * Sets the MenuParticle to their final 
		 * state and stops rotation. 
		 */
		this.speedUp = function(){
			this.removeEventListener("tick", onRotation);
			this.removeEventListener("tick", onAlpha);
			this.removeEventListener("tick", onScale);
			this.rotation = 0;
			this.alpha = mpAlpha;
			this.scaleX = 1;
			this.scaleY = 1;
		};
	}

	var p = createjs.extend(MenuParticle, createjs.Shape);

	p.toString = function(){
		return '[object ' + MenuParticle.prototype.constructor.name + ']';
	};

	window.MenuParticle = createjs.promote(MenuParticle, "Shape");
}());