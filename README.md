# Darth Midlo's Happy Habitat

### Udacity FEND Neighborhood Map Project

***

![alt text](https://github.com/LeaDD/fend-neighborhood-map/blob/master/neighborhood-map.jpg "The neighborhood map")

#### Installation

Clone the [GitHub repository](https://github.com/LeaDD/fend-neighborhood-map), navigate to the *dist* folder and launch index.html.

```
$ git clone https://github.com/LeaDD/frontend-nanodegree-arcade-game.git
$ cd dist
$ xdg-open index.html
```

Or you can access on the web @ [https://leadd.github.io/fend-neighborhood-map/dist/index.html](https://leadd.github.io/fend-neighborhood-map/dist/index.html).

To build from source you must first install the Grunt task runner. If you do not already have a global install see [Grunt's homepage](https://gruntjs.com/) for reference. You will then need to install the htmlmin, cssmin, uglify and jshint plugins.

```
$ npm install grunt-contrib-jshint --save-dev
$ npm install grunt-contrib-cssmin --save-dev
$ npm install grunt-contrib-htmlmin --save-dev
$ npm install grunt-contrib-uglify --save-dev
```

Again, see the Grunt main and plugin pages for further details. Once Grunt and the appropriate plugins are installed execute the *grunt* command from anywhere in the directory.

```
$ grunt
```

#### About

This project is meant to incorporate the use of one or more third party JavaScript libraries as well as content from one or more APIs into a neighborhood map displayed in Google Maps. For my submission I chose to get 'venues' from a small town in North Texas, which just happens to be home to the much loved Darth Midlo.

Technologies Used:

- The holy trinity i.e. HTML5, CSS3 and JavaScript.
- jQuery & jQuery UI
- Bootstrap
- Knockout JS
- Google Maps
- Foursquare API

#### Usage

When the site is initally opened it will display a large map with about three dozen markers placed. Selecting any marker will cause it to animate and an infowindow will open displaying additional information about the location. If the initial viewport size is greater than 992 pixels (desktop/laptop size) there will be a list of the marked locations as well as an input box to the left of the map. If the viewport is adjusted to or begins at below 992 pixels the select list and filter will slide off screen and a 'hamburger menu' will appear. Clicking the menu will cause the select list and input to slide back into view atop the map.

Clicking on any of the list items will cause the corresponding marker to animate and the infowindow to open. Entering a string into the input will filter the list, and corresponding markers, to only return items which contain that string.

#### Future

1) Autocomplete filter input.
2) Directions.
3) Filter by business type.

#### License

Darth Midlo's Happy Habitat is released under the [MIT License](LICENSE.txt)