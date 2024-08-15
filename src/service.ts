import { spawn } from "child_process";
import * as path from "path";

import { config } from '../';
import { filterPgRestoreFile, generateSchemaFile } from "./generateFile";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function pgRestoreSchema(stackError: string[]) {
    const schemaPath = path.resolve(config.preDataPath);

    await generateSchemaFile();
    await delay(2000);
    console.clear();

    return new Promise<void>((resolve, reject) => {
        const command = 'pg_restore';
        const args = ['-U', 'postgres', '-w', '-d', config.nomeBanco, '-L', schemaPath, '-v', config.backupFilePath];

        const restoreProcess = spawn(command, args, {
            env: { ...process.env, PGPASSWORD: 'postgres' }
        });

        restoreProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        restoreProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            const message = data.toString();
            if (message.includes('pg_restore: error') && !message.includes('could not execute query')) {
                reject(new Error(message));
                restoreProcess.kill();
            }
            stackError.push(message);
        });

        restoreProcess.on('close', (code) => {
            if (!restoreProcess.killed) {
                console.log("\n");
                console.log("Ehh, até agora esta dando certo a restauração, parece que os schemas foram criados...\n");
                resolve();
            }
            else {
                reject(new Error(`pg_restore process exited with code ${code}`));
            }
        });
    });
}

async function pgRestoreData(stackError: string[]): Promise<void> {
    const dataPath = path.resolve(config.dataPath);
    const postPath = path.resolve(config.postPath);

    await filterPgRestoreFile();
    await delay(3000);
    console.clear();

    try {
        await new Promise<void>((resolve, reject) => {
            const command = 'pg_restore';
            const args = ['-U', 'postgres', '-w', '-d', config.nomeBanco, '-L', dataPath, '-v', config.backupFilePath];

            const restoreProcess = spawn(command, args, {
                env: { ...process.env, PGPASSWORD: 'postgres' }
            });

            restoreProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            restoreProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                const message = data.toString();
                if (message.includes('pg_restore: error') && !message.includes('could not execute query')) {
                    reject(new Error(message));
                    restoreProcess.kill();
                }
                stackError.push(message);
            });

            restoreProcess.on('close', (code) => {
                if (!restoreProcess.killed) {
                    console.log("\n");
                    console.log("Ta quase lá...\n");
                    resolve();
                } else {
                    reject(new Error(`pg_restore process exited with code ${code}`));
                }
            });
        });

        await delay(4000);
        console.clear();


        await new Promise<void>((resolve, reject) => {
            const command = 'pg_restore';
            const args = ['-U', 'postgres', '-w', '-d', config.nomeBanco, '-L', postPath, '-v', config.backupFilePath];

            const restoreProcess = spawn(command, args, {
                env: { ...process.env, PGPASSWORD: 'postgres' }
            });

            restoreProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            restoreProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                const message = data.toString();
                if (message.includes('pg_restore: error') && !message.includes('could not execute query')) {
                    reject(new Error(message));
                    restoreProcess.kill();
                }
                stackError.push(message);
            });

            restoreProcess.on('close', (code) => {
                if (!restoreProcess.killed) {
                    console.log("\n");
                    console.log("Acho que deu certo aquela parada que vc está tentando fazer, mas confere ai cara...");
                    resolve();
                }
                else {
                    reject(new Error(`pg_restore process exited with code ${code}`));
                }
            });
        });
    } catch (error) {
        console.error("Erro durante a restauração dos dados:", error);
        throw error;
    }
}
export { pgRestoreData, pgRestoreSchema };
