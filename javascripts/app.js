/* FIXME: need a better algorithm to fast detect .log on screen

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

var scrollTimer = null;
$(window).on('scroll', function() {
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(function() { fixedOnScroll(); }, 100);
});
*/

var highlightText = function() {
    var url = document.location.toString();

    $('.text-highlight').removeClass('text-highlight');

    if (url.match('#')) {
        if (url.split('#')[1]) {
            $('#'+url.split('#')[1]).addClass('text-highlight');
            window.scrollTo(0, $('#'+url.split('#')[1]).closest('.media').offset().top);
        }
    }

};

$(function() {
    if (typeof(JSON_URL) != 'undefined') {
        var speakers = [],
            avatars = [],
            sidebarTmpl = Handlebars.compile($("#sidebar-template").html()),
            speechTmpl = Handlebars.compile($("#speech-template").html()),
            $logs = $('<div />');

        $('<div id="loading">').text('載入中...').appendTo('body');
        $.getJSON(JSON_URL)
            .fail(function() {
                $('#loading').text('載入失敗：沒有找到檔案');
            })
            .success(function(data) {
                $.each(data, function(i) {
                    if (this[0] && this[0].type === 'interp') {
                        var $l, $well, $people, avatar_pos;

                        $l = $('<div class="interp" />');

                        $well = $('<div class="well" />');
                        $people = $('<div class="people" />');
                        $.each(this[0].people, function() {
                            $people.append('<span>' + this + '</span>、');
                        });
                        $well.append($people);
                        $l.append($well);

                        $.each(this[1], function(j) {
                            var speaker = this.speaker;
                            avatar_pos = $.inArray(speaker, speakers);
                            if (avatar_pos < 0) {
                                speakers.push(speaker);
                                avatars.push(CryptoJS.MD5("MLY/" + speaker.replace(/(委員|院長|主任|部長)+/, "")).toString());
                                avatar_pos = avatars.length - 1;
                            }

                            $l.append(speechTmpl({
                                "avatar": avatars[avatar_pos],
                                "speaker": this.speaker,
                                "content": this.content,
                                "encoded_content": encodeURIComponent(speaker.replace(/(委員|院長|主任|部長)+/, "") + "：「" + this.content + "」"),
                                "url": encodeURIComponent(window.location.href.split('#')[0]
) + '%23p' + i + '-' + j,
                                "speech_pos": 'p' + i + '-' + j
                            }));
                        });
                        $logs.append($l);
                    }
                });

                $('#log').append($logs);

                $('#sidebar').html(sidebarTmpl({ "speakers": speakers }));

                $(window).bind('hashchange', function() {
                    highlightText();
                });
                $(window).trigger('hashchange');

                if ($logs.find('div').length) {
                    $('#loading').text('載入完成').fadeOut(1000);
                } else {
                    $('#loading').text('載入失敗：檔案裡沒有可顯示的內容');
                }


            });

        $('#sidebar').on('click', '.filter', function(e) {
            e.preventDefault();

            $('.log .media').removeClass('media-highlight');
            if ($(this).closest('li').hasClass('active')) {
                $(this).closest('li').removeClass('active');
            } else {
                $(this).closest('li').addClass('active')
                    .siblings().removeClass('active');

                var $highlights = $('.media-heading:contains("' + $(this).data('filter') + '")').closest('.media');
                $highlights.addClass('media-highlight');

                window.scrollTo(0, $highlights.closest('.interp').offset().top);
            }
        });

    }
});
