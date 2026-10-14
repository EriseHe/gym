# FORM — 中文哑铃健身训练手册

独立、从零设计的静态健身网站，使用真人动作摄影与中文教学，兼容 iPhone 和桌面浏览器。

## 功能
- 7 天训练计划：周一、周五肩臂，周三下肢核心，周二/周四轻量恢复；周末轻活动与休息。
- 13 个动作的中文分步教学，真实人物示范摄影（起止两张），前锯肌专项练习为 CC 授权真人视频。
- 每组完成记录、组间休息计时器、个人重量笔记、训练阶段与训练历史（浏览器本地保存）。
- 8 周递进计划，阶段可手动修改；安全提醒、动作错误示例与媒体来源说明。
- 原生 HTML/CSS/JavaScript，无构建或服务器依赖。

## 启动

```bash
python3 -m http.server 5173 --directory site
```

首次本地预览前请运行 `python3 scripts/vendor_photos.py` 下载真人照片（需联网）；然后打开 `http://localhost:5173`。

## 当前部署

**线上地址：** https://erisehe.github.io/gym/  
**独立源码：** https://github.com/EriseHe/gym

当前通过 `EriseHe/erisehe.github.io` 的现有 GitHub Pages 工作流发布，而不是依赖本仓库尚未启用的独立 Pages 设置：

1. 主站的 `.github/workflows/pages.yml` 正常构建其原有 Nextra 页面。
2. 构建流程会额外 checkout 本仓库 `EriseHe/gym` 的 `main`。
3. 执行 `python3 _gym_source/scripts/vendor_photos.py`，下载动作真人照片。
4. 将本仓库 `site/` 的内容复制到主站构建产物 `out/gym/`，一并发布。

这里仅共享**部署基础设施**，不共享旅行站点的设计或代码，也不改动独立的 `trip` 仓库。

**之后更新 gym 源码时**，需要在 [主站 GitHub Actions](https://github.com/EriseHe/erisehe.github.io/actions/workflows/pages.yml) 手动运行 `Deploy Nextra site to Pages`，网站才会读取最新 gym 提交。本仓库的 `.github/workflows/pages.yml` 当前仅开放手动运行；等将来在本仓库 `Settings → Pages` 启用 `GitHub Actions` 构建来源后，可改回 push 自动触发，从而完全独立部署。

## 图像与视频许可

- 真人动作照片来自 [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db)，按原项目 Unlicense 授权使用。照片使用原图库的两帧真实照片；部署工作流自动运行 `python3 scripts/vendor_photos.py`，将照片下载到 `site/photos/` 后一起发布，避免线上网站依赖第三方热链。
- 前锯肌推拳的真人视频由 [Buidhe](https://commons.wikimedia.org/wiki/File:Serratus_punch.webm) 发布，许可 CC BY-SA 4.0。视频在页面中标注来源与许可。
- 摄影示范与居家版本存在细微区别的动作，在动作卡的“版本提醒”中明确说明；不把其他动作照片冒充具体练习。
- 个人姿态视频或照片**未包含**在本站或代码中。

## 医疗限制

网站展示保守的力量和动作控制计划，非物理治疗诊断。出现进行性无力、麻木、明显疼痛、脚尖拖地或经常绊倒时，应接受线下评估。肩胛不对称与脚部外旋的共同根源未经确认。

## 代码结构

- `site/index.html` — 页面布局
- `site/styles.css` — 独立原创响应式视觉系统
- `site/data.js` — 中文运动教学和真人照片来源配置
- `site/app.js` — 日历、训练状态、动作详情、计时器、训练记录
- `scripts/vendor_photos.py` — 发布前下载开放授权照片到 `site/photos/`
- `.github/workflows/pages.yml` — GitHub Pages 自动部署

本项目不使用也不引用 `EriseHe/trip` 的设计或代码。