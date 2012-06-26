
/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
;(function(a){var b=a({});a.subscribe=function(){b.on.apply(b,arguments)},a.unsubscribe=function(){b.off.apply(b,arguments)},a.publish=function(){b.trigger.apply(b,arguments)}})(jQuery);

;(function () {
    var
         emptyListItems = function () {return !$(this).find("span").html().replace(rnbsp, "").length;}
        ,emptyLists = function () {return $(this).children().length === 0}
        ,nbsp  = "&nbsp;"
        ,rnbsp = /^(?:&nbsp;)*$/i;

    function blur (event) {
        $.publish("field.close", [$(this)]);
    }

    function input (span) {
        return $("<input>")
            .attr("size", 1 + (span.html().length || 1))
            .on("blur", blur)
            .on("keydown", keydown)
            .val(span.html());
    }

    function keydown (event) {
        var self = $(this)
            .attr("size", 1 + (this.value.length || 1));

        // {keyCode : 9} tab key
        if (event.keyCode === 9) {
            self.val() && $.publish("field.addChild", [self.parents("li").first()]);

            nextSpan(self.parent(), !event.shiftKey)
                .click();

            event.preventDefault();
        }
    }

    function nextSpan (obj, forward) {
        var collection = $(obj[0].tagName);

        return collection
            .eq(vector(forward) + collection.index(obj));
    }

    function removeEmptyLists() {
        $("ul")
            .children()
            .filter(emptyListItems)
            .remove()
            .end()
            .filter(emptyLists)
            .remove();
    }

    function vector (bool) {
        return [-1, 1][+bool];
    }

    $.subscribe("field.addChild", function (event, target) {
        !target.find("ul").length && target.append("<ul>");

        target
            .find("ul")
            .first()
            .prepend("<li><span>" + nbsp);
    });

    $.subscribe("field.close", function (event, editor) {
        var span = editor
            .parent()
            .html(editor.val() || nbsp)
            .toggleClass("empty", rnbsp.test(editor.val()));

        removeEmptyLists();
    });

    $.subscribe("field.open", function (event, span) {
        if (!span.children().first().length) {
            span
                .html(span.html().replace(rnbsp, ""));

            var editor = input(span);

            span
                .removeClass("empty")
                .html(editor);

            editor.focus();

            removeEmptyLists();
        }
    });

    $.fn.ready(function () {
        $("span")
            .addClass("empty")
            .html(nbsp)
            .live("click", function () {
                $.publish("field.open", [$(this)]);
            });

        $("ol")
            .children()
            .on("dblclick", function (event) {
                // event.altKey &&
                    $(this)
                        .find("ul")
                        .first()
                        .slideToggle();
            });
    });
}());

// wyandotte general
// room 351
