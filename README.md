# UACG · 回家的路

简洁的 UACG 地址发布页，只展示游戏、AI、视频站点的“主站”“备用入口”链接，不在页面上显示实际域名。沿用 UACG Logo、粉色与圆角风格，支持手机、深色模式和无 JavaScript 访问。

地址统一维护在 `src/sites.json`。所有资源本地加载，无追踪脚本或第三方依赖。

## 本地预览

使用 Node.js 22 或更高版本：

```sh
npm run build
python3 -m http.server 3309 --bind 127.0.0.1 --directory dist
```

生成 `/`、`/game/`、`/ai/`、`/video/` 四个页面。页面仅列出地址，不表示入口实时可用。

## 发布

推送 `main` 后，GitHub Actions 自动构建并部署 `dist` 到 GitHub Pages。
仓库 Settings → Pages → Source 应选择 GitHub Actions，避免从仓库根目录生成 README 页面。

Cloudflare Pages 也可使用 `npm run build`，输出目录为 `dist`。如果使用独立发布域名，将 `PUBLIC_SITE_URL` 设置为对应的 HTTPS 地址（以 `/` 结尾），用于 canonical 和 sitemap。

只发布 `dist`，不上传 Git 元数据或本地配置。提交的作者和提交者统一使用 `UACG-TEAM <uacg-team@users.noreply.github.com>`。
