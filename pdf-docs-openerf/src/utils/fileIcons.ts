export interface FileBadge {
    label: string;
    color: string;
}

export function getFileBadge(filename: string): FileBadge {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return { label: 'PDF', color: '#FF3B30' };
        case 'doc':
        case 'docx':
            return { label: 'DOC', color: '#007AFF' };
        case 'xls':
        case 'xlsx':
            return { label: 'XLS', color: '#34C759' };
        case 'ppt':
        case 'pptx':
            return { label: 'PPT', color: '#FF9500' };
        default:
            return { label: 'FILE', color: '#8E8E93' };
    }
}
