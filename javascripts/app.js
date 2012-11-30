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

$(window).on('scroll', function() { fixedOnScroll(); });

$(function() {

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
    });
});
