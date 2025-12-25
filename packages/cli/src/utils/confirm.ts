import { createInterface } from "node:readline";

function resolveFromString(answer: string, initial: boolean): boolean {
    const value = (answer ?? "").trim().toLowerCase();
    if (!value) return initial;
    if (value === "y" || value === "yes") return true;
    if (value === "n" || value === "no") return false;
    return initial;
}

export async function confirm(message: string, initial: boolean = false): Promise<boolean> {
    const suffix = initial ? "(Y/n)" : "(y/N)";
    const prompt = `${message} ${suffix} `;

    if (!process.stdin.isTTY) {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return await new Promise((resolve) => {
            rl.question(prompt, (answer) => {
                rl.close();
                resolve(resolveFromString(answer, initial));
            });
        });
    }

    return await new Promise((resolve) => {
        const stdin = process.stdin;
        const stdout = process.stdout;

        const prevRawMode = (stdin as any).isRaw;
        if (typeof stdin.setRawMode === "function") {
            stdin.setRawMode(true);
        }
        stdin.resume();

        stdout.write(prompt);

        const cleanup = () => {
            stdin.off("data", onData);

            if (typeof stdin.setRawMode === "function") {
                stdin.setRawMode(Boolean(prevRawMode));
            }

            stdin.pause();
        };

        const finish = (result: boolean) => {
            stdout.write(`${result ? "y" : "n"}\n`);
            cleanup();
            resolve(result);
        };

        const onData = (chunk: Buffer) => {
            const str = chunk.toString("utf8");

            if (str === "\u0003") {
                cleanup();
                process.kill(process.pid, "SIGINT");
                return;
            }

            const key = str.toLowerCase();

            if (key === "\r" || key === "\n") {
                finish(initial);
                return;
            }

            if (key === "y") {
                finish(true);
                return;
            }

            if (key === "n") {
                finish(false);
                return;
            }
        };

        stdin.on("data", onData);
    });
}
