const puppeteer = require('puppeteer')
const nodemailer = require('nodemailer')
require('dotenv').config()

const CURRENT_MOVIES_URL =
  'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&query=%ED%98%84%EC%9E%AC%EC%83%81%EC%98%81%EC%98%81%ED%99%94&mra=bkEw'
const FUTURE_MOVIES_URL =
  'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&query=%EA%B0%9C%EB%B4%89%EC%98%88%EC%A0%95%EC%98%81%ED%99%94&mra=bkEw'
const now = Date.now()

const takeScreenshots = async _ => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], executablePath: 'google-chrome-unstable' })
  const page = await browser.newPage()
  await page.goto(CURRENT_MOVIES_URL)
  const clip = { x: 0, y: 240, width: 660, height: 540 }
  await page.screenshot({
    path: `now-${now}.png`,
    clip,
  })
  await page.goto(FUTURE_MOVIES_URL)
  await page.screenshot({
    path: `future-${now}.png`,
    clip,
  })

  await browser.close()
}

const sendEmail = async _ => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PW,
    },
  })

  const to = [process.env.GMAIL_ID]

  const mailOptions = {
    from: process.env.GMAIL_ID,
    to,
    subject: '현재상영영화 & 개봉예정영화',
    html: `<img src="cid:now-${now}"/><br><img src="cid:future-${now}"/>`,
    attachments: [
      {
        filename: `now-${now}.png`,
        path: `./now-${now}.png`,
        cid: `now-${now}`,
      },
      {
        filename: `future-${now}.png`,
        path: `./future-${now}.png`,
        cid: `future-${now}`,
      },
    ],
  }

  const info = await transporter.sendMail(mailOptions).catch(e => console.log(e))
  console.log('Email sent: ' + info.response)
}

!(async _ => {
  await takeScreenshots()
  await sendEmail()
})()
