'use strict';
import $ from 'jquery'; 
import * as dummy from 'modules/dummy';

describe('Give it some context', () => {
    describe('maybe a bit more context here', () => { 
        it('should run here few assertions', (done) => { 
            expect($).to.exist;
            expect(dummy).to.exist;
            expect(dummy.msg).to.equal('I\'m an awesome dummy module');
            done();             
        });
    });
});