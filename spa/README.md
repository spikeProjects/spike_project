### Installation Instructions:
* Tested and verified on OSX 10.9.1
* <a href="https://developer.apple.com/xcode/"><strong>Install Command Line Tools for XCode</strong></a>
    * NOTE: you do not need to download the entire (huge) XCode toolset. The command line tools will do.
    * NOTE: free Apple developer account required for download
* <a href="http://nodejs.org/dist/v0.10.24/"><strong>Install Node 0.10.24 via Macintosh Installer (Universal)</strong></a>

## Foobunny Boilerplate Generator

### How To Use:

* clone this repository
* cd into app-eventpage-splitscreen/ui-pkg/spa (or folder with package.json) and type: `sudo npm cache clear`, then `sudo npm install .`
* cd into foobunny_devTools and type: `grunt-init foobunny_boilerplate`
* follow the prompts
* you'll now have a new folder at the same level as foobunny_devTools with the same name as the appName you gave the generator
* cd into your new app folder
* clone app-common: `git clone https://github.scm.corp.ebay.com/Stubhub-Next-Projects/app-common.git`
* install node_modules:
    * `sudo npm cache clear`
    * `sudo npm install .`
* initialize a git repository and commit intial project state:
    * `git init`
    * `git add .`
    * `git commit -m "initial commit"`
* to run the app: `grunt server`
    * then navigate to: http://localhost:7777/appNameYouTypedFolder/
* to run the unit tests `grunt serverTest`
    * then navigate to: http://localhost:9999/unit.html
* to run the functional tests: `grunt testFunc`
    * results will be in your terminal

## Foobunny Sub Generators

The boilerplate application created by the Foobunny boilerplate generator contains additional functionality that generates properly formatted models, views, controllers, etc.

### How to Use:

* <strong>view:</strong>
    * from the root of your project type: `grunt-init generators/view`
    * follow the prompts
    * output:
        * app/scripts/views/nameYouTyped_view.js
        * test/unit/t_nameYouTyped_view.js
        * app/templates/nameYouTyped.dust
    * output if you chose to generate a model:
        * app/scripts/models/nameYouTyped_model.js
        * test/unit/t_nameYouTyped_model.js
    * output if you chose to generate a collection:
        * app/scripts/collections/nameYouTyped_collection.js
        * test/unit/t_nameYouTyped_collection.js
* <strong>viewContainer:</strong>
    * from the root of your project type: `grunt-init generators/viewcontainer`
    * follow the prompts
    * output:
        * app/scripts/viewcontainers/nameYouTyped_view_container.js
        * test/unit/t_nameYouTyped_view_container.js
* <strong>layout:</strong>
    * from the root of your project type: `grunt-init generators/layout`
    * follow the prompts
    * output:
        * app/scripts/layouts/nameYouTyped_layout.js
        * app/templates/nameYouTyped.dust
        * test/unit/t_nameYouTyped_layout.js
* <strong>model:</strong>
    * from the root of your project type: `grunt-init generators/model`
    * follow the prompts
    * output:
        * app/scripts/models/nameYouTyped_model.js
        * test/unit/t_nameYouTyped_model.js
* <strong>collection:</strong>
    * from the root of your project type: `grunt-init generators/collection`
    * follow the prompts
    * output:
        * app/scripts/collections/nameYouTyped_collection.js
        * test/unit/t_nameYouTyped_collection.js
    * output if you chose to generate a model:
        * app/scripts/models/nameYouTyped_model.js
        * test/unit/t_nameYouTyped_model.js
* <strong>controller:</strong>
    * from the root of your project type: `grunt-init generators/controller`
    * follow the prompts
    * output:
        * app/scripts/controllers/nameYouTyped_controller.js
        * test/unit/t_nameYouTyped_controller.js
* <strong>template:</strong>
    * from the root of your project type: `grunt-init generators/template`
    * follow the prompts
    * output:
        * app/templates/nameYouTyped.dust
* <strong>func_test:</strong>
    * from the root of your project type: `grunt-init generators/func_test`
    * follow the prompts
    * output:
        * test/func/t_nameYouTyped.js
