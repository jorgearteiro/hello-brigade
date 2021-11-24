import { events, Job } from "@brigadecore/brigadier"
import { uniqueNamesGenerator, adjectives, animals } from "unique-names-generator"
        
// Use events.on() to define how your script responds to different events. 
// The example below depicts handling of "exec" events originating from
// the Brigade CLI.

function newName(): string {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: "-"
  })
}

events.on("brigade.sh/cli", "exec", async event => {
  let job1 = new Job("hello", "debian:latest", event)
  job1.primaryContainer.command = ["echo"]
  job1.primaryContainer.arguments = [`Hello, ${newName()}!`]
  
  let job2 = new Job("goodbye", "alpine:latest", event)
  job2.primaryContainer.command = ["echo"]
  job2.primaryContainer.arguments = [`Hello, ${event.project.secrets.name}!`]

  await Job.sequence(job1, job2).run()
})

events.process()

