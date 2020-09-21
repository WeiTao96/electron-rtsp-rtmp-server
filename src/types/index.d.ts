export interface channel {
    id: string;
    inputPath: string;
    outputPath: string;
}

export interface systemSetting {
    openAtLogin: boolean;   //在登录时启动应用
}