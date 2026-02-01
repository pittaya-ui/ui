import chalk from "chalk";
import CFonts from "cfonts";
import gradient from "gradient-string";

export async function showBanner() {
  try {
    const textOutput = CFonts.render("Pittaya UI", {
      font: "block",
      align: "left",
      colors: ["system"],
      background: "transparent",
      letterSpacing: 1,
      lineHeight: 1,
      space: false,
    });

    const pittayaGradient = gradient(["#fda4af", "#fb7185", "#9f1239"]);

    process.stdout.write("\n" + pittayaGradient.multiline(textOutput?.string || "Pittaya UI"));
    
    console.log(chalk.gray(`\n  ${"─".repeat(20)} Pittaya UI - Components that scale with your ideas ${"─".repeat(20)}\n`));

  } catch (error) {
    CFonts.say("Pittaya UI", { font: "block", colors: ["#fb7185"] });
  }
}
