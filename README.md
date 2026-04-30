# 珠宝偏好问卷（全栈）

Next.js + React + TypeScript + Prisma + SQLite 全栈项目，用于珠宝/水晶定制偏好问卷的收集与管理。

## Ubuntu 生产部署

### 1. 环境准备

```bash
# 安装 Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# better-sqlite3 原生模块编译依赖
sudo apt install -y build-essential python3

# 安装 pnpm（可选，也可用 npm）
npm install -g pnpm
```

### 2. 安装依赖

```bash
pnpm install
# 或 npm install
```

`postinstall` 脚本会自动执行 `prisma generate` 生成数据库客户端。

### 3. 初始化数据库

```bash
pnpm db:push
# 或 npx prisma db push
```

会在 `prisma/` 目录下创建 SQLite 数据库文件 `dev.db` 并建表。

### 4. 配置环境变量

复制 `.env.example` 为 `.env`，修改 `ADMIN_TOKEN`：

```bash
cp .env.example .env
# 编辑 .env，把 ADMIN_TOKEN 改成你自己的密钥
```

### 5. 生产模式启动

```bash
pnpm build
pnpm start
# 或 npm run build && npm run start
```

访问 `http://服务器IP:3000`。

---

## 本地开发

```bash
npm run dev
# 监听所有网络接口
npm run dev -- --hostname 0.0.0.0
```

---

## 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 自动跳转到问卷编辑页 |
| `/prefer/1?edit=True` | 问卷编辑页（8步完成） |
| `/prefer/1` | 问卷完成页 demo |
| `/step` | 定制流程页 |
| `/CustomerReview` | 顾客反馈页 |
| `/admin?token=<ADMIN_TOKEN>` | 后台管理页（查看提交数据） |

---

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/submit` | 提交问卷数据（Zod 校验 + IP 限流） |

---

## 数据库

使用 Prisma 7 + SQLite（better-sqlite3 驱动）。

```bash
# 查看数据库
npx prisma studio

# 修改 schema 后同步
npx prisma db push
```

---

## 注意事项

- 不要提交 `node_modules/`、`.next/`、`prisma/dev.db`、`prisma/generated/`
- `.env` 不会被提交，生产环境需手动创建
- 如果服务器无法访问 `3000` 端口，检查云服务器安全组
- SQLite 数据库文件位于 `prisma/dev.db`，注意备份
