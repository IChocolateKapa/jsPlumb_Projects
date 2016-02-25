/**
 * Created by Echo on 2016/2/23.
 */
/*var vm = new Vue({
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
        fullName: 'Foo Bar'
    }
});

vm.$watch('firstName', function (val) {
    this.fullName = val + ' ' + this.lastName
});

vm.$watch('lastName', function (val) {
    this.fullName = this.firstName + ' ' + val
});*/

(function () {
    var vm = new Vue({
        el: '#demo',
        created: function () {
            // `this` Ö¸Ïò vm ÊµÀı
            console.log('a is: ' + this.firstName)
        },
        data: {
            firstName: 'Foo',
            lastName: 'Bar'
        },
        computed: {
            fullName: function () {
                return this.firstName + ' ' + this.lastName
            }
        }
    });

    vm.$el === document.getElementById('demo') // -> true
})();
