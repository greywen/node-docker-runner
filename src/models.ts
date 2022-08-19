export class RunBody {
  languageId: number;
  code: string;
}

export class ILanguage {
  id: number;
  name: string;
  version?: string;
  memory: number;
  image: string;
  cpuset: string;
  timeout: number; // 执行超时时间 单位：秒
  code: string; // 所执行代码
  fileName: string; // 代码保存到docker文件名称 index.js
  beforInjectionCodeCmd?: string; // 注入代码前cmd命令 创建项目/文件夹等
  afterInjectionCodeCmd?: string; // 注入代码后cmd命令 编译/有运行等
  imports?: string; // 导入外部资源
  captureCode?: string;
  initialCode?: string; // 初始代码
}
