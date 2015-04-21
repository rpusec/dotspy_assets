(function(){
	/**
	 * This is a DisplayObject which is used during 
	 * the tutorial section of the game. It's consisted of a message, which explains a certain portion 
	 * of the game, and a tutorialID which uniquely indentifies a tutorial. 
	 * @param {String} tutorialID    Uniqely indentifies a particular tutorial. 
	 * @param {String} message       The message to be displayed. 
	 * @param {Object} options       Additional options for this object. 
	 * @author  Roman Pusec
	 * @augments {MenuPanel}
	 */
	function Tutorial(tutorialID, message, options){
		this.MenuPanel_constructor(new createjs.Point(0,0), 0, 0, 5, 5, "#000", 2500, 100, 0.8, "#000", 0, 1.25, false);

		var parent = this;

		if(typeof options === 'undefined')
			options = {};

		//predefining default options, if not specified
		options['fontConfig'] = options.hasOwnProperty('fontConfig') ? options['fontConfig'] : "14px Arial";
		options['fontColor'] = options.hasOwnProperty('fontColor') ? options['fontColor'] : "#fff";
		options['frameWidth'] = options.hasOwnProperty('frameWidth') ? options['frameWidth'] : 400;
		options['moveLinesAmount'] = options.hasOwnProperty('moveLinesAmount') ? options['moveLinesAmount'] : 5;
		options['bgAlphaCh'] = options.hasOwnProperty('bgAlphaCh') ? options['bgAlphaCh'] : 0.025;
		options['fontAlphaCh'] = options.hasOwnProperty('fontAlphaCh') ? options['fontAlphaCh'] : 0.025;
		options['bgColor'] = options.hasOwnProperty('bgColor') ? options['bgColor'] : 'rgba(0,0,0,0.8)';
		options['txtPadding'] = options.hasOwnProperty('txtPadding') ? options['txtPadding'] : 15;
		options['openingDelay'] = options.hasOwnProperty('openingDelay') ? options['openingDelay'] : null;
		options['txtLineHeight'] = options.hasOwnProperty('txtLineHeight') ? options['txtLineHeight'] : 22;

		//message as a createjs.Text object
		var msgTxt = new createjs.Text(message, options['fontConfig'], options['fontColor']);
		msgTxt.lineWidth = options['frameWidth'] - (options['txtPadding']*2);
		msgTxt.alpha = 0;
		msgTxt.x += options['txtPadding'];
		msgTxt.y += options['txtPadding'];
		msgTxt.lineHeight = options['txtLineHeight'];

		var finished = false;

		var TUT_FRAME_HEIGHT = msgTxt.getBounds().height + (options['txtPadding'] * 2);

		//drawing the lines
		var leftLine = new createjs.Shape();
		leftLine.graphics.setStrokeStyle(2).beginStroke("#fff").moveTo(0, 0).lineTo(0, TUT_FRAME_HEIGHT).endStroke();
		var rightLine = leftLine.clone();

		//setting the bounds of the DisplayObject
		this.setBounds(0, 0, options['frameWidth'], TUT_FRAME_HEIGHT);

		//setting the width and height in the global scope
		this.setWidth(options['frameWidth']);
		this.setHeight(TUT_FRAME_HEIGHT);

		//centering the two lines
		leftLine.x = this.getBounds().width/2;
		rightLine.x = this.getBounds().width/2;

		leftLine.regX = this.getParticleWH().width/2;
		rightLine.regX = this.getParticleWH().width/2;
		leftLine.y -= this.getParticleWH().height/2;
		rightLine.y -= this.getParticleWH().height/2;

		msgTxt.x -= this.getParticleWH().width/2;
		msgTxt.y -= this.getParticleWH().height/2;

		//adding chlid objects
		this.addChild(leftLine, rightLine, msgTxt);

		this.getID = function(){
			return tutorialID;
		};

		this.getMessage = function(){
			return message;
		};

		this.setFinished = function(b){
			if(typeof b !== 'boolean')
				b = false;

			finished = b;
		};

		this.getFinished = function(){
			return finished;
		}

		var animating = true;

		this.openTutorial = function(){
			normalizeTutorial();

			animating = true;

			//calling the global function to open the panel
			this.openPanel();

			this.setChildIndex(leftLine, this.numChildren-1);
			this.setChildIndex(rightLine, this.numChildren-1);
			this.setChildIndex(msgTxt, this.numChildren-1);

			if(options['openingDelay'] !== null)
			{
				setTimeout(function(){
					createjs.Ticker.addEventListener('tick', onOpenTutorial);
				}, options['openingDelay']);
			}
			else
				createjs.Ticker.addEventListener('tick', onOpenTutorial);
		};

		/**
		 * Animates the lines, changes the opacity for 
		 * both the text and the background container. 
		 */
		function onOpenTutorial()
		{
			if(leftLine.x > 0 && rightLine.x < options['frameWidth'])
			{
				leftLine.x -= options['moveLinesAmount'];
				rightLine.x += options['moveLinesAmount'];
			}
			else
			{
				if(msgTxt.alpha < 1)
					msgTxt.alpha += options['fontAlphaCh'];
				else
				{
					createjs.Ticker.removeEventListener('tick', onOpenTutorial);
					animating = false;
				}
			}
		}

		/**
		 * Closes the tutorial and deletes it. 
		 */
		this.closeTutorial = function(){
			if(animating)
				return;

			this.blowUp(false);
			createjs.Ticker.addEventListener('tick', onCloseTutorial);
		};

		/**
		 * Gradually removes the tutorial 
		 * window from the stage. 
		 */
		function onCloseTutorial()
		{
			animating = true;

			if(parent.alpha > 0)
			{
				leftLine.x += options['moveLinesAmount'];
				rightLine.x -= options['moveLinesAmount'];
				parent.alpha -= 0.025;
			}
			else
			{
				createjs.Ticker.removeEventListener('tick', onCloseTutorial);
				parent.parent.removeChild(parent);
			}
		}

		/**
		 * When the user presses the [load next tutorial] key while the tutorial is 
		 * opening, then the tutorial window will immediatly fully display itself. 
		 */
		this.speedUp = function(){
			leftLine.x = 0;
			rightLine.x = options['frameWidth'];
			msgTxt.alpha = 1;
			createjs.Ticker.removeEventListener('tick', onOpenTutorial);
			animating = false;
			this.speedUpParticles();
		};

		/**
		 * Sets the tutorial window back 
		 * to its initial state.
		 */
		function normalizeTutorial()
		{
			parent.alpha = 1;
			leftLine.x = parent.getBounds().width/2;
			rightLine.x = parent.getBounds().width/2;
			msgTxt.alpha = 0;
			createjs.Ticker.removeEventListener('tick', onCloseTutorial);
		}

		/**
		 * Returns the animation state. 
		 * @return {Boolean} True if the tutorial window is being animated, false otherwise. 
		 */
		this.getAnimate = function(){
			return animating;
		};
	}

	var p = createjs.extend(Tutorial, MenuPanel);

	window.Tutorial = createjs.promote(Tutorial, "MenuPanel");
}());