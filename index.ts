import * as fs from 'fs';
import * as path from 'path';

async function main() {

    try {
        const inputFilePath = path.resolve("contents.txt");
        const outputFilePath = path.resolve("/home/compels/Downloads/selectedSchema.txt");

        const fileContent = await fs.promises.readFile(inputFilePath, 'utf-8');
        const lines = fileContent.split('\n');
        const modifiedLines: string[] = [];

        const mrPattern = /_mr\d{2}/;
        const excludedMr = ["_mr01", "_mr02", "_mr04", "_mr06", "_mr18"];

        for (let line of lines) {
            if (
                line.includes(" agro ") ||
                line.includes(" bling ") ||
                line.includes(" ctb ") ||
                line.includes(" cpdv ") ||
                line.includes(" fin ") ||
                line.includes(" imobilizado ") ||
                line.includes(" imp ") ||
                line.includes(" impl ") ||
                line.includes(" messaging ") ||
                line.includes(" lfi ") ||
                line.includes(" tray ") ||
                line.includes(" transp ") ||
                line.includes(" sfl ") ||
                line.includes("old") ||
                line.includes("kikker") ||
                (mrPattern.test(line) && !excludedMr.some(mr => line.includes(mr)))
            ) {
                line = ";" + line;
            }
            modifiedLines.push(line);
        }
        await fs.promises.writeFile(outputFilePath, modifiedLines.join('\n'), 'utf-8');
        console.log("Acho que deu certo aquela parada que vc está tentando fazer, mas confere ai cara...");
    } catch (error) {
        console.error("Ocorreu um erro:", error);
    }
}
main();