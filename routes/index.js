var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('underscore');

DEFAULT = {
  lat: 39.106316,
  lng: -84.515826,
  radius: 250
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    lat: DEFAULT.lat,
    lng: DEFAULT.lng,
    radius: DEFAULT.radius
  });
});

router.post('/', function(req, res, next) {
  var url = 'https://api.spatial.ai/poi/proximity' +
      '?apikey=' + process.env.API_KEY +
      '&lat=' + req.body.lat +
      '&lng=' + req.body.lng +
      '&radius=' + req.body.radius;
  request(url, function(err, response, body) {
    if (response.statusCode !== 200) {
      console.error(body);
      return res.render('index', {
          lat: req.body.lat,
          lng: req.body.lng,
          radius: req.body.radius,
        error: JSON.parse(body).error
      });
    }
    res.render('index', {
      lat: req.body.lat,
      lng: req.body.lng,
      radius: req.body.radius,
      searchResults: _.filter(JSON.parse(body), function(x) { return _.contains(x.type, 'drink_coffee'); })
    });
  });
});

module.exports = router;
