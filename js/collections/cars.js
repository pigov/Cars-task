var app = app || {};

(function () {
    'use strict';
    var Cars = Backbone.Collection.extend({
        model: app.Car,
        filterStock: false,

        localStorage: new Backbone.LocalStorage('cars'),

        search: function( filterObj ) {
            return _.clone( this.where( filterObj ) );
        },

        inStock: function () {
            var result = this.filter(function (car) {
                return car.get('inStock');
            });
            return result;
        },

        nextOrder: function () {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        }
    });

    app.cars = new Cars();
})();
