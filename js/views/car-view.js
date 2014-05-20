var app = app || {};

(function ($) {
    'use strict';
    app.CarView = Backbone.View.extend({
        tagName:  'li',

        template: _.template($('#car-template').html()),

        events: {
            'dblclick .editable': 'edit',
            'click .destroy': 'clear',
            'click .save': 'close',
            'click .toggle': 'toggleStock',
            'keypress .edit': 'updateOnEnter',
            'keydown .edit': 'revertOnEscape',
            'blur .edit': 'close'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'visible', this.toggleVisible);
        },

        render: function () {
            if (this.model.changed.id !== undefined) {
                return;
            }

            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('inStock', this.model.get('inStock'));
            this.toggleVisible();
            this.$inputMake = this.$('.input-make').val(this.model.get('make'));
            this.$inputModel = this.$('.input-model').val(this.model.get('model'));
            this.$inputYear = this.$('.input-year').val(this.model.get('year'));
            return this;
        },

        toggleVisible: function () {
            this.$el.toggleClass('hidden', this.isHidden());
        },

        isHidden: function () {
            var inStock = this.model.get('inStock');
            return !inStock && app.cars.filterStock;
        },

        toggleStock: function () {
            this.model.toggle();
        },

        edit: function (e) {
            this.$el.addClass('editing');
            this["$input" + e.target.id].focus();
        },

        close: function () {
            if (!this.$el.hasClass('editing')) {
                return;
            }

            this.model.save({
                make: this.$inputMake.val().trim(),
                model: this.$inputModel.val().trim(),
                year: this.$inputYear.val().trim(),
                inStock: this.model.get('inStock')
            });

            this.model.trigger('change');

            this.$el.removeClass('editing');
        },

        updateOnEnter: function (e) {
            console.log(e.which);
            if (e.which === ENTER_KEY) {
                this.close();
            }
        },

        revertOnEscape: function (e) {
            if (e.which === ESC_KEY) {
                this.$el.removeClass('editing');
                this.$inputMake.val(this.model.get('make'));
                this.$inputModel.val(this.model.get('model'));
                this.$inputYear.val(this.model.get('year'));
            }
        },

        clear: function () {
            this.model.destroy();
        }
    });
})(jQuery);