* <strong>unit_test:</strong>
    * from the root of your project type: `grunt-init generators/unit_test`
    * follow the prompts
    * output:
        * test/unit/t_nameYouTyped_objectTypeYouTyped.js

### Important Terminology
  * The Foobunny framework is geared toward developing single-page web applications. Given that context, we have the long-lived "page", and multiple short-lived "screens".
  * <strong>Page:</strong> the totality of your application. Bootstraps and loads its initial state. The page will have an associated long-lived controller that establishes a layout for the overall page structure. The page can have multiple URLs, each of which is associated with a screen.
  * <strong>Screen:</strong> subsections of your Page for any given URL will be represented by the concept of screens, which have short-lived controllers and their associated models/collections/views.

### Object Lifecycle

| Application  | Controller  | ViewContainer  | View |
| -------  | ----  | ----------- | ----------- |
|(onload)|(onload)|(onload)| (onload) |
|initialize|initialize|initialize| initialize |
|start|start| | |
|| | render | render|
||show|show| |
||update| | |
|dispose|dispose|dispose| dispose |

  * (onload): This is not a method, but rather an event that occurs when the JavaScript code for any given object is loaded and excecuted. The only thing that should happen here is to define an object and its methods. Remember, one object per file. No DOM access or manipulation should be attempted at this point.
  * `initialize()`: when an object instance is created using `new myObject` its initialize method will be called. Typically this is the place to set up your instance properties. For instance, in a Layout, this is where you'd define your views and viewContainers properties. There should be no DOM access here.
  * `start()`: typically this is run once. Possible use cases here are creating a local reference to a DOM node, or fetching data for a model or collection.
  * `render()`: here, a dust template, the correspoing model/collection data, and message bundle strings are combined into a DOM fragment. At this point, the fragment exists in memory as a variable, but will not be fully inserted into the DOM until render's associated `renderDone()` method has run.
  * `show()`: typically where the controller or viewContainer shows its view by placing a rendered view instance into the DOM.
  * `update()`: this can be used for updating views after they've been rendered and inserted into the DOM. For example, to insert data in a specific DOM element.
  * `dispose()`: removes the object and its dependents and corresponding event handlers. Typcially, all views and models/collections associated with previous screen-level controller will be disposed automatically when the page switches between screens. TODO: implement keepAlive.

### The Following Files And Objects Will Be Used In Every Foobunny Application:

* <strong>app/index.html</strong> - This is the bootstrap html file that is loaded when a url request is made. From here, everything
else is instatiated.

```html
<div id="app_container"></div>

The container div for your application. Feel free to rename the id to whatever you like.
```

```html
<script src="/scripts/lib/require.js"></script>

Pulls in require.js. Do not ever remove this.
```

```html
<script>
  require(['../scripts/config'], function (config) {
    require(['main']);
  });
</script>

Configures require.js to use ../scripts/config file and requires main.js,
which is the main file that initializes and starts the application.
```
* <strong>app/app.js</strong> - This is the main application object.

```js
define([
    'foobunny',
    'routes'
], function(Foobunny, routes) {

Pulls in foobunny and the routes file.
NOTE: the convention here is that the values in the array in quotes are passed as lower case strings, framework objects are
passed to the function in Uppercase, and plain old objects are passed to the function as lower-case.
```

```js
var app = new Foobunny.Application();

Creates var app as a Foobunny.Application instance.
NOTE: application instantiation is done here. Application lifecycle management (initialization, start, etc)
is intentionally done in main.js.
```

```js
app.initialize = function() {
  app.initAll(routes);
};

Defines instance-level app.initialize function, which initializes the single-page-app navigation objects.
Calls app.initAll, passing in the routes file, which defines short-lived controller routes.
```

```js
app.initPageControllers = function() {};

Defines instance-level initPageControllers function.
This is where you initialize long-lived page-level controllers as opposed to short-lived screen-level controllers that are
defined in your routes.js file.
NOTE: see "Using Controllers" below for more detail.
```
* <strong>app/main.js</strong> - This is the main file that initializes and starts the application.

```js
require([
    'app'
], function(app) {

Pulls in the app instance created in app.js. NOTE: application lifecycle management (initialization,
start, etc) is intentionally done in main.js. Application instantiation is intentionally done in app.js.
```

