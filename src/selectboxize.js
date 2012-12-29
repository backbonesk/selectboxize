(function($){
  $.fn.selectboxize = function(options) {
    // Processing options.
    options = $.extend({}, $.fn.selectboxize.options, options);

    var listOpen = false;

    var showList = function(listObj) {
      listOpen = true;
  
      $(document).bind('click.selectboxize', onBlurList);
  
      return listObj.addClass('opened');
    };

    var hideList = function(listObj) {
      listOpen = false;
      listObj.removeClass('opened')
        .parent().css('z-index', 1);
  
      $(document).unbind('click.selectboxize');
  
      return listObj;
    };

    var onBlurList = function(e) {
      var currentListElements = $('.' + options.theme + '-list:visible').parent().find('*').andSelf();
  
      if ($.inArray(e.target, currentListElements) < 0 && listOpen) {
        hideList($('.' + options.theme + '-list'));
      }
  
      return false;
    };

    // Wrapping all passed elements.
    return this.each(function() {
      var _this = $(this);

      if (_this.filter(':visible').length === 0 && !options.replaceInvisible) {
        return;
      }

      var replacement = $(
        '<div class="' + options.theme + ' ' + options.commonClass + '">' +
          '<div class="' + options.theme + '-more" />' +
          '<div class="' + options.theme + '-list" />' +
          '<span class="' + options.theme + '-current" />' +
        '</div>'
      );

      $('option', _this).each(function(k, v) {
        var $value = $(v);
        var listElement =  $('<span class="' + options.theme + '-item" data-item="' + k + '" data-value="' + $value.val() + '">' + $value.text() + '</span>');

        listElement.click(function(event) {
          var $thisListElement = $(this);

          var thisReplacment = $thisListElement.parents('.'+options.theme);

          var thisIndex = $thisListElement.data('item');
          var thisValue = $thisListElement.data('value');

          thisReplacment
            .find('.' + options.theme + '-current')
            .text($thisListElement.text());

          $(thisReplacment.find('option')).removeAttr('selected');

          $(thisReplacment.find('option')[ thisIndex ]).attr('selected', 'selected');

          if ($.isFunction(options.callback)) {
            options.callback.call(this, this, event);
          }

          hideList(thisReplacment.find('.' + options.theme + '-list'));

          return false;
        });

        $('.' + options.theme + '-list', replacement).append(listElement);

        if($value.filter(':selected').length > 0) {
          $('.'+options.theme + '-current', replacement).text($value.text());
        }
      });

      replacement.addClass(_this.attr('class'));
      replacement.insertBefore(_this);
      var cl = _this.hide().clone(true);
      cl.appendTo(replacement);
      _this.remove();
      _this = cl;

      replacement.click(function(event) {
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
        'height': options.listboxMaxSize * 24
      });
    });
  };

  $.fn.selectboxize.options = {
    theme: 'selectboxize',
    commonClass: 'selectboxize-replaced',
    listboxMaxSize: 15,
    replaceInvisible: false,
    callback: null
  };
})(jQuery);
