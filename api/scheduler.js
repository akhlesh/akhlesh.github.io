const schedule = require("node-schedule");
const axios = require("axios").default;
const sendEmail = require('./send-mail');

const url =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin";
let job;  

function processData(data) {
  let avlSession = [];
  const d =  data.centers.reduce((p, c) => {
    if (c.sessions && c.sessions.length) {
      avlSession = c.sessions
        .filter(
          (x) =>
            x.min_age_limit === parseInt(args.age || 18) &&
            x.available_capacity > 0
        )
        .map((x) => ({ available: x.available_capacity, vaccine: x.vaccine, age: x.min_age_limit }));
    }
    if (avlSession && avlSession.length) {
      p[c.center_id] = { address: c.address, avlSession };
    }
    return p;
  }, {});
  return d;
}

function fetchSchedule(pincode, date) {
  axios
    .get(url, {
      params: { pincode, date },
      headers: {
        "Accept-Language": "hi_IN",
        accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
      },
    })
    .then(function (response) {
      const data = processData(response.data);
      if (Object.entries(data).length) {
        sendEmail(JSON.stringify(data));
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function scheduleSearch(pincode, date) {
  console.log("Scheduler has started.......");
  fetchSchedule(pincode, date);
  job = schedule.scheduleJob("1 * * * * *", function () {
    fetchSchedule(args.pin, args.date);
  });
}


module.exports = (req, res) => {
    const { pin , date } = req.query;
    let msg  = 'Please provide valid pincode and date.';
    if (pin && date) {
        scheduleSearch(pin, date);
        msg = 'Scheduler has started';
    }
    res.send(msg)
}