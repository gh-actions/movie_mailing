workflow "Every 8 AM" {
  on = "schedule(*/3 * * * *)"
  resolves = [
    "Take screenshots & Send Email",
  ]
}

action "Take screenshots & Send Email" {
  uses = "./"
  env = {
    GMAIL_ID = "ysm0622@gmail.com"
  }
  secrets = ["GMAIL_PW"]
}