```js
app.initialize();
app.start();

Calls app.initialize. See description above under app/app.js.
Calls app.start which in turn:
  * calls any methods added via app.addStartMethods():
  * triggers application wide 'start' event.

```

* <strong>app/routes.js</strong> - This where you define short-lived screen-level routes.

```js
var routes = function(match) {
  match('', 'myHomeScreen#myAction');
  match('screen1UrlPattern', 'myScreen1#myAction');
  match('screen2UrlPattern', 'myScreen2#myAction');
};

Creates a routes function and registers the passed in match functions, which are used to map Url patterns to corresponding
controllers and their action method.
Typically myAction will be the show method of the controller.
So '' is used for the home screen, while 'screen1UrlPattern' or 'screen2UrlPattern' would be used for subsequent screens.
In the second param, screen1UrlPattern will map to a controller named myScreen1Controller inside of your app/controllers directory
and myAction will map to a method inside of myScreen1Controller.
NOTE: the controller file name MUST end in "_controller.js". For instance "my_screen1_controler.js"
NOTE: pay very close attention here. This can bite you.

The above use of the match function is most common.
There are 2 alternative means of using match:
```

```js
var routes = function(match) {
  match('', {controller: 'myController', action: 'myAction'});
};

Passing the controller and action in an object.
```

```js
var routes = function(match) {
  match('', 'myController#myAction', {myParamName:'myParamValue'});
};

In this use case, the 3rd parameter is an object with addtional params you might need. In this case, the param would be available as
options.routeParams.myParamName. Call subscribeEvent and pass it a local function which will be called when the
!router:changeURL event is published: TODO: evaluate this vs. data-href + .go-to class

this.subscribeEvent('!router:changeURL', this.myMethod);

myMethod : function(options) {
  var myVal = options.routeParams;
}

```

* <strong>app/config.js</strong> - There are 4 important pieces in this file:

```js
baseUrl: "scripts"

Defines app/scripts as baseUrl for require.js compilation.
```

```js
paths: {
  "jquery": "lib/jquery-1.8.3",
  "json": (typeof JSON === "undefined") ? "lib/json2": "empty:",
  "underscore": "lib/underscore-1.4.4",
  "backbone": "lib/backbone-1.0.0",
  "dust": "lib/dust-core-1.0.0",
  "foobunny": "lib/foobunny"
},

Sets up paths to all libraries provided by Foobunny Boilerplate. As a result, you can reference them in your individual
project files like:

define([
  'jquery',
  'foobunny' ...etc.

If you would like to alias any file in your application, you can do add to the paths config like:

paths: {
  "jquery": "lib/jquery-1.8.3",
  "json": (typeof JSON === "undefined") ? "lib/json2": "empty:",
  "underscore": "lib/underscore-1.4.4",
  "backbone": "lib/backbone-1.0.0",
  "dust": "lib/dust-core-1.0.0",
  "foobunny": "lib/foobunny",
  "myFile": "path/to/myFile"
},

Now, in a file, you can do:

define([
  'myFile', ...etc.

Instead of:

define([
  'path/to/myFile', ...etc.

```

```js
useStrict: true,

Toggles strict mode.
```

```js
shim: {
  "dust": {
    exports: 'dust'
  },
  "underscore": {
    exports: '_'
  },
  "backbone": {
    deps: ["underscore", "jquery"],
    exports: 'Backbone'
  }
}

Sets up shim config for non-AMD modules/files. Do not modify this unless you need to add other non-AMD files.
How to do so is beyond the scope of this documentation. See the require.js docs.
```

### <strong>Using Controllers</strong>

* Regardless of how you build your Foobunny application, you'll always use at least a single controller within which models/collections and view or view-management objects will be instantiated.
* Views and view-management objects don't always require a model/collection, but expect to use a model/collection in most cases.
* Some controllers will manage view elements (header, footer, etc.) that will remain across multiple pages, while other controllers will only be associated with a specific URL, for example /sell.
* In order to differentiate between long-lived and short-lived controllers, we recommend that a controller with long-lived view elements be named in relation to it's purpose, for example, layoutController. Short-lived url-associated controllers should be named in relation to their associated URL, for example sellController for /sell.

