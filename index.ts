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
                !line.includes("sei") && 
                !line.includes("cpe") && 
                !line.includes("sat") &&
                !line.includes("scc") &&
                !line.includes("sca")
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