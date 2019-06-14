import * as https from "https";
import { URL } from "url";
import { Application } from "probot"; // eslint-disable-line no-unused-vars

process.addListener("uncaughtException", err => {
  console.error(err);
});

export = (app: Application) => {
  app.on("issues.opened", async context => {
    const { issue } = context.payload;

    // if not owner open an issue and not a bot
    if (issue.author_association !== "OWNER" && !context.isBot) {
      // default reply template
      const defaultReply = `Thank you very much for your issued

**But the issue of this repositories is only open for some people.**

Your issue will be closed and locked.

---- from bot`;

      // config field
      const configField = "no-issue-bot";

      // read .github/config.yml
      const config = await context.config("config.yml", {
        [configField]: defaultReply
      });

      // comment issue
      await context.github.issues.createComment(
        context.issue({
          body: config[configField] || defaultReply
        })
      );

      const issue = context.issue();

      // close issue
      await context.github.issues.update({ ...issue, state: "closed" });

      // lock issue
      await context.github.issues.lock(context.issue());
    }
  });
};

// Keep it active
setInterval(() => {
  const options = new URL("https://github-no-issue-bot.herokuapp.com/");
  https.request(options, res => {
    // ...
  });
}, 1000 * 60);
