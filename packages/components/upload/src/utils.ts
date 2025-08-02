export function readDirectory(entry: FileSystemDirectoryEntry): Promise<File[]> {
    const reader = entry.createReader();
    const allFiles: File[] = [];

    const isHiddenOrIgnored = (file: File) => {
        const ignoredNames = ['.DS_Store', '.git', 'desktop.ini'];
        return file.name.startsWith('.') || ignoredNames.includes(file.name);
    };

    return new Promise(resolve => {
        const readEntries = () => {
            reader.readEntries(async entries => {
                if (entries.length === 0) {
                    resolve(allFiles);
                    return;
                }
                for (const subEntry of entries) {
                    if (subEntry.isFile) {
                        await new Promise<void>(resolveFile => {
                            (subEntry as FileSystemFileEntry).file(file => {
                                if (!isHiddenOrIgnored(file)) {
                                    allFiles.push(file);
                                }
                                resolveFile();
                            });
                        });
                    } else if (subEntry.isDirectory) {
                        const subFiles = await readDirectory(
                            subEntry as FileSystemDirectoryEntry
                        );
                        allFiles.push(...subFiles);
                    }
                }

                readEntries();
            });
        };

        readEntries();
    });
}
