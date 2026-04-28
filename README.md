# 珠宝偏好问卷前端

这是一个 Next.js + React + TypeScript 的纯前端项目，用于本地展示珠宝/水晶定制偏好问卷与完成页。

## Ubuntu 启动方式

### 1. 安装 Node.js

推荐使用 Node.js 20 LTS 或更高版本。

```bash
node -v
npm -v
```

如果 Ubuntu 还没有安装 Node.js，可以使用 NodeSource：

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. 安装项目依赖

进入项目目录后执行：

```bash
npm install
```

### 3. 开发模式启动

适合本地调试，支持热更新：

```bash
npm run dev
```

默认访问：

```text
http://localhost:3000
```

如果需要让局域网或服务器外部访问：

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

然后访问：

```text
http://服务器IP:3000
```

### 4. 生产模式启动

先构建：

```bash
npm run build
```

再启动：

```bash
npm run start
```

如需指定监听地址和端口：

```bash
npm run start -- --hostname 0.0.0.0 --port 3000
```

## 常用页面

```text
/              自动跳转到问卷编辑页
/prefer/1?edit=True   默认问卷编辑页，完成全部步骤后进入“问卷完成！”页面
/prefer/1      问卷完成页 demo
/step          定制流程页
/CustomerReview 顾客反馈页
```

## 注意事项

- 不要提交 `node_modules/`、`.next/`、`artifacts/` 等本地生成目录。
- 如果服务器无法访问 `3000` 端口，需要检查云服务器安全组或 Ubuntu 防火墙。
- 本项目目前是纯前端 mock 数据，不连接后端接口，也不保存真实用户数据。
