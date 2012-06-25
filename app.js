var digr = (function () {
    function tabNav (obj, forward) {
        var collection = $(obj[0].tagName);

        collection
            .eq(([-1, 1][+!forward]) + collection.index(obj))
            .click();
    }

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

                    if (event.keyCode === 9) {
                        self.val() && $.publish("field.addChild", [self.parents("li")]);

                        tabNav(self.parent(), event.shiftKey);

                        self.blur();

                        event.preventDefault();
                    }
                })
                .val(span);
        }
    };
}());

$.fn.ready(function () {
    $("span")
        .addClass("empty")
        .html("&nbsp;")
        .live("click", function () {
            $.publish("field.open", [$(this)]);
        });

    $("li")
        .on("click", function (event) {
            if (event.altKey) {
                $.publish("field.addChild", [$(event.target)]);

                event.preventDefault();
            }
        });
});

/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
(function(a){var b=a({});a.subscribe=function(){b.on.apply(b,arguments)},a.unsubscribe=function(){b.off.apply(b,arguments)},a.publish=function(){b.trigger.apply(b,arguments)}})(jQuery)

$.subscribe("field.addChild", function (event, target) {
    console.log(target)
    !target.find("ul").length && target.append("<ul>");

    target
        .find("ul")
        .first()
        .append("<li><span>&nbsp;");
});

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

// wyandotte general
// room 351
