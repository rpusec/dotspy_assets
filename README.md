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