The following pattern shows the most basic approach to creating a controller called layoutController (NOTE: always name the file the same as the object it returns, except for in snake, rather than camel case. in this case layout_controller) inside of your controllers directory:

```js
define([
  'foobunny'
], function(Foobunny){
  'use strict';

  var layoutController = Foobunny.Controller.extend({
    initialize: function() {
      //do stuff
    },

    start: function() {
      //do stuff
    },

    show: function() {
      //do stuff
    },

    update: function(args) {
      //do stuff
    }

  });

  return layoutController;

});
```

* Once you've created a controller, you may use it by adding a reference to it in your routes.js file, or, for long-lived controllers not associated with a route, by instantiating it within app.js in the app.initControllers() method and adding it as an initializer with a call to app.addInitializer(). See the following 2 examples:

```js
var routes = function(match) {
  match('', 'sellController#sellAction');
};

The routes method.
```

```js
app.initControllers = function() {
  this.layoutController = new layoutController();
};

app.initialize = function() {
  app.addInitializer(this.layoutController.start);
};

Instantiating and initializing a controller inside of app.js initControllers.
```

### <strong>Using BaseView</strong>

* The BaseView is an extention of Backbone view with a Dust template rendering mechanism that's based on Deferreds.
* From the Backbone documentation: "Backbone Views are almost more convention than they are actual code. A View is simply a JavaScript object that represents a logical chunk of UI in the DOM. This might be a single item, an entire list, a sidebar or panel, or even the surrounding frame which wraps your whole app. Defining a chunk of UI as a **View** allows you to define your DOM events declaratively, without having to worry about render order ... and makes it easy for the view to react to specific changes in the state of your models. Creating a Backbone.View creates its initial element outside of the DOM, if an existing element is not provided."
* Given that a template property is defined, the corresponding Dust template will be processed by the BaseView's render method. The rendering itself is asynchronous and therefore the render method returns a Deferred's promise.

There are 2 basic patterns for using BaseView. The first is assumes that the target element exists in the DOM:
```js
define([
  'foobunny'
], function(Foobunny){
  'use strict';

  var MyView = Foobunny.BaseView.extend({
    initialize: function () {
      //put anything here that needs to run at this object's instantiation.
    },
    el: '#my_view_target',
    template:'my_view_template',
    //event handling example
    events: {
      "click #myButton" : "myButtonClickFunction"
    },
    myButtonClickFunction : function () {
      //event handler logic for when #myButton is clicked
    }
  });
  return MyView;
});
```

The second creates a detached DOM fragment, that will be later added to the DOM by another object:
```js
define([
  'foobunny'
], function(Foobunny){
  'use strict';

  var ItemView = Foobunny.BaseView.extend({
    initialize: function () {
      //put anything here that needs to run at this object's instantiation
    },
    tagName: 'li',
    template:'item_view'
  });
  return ItemView;
});
```

Views should always address an element in the DOM as in the first example above, except
in the case of an ItemView in a collection or when using a ViewContainer

Below are 2 examples of using BaseView in a Controller with a ViewContainer. The first one is recommended for performance reasons b/c it creates one less object.

Example 1:
```js
define([
  'foobunny',
  'app',
  'models/my_base_model',
  'views/my_base_view'
], function(Foobunny, app, MyBaseModel, MyBaseView){
  'use strict';

  var BaseViewController = Foobunny.Controller.extend({
    initialize: function() {
      _.bindAll(this);
      this.model = new MyBaseModel();

      // Pattern 1 (recommended) - create view using a BaseModel, template and new Foobunny.BaseView
      // in this file

      this.view = new Foobunny.BaseView({
        model: this.model,
        template: 'my_base_view'
      });

      //Pattern 1 + 2 - Always call fetchPromise when inserting a BaseView into a ViewContainer
      this.fetchPromise = this.view.model.fetch({dataType: 'jsonp'});

      return this.view;
    },

    start: function() {
      this.show();
    },

    show: function() {
      //Pattern 1
      var that = this;
      this.fetchPromise.done(function () {
        app.layoutController.view.viewContainers.contentContainer.show(that.view);
      });
    },

    update: function(args) {
      //do stuff
    }

  });

  return BaseViewController;

});
```

