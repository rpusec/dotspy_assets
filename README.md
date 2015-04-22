# Dotspy Assets
These are some of the assets that I created for the game [Dotspy](http://www.newgrounds.com/portal/view/655987). 
These assets are made using the [CreateJS](http://www.createjs.com/Home) library suit. 
So in order to use these assets in your personal projects, check the documentation on CreateJS first.  

TypedText
----

These objects represent a text which is automatically typed on the screen. Below you can see a brief example.

![](https://github.com/rpusec/dotspy_assets/blob/master/ds_assets_gifs/typedtexts.gif?raw=true)

A code example of how to create a TypedText:

```javascript
var typedText = new TypedText(new createjs.Point(30, 30), "Hello World", 30, "#fff", "Arial", 10, 250, 50);
stage.addChild(typedText);
```

In order to erase the text from the canvas, you use the `TypedText.deleteText` method. 

See the `typedtext.html` page for a demo. 

CheckBox
----

CheckBox is a DisplayObject which represents checked and unchecked state. 

![](https://github.com/rpusec/dotspy_assets/blob/master/ds_assets_gifs/checkbox.gif?raw=true)

As you can see in the above example, when the checkbox is 'checked', the background of the <body> tag is assigned a random color. When it is unchecked, it is assigned white background color. Below is a code example of how that can be done:

```javascript
var checkbox = new CheckBox("Set random background", function(){
  //sets a randomly colored background when checked
  document.getElementsByTagName('body')[0].style.backgroundColor = getRandColor(); 
}, function(){
  //resets back to white when the box is unchecked
  document.getElementsByTagName('body')[0].style.backgroundColor = "#FFF";
}, {checked: false,
  bgColor: '#66FFCC',
  borderColor: '#00CC99',
  textColor: '#fff',
  bgColorHover: '#66CCFF',
  borderColorHover: '#3399FF',
  textColorHover: '#00CCFF'
});
```

See the `checkbox.html` page for a demo. 

Menu Components
----

All of the menu components in the game are as follows: MenuParticle, MenuPanel, and MenuFrame. 

**MenuParticle** is a components which is basically an animated rectangle. 

![](https://github.com/rpusec/dotspy_assets/blob/master/ds_assets_gifs/mparticle.gif?raw=true)

**MenuPanel** is a 'container' which is consisted of a number of **MenuParticle** objects. 

![](https://github.com/rpusec/dotspy_assets/blob/master/ds_assets_gifs/mpanel.gif?raw=true)

**MenuFrame** is a frame which extends MenuPanel and provides additional components, such as tabs, text, etc.

![](https://github.com/rpusec/dotspy_assets/blob/master/ds_assets_gifs/mframe.gif?raw=true)

Code example can be seen in the `menu_comps.html` file. 

MenuOptionDisplayImg
----

This object is basically a slideshow of images with a transition between each images. 

![](https://github.com/rpusec/dotspy_assets/blob/master/ds_assets_gifs/displImage.gif?raw=true)

See the displayimg.html page for more info. 

Tutorial and TutorialFactory
----

The game includes a tutorial section, in which users can learn a few things about the game.  

The idea was to created a **Tutorial** object, which is basically an animated `MenuPanel` and includes a `message` attribute (which is basically the content of a tutorial window/section), and a `tutorialID` attribute which uniqely indentifies a particular Tutorial. 

The **TutorialFactory** object is used to manage, prepare, and create Tutorials used in the tutorial section. 

Below you can see a brief example of preloaded and displayed Tutorial objects. 

![](https://github.com/rpusec/dotspy_assets/blob/master/ds_assets_gifs/tutorials.gif?raw=true)

In order to create a new Tutorial, you use the `TutorialFactory.setNewTutorial` method. So that the tutorials can be managed directly through the TutorialFactory object. 

```javascript
tutorialFactory.setNewTutorial('tut_no_1', 'Aliquam id nibh ullamcorper, porttitor purus id, ornare urna. Nullam enim nibh, suscipit gravida tristique nec, tincidunt in orci.');
tutorialFactory.setNewTutorial('tut_no_2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
```

This is how you prepare tutorials. Preparing a number of tutorials will make it possible to display these tutorials later on the screen. You need to reference the Tutorial's ID in the parameter of the `TutorialFactory.prepareTutorial` method.  

```javascript
tutorialFactory.prepareTutorial('tut_no_1');
tutorialFactory.prepareTutorial('tut_no_2');
```

To finally display a tutorial, use the `TutorialFactory.loadNext` method. Execute the said method again to display another prepared tutorial, etc. until you run out of prepared tutorials. 

```javascript
tutorialFactory.loadNext();
```

See the `tutorial.html` file for a demo. 
