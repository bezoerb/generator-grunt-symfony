'use strict';
describe('Give it some context', function () {
    describe('maybe a bit more context here', function () {
        it('should run here few assertions', function (done) {
            require(['jquery','modules/dummy'],function($,dummy) {
                expect($).to.exist;
                expect(dummy).to.exist;
                expect(dummy.msg).to.equal('I\'m an awesome dummy module!');
                done();
            });
        });
    });
});
