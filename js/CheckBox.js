(function(){
	/**
	 * CheckBox is a small button with a label 
	 * that can be activated when clicked.
	 * @param {String} strLabel The label of the given CheckBox.
	 * @param {Function} onCheck Function that's executed when the CheckBox is checked. 
	 * @param {Function} onUnCheck Function that is executed when the CheckBox is unchecked. 
	 * @param {Object} options Additional options. 
	 *                         bgColor => 			The background color of the box.
	 *                         borderColor => 		The border color of the box.
	 *                         xColor => 			The color of the X symbol. 
	 *                         textColor => 		The color of the createjs.Text object. 
	 *                         bgColorHover => 		The background color of the box when hovered.
	 *                         borderColorHover => 	The border color of the box when hovered.
	 *                         xColorHover => 		The color of the X symbol when hovered. 
	 *                         textColorHover => 	The color of the createjs.Text object when hovered. 
	 *                         font => 				The font of the createjs.Text object (eg. "15px Arial"). 
	 *                         boxSize =>			The size of the box. 
	 *                         xSize =>				The size of the X symbol.
	 *                         labelToBoxGap => 	The gap (space) between the createjs.Text object and the box shape. 
	 *                         checked =>			True to set the box as checked, false otherwise. 
	 *                         transOffset =>		The offset applied when the object is transitioning.
	 *                         transDir =>			The direction of the transition.  
	 *
	 * @author  Roman Pusec 
	 * @augments {createjs.Container}
	 */
	function CheckBox(strLabel, onCheck, onUnCheck, options){
		this.Container_constructor();

		var parent = this;

		if(typeof options === 'undefined')
			options = {};

		//initial options
		options.bgColor = options.hasOwnProperty('bgColor') ? options.bgColor : "#fff";
		options.borderColor = options.hasOwnProperty('borderColor') ? options.borderColor : "#ccc";
		options.xColor = options.hasOwnProperty('xColor') ? options.xColor : "#000";
		options.textColor = options.hasOwnProperty('textColor') ? options.textColor : "#fff";

		//when hovered
		options.bgColorHover = options.hasOwnProperty('bgColorHover') ? options.bgColorHover : "#ccc";
		options.borderColorHover = options.hasOwnProperty('borderColorHover') ? options.borderColorHover : "#585858";
		options.xColorHover = options.hasOwnProperty('xColorHover') ? options.xColorHover : "#fff";
		options.textColorHover = options.hasOwnProperty('textColorHover') ? options.textColorHover : "#c4c4c4";

		//other options
		options.font = options.hasOwnProperty('font') ? options.font : "15px Arial";
		options.boxSize = options.hasOwnProperty('boxSize') ? options.boxSize : 15;
		options.xSize = options.hasOwnProperty('xSize') ? options.xSize : 7;
		options.labelToBoxGap = options.hasOwnProperty('labelToBoxGap') ? options.labelToBoxGap : 10;
		options.checked = options.hasOwnProperty('checked') ? options.checked : true;
		options.transOffset = options.hasOwnProperty('transOffset') ? options.transOffset : 10;
		options.transDir = options.hasOwnProperty('transDir') ? options.transDir : 'left';

		//creating the box itself
		var boxShape = new createjs.Shape();
		alterBoxSkin(options.borderColor, options.bgColor);

		//creating the small X sign
		var xSign = new createjs.Shape();
		alterXSkin(options.xColor);
		xSign.x = options.boxSize/2 - options.xSize/2;
		xSign.y = options.boxSize/2 - options.xSize/2;

		//hide the X symbol if the cb is not checked
		if(!options.checked)
			xSign.visible = false;

		//creating the text label 
		var textLabel = new createjs.Text(strLabel, options.font, options.textColor);
		textLabel.x += options.boxSize + options.labelToBoxGap;

		//adding components to the parent
		this.addChild(boxShape, xSign, textLabel);

		//setting the bounds
		this.setBounds(0, 0, options.boxSize + options.labelToBoxGap + textLabel.getBounds().width, options.boxSize);

		var area = new createjs.Shape();
		area.graphics.beginFill("#000").drawRect(0, 0, this.getBounds().width, this.getBounds().height);
		this.hitArea = area;
		switch(options.transDir)
		{
			case 'left' : 
				this.x -= options.transOffset;
				break;
			case 'right' : 
				this.x += options.transOffset;
				break;
			case 'up' : 
				this.y += options.transOffset;
				break;
			case 'down' : 
				this.y -= options.transOffset;
				break;
		}

		this.alpha = 0;
		var transFinished = false; //checks if the transition state is over
		var moveCount = 0;

		var onTrans = createjs.Ticker.addEventListener('tick', function(){
			//moves the object appropriate to the transition direction
			switch(options.transDir)
			{
				case 'left' : 
					if(moveCount !== options.transOffset)
						parent.x += 1;
					else
						transFinished = true;
					break;
				case 'right' : 
					if(moveCount !== options.transOffset)
						parent.x -= 1;
					else
						transFinished = true;
					break;
				case 'up' : 
					if(moveCount !== options.transOffset)
						parent.y -= 1;
					else
						transFinished = true;
					break;
				case 'down' : 
					if(moveCount !== options.transOffset)
						parent.y += 1;
					else
						transFinished = true;
					break;
			}

			if(moveCount !== options.transOffset)
				moveCount++;

			if(parent.alpha < 1)
				parent.alpha += 0.05;
			else
			{
				if(transFinished)
					createjs.Ticker.removeEventListener('tick', onTrans);
			}
		});

		//click event
		this.addEventListener('click', function(){
			//hides or shows the boxShape object
			xSign.visible = xSign.visible ? false : true;

			if(options.checked)
			{
				onUnCheck();
				options.checked = false;
			}
			else
			{
				onCheck();
				options.checked = true;
			}
		});

		//mouse over event
		this.addEventListener('mouseover', function(){
			alterBoxSkin(options.borderColorHover, options.bgColorHover);
			alterXSkin(options.xColorHover);
			textLabel.color = options.textColorHover;
		});

		//mouse out event
		this.addEventListener('mouseout', function(){
			alterBoxSkin(options.borderColor, options.bgColor);
			alterXSkin(options.xColor);
			textLabel.color = options.textColor;
		});

		/**
		 * Checks if the box is selected. 
		 * @return {Boolean} True of the box is selected, false otherwise. 
		 */
		this.isSelected = function(){
			return xSign.visible;
		};

		/**
		 * Returns the transition info
		 * @return {Object} Object which is consisted of 'transDir' and 'transOffset' properties. 
		 */
		this.getTransitionInfo = function(){
			return {transDir: options.transDir, transOffset: options.transOffset};
		}

		/**
		 * Changes the colors of the box
		 * @param  {String} borderColor The target border color. 
		 * @param  {String} bgColor     The target background color. 
		 */
		function alterBoxSkin(borderColor, bgColor){
			boxShape.graphics.clear().setStrokeStyle(1).beginStroke(borderColor).beginFill(bgColor).drawRect(0, 0, options.boxSize, options.boxSize).endFill().endStroke();
		}

		/**
		 * Changes the color of the X symbol. 
		 * @param  {[type]} xColor The new color for the X symbol. 
		 */
		function alterXSkin(xColor){
			xSign.graphics.clear().setStrokeStyle(1).beginStroke(xColor).moveTo(0,0).lineTo(options.xSize,options.xSize).moveTo(options.xSize,0).lineTo(0,options.xSize).endStroke();
		}
	}

	var p = createjs.extend(CheckBox, createjs.Container);

	window.CheckBox = createjs.promote(CheckBox, "Container");
}());