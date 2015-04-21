(function(){
	/**
	 *	This DisplayObject displays an image in an interactive way, it is 
	 *	used in the main menu section of the game. 
	 *	@param {Array<createjs.Bitmap>} arrImages The array of all of the images to display. 
	 *	@param {Array<String>} arrTexts The texts that are displayed appropriately to each image. 
	 *	@param {createjs.SpriteSheet} annoyanceSS The spritesheet reference whenever the image is switched. 
	 *	@author Roman Pusec 
	 *	@augments {createjs.Container}
	 */
	function MenuOptionDisplayImg(arrImages, arrTexts, annoyanceSS){
		this.Container_constructor();

		//initially, there's not previous image
		var prevImageIndex = null;

		var parent = this;

		//creating and playing the sprite
		var annoyance_Sprite = new createjs.Sprite(annoyanceSS, 0);
		annoyance_Sprite.play();
		annoyance_Sprite.alpha = 0;

		//decreases the alpha of the sprite
		var onAlpha = this.addEventListener('tick', function(){
			if(annoyance_Sprite.alpha > 0)
				annoyance_Sprite.alpha -= 0.05;
		});

		var txtCont = new createjs.Container();
		var displayText = new createjs.Text('', '12px Arial', '#fff');
		displayText.textAlign = 'center';
		var textBg = new createjs.Shape();
		textBg.alpha = 0.75;
		txtCont.addChild(textBg, displayText);

		//alters the scale of the whole container
		var onScale = this.addEventListener('tick', function(){
			if(parent.scaleX < 1)
			{
				parent.scaleX += 0.05;
				txtCont.y -= 5;
			}
		});

		this.addChild(txtCont, annoyance_Sprite);

		/**
		 * Displays an image on the screen. 
		 * @param  {Integer} imgIndex The index of the specified image. 
		 */
		this.displayImage = function(imgIndex){
			//if the previous image exists
			if(prevImageIndex != null)
			{
				//if the user did not select the same image as the previous one, the previous one is deleted
				if(prevImageIndex != imgIndex)
					this.removeChild(arrImages[prevImageIndex]);
				else
					return; //if the user did, then end the whole method execution
			}

			this.addChildAt(arrImages[imgIndex], 0);
			prevImageIndex = imgIndex;

			annoyance_Sprite.alpha = 1;

			displayText.text = arrTexts[imgIndex];
			displayText.lineWidth = arrImages[imgIndex].getBounds().width;

			txtCont.x = arrImages[imgIndex].getBounds().width/2 + displayText.getBounds().width/2;
			txtCont.y = (arrImages[imgIndex].getBounds().height/2) + 180;
			txtCont.regX = displayText.getBounds().width/2;
			txtCont.regY = displayText.getBounds().height/2;

			textBg.graphics.clear().beginFill('#000').drawRect(0, 0, arrImages[imgIndex].getBounds().width*2, displayText.getBounds().height).endFill();
			textBg.x = (arrImages[imgIndex].getBounds().width / 2) * -1;

			//setting the scale to zero so that the scale can be altered during the spawning animation
			this.scaleX = 0;

			//setting the annoyance_Sprite width identical to the currently displayed image, so that both display objects have identical dimensions
			if(annoyance_Sprite.getBounds().width < arrImages[imgIndex].getBounds().width)
				annoyance_Sprite.scaleX = arrImages[imgIndex].getBounds().width / annoyance_Sprite.getBounds().width;

			//same thing, but only with height
			if(annoyance_Sprite.getBounds().height < arrImages[imgIndex].getBounds().height)
				annoyance_Sprite.scaleY = arrImages[imgIndex].getBounds().height / annoyance_Sprite.getBounds().height;

			this.regX = arrImages[imgIndex].getBounds().width/2;
		};

		/**
		 * Deletes the image from the display and plays
		 * the appropriate animation. Afterwards deletes
		 * the overall display object. 
		 */
		this.deleteFromDisplay = function(){
			annoyance_Sprite.alpha = 1;
			
			if(prevImageIndex != null)
				this.removeChild(arrImages[prevImageIndex]);

			this.removeEventListener('tick', onScale);

			this.addEventListener('tick', function(){
				if(parent.scaleX > 0)
					parent.scaleX -= 0.05;

				if(annoyance_Sprite.alpha <= 0)
				{
					parent.removeAllEventListeners();
					parent.parent.removeChild(parent);
				}
			});
		};

		/**
		 * Returns the images. 
		 * @return {Array<createjs.Bitmap>} The array of bitmap images. 
		 */
		this.getImages = function(){
			return arrImages;
		};
	}

	var p = createjs.extend(MenuOptionDisplayImg, createjs.Container);

	window.MenuOptionDisplayImg = createjs.promote(MenuOptionDisplayImg, "Container");
}());