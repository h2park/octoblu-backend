'use strict';

var request = require('request');

module.exports = function (app) {
    app.post('/api/import/flow', function(req, res) {
        if(req.body.flow){
            req.session.flow = req.body.flow;
            res.redirect('/designer');
            return;
        }
        res.json({ success  : false });
    });

    app.get('/api/get/flow', function(req, res) {
        var flow = req.session.flow;
        console.log('FLOW', flow);
        if(flow){
            req.session.flow = null;
            res.json({ flow : flow });
        }else{
            res.json({ flow : null });
        }
    });
};
