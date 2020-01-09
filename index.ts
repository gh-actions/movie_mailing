import puppeteer from 'puppeteer'
import nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()

const CURRENT_MOVIES_URL = 'https://movie.naver.com/movie/running/current.nhn'
const FUTURE_MOVIES_URL = 'https://movie.naver.com/movie/running/premovie.nhn'
const now = Date.now()

const takeScreenshots = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1024,
      height: 10000,
    },
    args: ['--no-sandbox'],
    // executablePath: 'google-chrome-unstable',
  })
  const page = await browser.newPage()
  await page.goto(CURRENT_MOVIES_URL, { timeout: 0, waitUntil: 'networkidle2' })
  await screenshotDOM(page, `now-${now}.png`, '#content')
  await page.goto(FUTURE_MOVIES_URL, { timeout: 0, waitUntil: 'networkidle2' })
  await screenshotDOM(page, `future-${now}.png`, '#content')

  await browser.close()
}

const screenshotDOM = async (page: puppeteer.Page, path: string, selector: string) => {
  const padding = 0

  if (!selector) throw Error('Please provide a selector.')

  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector)
    if (!element) return null
    const { x, y, width, height } = element.getBoundingClientRect()
    return { left: x, top: y, width, height, id: element.id }
  }, selector)

  if (!rect) throw Error(`Could not find element that matches selector: ${selector}.`)

  return await page.screenshot({
    path,
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: 669 + 171 * 10,
    },
  })
}

const sendEmail = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PW,
    },
  })

  const to = ['ysm0622@gmail.com']

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
