// 将文档转换为AI知识库
/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, existsSync, rmdirSync, mkdirSync, readdirSync, unlinkSync, lstatSync } = require('fs');
const { readFile, writeFile, readdir, stat } = require('fs/promises');
const path = require('path');

const docsPath = path.resolve('docs');
const destPath = path.resolve('docs/ai-dist');
console.log('文档路径', docsPath);
console.log('构建后的文档路径', destPath);

const exampleDocRegex = /<ExampleDoc[\s\S]*?<<< @\/(.*?)\n[\s\S]*?<\/ExampleDoc>/g;

const build = async (filePath, fileName) => {
    console.info('【building】', filePath);
    let content = await readFile(filePath, { encoding: 'utf-8' });
    content = content.replace(exampleDocRegex, (val, val2) => {
        const codePath = path.resolve(docsPath, val2);
        const ext = path.extname(codePath).slice(1);
        console.info('【match】', val2);
        const code = readFileSync(codePath, { encoding: 'utf-8' });
        return '```' + (ext === 'vue' ? 'html' : ext) + '\n' + code + '\n```';
    });
    const dest = path.resolve(destPath, fileName);
    console.info('【build】', dest);
    await writeFile(dest, content, { encoding: 'utf-8' });
};

const getDocFiles = async (dirPath) => {
    const preName = dirPath.replace(docsPath + '/', '').replace(/\//g, '_');
    const files = await readdir(dirPath);
    const list = [];
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await stat(filePath);
        if (stats.isFile() && file.endsWith('.md')) {
            list.push({ path: filePath, name: preName + '_' + file });
        } else if (stats.isDirectory()) {
            const child = await getDocFiles(filePath);
            list.push(...child);
        }
    }
    return list;
};

function deleteAndCreateFolder(folderPath) {
    if (existsSync(folderPath)) {
        // 如果文件夹存在，先删除它及其内容
        deleteFolderRecursive(folderPath);
    }

    // 创建新的文件夹
    mkdirSync(folderPath);
}

function deleteFolderRecursive(folderPath) {
    if (existsSync(folderPath)) {
        readdirSync(folderPath).forEach((file) => {
            const curPath = folderPath + '/' + file;
            if (lstatSync(curPath).isDirectory()) {
                // 递归删除子文件夹
                deleteFolderRecursive(curPath);
            } else {
                // 删除文件
                unlinkSync(curPath);
            }
        });
        // 删除空文件夹
        rmdirSync(folderPath);
    }
}

const main = async () => {
    deleteAndCreateFolder(destPath);
    const files = await getDocFiles(path.resolve(docsPath, 'zh'));
    for (const file of files) {
        await build(file.path, file.name);
    }
};

main();
