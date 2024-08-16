import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { promisify } from 'util';

import { config } from "../";

const execPromise = promisify(exec);

async function generateSchemaFile(): Promise<number> {
    const preDataPath = path.resolve(config.preDataPath);

    const directory = path.dirname(preDataPath);
    if (!fs.existsSync(path.dirname(preDataPath))) {
        fs.mkdirSync(directory, { recursive: true });
    }

    try {
        const { stderr } = await execPromise(`pg_restore --section=pre-data -l -f ${preDataPath} ${config.backupFilePath}`);
        if (stderr)
            throw new Error(`Erro durante a execução: ${stderr}`);

        console.log("Acho que deu certo de criar um txt com os schemas do backup!");
    } catch (error) {
        throw error;
    }

    const commandTotal = await countLinesInFile(preDataPath);
    return commandTotal;
}

async function generateDataFile(): Promise<number> {
    const dataPath = path.resolve(config.dataPath);
    const postPath = path.resolve(config.postPath);

    const directory = path.dirname(dataPath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    try {
        const { stderr } = await execPromise(`pg_restore --section=data -l -f ${dataPath} ${config.backupFilePath}`);
        if (stderr)
            throw new Error(`Erro durante a execução: ${stderr}`);

        console.log("Acho que deu certo de criar um txt com os registros do backup!");
    } catch (error) {
        throw error;
    }

    try {
        const { stderr } = await execPromise(`pg_restore --section=post-data -l -f ${postPath} ${config.backupFilePath}`);
        if (stderr)
            throw new Error(`Erro durante a execução: ${stderr}`);

        console.log("Acho que deu certo de criar um txt com os pos Data do backup!");
    } catch (error) {
        throw error;
    }
    const commandTotalData = await countLinesInFile(dataPath);
    const commandTotalPost = await countLinesInFile(postPath);
    return commandTotalData + commandTotalPost;
}

async function filterPgRestoreFile(): Promise<number> {
    const filterList = config.schemasList;
    const codigoLoja = config.codigoLoja;
    const filterLojas = config.lojaList;
    const removeFilter = config.removeFilter;

    const commandTotalData = await generateDataFile();

    const pattern = new RegExp(`_${codigoLoja}\\d{2}`, 'i');
    const filePath = path.resolve(config.dataPath);
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const modifiedLines: string[] = [];

    for (let line of lines) {

        if (!line.startsWith(";")) {
            for (let filter of removeFilter) {

                const regex: RegExp = typeof filter === 'string'
                    ? new RegExp(` ${filter} `)
                    : filter;

                if (regex.test(line)) {
                    line = ";" + line;
                    break;
                }
            }
        }

        if (!line.startsWith(";") && filterList.length > 0) {
            let lineContent = true;

            for (let filter of filterList) {
                const regex: RegExp = typeof filter === 'string'
                    ? new RegExp(` ${filter} `)
                    : filter;

                if (regex.test(line)) {
                    lineContent = false;
                    break;
                }
            }

            if (lineContent) {
                line = ";" + line;
            }

        }
        if (!line.startsWith(";") && codigoLoja && pattern.test(line)) {
            let shouldPrefix = true;

            for (let filter of filterLojas) {
                if (line.includes(filter)) {
                    shouldPrefix = false;
                    break;
                }
            }

            if (shouldPrefix) {
                line = ";" + line;
            }
        }
        modifiedLines.push(line);
    }

    try {
        await fs.promises.writeFile(filePath, modifiedLines.join('\n'), 'utf-8');
        console.log("Filtragem feita!\n");
    } catch (error) {
        throw error;
    }
    return commandTotalData;
}

async function countLinesInFile(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        let lineCount = 0;
        fs.createReadStream(filePath)
            .on('data', (buffer) => {
                const str = buffer.toString();
                let idx = -1;
                while ((idx = str.indexOf('\n', idx + 1)) !== -1 && !str.startsWith(";")) {
                    lineCount++;
                }
            })
            .on('end', () => resolve(lineCount))
            .on('error', reject);
    });
}

export { filterPgRestoreFile, generateDataFile, generateSchemaFile };