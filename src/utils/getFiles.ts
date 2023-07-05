import { readdirSync } from 'fs';
import { join } from 'path';

export const getFiles = (path: string, categorized: boolean): string[] => {
    const files: string[] = [];

    // FS = FileSystem (FSNode representing both files and folders)
    const firstDepthFSNodes = readdirSync(path);

    firstDepthFSNodes.forEach(FSNode => {
        if (!categorized) {
            files.push(join(path, FSNode));
            return files;
        }

        // Basically files but named this way for consistency
        const secondDepthFSNodes = readdirSync(`${path}/${FSNode}`);

        secondDepthFSNodes.forEach(fileName => {
            files.push(join(path, FSNode, fileName));
            return files;
        });
    });
    return files;
};
