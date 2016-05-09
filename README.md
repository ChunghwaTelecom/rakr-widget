# Rakr Widget
JavaScript library which could be embedded into any web site and enabling Rakr integration.

## Installation

Embed following snippet into your HTML.
```html
<script>
  (function(r,a,k,e,y,o,u){r['RakrWidgetObject']=y;r[y]=r[y]||function(){
  (r[y].q=r[y].q||[]).push(arguments)},r[y].l=1*new Date();o=a.createElement(k),
  u=a.getElementsByTagName(k)[0];o.async=1;o.src=e;u.parentNode.insertBefore(o,u)
  })(window,document,'script','//cht.technology/rakr-widget.js','rakr');
  
  rakr('//localhost:3000', 'RAKR-YOUR_ID_HERE');
  //    \- rakr base url    \- rakr id 
</script>
```
