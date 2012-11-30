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

$(window).on('scroll', function() { fixedOnScroll(); });

$(function() {
    $('#sidebar .filter').on('click', function(e) {
        e.preventDefault();

        $('.log .media').removeClass('highlight');
        if ($(this).parents('li').hasClass('active')) {
            $(this).parents('li').removeClass('active');
        } else {
            $(this).parents('li').addClass('active')
                .siblings().removeClass('active');
            $('.media-heading:contains("' + $(this).data('filter') + '")').parents('.media').addClass('highlight');
        }
    });
});