Example 2:
```js
define([
  'foobunny',
  'app',
  'models/my_base_model',
  'views/my_base_view'
], function(Foobunny, app, MyBaseModel, MyBaseView){
  'use strict';

  var BaseViewController = Foobunny.Controller.extend({
    initialize: function() {
      _.bindAll(this);
      this.model = new MyBaseModel();

      //Pattern 2 - create view using a BaseModel, template and new MyBaseView
      this.view = new MyBaseView({
        model: this.model
      });

      //Pattern 1 + 2 - Always call fetchPromise when inserting a BaseView into a ViewContainer
      this.fetchPromise = this.view.model.fetch({dataType: 'jsonp'});

      return this.view;
    },

    start: function() {
      this.show();
    },

    show: function() {
      //Pattern 2
      app.layoutController.view.viewContainers.contentContainer.show(this.view);
    },

    update: function(args) {
      //do stuff
    }

  });

  return BaseViewController;

});
```
### <strong>Using Layouts</strong>

* Typically, layouts will be used in cases where you need nested views.
* Layouts can manage an unlimited number of views and viewContainers.
* Layout is a type of view and it has a dust template to be rendered. The template can have 1 or more placeholders/target elements for the dependent views or viewContainers of the layout.
* Views and viewContainers are defined in the initialize() method.
* The names that are chosen for the views and viewContainers are directly accessable as properties on the layout instance.
* When the layout is rendered all of its dependent views are rendered automatically.

Here is a full example of defining a Layout object, with 2 views and 1 viewContainer:

```js

define([
  'foobunny',
  'views/header_view',
  'views/footer_view',
  'viewcontainers/content_view_container'
], function(Foobunny, HeaderView, FooterView, ContentViewContainer){
  'use strict';

  var PageLayout = Foobunny.Layout.extend({

    initialize: function () {
      //Here's an example of associating/instantiating dependent views
      this.views = {
        //"header" and "footer" are the names that you choose here to be able
        //to reference these views later on (see below)
        header: new HeaderView({
          el: '#header_view',
          template:'header'
        }),
        footer: new FooterView({
          el: '#footer_view',
          template:'footer'
        })
      };
      //Here's an example of associating/instantiating dependent viewContainers
      this.viewContainers = {
        //"contentContainer" is a name that you choose that is relevant to your context
        contentContainer: new ContentViewContainer({
          el:'#content_view_container'
        })
      };
    },

    //this is the Layout's template, that must contain the above referenced DOM elements/targets
    //for #header_view, #footer_view, and #content_view_container
    template:'page_layout'

  });
  return PageLayout;
});
```

```js
Given this for an instance definition:
var myPageLayout = new PageLayout();

You can access the layout's views and viewContainers like:
myPageLayout.views.header;
myPageLayout.views.footer;
myPageLayout.viewContainers.contentContainer.show(myContainerManagedView);
NOTE: "header" and "contentContainer" are the names that were user-defined in the initialize()
method of the Layout
```

### <strong>Using ViewContainers</strong>

* A ViewContainer performs the very simple function of rendering a view inside of its DOM element. If the ViewContainer has a current view, it will be removed from the DOM to make way for the new one.

Here are a few patterns for using ViewContainer:
```js
  //Create a view container.
  //IMPORTANT: You must always provied an el for the ViewContainer
  var viewContainer = new ViewContainer({ el: "#my_viewContainer_target"});

  //Create a view (BaseView in this case)
  var myBaseView1 = new Foobunny.BaseView({
    model: new Foobunny.BaseModel({testProp:'testVal1'})
  });

  //Show the view (myBaseView1)
  var showPromise = viewContainer.show(myBaseView1);
  showPromise.done(function(){
    // the content should reflect the model of myBaseView1
    console.log(viewContainer.$el[0].firstChild.innerText); //"testVal1"
  });

  //Create second view
  var myBaseView2 = new Foobunny.BaseView({
    model: new Foobunny.BaseModel({testProp:'testVal2'})
  });

  //Show a new view instance (myBaseView2) and expect old view (myBaseView1) is disposed
  var showPromise = viewContainer.show(myBaseView2);
  showPromise.done(function(){
    // the content should now reflect the model of myBaseView2
    console.log(viewContainer.$el[0].firstChild.innerText); //"testVal2"
    // and the first view should have been disposed
    console.log(myBaseView1.disposed); //true
  });

  //Dispose viewContainer and its associated view
  viewContainer.dispose();
  console.log(viewContainer.disposed); //true
  console.log(myBaseView2.disposed); //true
  // the target div should be empty again
  console.log($("#my_viewContainer_target")[0].innerText); // "" (empty)

```

