import * as fs from 'fs';
import * as path from 'path';

async function main() {

    try {
        const inputFilePath = path.resolve("tabelas.txt");
        const outputFilePath = path.resolve("tabelasSelecionadas.txt");

        const fileContent = await fs.promises.readFile(inputFilePath, 'utf-8');
        const lines = fileContent.split('\n');
        const modifiedLines: string[] = [];

        for (let line of lines) {
            if (
                line.includes(" agro ") ||
                line.includes(" bling ") ||
                line.includes(" ctb ") ||
                line.includes(" cpdv ") ||
                line.includes(" kikker ") ||
                line.includes(" fin ")||
                line.includes(" imobilizado ")||
                line.includes(" imp ")||
                line.includes(" impl ")||
                line.includes(" messaging ")||
                line.includes(" sfl ")
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