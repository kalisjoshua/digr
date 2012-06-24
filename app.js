var digr = (function () {
    return {
        input: function (span) {
            span = span.html().replace(/&nbsp;/gi, "");

            return $("<input>")
                .attr("size", 1 + (span.length || 1))
                .on("blur", function () {
                    $.publish("field.close", [$(this)]);
                })
                .on("keydown", function (event) {
                    var self = $(this)
                        .attr("size", 1 + (this.value.length || 1));

                    // if (event.keyCode === 9) {
                    //     self
                    //         // .parents("div")
                    //         // .siblings()
                    //         // [["first", "last"][+!event.shiftKey]]()
                    //         // .find("span")
                    //         // .trigger("click");

                    //     event.preventDefault();
                    // }
                })
                .val(span);
        }
    };
}());

$.fn.ready(function () {
    $("span")
        .addClass("empty")
        .html("&nbsp;")
        .on("click", function () {
            $.publish("field.open", [$(this)]);
        });

    $("li")
        .on("click", function (event) {
            var target = $(event.target);

            if (event.altKey) {
                !target.find("ul").length && target.append("<ul>");

                target
                    .find("ul")
                    .first()
                    .append("<li>dig deep!");

                event.preventDefault();
            }
        });
});

/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
(function(a){var b=a({});a.subscribe=function(){b.on.apply(b,arguments)},a.unsubscribe=function(){b.off.apply(b,arguments)},a.publish=function(){b.trigger.apply(b,arguments)}})(jQuery)

$.subscribe("field.close", function (event, editor) {
    editor
        .parent()
        .html(editor.val() || "&nbsp;")
        .toggleClass("empty", /^(?:&nbsp;)*$/.test(editor.val()));
});

$.subscribe("field.open", function (event, span) {
    if (!span.children().first().length) {
        var editor = digr.input(span);

        span
            .removeClass("empty")
            .html(editor);

        editor.focus();
    }
});

// wyandotte medical
// room 351