### Using BaseModel & BaseCollection

  * BaseModel & BaseCollection extend Backbone.Model & Backbone.Collection with the generically named dispose method that removes the object and its dependents and corresponding event handlers.
  * Typically, you would `fetch` data for you model or collection inside the initialize method of the corresponding view, or better yet, if possible, in the initialize method of the related controller.
  * For both BaseModel & BaseCollection, the `fetch` method returns a promise. For the BaseModel, you may need to handle this yourself. For the BaseCollection, if you use the CollectionView, the promise will be automatically handled correctly for you. Rendering will start after the `fetch` is complete.
  * If you need to pass information to the server using HTTP headers you can do so in the fetch method of BaseModel or BaseCollection like so: `fetch({headers: {'Authorization' :'Basic USERNAME:PASSWORD'} });`

Here's a typical BaseModel setup:
```js
define([
  'foobunny'
], function(Foobunny){
  'use strict';

  var MyModel = Foobunny.BaseModel.extend({
    url: 'path/to/my/endpoint',
  });

  return MyModel;

});
```

Here's a typical BaseCollection setup:
```js
define([
  'foobunny'
], function(Foobunny){
  'use strict';

  var MyCollection = Foobunny.BaseCollection.extend({

    url: 'path/to/my/endpoint',

    parse: function(response) {
      return response;
    }

  });

  return MyCollection;

});
```

### Patterns For Optimizing Network Communication

* Each page contains models and views. There are 2 ways of retreiving those models and views: bootstrapping and subsequent API calls.

  * 1 - Bootstrapping:
    * Any model or view that is known at the moment of server side construction of the HTML source of any given page can be inserted into that HTML source directly

```html
This is our recommended way of bootstrapping in index.html:
<script src="/scripts/lib/require.js"></script>
<script>
  define("bootstrap", [], function() {
    'use strict';

    var bootstrap = {
      locale: 'en-US'
    }
    return bootstrap;
  });
</script>
<script>
  require(['../scripts/config'], function (config) {
    require(['main']);
  });
</script>
```
  * 2 - API Calls:
    * All subsequent user prompted data requests will occur via API calls to the server.

```js
TODO: example.
```

### The Event System
  * Foobunny presents you with 3 different ways to manage events:
  * <strong> object-to-object communication</strong> (through Backbone Event methods that are placed on every object)
    * is configured with `this.listenTo(entity, event, callback)` or `this.listenToOnce(entity, event, callback)`
    * is disposed with `this.stopListening([entity] , [event] , [callback])`
    * (the use of `on()` and `off()` should be avoided but may be needed in special cases)

  * <strong> generic publish/subscribe mechanism </strong> (also available on every object)
    * is configured with:
        * `this.subscribeEvent(event, callback)`
        * `this.publishEvent(event, args)`
    * is disposed with:
        * `this.unsubscribeEvent(event, callback)`
        * `this.unsubscribeAllEvents()`
  * <strong> DOM event handling </strong>(available on the view objects through jQuery's event mechanism)
    * is configured with the events property of a view:
       `events: {"click .button.delete", "onDelete"}`
    * is disposed automatically during a view's `remove()` or `empty()` call
  * All of the above events are automatically disposed of in the view's `dispose()` call, though you may also dispose them directly as documented above.

# TODOs:

### Object vs Instance Patterns
  * TODO: which properties belong on objects vs. instances.

### The Render Cycle: Deferreds & Promises
  * Foobunny go hop hop
