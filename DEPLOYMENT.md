# 运维部署文档 - 公众号 Markdown 编辑器

**项目名称**: 公众号 Markdown 编辑器 (WeChat Content Editor)  
**项目类型**: 静态网站 (纯前端)  
**GitHub**: https://github.com/lawushanshan/wechatcontenteditor  
**部署时间**: 2026-03-28  
**部署负责人**: 运维-titan  

---

## 📋 项目信息

### 项目概述
一个专为微信公众号设计的 Markdown 编辑器，支持 13 种精美样式和智能图片处理功能。

### 技术栈
- **前端**: 原生 HTML/CSS/JavaScript
- **构建工具**: 无 (纯静态文件)
- **依赖**: 无 Node.js 依赖
- **服务器**: 任意 HTTP 服务器 (Nginx/Apache/Python)

### 核心功能
1. **13 种精美样式**
   - 经典公众号系列：默认、技术、优雅、深度阅读
   - 传统媒体系列：杂志风格、纽约时报、金融时报、Jony Ive
   - 现代数字系列：Wired 连线、Medium 长文、Apple 极简等

2. **智能图片处理** (⭐ 最新升级)
   - 智能粘贴：支持截图、浏览器、文件管理器粘贴
   - 自动压缩：图片自动压缩到合理大小 (最高 80%+)
   - 本地存储：IndexedDB 持久化存储
   - 多图网格：2-3 列自动排版

---

## 🚀 部署方案

### 方案 A: Nginx 部署 (推荐 - 生产环境)

#### 1. 创建网站目录
```bash
sudo mkdir -p /var/www/wechat-editor
sudo chown -R www-data:www-data /var/www/wechat-editor
```

#### 2. 复制项目文件
```bash
cd /app/working/projects/titanlab/wechatcontenteditor
sudo cp -r * /var/www/wechat-editor/
```

#### 3. 配置 Nginx
```bash
sudo nano /etc/nginx/sites-available/wechat-editor
```

**Nginx 配置**:
```nginx
server {
    listen 80;
    server_name editor.titanlab.ai;  # 替换为实际域名
    
    root /var/www/wechat-editor;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss;
    
    # 缓存静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 4. 启用站点
```bash
sudo ln -s /etc/nginx/sites-available/wechat-editor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. 配置 HTTPS (可选但推荐)
```bash
sudo certbot --nginx -d editor.titanlab.ai
```

---

### 方案 B: Python HTTP 服务器 (快速测试)

#### 1. 进入项目目录
```bash
cd /app/working/projects/titanlab/wechatcontenteditor
```

#### 2. 启动服务器
```bash
# 使用启动脚本
./start.sh

# 或直接运行
python3 -m http.server 8080
```

#### 3. 访问
```
http://localhost:8080/
```

---

### 方案 C: Docker 部署 (容器化)

#### 1. 创建 Dockerfile
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 构建镜像
```bash
docker build -t wechat-editor:latest .
```

#### 3. 运行容器
```bash
docker run -d -p 8080:80 --name wechat-editor wechat-editor:latest
```

---

### 方案 D: 1Panel 部署 (推荐 - 如果已安装 1Panel)

#### 1. 登录 1Panel 面板
访问：http://your-server-ip:10086/

#### 2. 创建网站
1. 进入 **网站** → **创建网站**
2. 选择 **静态网站**
3. 网站目录：`/opt/1panel/apps/wechat-editor`
4. 上传项目文件

#### 3. 配置域名 (可选)
- 添加域名：`editor.titanlab.ai`
- 启用 HTTPS
- 配置 WAF

---

## 🔧 端口分配

根据 Titan Lab 产品线统一规划：

| 端口 | 项目 | 状态 |
|------|------|------|
| 8080 | **公众号 Markdown 编辑器** | 🆕 待部署 |
| 8081 | Privacy API | ✅ 已部署 |
| 8082 | Agent Control Center | ✅ 已部署 |
| 8084 | MindFlow AI | ✅ 已部署 |
| 8085 | Titan Lab 官网 | ✅ 已部署 |

---

## 📝 部署检查清单

### 部署前
- [ ] 确认端口 8080 未被占用
- [ ] 准备域名 (可选): `editor.titanlab.ai`
- [ ] 准备 SSL 证书 (可选)
- [ ] 备份现有配置

### 部署中
- [ ] 复制项目文件到服务器
- [ ] 配置 Web 服务器 (Nginx/1Panel)
- [ ] 配置域名解析
- [ ] 配置 HTTPS
- [ ] 设置文件权限

### 部署后
- [ ] 访问测试：http://localhost:8080/
- [ ] 功能测试：
  - [ ] Markdown 编辑正常
  - [ ] 样式切换正常
  - [ ] 图片上传正常
  - [ ] 复制粘贴正常
- [ ] 性能测试：
  - [ ] 页面加载时间 < 2 秒
  - [ ] 图片压缩正常
- [ ] 安全测试：
  - [ ] HTTPS 正常
  - [ ] 安全头配置正确

---

## 🔍 监控与维护

### 日志位置
- **Nginx 访问日志**: `/var/log/nginx/access.log`
- **Nginx 错误日志**: `/var/log/nginx/error.log`

### 监控指标
- 页面响应时间
- 图片上传成功率
- 用户活跃度

### 备份策略
- 每周备份项目文件
- 每月备份用户数据 (IndexedDB 导出)

---

##  性能优化建议

### 1. CDN 加速
将静态资源托管到 CDN:
- Cloudflare (免费)
- 阿里云 CDN
- 腾讯云 CDN

### 2. 图片优化
- 启用 WebP 格式
- 配置图片懒加载
- 使用图片 CDN

### 3. 缓存策略
```nginx
# Nginx 缓存配置
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

---

## 🆘 故障排查

### 问题 1: 页面无法访问
```bash
# 检查服务状态
sudo systemctl status nginx

# 检查端口占用
sudo lsof -i:8080

# 检查防火墙
sudo ufw status
```

### 问题 2: 图片上传失败
```bash
# 检查文件权限
ls -la /var/www/wechat-editor/

# 检查磁盘空间
df -h
```

### 问题 3: HTTPS 证书问题
```bash
# 重新生成证书
sudo certbot renew --force-renewal
```

---

## 📞 联系支持

**运维负责人**: 运维-titan  
**技术支持**: Titan Lab 团队  
**文档**: `/app/working/projects/titanlab/wechatcontenteditor/README.md`

---

## 📄 附录

### A. 项目文件结构
```
wechatcontenteditor/
├── index.html          # 主页面
├── app.js             # 主应用逻辑
├── start.sh           # 启动脚本
├── style.css          # 样式文件
├── favicon.svg        # 网站图标
├── logo.svg           # Logo
└── README.md          # 项目说明
```

### B. 快速部署命令 (一键部署)
```bash
#!/bin/bash
# deploy.sh - 一键部署脚本

echo "🚀 开始部署公众号 Markdown 编辑器..."

# 1. 创建目录
sudo mkdir -p /var/www/wechat-editor

# 2. 复制文件
sudo cp -r /app/working/projects/titanlab/wechatcontenteditor/* /var/www/wechat-editor/

# 3. 设置权限
sudo chown -R www-data:www-data /var/www/wechat-editor

# 4. 重启 Nginx
sudo systemctl reload nginx

echo "✅ 部署完成！"
echo "🌐 访问地址：http://localhost:8080/"
```

---

**部署完成时间**: ____________  
**部署负责人签字**: ____________  
**验收人签字**: ____________
