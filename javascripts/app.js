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
            window.scrollTo(0, $('#'+url.split('#')[1]).parents('.media').offset().top );
        }
    }

};

//$(window).on('scroll', function() { fixedOnScroll(); });

$(function() {

    var avatars = [];
    window.avatars = avatars;

    $.getJSON(JSON_URL, function(data) {
        $.each(data, function(i) {
            if (this[0].type === 'interp') {
                var $ul, $l, avatar_pos;
                $('#log').append('<hr>');

                $ul = $('<ul>');
                $.each(this[0].people, function() {
                    $ul.append('<li>' + this + '</li>');
                });
                $('#log').append($ul);

                $l = $('<div>');

                $.each(this[1], function(j) {
                    var speaker = this.speaker.replace(/(委員|院長|主任)+/, "");
                    avatar_pos = $.inArray("MLY/" + speaker, avatars);

                    if (avatar_pos < 0) {

                        avatars.push("MLY/" + speaker);
                        avatars.push(CryptoJS.MD5("MLY/" + speaker).toString());
                        avatar_pos = avatars.length - 2;
                    }
                    $l.append('<div class="media"><a class="avatar pull-left" href="#"><img class="media-object" src="http://avatars.io/50a65bb26e293122b0000073/'+ avatars[avatar_pos+1] + '"></a><div class="media-body"><h4 class="media-heading">' + this.speaker + '</h4><p id="p' + i + '-' + j + '">' + this.content + '<a href="#p' + i + '-' + j + '">#</a></p></div></div>');
                });
                $('#log').append($l);
            }
        });
        $(window).bind('hashchange', function() {
            highlightText();
        });
        $(window).trigger('hashchange');
    });

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
