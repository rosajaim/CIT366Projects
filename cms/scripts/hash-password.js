const readline = require("node:readline");
const { hashPassword } = require("../server/password");
// Input is hidden on a TTY. Pipe input for secure noninteractive provisioning.
(async () => {
  let password;
  if (process.stdin.isTTY) {
    process.stdout.write("Administrator password (12+ characters): ");
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    password = await new Promise((resolve) => {
      let input = "";
      process.stdin.on("keypress", (s, key) => {
        if (key?.ctrl && key.name === "c") process.exit(1);
        if (key?.name === "return") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write("\n");
          resolve(input);
        } else if (key?.name === "backspace") input = input.slice(0, -1);
        else if (s) input += s;
      });
    });
  } else {
    password = "";
    for await (const chunk of process.stdin) password += chunk;
    password = password.replace(/\r?\n$/, "");
  }
  if (password.length < 12 || password.length > 1024)
    throw new Error("Use a password between 12 and 1024 characters");
  console.log(await hashPassword(password));
})().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
