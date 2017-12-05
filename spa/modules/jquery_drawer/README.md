# Add jquery drawer Component (module/jquery_drawer)

create a drawer animation for any given div with the appropriate classes

expected default dom structure:
    <div class='drawer-container'>
        <span class="drawer-buttons">
            <span class="drawer-nav-up"></span>
            <span class="drawer-nav-down"></span>
        </span>
        <div class='drawer-object'>
        </div>
    </div>

## Installation

### AppCommon Server

Copy the AppCommon repository to a local directory. Open a terminal window. Navigate to the /ui-war/src/main/spa/ folder and run 'grunt sh_app' followed by 'grunt sh_server' to build a local static server on port 8888.

```
$ cd ui-war/src/main/spa
$ grunt sh_app
...
$ grunt sh_server
```

Configure your local .html to include the module at localhost:8888/

### Module Only

Copy the AppCommon repository to a local directory. Open a terminal window. Navigate to the /ui-war/src/main/spa/modules/jquery_drawer folder and run 'grunt sh_module'

```
$ cd ui-war/src/main/spa/modules/jquery_drawer
$ grunt sh_module
```

Copy the files built in ui-war/src/

## Usage

Inject the module into your code using any [standard method](http://krasimirtsonev.com/blog/article/Dependency-injection-in-JavaScript "Javascript injection examples").

Constructor:

```
uiEl.$myDrawerContainer.drawer({
    drawer: jquery drawer element,    // Example of overriding default css selector
    open_callback: callback function,
    split_callback: callback function,
    close_callback: callback function,
});
```

### params:

element - element is an [element](https://developer.mozilla.org/en-US/docs/Web/API/element "Element definition") object defined by a string containing one [CSS selector](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors "CSS Selector definition"). attributes

attributes to be passed for jquery_drawer component:

optional:
- open_callback: function
- split_callback: function
- close_callback: function
- drawer: jquery element
- upButton: jquery element
- downButton: jquery element

### returns

none
this component instantiates on existing dom structures, and ties to the element you instantiate it on.

## Support

Please [open an issue](https://jira.stubcorp.com) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). [Create a branch](https://github.corp.ebay.com/Stubhub/app-common), add commits, and [open a pull request](https://github.corp.ebay.com/Stubhub/app-common/compare).
