const puppeteer = require('puppeteer')
const nodemailer = require('nodemailer')
require('dotenv').config()

const CURRENT_MOVIES_URL =
  'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&query=%ED%98%84%EC%9E%AC%EC%83%81%EC%98%81%EC%98%81%ED%99%94&mra=bkEw'
const FUTURE_MOVIES_URL =
  'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&query=%EA%B0%9C%EB%B4%89%EC%98%88%EC%A0%95%EC%98%81%ED%99%94&mra=bkEw'

const takeScreenshots = async _ => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.goto(CURRENT_MOVIES_URL)
  const clip = { x: 0, y: 240, width: 660, height: 540 }
  await page.screenshot({
    path: 'now.png',
    clip,
  })
  await page.goto(FUTURE_MOVIES_URL)
  await page.screenshot({
    path: 'future.png',
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

  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: process.env.GMAIL_ID,
    subject: '현재상영영화 & 개봉예정영화',
    html: '<img src="cid:file1"/><br><img src="cid:file2"/>',
    attachments: [
      {
        filename: 'now.png',
        path: './now.png',
        cid: 'file1',
      },
      {
        filename: 'future.png',
        path: './future.png',
        cid: 'file2',
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
