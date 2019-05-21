workflow "Every 8 AM" {
  on = "schedule(*/3 * * * *)"
  resolves = [
    "Take screenshot and send email",
  ]
}

action "Update packages" {
  uses = "actions/bin/sh@master"
  args = ["apt-get -y update"]
}

action "Install packages for puppeteer" {
  uses = "actions/bin/sh@master"
  needs = ["Update packages"]
  args = "apt-get -y install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget"
}

action "Install node packages" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install packages for puppeteer"]
  args = "install"
}

action "Take screenshot and send email" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install node packages"]
  args = "run send"
  secrets = ["GMAIL_PW", "GMAIL_ID"]
}
