# Selectboxize

Selectboxize is a simple and lightweight JavaScript library for styling and replacing default selectboxes. The library is heavily based on [previous work by Krzysztof Suszyński](http://info.wsisiz.edu.pl/~suszynsk/jQuery/demos/jquery-selectbox/).

## Setup
Just add jQuery and the following dependencies to your site:

``` html
<script src="selectboxize.js"></script>
<link rel="stylesheet" type="text/css" href="selectboxize.css">
```

## Usage
Selectboxize needs to be called on a jQuery node to replace selectboxes, like this:

``` js
$('#demo-selectbox').selectboxize();
```

### Configuration
Selectboxize call can take an optional parameter -- an object of key / value settings:

- **theme** *(default: "selectboxize")* - name of the colour theme prefixing class names applied to replaced selectboxes.
- **commonClass** *(default: "selectboxize-replaced")* - class name that is applied to root element of all replaced selectboxes.
- **listboxMaxSize** *(default: 15)* - maximum number of displayed items in rolled out selectbox without a scrollbar.
- **replaceInvisible** *(default: false)* - replace selectboxes even if they are not displayed (e.g. with `display: none` applied).
- **callback** *(default: null)* - function that runs after a new item has been selected.

### Example
Take a look at the following example, where there is a simple selectbox in HTML:

``` html
<select name="country">
  <option value="1">Slovakia</option>
  <option value="2">Sweden</option>
</select>
```

By running the example the selectbox will be changed into a bunch of HTML nodes and can be styled as such:

``` html
<div class="selectboxize-list selectboxize-replaced" data-selection="0">
  <a href="#" class="selectboxize-list-more"></a>
  <div class="selectboxize-list-list">
    <span class="selectboxize-list-item" data-item="0" data-value="1">Slovakia</span>
    <span class="selectboxize-list-item" data-item="1" data-value="2">Sweden</span>
  </div>
  <span class="selectboxize-list-current">Slovakia</span>
</div>
```

## Contributions
If you have any grand ideas on how to improve Selectboxize and make it more useful or found any bugs, just create an issue or fork the project.

## License
Selectboxize is &copy; 2012 [BACKBONE, s.r.o.](http://www.backbone.sk/en/), 2008 [Krzysztof Suszyński](http://suszynski.org/) and licensed under the terms of [MIT license](https://github.com/palosopko/selectboxize/blob/master/LICENSE.md).
