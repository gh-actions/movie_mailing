workflow "Every 8 AM" {
  on = "schedule(*/3 * * * *)"
  resolves = [
    "Install node packages",
  ]
}

action "Install node packages" {
  uses = "./"
  env = {
    GMAIL_ID = "ysm0622@gmail.com"
  }
  secrets = ["GMAIL_PW"]
}