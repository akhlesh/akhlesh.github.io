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

function fetchSchedule(pincode, date) {
  return axios.get(`${url}?pincode=${pincode}&date=${date}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxNDFmYmU4Yi01MzE0LTRkYjktYWNhMS1hODkxMWE4ZDMyZGEiLCJ1c2VyX2lkIjoiMTQxZmJlOGItNTMxNC00ZGI5LWFjYTEtYTg5MTFhOGQzMmRhIiwidXNlcl90eXBlIjoiQkVORUZJQ0lBUlkiLCJtb2JpbGVfbnVtYmVyIjo5NTUyNTUwNjg2LCJiZW5lZmljaWFyeV9yZWZlcmVuY2VfaWQiOjg1MzE1MzM4NjQ2NDQwLCJzZWNyZXRfa2V5IjoiYjVjYWIxNjctNzk3Ny00ZGYxLTgwMjctYTYzYWExNDRmMDRlIiwidWEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvODkuMC40Mzg5LjExNCBTYWZhcmkvNTM3LjM2IEVkZy84OS4wLjc3NC42OCIsImRhdGVfbW9kaWZpZWQiOiIyMDIxLTA1LTA5VDE3OjU5OjMxLjQ2MFoiLCJpYXQiOjE2MjA1ODMxNzEsImV4cCI6MTYyMDU4NDA3MX0.0gBQcEkAwwipMend2gVMog7mzWjl4m-DnYubg34heHM",
      origin: "https://selfregistration.cowin.gov.in",
      referer: "https://selfregistration.cowin.gov.in/",
    },
  })
}

module.exports = async function execute(req, res) {
  const { pin, date, age } = req.query
  console.log(req.query)
  let msg = "Please provide valid pincode and date."
  try {
    if (pin && date) {
      const response = await fetchSchedule(pin, date)
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
