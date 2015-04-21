(function(){
	/**
	 * This DisplayObject represents a text which is dinamically "typed" on the canvas. 
	 * @param {createjs.Point} point 			The coordinates of the text.
	 * @param {String} sent 					The sentence to be displayed.
	 * @param {Double} textSize				The size of the font.
	 * @param {HTML Color} color				The color of the font. 
	 * @param {String} font					The type of the font, eg Arial.
	 * @param {Integer} textBlinkingAmount		Number of times the "_" sign should blink. 
	 * @param {Double} blinkingDelay			How fast should the "_" sign blink.
	 * @param {Double} typingDelay				How fast should the font appear.
	 * @example new TypedText(new createjs.Point(30, 30), "Hello World", 30, "#fff", "Arial", 10, 250, 50);
	 * @author Roman Pusec
	 * @augments {createjs.Text}
	 */
	function TypedText(point, sent, textSize, color, font, textBlinkingAmount, blinkingDelay, typingDelay){
		this.Text_constructor("", textSize + "px " + font, color);

		this.x = point.x;
		this.y = point.y;

		/* 
			to accurately measure the bounds, we've created a temporary Text object which
			has the same sentence embedded to it, and used its bounds on the actual text object 
		*/
		var tempText = new createjs.Text(sent, textSize + "px " + font, color);
		this.setBounds(0, 0, tempText.getBounds().width, tempText.getBounds().height);

		this.animationInterval = setInterval(onAnimation, blinkingDelay);
		var animHelper = 0; //helps us with some animation config
		this.typing = false; //active when the text should appear
		this.typed = false; //active when the text had already appeared
		this.sentence = sent;

		var parent = this;

		function onAnimation()
		{
			//if the state of typing isn't active
			if(!parent.typing)
			{
				//if the text still wasn't typed
				if(!parent.typed)
				{
					//makes the "_" blink N amount of times
					if(animHelper != textBlinkingAmount)
					{
						if(animHelper % 2)
							parent.text = "_";
						else
							parent.text = "";

						animHelper++;
					}
					else
					{
						//starting a faster animation, to better simulate typing
						clearInterval(parent.animationInterval);
						parent.animationInterval = setInterval(onAnimation, typingDelay);
						animHelper = 0;
						parent.typing = true; //typing starts
					}
				}
				else
				{
					/* this is the part of the code which repeatedly removes and
					adds the last character (which, in this case, is the "_" sign) */
					if(animHelper == 0)
						parent.text = parent.text.substring(0, parent.text.length-1);
					else
						parent.text += "_";

					animHelper++;
					animHelper %= 2;
				}
			}
			else
			{
				//this part of the code makes the final text appear on the screen
				if(animHelper != parent.sentence.length+1)
				{
					/* at this point, the animHelper, with each execution of this function,
					is being added up by one, which in turn makes a greater substring of the text */
					parent.text = parent.sentence.substring(0, animHelper) + "_";
					animHelper++;
				}
				else
				{
					//the "typing" animation is over
					clearInterval(parent.animationInterval);
					parent.animationInterval = setInterval(onAnimation, blinkingDelay);
					parent.typing = false;
					parent.typed = true; //the "typed" animation begins
					animHelper = 0;
				}
			}
		}
	}

	var p = createjs.extend(TypedText, createjs.Text);

	/**
	*	Removes the animation listener and removes the "_" sign. 
	*/
	p.removeListeners = function(){
		clearInterval(this.animationInterval);
		if(this.text.length == this.sentence.length+1 && this.typed)
			this.text = this.text.substring(0, this.text.length-1);
	};

	/**
	 * Deletes the text by eliminating second last 
	 * character (it doesn't remove the "_" sign). 
	 */
	p.deleteText = function(){
		this.removeListeners();
		this.text = this.sentence + "_";

		createjs.Ticker.addEventListener("tick", onDeleteText);
		var currInd = this.text.length;
		var parent = this;

		function onDeleteText()
		{
			if(currInd != 0)
			{
				parent.text = parent.text.substring(0, currInd-1);
				currInd--;
			}
			else
			{
				createjs.Ticker.removeEventListener('tick', onDeleteText);
				parent.parent.removeChild(parent);
			}
		}
	}

	window.TypedText = createjs.promote(TypedText, "Text");
}());