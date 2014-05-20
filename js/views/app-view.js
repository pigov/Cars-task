var app = app || {};

(function ($) {
    'use strict';

    app.AppView = Backbone.View.extend({
        el: '#container',
        events: {
            'click .submit': 'onItemSubmit',
            'click #filter-stock': 'filterStock',
            'keypress .input': 'updateOnEnter'
        },

        initialize: function () {
            this.$inputTitle = this.$('.input-make');
            this.$inputModel = this.$('.input-model');
            this.$inputYear = this.$('.input-year');
            this.$inputStock = this.$('#input-stock');
            this.$filterStock = this.$('#filter-stock');
            this.$main = this.$('#listHolder');
            this.$list = this.$('#list');

            this.listenTo(app.cars, 'add', this.addOne);
            this.listenTo(app.cars, 'reset', this.addAll);
            this.listenTo(app.cars, 'change:completed', this.filterOne);
            this.listenTo(app.cars, 'filter', this.filterAll);
            this.listenTo(app.cars, 'all', this.render);

            app.cars.fetch({reset: true});
        },

        render: function () {
            this.$main.show();
        },

        addOne: function (car) {
            var view = new app.CarView({ model: car }),
                el = view.render().el;
            this.$list.append( el );
        },

        addAll: function () {
            this.$list.html('');
            app.cars.each(this.addOne, this);
        },

        filterOne: function (car) {
            car.trigger('visible');
        },

        filterAll: function () {
            app.cars.each(this.filterOne, this);
        },

        filterStock: function() {
            var _this = this;
            app.cars.filterStock = this.$filterStock.is(":checked");
            if ( app.cars.filterStock ) {
                _.each( app.cars.search( { inStock: false }), function( car ) {
                    _this.filterOne( car );
                } );
            } else {
                this.filterAll();
            }

        },

        newAttributes: function () {
            var result = {
                make: this.$inputTitle.val().trim(),
                model: this.$inputModel.val().trim(),
                year: this.$inputYear.val().trim(),
                inStock: this.$inputStock.is(":checked"),
                order: app.cars.nextOrder()
            };
            return result;
        },

        onItemSubmit: function () {
            if ( this.$inputTitle.val() == '' || this.$inputModel.val() == '' || this.$inputYear.val() == '' ) {
                alert("You have not entered value");
                return false;
            }
            var options = this.newAttributes();
            app.cars.create( options );

            this.$inputTitle.val('');
            this.$inputModel.val('');
            this.$inputYear.val('');
        },

        updateOnEnter: function(e) {
            if (e.which === ENTER_KEY) {
                this.onItemSubmit();
            }
        }

    });
})(jQuery);
