const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/user");
const locationModel = require("../models/location");
const https = require("https");

router.get("/crops", (req, res) => {
  if (req.isAuthenticated()) {
    result = locationModel.findOne(
      { name: req.user.location },
      (err, result) => {
        // console.log(req.user + " result it is");
        if (err) {
          console.log(err);

          return res.redirect("/login");
        } else {
          if (result && result.crops) {
            let crops = result.crops;

            let cityName = req.user.location;
            var appID = process.env.OPEN_WEATHER_MAP_API_KEY;
            var units = "metric";
            const url =
              "https://api.openweathermap.org/data/2.5/weather?q=" +
              cityName +
              "&units=" +
              units +
              "&appid=" +
              appID;
            https.get(url, (response) => {
              // console.log(response.statusCode);
              response.on("data", (data) => {
                const wetherData = JSON.parse(data);
                // console.log(wetherData);
                const tmp = wetherData.main.temp;
                const desc = wetherData.weather[0].description;
                // console.log(desc);
                const imgID = wetherData.weather[0].icon;
                var iconurl =
                  "http://openweathermap.org/img/wn/" + imgID + "@2x.png";
                obj = {
                  temp: tmp,
                  cond: desc,
                  iurl: iconurl,
                };
                res.render("cropsInfo", {
                  crops: crops,
                  whe: obj,
                  cityName: req.user.location,
                });
              });
              return;
            });
          } else {
            console.log(
              "Location not found or crops not defined for this location."
            );
            res.redirect("/login");
          }
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

router.get("/crops/add/:cropName", (req, res) => {
  if (req.isAuthenticated()) {
    locationModel.findOne({ name: req.user.location }, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        for (let index = 0; index < req.user.harvest.length; index++) {
          if (req.user.harvest[index].cropName == req.params.cropName) {
            return res.redirect("/crop/" + req.params.cropName);
          } else {
            req.user.harvest.push({
              cropName: req.params.cropName,
              harDate: new Date(),
            });
            req.user.save();
            return res.redirect("/crop/" + req.params.cropName);
          }
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/crop/:cropName", (req, res) => {
  if (req.isAuthenticated()) {
    locationModel.findOne({ name: req.user.location }, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        for (let index = 0; index < req.user.harvest.length; index++) {
          if (req.user.harvest[index].cropName == req.params.cropName) {
            for (let i = 0; i < result.crops.length; i++) {
              if (result.crops[i].name == req.params.cropName) {
                return res.render("roadmap", { sch: result.crops[i].schedule });
              }
            }
          }
        }
        return res.send("Crops Not Harvested");
      }
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
