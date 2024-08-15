import { pgRestoreData, pgRestoreSchema } from "./src/service";

type ConfigProps = {
    backupFilePath: string;
    preDataPath: string;
    dataPath: string;
    postPath: string;
    nomeBanco: string;
    schemasList: string[];
    codigoLoja: string | null;
    lojaList: string[];
}

export const config: ConfigProps = {
    backupFilePath: "/home/compels/Downloads/compels_mr_2024-08-14_22_05.backup",
    preDataPath: "./pgArchive/pre_data.txt",
    dataPath: "./pgArchive/data.txt",
    postPath: "./pgArchive/post_data.txt",

    nomeBanco: "compels_mr",
    schemasList: ["cpdv", "crm", "dominio", "ecommerce", "kikker", "messaging", "otrs", "pci", "pcp", "rdstation", "rec", "transp", "tray", "vipcommerce"],
    codigoLoja: "mr",
    lojaList: ["mr01", "mr02", "mr04", "mr06", "mr18"],
}

async function main() {
    try {
        const arrayError: string[] = [];

        await pgRestoreSchema(arrayError);
        await pgRestoreData(arrayError);

        if (arrayError.length > 0) {
            console.log("============================================================================");
            console.log("Erros do processo: \n");
            arrayError.forEach(error => console.log(error + "\n"));
        }
    } catch (error) {
        console.error("Deu ruim ai, verifica ai:", error);
    }
}
main();