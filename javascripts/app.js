var fixedOnScroll = function() {
    var w_pos = $(window).scrollTop(),
        w_height = $(window).height();

    $('.log .media').each(function() {
        var $that = $(this),
            top = $that.offset().top,
            bottom = top + $that.height(),
            avatar_height = $('.avatar img', this).height();

        if ( $that.height() < w_height ) {
            return;
        }

        if ( top < w_pos && bottom - avatar_height > w_pos ) {
            $that.addClass('fixed');
        } else {
            $that.removeClass('fixed');
        }
    });
};

var highlightText = function() {
    var url = document.location.toString();

    $('.text-highlight').removeClass('text-highlight');

    if (url.match('#')) {
        if (url.split('#')[1]) {
            $('#'+url.split('#')[1]).addClass('text-highlight');
        }
    }
};

//$(window).on('scroll', function() { fixedOnScroll(); });

$(function() {

    $.getJSON(JSON_URL, function(data) {
        $.each(data, function() {
            if (this[0].type === 'interp') {
                $('#log').append('<hr>');

                var $ul = $('<ul>');
                $.each(this[0].people, function() {
                    $ul.append('<li>' + this + '</li>');
                });
                $('#log').append($ul);

                var $l = $('<div>');

                $.each(this[1], function() {
                    $l.append('<div class="media"><a class="avatar pull-left" href="#"><img class="media-object" src="http://placehold.it/100"></a><div class="media-body"><h4 class="media-heading">' + this.speaker + '</h4><p id="p1-1">' + this.content + '</p></div></div>');
                });
                $('#log').append($l);
            }
        });

    });
/*
    $(window).bind('hashchange', function() {
        highlightText();
    });

    $(window).trigger('hashchange');

    $('#sidebar .filter').on('click', function(e) {
        e.preventDefault();

        $('.log .media').removeClass('media-highlight');
        if ($(this).parents('li').hasClass('active')) {
            $(this).parents('li').removeClass('active');
        } else {
            $(this).parents('li').addClass('active')
                .siblings().removeClass('active');
            $('.media-heading:contains("' + $(this).data('filter') + '")').parents('.media').addClass('media-highlight');
        }
    });*/
});
