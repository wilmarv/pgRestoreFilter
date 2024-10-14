import fs from 'fs';
import * as path from "path";

import { pgRestoreData, pgRestoreSchema } from "./src/service";

type ConfigProps = {
    backupFilePath: string;
    preDataPath: string;
    dataPath: string;
    postPath: string;
    nomeBanco: string;
    schemasList: (string | RegExp)[];
    removeFilter: (string | RegExp)[];
    codigoLoja: string | null;
    lojaList: string[];
}

export const config: ConfigProps = {
    backupFilePath: "C:\\Users\\Wilmar\\Downloads\\compels_mr_2024-09-02_22_05.backup",
    preDataPath: ".\\pgArchive\\pre_data.txt",
    dataPath: ".\\pgArchive/data.txt",
    postPath: ".\\pgArchive\\post_data.txt",

    nomeBanco: "compels_mr",
    removeFilter: ["cpdv", "crm", "dominio", "ecommerce", "kikker", "estoquekikker", "messaging", "otrs", "ctb",
        "pci", "pcp", "rdstation", "rec", "transp", "tray", "vipcommerce", "estoquekikker", 
        new RegExp("notafiscalconsumidor"),new RegExp("itemnotafiscalconsumidor"),
        new RegExp("old"), new RegExp("ruptura"), new RegExp("itemsaldoperiodo"), new RegExp("itemsaldopordia")],
    schemasList: [],
    codigoLoja: "mr",
    lojaList: ["mr01", "mr18"],
}

async function main() {
    const arrayError: string[] = [];

    try {
        await pgRestoreSchema(arrayError);
        await pgRestoreData(arrayError);
    } catch (error) {
        console.error("Deu ruim ai, verifica ai:", error);
    }
    if (arrayError.length > 0) {
        const logPath = path.resolve(".\\pgArchive\\logWarning.txt");
        //const message = data.toString().replace(/[\r\n]+/g, '').trim();
        const directory = path.dirname(logPath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        const file = fs.createWriteStream(logPath);
        file.on('error', function (err) { });
        arrayError.forEach(line => file.write(line.replace(/[\r\n]+/g, '').trim() + '\n'));
        file.end();
    }
}
main();