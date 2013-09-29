(function($){
  $.fn.selectboxize = function(options) {
    // Processing options.
    options = $.extend({}, $.fn.selectboxize.options, options);

    var $openList = null;

    var showList = function(listObj) {
      $openList = listObj;
  
      $(document).on('click.selectboxize', onBlurList)
        .on('keydown.selectboxize', onKeyDown);

      $openList.addClass('opened');

      selectItem(
        $openList.find('[data-item="' + $openList.parent().data('selection') + '"]'));

      return $openList;
    };

    var hideList = function(listObj) {
      $openList = null;

      listObj.removeClass('opened')
        .parent().css('z-index', 1);
  
      $(document).off('click.selectboxize')
        .off('keydown.selectboxize');
  
      return listObj;
    };

    var onBlurList = function(e) {
      var currentListElements = $('.' + options.theme + '-list:visible')
        .parent().find('*').andSelf();
  
      if ($.inArray(e.target, currentListElements) < 0 && $openList.length) {
        hideList($openList);
      }
  
      return false;
    };

    var onKeyDown = function(e) {
      var $selected = $openList.find('.' + options.theme + '-item-hover');

      switch (e.keyCode) {
        case 9:  // tab
        case 27: // esc
          hideList($openList);
          break;

        case 13: // return
        case 32: // space
          if ($selected.length === 1) {
            e.preventDefault();
            $selected.trigger('click');
          }
          break;

        case 38: // up
          event.preventDefault();

          if ($selected.length === 1) {
            selectItem($selected.prev());
          } else {
            selectItem(
              $openList.find('.' + options.theme + '-item').last());
          }

          break;

        case 40: // down
          event.preventDefault();

          if ($selected.length === 1) {
            selectItem($selected.next());
          } else {
            selectItem(
              $openList.find('.' + options.theme + '-item').first());
          }

          break;
      }
    };

    var selectItem = function($item, scrollToItem) {
      if ($item.length !== 1) {
        return false;
      }

      var selectionClassName = options.theme + '-item-hover';

      $item.addClass(selectionClassName)
        .siblings().removeClass(selectionClassName);

      if (scrollToItem !== false) {
        $openList.scrollTop(
          $item.offset().top - $openList.offset().top + $openList.scrollTop());
      }
    };

    // Wrapping all passed elements.
    return this.each(function() {
      var _this = $(this);

      if (_this.filter(':visible').length === 0 && !options.replaceInvisible) {
        return;
      }

      var replacement = $(
        '<div class="' + options.theme + ' ' + options.commonClass + '">' +
          '<a href="#" class="' + options.theme + '-more" />' +
          '<div class="' + options.theme + '-list" />' +
          '<span class="' + options.theme + '-current" />' +
        '</div>'
      );

      $('option', _this).each(function(k, v) {
        var $value = $(v);
        var listElement =  $('<span class="' + options.theme + '-item" data-item="' + k + '" data-value="' + $value.val() + '">' + $value.text() + '</span>');

        listElement.on('click', function(event) {
          var $thisListElement = $(this);

          var thisReplacement = $thisListElement.parents('.' + options.theme);

          var thisIndex = $thisListElement.data('item');
          var thisValue = $thisListElement.data('value');

          thisReplacement
            .data('selection', thisIndex)
            .find('.' + options.theme + '-current')
            .text($thisListElement.text());

          $(thisReplacement.find('option')).removeAttr('selected');

          $(thisReplacement.find('option')[ thisIndex ]).attr('selected', 'selected');

          if ($.isFunction(options.callback)) {
            options.callback.call(this, this, event);
          }

          hideList(thisReplacement.find('.' + options.theme + '-list'));

          return false;
        }).on('mouseover', function() {
          selectItem($(this), false);
        });

        $('.' + options.theme + '-list', replacement).append(listElement);

        if($value.filter(':selected').length > 0) {
          replacement.data('selection', k);

          $('.' + options.theme + '-current', replacement)
            .text($value.text());
        }
      });

      replacement.addClass(_this.attr('class'));
      replacement.insertBefore(_this);
      var cl = _this.hide().clone(true);
      cl.appendTo(replacement);
      _this.remove();
      _this = cl;

      replacement.on('click', function(event) {
        $(this).css('z-index', 1000);

        var thisMoreButton = $(this).find('.' + options.theme + '-more');
        var $openedList = thisMoreButton
          .siblings('.' + options.theme + '-list');

        hideList($('.' + options.theme + '-list').not($openedList));
        showList($openedList);

        return false;
      });

      var thisListBox = replacement.find('.' + options.theme + '-list');
      var thisListBoxSize = thisListBox.find('.' + options.theme + '-item').length;

      if (thisListBoxSize > options.listboxMaxSize) {
        thisListBoxSize = options.listboxMaxSize;
      }

      if (thisListBoxSize === 0) {
        thisListBoxSize = 1;
      }

      replacement.css('width', _this.width());

      thisListBox.css({
        'width': _this.width(),
        'height': Math.min(options.listboxMaxSize, thisListBoxSize) * options.listboxItemHeight
      });
    });
  };

  $.fn.selectboxize.options = {
    theme: 'selectboxize',
    commonClass: 'selectboxize-replaced',
    listboxMaxSize: 15,
    listboxItemHeight: 24,
    replaceInvisible: false,
    callback: null
  };
})(jQuery);
