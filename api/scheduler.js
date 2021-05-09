const axios = require("axios").default
const sendEmail = require("../helpers/send-mail")

const url =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin"

function processData(data, min_age_limit = 18) {
  let avlSession = []
  const out = data.centers.reduce((p, c) => {
    if (c.sessions && c.sessions.length) {
      avlSession = c.sessions
        .filter(
          x =>
            x.min_age_limit === parseInt(min_age_limit) &&
            x.available_capacity > 0
        )
        .map(x => ({
          available: x.available_capacity,
          vaccine: x.vaccine,
          age: x.min_age_limit,
        }))
    }
    if (avlSession && avlSession.length) {
      p[c.center_id] = { address: c.address, avlSession }
    }
    return p
  }, {})
  return out
}

function fetchSchedule(pincode, date, min_age_limit) {
  return axios.get(url, {
    params: { pincode, date },
    headers: {
      "Accept-Language": "hi_IN",
      accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    },
  })
}

module.exports = async function execute(req, res) {
  const { pin, date, age } = req.query
  console.log(req.query)
  let msg = "Please provide valid pincode and date."
  try {
    if (pin && date) {
      const response = await fetchSchedule(pin, date, age)
      const data = processData(response.data, age)
      console.log(data)
      if (Object.entries(data).length) {
        sendEmail(JSON.stringify(data))
      }
      msg = "Scheduler has started"
    }
  } catch (e) {
    console.log(e)
    msg = "Something wrong has happend!"
  } finally {
    res.send(msg)
  }
}
