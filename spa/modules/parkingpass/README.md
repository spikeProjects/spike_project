# Add Parking Pass Component (module/parkingpass)

Displays the LOWEST PRICE parking pass for the single-listing event ID passed to component. Links to the related parking event so you can change or add up to 4 parking passes.

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

Copy the AppCommon repository to a local directory. Open a terminal window. Navigate to the /ui-war/src/main/spa/modules/parkingpass folder and run 'grunt sh_module'

```
$ cd ui-war/src/main/spa/modules/parkingpass
$ grunt sh_module
```

Copy the files built in ui-war/src/

## Usage

Inject the module into your code using any [standard method](http://krasimirtsonev.com/blog/article/Dependency-injection-in-JavaScript "Javascript injection examples").

Constructor:

```
var parkingPass = new ParkingPass({
    'element': '[CSS selector]',
    'attributes': parkingAttributes
});
```

### params:

element - element is an [element](https://developer.mozilla.org/en-US/docs/Web/API/element "Element definition") object defined by a string containing one [CSS selector](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors "CSS Selector definition"). attributes

attributes to be passed for parking component:

- parkingEventId: required
- qty: required if quantity > 1 default 1
- priceType: listingPrice/currentPrice default 'listingPrice',
- parkingSelected: false/true default false

### returns

Foobunny.BaseView

## Support

Please [open an issue](https://jira.stubcorp.com) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). [Create a branch](https://github.corp.ebay.com/Stubhub/app-common), add commits, and [open a pull request](https://github.corp.ebay.com/Stubhub/app-common/compare).
