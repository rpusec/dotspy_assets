# Dotspy Assets
These are some of the assets that I created for the game Dotspy. 
These assets are made using the CreateJS JavaScript library suit. 
So in order to use these assets in your projects, load the appropriate libraries first. 

CheckBox
----

CheckBox is a DisplayObject which represents checked and unchecked state. 

TODO: Add GIF

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

Menu Components
----

All of the menu components in the game are as follows: MenuParticle, MenuPanel, and MenuFrame. 

**MenuParticle** is a components which is basically an animated rectangle. 

TODO: Add a GIF

**MenuPanel** is a 'container' which is consisted of a number of **MenuParticle** objects. 

TODO: Add a GIF

**MenuFrame** is a frame which extends MenuPanel and provides additional components, such as tabs, text, etc.

TODO: Add a GIF

Code example can be seen in the `menu_comps.html` file. 

Tutorial and TutorialFactory
----

The game includes a tutorial section, in which users can learn a few things about the game.  

The idea was to created a **Tutorial** object, which is basically an animated `MenuPanel` and includes a `message` attribute (which is basically the content of a tutorial window/section), and a `tutorialID` attribute which uniqely indentifies a particular Tutorial. 

The **TutorialFactory** object is used to manage, prepare, and create Tutorials used in the tutorial section. 

Below you can see a brief example of preloaded and displayed Tutorial objects. 

TODO: Add GIF

In order to create a new Tutorial, you use the `TutorialFactory.setNewTutorial` method. So that the tutorials can be managed directly through the TutorialFactory object. 

```javascript
tutorialFactory.setNewTutorial('tut_no_1', 'Aliquam id nibh ullamcorper, porttitor purus id, ornare urna. Nullam enim nibh, suscipit gravida tristique nec, tincidunt in orci.');
tutorialFactory.setNewTutorial('tut_no_2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
```
