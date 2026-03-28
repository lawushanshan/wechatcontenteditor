const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// 获取当前脚本所在目录
const __dirname = path.dirname(decodeURIComponent(new url.URL(import.meta.url).pathname));
const ROOT_DIR = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const server = http.createServer((req, res) => {
  // 解析 URL，获取路径
  const reqPath = req.url === '/' ? '/index.html' : req.url;

  // 构建完整的文件路径（使用绝对路径）
  const filePath = path.join(ROOT_DIR, reqPath);

  console.log(`请求: ${req.url} -> ${filePath}`);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.error(`  错误: ${error.code} - ${filePath}`);
      if (error.code === 'ENOENT') {
        // 文件不存在，返回 404
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>404 - 文件未找到</h1><p>请求的文件: ${reqPath}</p>`, 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>500 - 服务器错误</h1><p>${error.code}</p>`, 'utf-8');
      }
    } else {
      console.log(`  成功: ${filePath} (${contentType})`);

      // 设置缓存控制头，开发环境禁用缓存
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
      };

      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('📝 公众号 Markdown 编辑器');
  console.log('================================');
  console.log('🌐 服务器地址: http://localhost:' + PORT + '/');
  console.log('📌 按 Ctrl+C 停止服务器');
  console.log('================================');
});
