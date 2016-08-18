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
  //                           \- url to the rakr widget javascript
  
  rakr('//localhost:3000', 'YOUR_RAKR_PROJECT_ID');
  //    \- rakr base url    \- rakr id 
  
  // customizations
  rakr('position', 'TopRight');      // Availables: TopRight, BottomRight*, BottomLeft, TopLeft
  rakr('theme', 'Dark');             // Availables: Dark*, Light
  rakr('content', 'Report to Rakr')
  rakr('shortcut', 'ctrl+4');
</script>
```

## Development

We use TypeScript and webpack to develop this widget, please have Node.js and NPM installed, and run following command in project directory to install all related stuffs:

```
npm install
```

### Build

You can run following command to build distributable js in `dist` folder:

```
npm run build
```

### Run Development Server

Start a webpack-dev-server and serving rakr.js in `http://localhost:8080/rakr.js`, simply type:

```
npm run dev
```

and start hacking.
