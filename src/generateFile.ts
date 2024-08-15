import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { promisify } from 'util';

import { config } from "../";

const execPromise = promisify(exec);

async function generateSchemaFile(): Promise<void> {
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
}

async function generateDataFile(): Promise<void> {
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
}

async function filterPgRestoreFile() {
    const filterList = config.schemasList;
    const codigoLoja = config.codigoLoja;
    const filterLojas = config.lojaList;

    await generateDataFile();

    const pattern = new RegExp(`_${codigoLoja}\\d{2}`, 'i');
    const filePath = path.resolve(config.dataPath);
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const modifiedLines: string[] = [];

    for (let line of lines) {

        if (!line.startsWith(";")) {
            for (let filter of filterList) {
                const regex = new RegExp(`\\b${filter}\\b`, 'i');
                if (regex.test(line)) {
                    line = ";" + line;
                    break;
                }
            }
        }
        if (!line.startsWith(";") && codigoLoja) {
            for (let filter of filterLojas) {
                if (pattern.test(line) && !line.includes(filter)) {
                    line = ";" + line;
                    break;
                }
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
}
export { filterPgRestoreFile, generateDataFile, generateSchemaFile };
