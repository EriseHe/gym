# FORM v3 — 力量与心肺训练计划

独立项目：`EriseHe/gym`。地址：<https://erisehe.github.io/gym/>。不使用 trip 的代码、模块或风格。

## 本版
- 周一上肢 A，周二下肢 A，周三轻松跑，周四上肢 B，周五下肢 B，周六较长轻松跑，周日休息。
- 重新适应、稳定训练、重点发展、减量巩固四阶段；不会按日期自动提高负荷。发展期第三跑需主动启用。
- 每动作独立组数，主项与低疲劳肩胛练习分开，含实际有氧分钟、组间与跑步阶段计时、重量/次数/余力记录。
- 14 个动作：13 对真人照片和 1 个真人推拳视频。新增前弓步，不将图片误标成反向弓步或后脚抬高版本。
- 新版使用 `form-gym-v3` 存储。旧的 `form-gym-v2` 不修改；历史页可查看旧记录，导出包含两版。
- 这是一般运动教育计划，不是远程诊断。没有上传用户私人体态照片、视频或病历。

## 文件与运行
`site/data.js` 保存原有动作资料；`site/plan.js` 定义新版课表与调整；`site/training.js` 为当前交互入口；`site/training.css` 为新版界面。旧 `site/app.js` 保留以供比较，但不再被页面加载。

```bash
python3 scripts/vendor_photos.py
python3 -m http.server 5173 --directory site
node tests/test_program.js
python3 tests/test_v3.py
```

浏览器测试需 Playwright 与 Chromium。默认使用离线页面装载和内存存储替身以适应受限沙箱；设置 `GYM_BASE=http://localhost:5173/` 可测试实际同源存储。生产图片与页面另行检查。

## 当前部署
源代码在独立仓库。项目级 Pages 尚未启用，当前仍由 `EriseHe/erisehe.github.io/.github/workflows/pages.yml` 检出本仓库 `main`，运行照片打包脚本，再把 `site/` 放入 Pages 的 `/gym/`。
更新源码后必须触发该托管工作流，不能把本仓库提交成功等同于已上线。本仓库的 Pages 工作流保留为手动入口，供之后启用独立项目 Pages。

## 媒体与隐私
照片按 [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) 公布的 Unlicense 使用；打包脚本下载确切的原始照片。照片与居家变式不同时有显著提示。推拳视频为 Buidhe / Wikimedia Commons，CC BY-SA 4.0。
没有登录、分析或服务器端用户记录；导出仅由用户点击触发。原有记录不清除。照片网络回退与真人视频可能访问第三方服务器。

训练证据与适用范围在网站「计划与进阶」页列出；星期、阶段与具体剂量是本项目设计，不冒充文献验证过的个人康复处方。
