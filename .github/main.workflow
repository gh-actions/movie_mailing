workflow "Every 8 AM" {
  on = "schedule(*/3 * * * *)"
  resolves = ["Send email"]
}

action "Install packages" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Send email" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install packages"]
  args = "run send"
  secrets = ["GMAIL_ID", "GMAIL_PW"]
}
