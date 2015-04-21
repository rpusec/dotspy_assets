/**
 * Used for saving, starting, and maintaining Tutorials.
 * @param {createjs.Stage} stage The stage object the tutorial windows will appear.  
 * @author  Roman Pusec
 */
function TutorialFactory(stage)
{
	if(typeof stage === 'undefined')
		throw "The stage reference had not been defined. ";

	var tutorialMode = false;

	var tutorials = {}; //stores all possible tutorials
	var preparedTutorials = []; //all of the tutorials that have been prepared
	var usedTutorials = {}; //tutorials that have been already shown

	var prevTutorial = null;
	var currTutorial = null;
	var count = 0;
	var tutorialsCovered = 0;

	//the game will check how many tutorials has the user discovered 
	var tutorialsCoveredTxt = new createjs.Text("", "13px Arial", "#fff");

	/**
	 * Updates the tutorials count text based 
	 * on how many tutorials the user had discovered.  
	 */
	this.updateTutorialsCoveredText = function(){
		tutorialsCoveredTxt.text = "Tutorials covered: " + tutorialsCovered + " out of " + getNumOfTutorials();
	}

	/**
	 * Calculates how many tutorials there are. 
	 */
	function getNumOfTutorials()
	{
		var i = 0;
		
		for(var t in tutorials)
			i++;

		return i;
	}

	/**
	 * Returns the createjs.Text object that counts how many 
	 * tutorials had been discovered by the user.  
	 * @return {createjs.Text} The Text object that counts discovered tutorials. 
	 */
	this.getTutorialsCoveredText = function(point){
		return tutorialsCoveredTxt;
	};

	/**
	 * Sets the createjs.Text object that coveres the amount of 
	 * tutorials discovered as the last displayobject (sets its z-index to maximum). 
	 */
	this.setTCTInFront = function(){
		if(tutorialsCoveredTxt.parent === null)
			return;

		tutorialsCoveredTxt.parent.setChildIndex(tutorialsCoveredTxt, tutorialsCoveredTxt.parent.numChildren-1);
	};

	/**
	 * Adds a tutorial to the collection. 
	 * @param {String} tutorialID The ID of the new tutorial.
	 * @param {String} message    The message of the new tutorial. 
	 */
	this.setNewTutorial = function(tutorialID, message){
		var newTutorial = new Tutorial(tutorialID, message, {'openingDelay': 1000});
		newTutorial.x = stage.canvas.width/2 - newTutorial.getBounds().width/2;
		newTutorial.y = stage.canvas.height/2 - newTutorial.getBounds().height/2;
		tutorials[tutorialID] = newTutorial;
	};

	/**
	 * Prepares a tutorial denoted with a uniqe ID for display. 
	 * @param  {String} tutorialID The ID of the tutorial. 
	 * @return {Boolean} True if the tutorial exists or wasn't already used, false otherwise. 
	 */
	this.prepareTutorial = function(tutorialID){
		if(typeof tutorials[tutorialID] === 'undefined' || !tutorialMode)
			return false;

		//if it wasn't already used
		if(typeof usedTutorials[tutorialID] === 'undefined')
		{
			preparedTutorials.push(tutorials[tutorialID]);
			usedTutorials[tutorialID] = tutorials[tutorialID];
			usedTutorials[tutorialID].setFinished(true);
			this.updateTFTL();
			return true;
		}

		return false;
	};

	/**
	 * Loads the next prepared tutorial. 
	 * @return {Boolean} True if it isn't the last Tutorial, false if all tutorials had been shown. 
	 */
	this.loadNext = function(){
		if(currTutorial !== null)
		{
			if(currTutorial.getAnimate())
			{
				currTutorial.speedUp();
				return true;
			}
		}

		//setting the curr tutorial as the previous one
		prevTutorial = currTutorial;

		//do nothing if the tutorial limit had been reached
		if(count === preparedTutorials.length || preparedTutorials.length === 0)
		{
			if(count === preparedTutorials.length)
				this.emptyPreparedTutorials();

			if(prevTutorial !== null)
			{
				prevTutorial.closeTutorial();
				prevTutorial = null;
			}

			count = 0;
			currTutorial = null;

			return false;
		}

		//closing the previous tutorial
		if(prevTutorial !== null)
			prevTutorial.closeTutorial();

		currTutorial = preparedTutorials[count];
		count++;

		stage.addChild(currTutorial);
		currTutorial.openTutorial();

		tutorialsCovered++;

		//notifies the users how many tutorials they discovered 
		this.updateTutorialsCoveredText();

		return true;
	};

	/**
	 * Sets the tutorial mode. 
	 * @param {Boolean} b True to set the tutorial mode, false otherwise. 
	 */
	this.setTutorialMode = function(b){
		if(typeof b === 'boolean')
			tutorialMode = b;
	};

	/**
	 * Returns the tutorial mode boolean. 
	 * @return {Boolean} The boolean which determines tutorial mode. 
	 */
	this.getTutorialMode = function(){
		return tutorialMode;
	};

	/**
	 * Returns the amount of prepared tutorials. 
	 * @return {Integer} Amount of prepared tutorials. 
	 */
	this.preparedTutorialsAmount = function(){
		return preparedTutorials.length;
	};

	this.emptyPreparedTutorials = function(){
		while(preparedTutorials.length > 0)
			preparedTutorials.pop();
	};

	/**
	 * Resets the factory back to its initial state. 
	 */
	this.resetFactory = function(){
		this.emptyPreparedTutorials();
		usedTutorials = {};
		prevTutorial = null;
		currTutorial = null;
		count = 0;
		tutorialsCovered = 0;

		for(var tutorial in tutorials)
			tutorials[tutorial].setFinished(false);
	};

	//contains all of the assets used to display 
	//all of the tutorials in the menu window
	var tfAssets = {};

	/**
	 * createjs.Container extended function which shows all 
	 * of the available tutorials, and whether we have finished 
	 * them or not. 
	 */
	(function(){
		function TFTutorialList(){
			this.Container_constructor();
			var tutorialSections = [];
			var parent = this;

			var infoBox = new tfAssets.InfoBox();
			this.addChild(infoBox);

			/**
			 * Iterates through the array of tutorial and generates a 
			 * distinct section for each individual tutorial. 
			 */
			this.generateTutorialList = function(){
				for(var tutorial in tutorials)
				{
					var newTutorialSection = new tfAssets.TutorialSection(tutorials[tutorial], infoBox);
					newTutorialSection.y = newTutorialSection.getBounds().height * tutorialSections.length;
					tutorialSections.push(newTutorialSection);
					parent.addChild(newTutorialSection);
				}
			};

			/**
			 * Updates all of the statuses of all tutorial sections. 
			 */
			this.updateStatuses = function(){
				tutorialSections.forEach(function(tutorialSection){
					tutorialSection.updateStatus();
				});
			};
		}

		/**
		 * Panel which displays the information of a particular tutorial. 
		 */
		function InfoBox(){
			this.Container_constructor();

			var parent = this;

			var bg = new createjs.Shape();
			bg.alpha = 0.8;
			this.addChild(bg);

			var txt = new createjs.Text("", "14px Arial", "#fff");
			txt.lineWidth = 300;
			this.addChild(txt);

			var bgColor = '#000';

			/**
			 * Sets the text (tutorial description) to be displayed. 
			 * @param {String} strText The text to be displayed. 
			 */
			this.setText = function(strText){
				var PADDING = 40;
				txt.text = strText;
				bg.graphics.clear().beginFill(bgColor).drawRect(0, 0, txt.getBounds().width + PADDING, txt.getBounds().height + PADDING).endFill();
				txt.x = PADDING/2;
				txt.y = PADDING/2;
				this.setBounds(0, 0, txt.getBounds().width + PADDING, txt.getBounds().height + PADDING);
			};

			/**
			 * Sets the new bg color.
			 * @param {String} newBgColor The new bg color. 
			 */
			this.setBgColor = function(newBgColor){
				bgColor = newBgColor;
			};

			this.shrink = function(){
				this.scaleX = 0;
				this.scaleY = 0;
				createjs.Ticker.removeEventListener('tick', onScaleCh);
			};

			/**
			 * Will gradually increase the object's x and y scales. 
			 */
			this.load = function(){
				this.scaleX = 0;
				this.scaleY = 0;

				createjs.Ticker.addEventListener('tick', onScaleCh);
			};

			/**
			 * Makes it possible for the tutorial description to open. 
			 */
			function onScaleCh()
			{
				if(parent.scaleX < 1 && parent.scaleY < 1)
				{
					parent.scaleX += 0.05;
					parent.scaleY += 0.05;
				}
				else
					createjs.Ticker.removeEventListener('tick', onScaleCh);
			}
		}

		/**
		 * Represents a tutorial section. 
		 * @param {Tutorial} tutorial The target tutorial to reference.
		 * @param {tfAssets.InfoBox} infoBox The box which displays the info related to this particular tutorial.  
		 */
		function TutorialSection(tutorial, infoBox){
			this.Container_constructor();

			var parent = this;
			var finished = false;

			var xOrCM = new createjs.Shape();

			var panel = new createjs.Shape();
			alterGraphics("#000");
			panel.alpha = 0.6;
			var txtID = new createjs.Text(tutorial.getID(), "12px Arial", "#fff");
			txtID.x = 5;
			txtID.y = 30/2 - txtID.getBounds().height/2;

			this.addChild(panel, txtID, xOrCM);
			this.setBounds(0, 0, panel.graphics.instructions[1].w, 30);

			xOrCM.x = this.getBounds().width - 15;
			xOrCM.y = this.getBounds().height/2 - 10/2;

			this.on('mouseover', function(){
				infoBox.x = parent.x + parent.getBounds().width;
				infoBox.y = parent.y;
				infoBox.setBgColor(finished ? '#0f0' : '#f00');
				infoBox.setText(tutorial.getMessage());
				infoBox.load();
				alterGraphics("#506072");

				if(infoBox.y + infoBox.getBounds().height > stage.canvas.height)
					infoBox.y -= (infoBox.y + infoBox.getBounds().height) - stage.canvas.height;
			});

			this.on('mouseout', function(){
				alterGraphics("#000");
				infoBox.shrink();
			});

			function alterGraphics(newBgColor){
				panel.graphics.clear().beginFill(newBgColor).drawRect(0, 0, 150, 30).endFill();
			}

			/**
			 * Labels the tutorial as unfinished or finished, depending on the boolean value. 
			 * @param {Boolean} b True to label the tutorial as finished, false otherwise.  
			 */
			function setAsFinished(b){
				if(typeof b !== 'boolean')
					b = false;

				finished = b;

				xOrCM.graphics.clear();
				xOrCM.graphics.setStrokeStyle(2);

				if(b)
				{
					xOrCM.graphics.beginStroke("#0f0");
					xOrCM.graphics.moveTo(0,5);
					xOrCM.graphics.lineTo(5, 10);
					xOrCM.graphics.moveTo(5, 10);
					xOrCM.graphics.lineTo(10, 0);
				}
				else
				{
					xOrCM.graphics.beginStroke("#f00");
					xOrCM.graphics.moveTo(0, 0);
					xOrCM.graphics.lineTo(10, 10);
					xOrCM.graphics.moveTo(10, 0);
					xOrCM.graphics.lineTo(0, 10);
				}

				xOrCM.graphics.endStroke();
			};

			/**
			 * Updates this tutorial's status. If it has been finished, puts a check mark 
			 * beside it, indicating that it was finished. Otherwise, it puts an X mark. 
			 */
			this.updateStatus = function(){
				setAsFinished(tutorial.getFinished());
			};
		}

		var tftl = createjs.extend(TFTutorialList, createjs.Container);
		var ib = createjs.extend(InfoBox, createjs.Container);
		var ts = createjs.extend(TutorialSection, createjs.Container);

		tfAssets.TFTutorialList = createjs.promote(TFTutorialList, "Container");
		tfAssets.InfoBox = createjs.promote(InfoBox, "Container");
		tfAssets.TutorialSection = createjs.promote(TutorialSection, "Container");
	}());

	//defining the resulting tftl
	var tftl;

	/**
	 * Updates all of the tutorial statuses. 
	 */
	this.updateTFTL = function(){
		tftl.updateStatuses();
	};

	/**
	 * Returns the TFTL.
	 * @return {tfAssets.TFTutorialList} The TFTL. 
	 */
	this.getTFTL = function(){
		return tftl;
	};

	/**
	 * Creates the TFTL. 
	 */
	this.createTFTL = function(){
		tftl = new tfAssets.TFTutorialList();
		tftl.generateTutorialList();
	};

	this.hideTFTL = function(b){
		if(typeof b !== 'boolean')
			b = true;

		tftl.visible = !b;
	};
}