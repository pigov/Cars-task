var app = app || {};

(function () {
    'use strict';
    app.Car = Backbone.Model.extend({
        defaults: {
            make: '',
            model: '',
            year: '',
            inStock: false
        },

        toggle: function () {
            this.save({
                inStock: !this.get('inStock')
            });
        }
    });
})();
