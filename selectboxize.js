/**
 * Selectboxize - jQuery Custom Selextboxes
 *
 * Pavol Sopko, Krzysztof Suszyński
 * Copyright 2012, Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
**/
$.fn.selectboxize = function(options) {
  var settings = {
    theme: 'selectboxize',
    listboxMaxSize: 15,
    replaceInvisible: false,
    callback: null
  };

  // Class that will be applied to all replaced selectboxes.
  var commonClass = 'fake-custom-selectbox-replaced';

  var listOpen = false;

  var showList = function(listObj) {
    listOpen = true;
    listObj.addClass('opened');

    $(document).bind('click.selectboxize', onBlurList);

    return listObj;
  }

  var hideList = function(listObj) {
    listOpen = false;
    listObj.removeClass('opened')
      .parent().css('z-index', 1);

    $(document).unbind('click.selectboxize');

    return listObj;
  }

  var onBlurList = function(e) {
    var currentListElements = $('.' + settings.theme + '-list:visible').parent().find('*').andSelf();

    if ($.inArray(e.target, currentListElements) < 0 && listOpen) {
      hideList($('.' + settings.theme + '-list'));
    }

    return false;
  }

  // Processing settings.
  settings = $.extend(settings, options || {});

  // Wrapping all passed elements.
  return this.each(function() {
    var _this = $(this);

    if (_this.filter(':visible').length == 0 && !settings.replaceInvisible)
      return;

    var replacement = $(
      '<div class="' + settings.theme + ' ' + commonClass + '">' +
        '<div class="' + settings.theme + '-more" />' +
        '<div class="' + settings.theme + '-list" />' +
        '<span class="' + settings.theme + '-current" />' +
      '</div>'
    );

    $('option', _this).each(function(k, v) {
      var v = $(v);
      var listElement =  $('<span class="' + settings.theme + '-item item-' + k + '" data-value="' + v.val() + '">' + v.text() + '</span>');

      listElement.click(function(event) {
        var thisListElement = $(this);

        var thisReplacment = thisListElement.parents('.'+settings.theme);
        var thisIndex = thisListElement[0].className.split(' ');

        for (k1 in thisIndex) {
          if (/^item-[0-9]+$/.test(thisIndex[k1])) {
            thisIndex = parseInt(thisIndex[k1].replace('item-',''), 10);
            break;
          }
        };

        var thisValue = thisListElement[0].className.split(' ');

        for (k1 in thisValue) {
          if (/^value-.+$/.test(thisValue[k1])) {
            thisValue = thisValue[k1].replace('value-','');
            break;
          }
        };

        thisReplacment
          .find('.' + settings.theme + '-current')
          .text(thisListElement.text());

        $(thisReplacment.find('option')).removeAttr('selected');

        $(thisReplacment.find('option')[ thisIndex ]).attr('selected', 'selected');
        $(thisReplacment.find('select')).trigger('change');

        var thisSublist = thisReplacment.find('.' + settings.theme + '-list');

        if ($.isFunction(settings.callback)) {
          settings.callback.call(this, this, event);
        }

        if (thisSublist.filter(":visible").length > 0) {
          hideList(thisSublist);
        } else {
          showList(thisSublist);
        }

        return false;
      });

      $('.' + settings.theme + '-list', replacement).append(listElement);

      if(v.filter(':selected').length > 0) {
        $('.'+settings.theme + '-current', replacement).text(v.text());
      }
    });

    replacement.addClass(_this.attr('class'));
    replacement.insertBefore(_this);
    cl = _this.hide().clone(true)
    cl.appendTo(replacement);
    _this.remove();
    _this = cl;

    replacement.click(function(event) {
      $(this).css('z-index', 1000);

      var thisMoreButton = $(this).find('.' + settings.theme + '-more');

      var otherLists = $('.' + settings.theme + '-list')
        .not(thisMoreButton.siblings('.' + settings.theme + '-list'));

      hideList(otherLists);

      var thisList = thisMoreButton.siblings('.' + settings.theme + '-list');

      showList(thisList);

      return false;
    });

    var thisListBox = replacement.find('.' + settings.theme + '-list');
    var thisListBoxSize = thisListBox.find('.' + settings.theme + '-item').length;

    if (thisListBoxSize > settings.listboxMaxSize)
      thisListBoxSize = settings.listboxMaxSize;

    if (thisListBoxSize == 0)
      thisListBoxSize = 1;    

    replacement.css('width', _this.width());

    thisListBox.css({
      'width': _this.width(),
      'height': settings.listboxMaxSize * 24
    });
  });
}
