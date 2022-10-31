const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

exports.googlePlaces = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(401).json({
        message: "Not allowed",
      });
    }

    return axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.search}&key=${process.env.GOOGLE_API_KEY}`
      )
      .then((response) => {
        console.log(response.data);
        return res.status(200).send(response.data);
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
  });
});
