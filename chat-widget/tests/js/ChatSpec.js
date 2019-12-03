/*
 * chat
 * https://github.com/fdelavega/chat-widget
 *
 * Copyright (c) 2019 FICODES
 * Licensed under the MIT license.
 */

/* globals $, MashupPlatform, MockMP, Chat */

(function () {

    "use strict";

    describe("Chat", function () {

        var widget;

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'widget'
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            widget = new Chat();
        });

        it("Dummy test", function () {
            expect(widget).not.toBe(null);
        });

    });

})();
