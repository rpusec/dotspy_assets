(function(){
	/**
	 * These buttons are specifically used as "tab links" on MenuFrames. 
	 * They also contain the content to be displayed when clicked on a 
	 * specific tab. 
	 * @param {Integer} buttonType    What type of the button should it be, can be a TAB_BUTTON or an EXIT_BUTTON. 
	 * @param {[type]} menuFrame      The MenuFrame in which this button is displayed. 
	 * @param {[type]} displayTxt     The text to be displayed on the button. 
	 * @param {[type]} defaultColor   The default color for the button. 
	 * @param {[type]} onHoverColor   The color applied when the button is hovered.
	 * @param {[type]} activeColor    The color applied when the button is pressed. 
	 * @param {[type]} openedColor    The color displayed for the tab which is currently opened. 
	 * @param {[type]} borderColor    The color of the border. 
	 * @param {[type]} textColor      The color of the text. 
	 * @param {[type]} width          Width of the button. 
	 * @param {[type]} height         Height of the button. 
	 * @param {[type]} contentColor   Color of the text in the content. 
	 * @param {[type]} arrContent     Content to be displayed when the button is pressed, can include text, images, etc. 
	 *                                (Check the MenuFrame documentation for more info)
	 * @param {[type]} textLineHeight The additional line height of the text. 
	 * @author Roman Pusec
	 * @augments {createjs.Container}
	 */
	function MFTabButton(buttonType, menuFrame, displayTxt, defaultColor, onHoverColor, activeColor, openedColor, borderColor, textColor, width, height, arrContent, contentColor, textLineHeight){
		this.Container_constructor();

		var activeState = false;

		//creates the text to be displayed
		var textObj = new createjs.Text(displayTxt, "18px Arial", textColor);
		textObj.regX = textObj.getBounds().width/2;
		textObj.regY = textObj.getBounds().height/2;
		
		var parent = this;

		//the graphics of the button
		var btnGrahpics = new createjs.Shape();
		changeGraphics(borderColor, defaultColor);
		this.addChild(btnGrahpics, textObj);

		//disabling the mouse event on the children
		this.mouseChildren = false;

		//sets the mouse events
		setMouseEvents();

		/**
		 * Changes the graphics of the button
		 * @param  {[String]} borderColor Border color. 
		 * @param  {[String]} bgColor     Background color. 
		 */
		function changeGraphics(borderColor, bgColor){
			btnGrahpics.graphics.clear();

			var currWidth = width;
			var currHeight = height;

			if(width < textObj.getBounds().width)
				currWidth = textObj.getBounds().width;

			if(height < textObj.getBounds().height)
				currHeight = textObj.getBounds().height;

			btnGrahpics.graphics.setStrokeStyle(2).beginStroke(borderColor).beginFill(bgColor).drawRect(0, 0, currWidth, currHeight).endFill();
			parent.setBounds(0, 0, currWidth, currHeight);
			textObj.x = parent.getBounds().width/2;
			textObj.y = parent.getBounds().height/2;
		};

		/**
		 * Sets the mouse events. 
		 */
		function setMouseEvents()
		{
			parent.addEventListener('mouseover', function(){
				changeGraphics(borderColor, onHoverColor);
			});

			parent.addEventListener('mouseout', function(){
				changeGraphics(borderColor, activeState ? openedColor : defaultColor);
			});

			parent.addEventListener('mousedown', function(){
				changeGraphics(borderColor, activeColor);
			});

			parent.addEventListener("click", function(){
				changeGraphics(borderColor, onHoverColor);
				switch(buttonType)
				{
					case MFTabButton.TAB_BUTTON :
						menuFrame.displayContent(parent.getDisplayedContent(), 5, displayTxt);
						break;
					case MFTabButton.EXIT_BUTTON :
						menuFrame.blowUp();
						break;
				}
			});
		}

		/**
		 * Creates and returns the content from the constructor's arrContent parameter. 
		 * @return {createjs.Container} The content from the arrContent parameter wrapped as as createjs.Container DisplayObject. 
		 */
		this.getDisplayedContent = function()
		{
			if(typeof arrContent === 'undefined')
				return null;

			var contentContainer = new createjs.Container();

			//creates and adds the title of the tab
			contentContainer.addChild(new createjs.Text(displayTxt, "20px Arial", contentColor));

			//loops through the arrContent parameter and adds the apropriate values to the contentContainer DisplayObject 
			arrContent.forEach(function(item){
				if(Object.prototype.toString.call(item) === '[object String]') //texts
				{
					var newText = new createjs.Text(item, "12px Arial", contentColor);
					newText.y = calcAllYValues();
					newText.lineWidth = menuFrame.getBounds().width - (menuFrame.textFramePadding*2);
					contentContainer.addChild(newText);
				}
				else if(Object.prototype.toString.call(item) === '[object Object]') //sprites, bitmaps, etc.
				{
					contentContainer.addChild(item);
					item.y = calcAllYValues();
				}
			});

			/**
			 * Calculates the appropriate Y value for the last text or iamge. 
			 * @return {Double} Appropriate Y position for the last text or image. 
			 */
			function calcAllYValues()
			{
				var maxY = 0;

				contentContainer.children.forEach(function(child){
					maxY += child.getBounds().height + textLineHeight;
				});

				return maxY;
			}

			return contentContainer;
		}

		/**
		 * Sets the tab as 'opened', that is, changes its default color
		 * to the specified one. 
		 * @param {Boolean} bool If true, sets the tab as opened, false otherwise. 
		 */
		this.setAsOpened = function(bool){
			if(activeState == bool)
				return;

			activeState = bool;
			changeGraphics(borderColor, activeState ? openedColor : defaultColor);
		};

		this.getTabName = function(){
			return displayTxt;
		};

		/**
		 * Removes the button from its parent. 
		 */
		this.blowUp = function(){
			var parent = this;

			var onEliminate = this.addEventListener('tick', function(){
				if(parent.alpha > 0)
				{
					parent.y--;
					parent.alpha -= 0.025;
				}
				else
				{
					parent.removeAllEventListeners();
					parent.parent.removeChild(parent);
				}
			});
		};
	}

	/**
	 * Constant which signifies that the button should be a tab button. 
	 * @type {Number} 
	 */
	MFTabButton.TAB_BUTTON = 0;

	/**
	 * Constant which signifies that the button should be used to close the appropriate MenuFrame. 
	 * @type {Number}
	 */
	MFTabButton.EXIT_BUTTON = 1;

	var p = createjs.extend(MFTabButton, createjs.Container);

	window.MFTabButton = createjs.promote(MFTabButton, "Container");
}());