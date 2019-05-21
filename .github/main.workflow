workflow "Every 8 AM" {
  on = "schedule(*/3 * * * *)"
  resolves = [
    "Take screenshot and send email",
  ]
}

action "Install node packages" {
  uses = "gh-actions/npm@master"
  needs = ["Install packages for puppeteer"]
  args = "install"
}

action "Take screenshot and send email" {
  uses = "gh-actions/npm@master"
  needs = ["Install node packages"]
  args = "run send"
  secrets = ["GMAIL_PW", "GMAIL_ID"]
}
