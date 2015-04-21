if(typeof Math.randomInt === 'undefined')
{
	Math.randomInt = function(min, max)
	{
		return Math.floor(Math.random()*(max-min+1)+min);
	}
}

(function(){
	/** 
	 * MenuFrames are used to provide the same interface as MenuPanels,
	 * but with additional components such as text, tabs, images, as well as borders.
	 *	
	 * The first parameter is responsible for providing all of the necessary
	 * information regarding the frame itself. It is an array which is consisted
	 * of Objects that have the following attributes: content and tabName.
	 *
	 * content => Contains the content to be displayed when clicking the tab (text, bitmaps, etc...)
	 * tabName => The name of the tab as well as the text to be displayed in the specified tab button. 
	 *
	 * Example: 
	 * var menuFrame = new MenuFrame([
	 * {
	 *      content: ['this is the first sentence of tab 1', 'second sentence...'],
	 *		tabName: "tab1"
	 * }
	 *	
	 * ...
	 *	
	 * {
 	 * 		content: ['this is the first sentence of tab N', 'second sentence...'],
	 *    	tabName: "tabN"
	 * }
	 * ]);
	 *	
	 * @param {Array<Object>} menuFrameInfo 	The information about the MenuFrame.
	 * @param {String} frameTitle				The title of the frame. 
	 * @param {String} textPadding 			The padding of the overall text. 
	 * @param {Object} options 				Options for setting the width, background color, etc. (Check MenuPanel documentation)
	 * @param {Object} mfTabOptions 			Options relating to the menu tabs. (Check MFTabButton documentation)
	 * @author Roman Pusec 
	 * @augments {MenuPanel}
	 */
	function MenuFrame(menuFrameInfo, frameTitle, textPadding, options, mfTabOptions){
		this.MenuPanel_constructor(
			new createjs.Point(0, 0), 
			options.width, 
			options.height, 
			options.xAmount, 
			options.yAmount, 
			options.color, 
			options.rotationAmount, 
			options.appearDelay, 
			options.mpAlpha, 
			options.borderColor, 
			options.strokeStyle, 
			options.rotationDecrAmount);

		var tabArr = []; //holds all of the tabs
		var parent = this;

		this.textFramePadding = textPadding;
		
		//since we have altered the regX and regY values of this class' supertype
		//we need to use these values to better position certain objects
		var margX = (this.getParticleBounds().width/2) * -1;
		var margY = (this.getParticleBounds().height/2) * -1;

		//calculates the correct width of all of the tab buttons
		var frameTabButtonWidth = this.getBounds().width / menuFrameInfo.length;

		//the content that's currently being displayed
		var currentContent = null;

		//this shape is the border surrounding the MenuFrame
		var frameBorder = new createjs.Shape();
		frameBorder.graphics.setStrokeStyle(2).beginStroke(options.border).drawRect(margX, margY, this.getBounds().width, this.getBounds().height);
		frameBorder.alpha = 0;
		this.addChild(frameBorder);

		//creates the tabs
		menuFrameInfo.forEach(function(item){
			createTab(item.content, item.tabName);
		});

		//this is the display object that includes the close button, and the name of the MenuFrame
		var frameTopRail = constructFrameTopRail(this.getBounds().width, 30);

		//this is used exclusively for animation purposes, since 
		//the tab buttons are sinking downwards when the MenuFrame is spawned
		tabArr.forEach(function(item){
			item.y -= 50;
		});

		frameTopRail.y -= 50; //same goes for the above

		this.addChild(frameTopRail);

		var posTabsCount = 0; //counts just how many times are the tabs supposed to go downwards

		var onAlphaTabs = this.addEventListener('tick', function(){
			if(tabArr[0].alpha < 1)
			{
				tabArr.forEach(function(item){
					item.alpha += 0.025;
				});

				frameTopRail.alpha += 0.025;
				frameBorder.alpha += 0.025;
			}
			else
				parent.removeEventListener('tick', onAlphaTabs);
		});

		//makes it possible to sink the tab buttons as well as the frameTopRail
		var onLocateTabs = this.addEventListener('tick', function(){
			//if the tabs were relocated N amount of times, the animation stops
			if(posTabsCount != 50)
			{
				tabArr.forEach(function(item){
					item.y++;
				});
				frameTopRail.y++;
				posTabsCount++;
			}
			else
				parent.removeEventListener('tick', onLocateTabs);
		});

		/**
		 * Creates a new tab with already defined properties. 
		 * @param {Array} arrContent The content to be displayed when clicking the tab button. (Check the MenuFrame documentation for more info)
		 * @param {String} tabName   The text to be displayed on the tab button. (Check the MenuFrame documentation for more info)
		 */
		function createTab(arrContent, tabName){
			var newMFTabButton = new MFTabButton(MFTabButton.TAB_BUTTON, parent, tabName, mfTabOptions.defaultColor, mfTabOptions.onHoverColor, mfTabOptions.activeColor, mfTabOptions.openedColor, mfTabOptions.borderColor, mfTabOptions.textColor, frameTabButtonWidth, 35, arrContent, mfTabOptions.contentColor, 10);

			newMFTabButton.x += margX;
			newMFTabButton.y += margY;

			newMFTabButton.alpha = 0;

			if(tabArr.length != 0)	
				newMFTabButton.x = tabArr[tabArr.length-1].x + tabArr[tabArr.length-1].getBounds().width;

			newMFTabButton.y -= newMFTabButton.getBounds().height;

			tabArr.push(newMFTabButton);

			//if there's only one or non menu tabs, then we should 
			//avoid making menu tab altogether (since having a single menu tab is redundant)
			if(menuFrameInfo.length > 1)
				parent.addChild(newMFTabButton);
		};

		/**
		 * Constructs the frameTopRail. 
		 * @param  {[Double]} width            The width of the object. 
		 * @param  {[Double]} height           The height of the object. 
		 * @return {createjs.Container}        Returns the frameTopRail. 
		 */
		function constructFrameTopRail(width, height)
		{
			var trContainer = new createjs.Container();
			var trGraphics = new createjs.Shape();
			var titleText = new createjs.Text(frameTitle, "15px Arial", "#fff");
			trGraphics.graphics.setStrokeStyle(2).beginStroke(options.border).beginFill(options.topRailColor).drawRect(0, 0, width, chooseAppropriateHeight());
			closeButton = new MFTabButton(MFTabButton.EXIT_BUTTON, parent, "X", mfTabOptions.defaultColor, mfTabOptions.onHoverColor, mfTabOptions.activeColor, mfTabOptions.openedColor, mfTabOptions.borderColor, mfTabOptions.textColor, chooseAppropriateHeight(), chooseAppropriateHeight());
			closeButton.x = width - closeButton.getBounds().width;
			trContainer.addChild(trGraphics, titleText, closeButton);
			trContainer.x += margX;
			trContainer.y += margY;
			trContainer.y -= trContainer.getBounds().height;
			titleText.x = (height/2 - titleText.getBounds().height/2) - 2;
			titleText.y = (height/2 - titleText.getBounds().height/2) - 2;

			//if there are zero or a single, do not alter the Y coordinate
			if(tabArr.length > 1)
				trContainer.y -= tabArr[0].getBounds().height;
			
			//during animation, its alpha will increase
			trContainer.alpha = 0;

			return trContainer;

			function chooseAppropriateHeight()
			{
				return height < titleText.getBounds().height ? titleText.getBounds().height : height;
			}
		}

		/**
		 * Displays the content on the MenuFrame. Method is executed 
		 * mostly after a tab button was pressed. 
		 * @param  {createjs.Container} content        Content wrapped as a createjs.Container, it can contains text, images, etc. 
		 *                                             It is recommended to use MFTabButton's getDisplayedContent() method for this
		 *                                             parameter. 
		 * @param  {Double} padding                    The additional padding of the overall content. 
		 * @param  {Integer} movementAmount            Each time the content is displayed, it moves slightly from left to right, this 
		 *                                             parameter signifies how many times per pixel should the content be moved. 
		 */
		this.displayContent = function(content, movementAmount, tabName)
		{
			if(content == null)
				return;

			//removing the previous content so that the new content can be displayed
			if(currentContent != null)
			{
				this.removeEventListener('tick', onMovement);
				this.removeChild(currentContent);
				currentContent = null;
			}

			//creating and displaying the new content
			currentContent = content;
			content.x += margX + this.textFramePadding;
			content.y += margY + this.textFramePadding;
			var originalLocX = content.x;
			content.x -= movementAmount;

			//adds content to the MenuFrame
			this.addChild(content);

			//slightly moves the content from left to right
			var onMovement = this.addEventListener('tick', function(){
				if(content.x != originalLocX)
					content.x++;
				else
					this.removeEventListener('tick', onMovement);
			});

			tabArr.forEach(function(tab){
				if(tab.getTabName() == tabName)
					tab.setAsOpened(true);
				else
					tab.setAsOpened(false);
			});
		};

		this.displayContent(tabArr[0].getDisplayedContent(), 5, tabArr[0].getTabName());

		this.getTabs = function(){
			return tabArr;
		};

		this.getFrameBorder = function(){
			return frameBorder;
		};

		this.getFrameTopRail = function(){
			return frameTopRail;
		};

		this.getCurrentContent = function(){
			return currentContent;
		};
	}

	var p = createjs.extend(MenuFrame, MenuPanel);

	/**
	 *	Overridden method from MenuPanel which first removes
	 *	the MenuParticles from the supertype and then removes
	 *	the DisplayObjects from the subtype. 
	 */
	p.blowUp = function(){
		if(this.getBlownUp())
			return;

		this.removeAllEventListeners();

		var parent = this;

		parent.getFrameBorder().alpha = 1;
		parent.getFrameTopRail().alpha = 1;
		parent.getCurrentContent() != null ? parent.getCurrentContent().alpha = 1 : '';

		this.getTabs().forEach(function(tab){
			parent.addParticle(tab);
		});

		this.addEventListener('tick', function(){
			if(parent.getFrameBorder().alpha > 0 && parent.getFrameTopRail().alpha > 0)
			{
				parent.getFrameBorder().alpha -= 0.025;
				parent.getFrameTopRail().alpha -= 0.025;
				parent.getCurrentContent() != null ? parent.getCurrentContent().alpha -= 0.025 : '';
			}
		});

		this.MenuPanel_blowUp();
	};

	window.MenuFrame = createjs.promote(MenuFrame, "MenuPanel");
}());