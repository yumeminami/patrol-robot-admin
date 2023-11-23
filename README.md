
# 简介
patrol-robot-admom是一个基于 `React` 和 `Ant Design` 的后台管理系统模板。它内置了用户登录/登出，动态路由，权限校验，用户管理等典型的业务模型。


# 功能

```bash
- 登录 / 注销

- 权限验证
  - 页面权限
  - 路由权限

- 全局功能
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑
  - 本地/后端 mock 数据
  - Screenfull全屏
  - 自适应收缩侧边栏

- ECharts 图表

- 错误页面
  - 404

- 组件
  - 拖拽列表

- 任务模块
  - 任务列表
  - 任务详情
  - 任务编辑
  - 任务新增
  - 任务删除
  - 任务导出

- 日志模块
  - 异常/任务日志列表
  - 异常日志详情
  - 异常/任务日志删除
  - 异常/任务日志导出

- 巡检数据模块
  - 巡检图片/视频列表
  - 巡检图片/视频详情
  - 巡检图片/视频删除
  - 巡检图片/视频导出

- 基础配置
  - 巡检点列表模块
  - 视觉算法检测模块

```

# 目录结构

```bash
├─ public                     # 静态资源
│   ├─ favicon.ico            # favicon图标
│   └─ index.html             # html模板
├─ build                      # 打包配置文件
├─ src                        # 项目源代码
│   ├─ api                    # 所有请求
│   ├─ assets                 # 图片 字体等静态资源
│   ├─ components             # 全局公用组件
│   ├─ config                 # 全局配置
│   │   ├─ menuConfig.js      # 导航菜单配置
│   │   └─ routeMap.js        # 路由配置
│   ├─ lib                    # 第三方库按需加载
│   ├─ mock                   # 项目mock 模拟数据
│   ├─ store                  # 全局 store管理
│   ├─ styles                 # 全局样式
│   ├─ utils                  # 全局公用方法
│   ├─ views                  # views 所有页面
│   ├─ App.js                 # 入口页面
│   ├─ defaultSettings.js     # 全局默认配置
│   └─index.js                # 源码入口
├── .env.development          # 开发环境变量配置
├── .env.production           # 生产环境变量配置
├── config-overrides.js       # 对cra的webpack自定义配置
└── package.json              # package.json
```

# 安装

```shell
# 克隆项目
git clone https://gitee.com/ZJCXJSLtd/patrol-robot-admin.git

# 进入项目目录
cd patrol-robot-admin

# 安装依赖
npm install

# 切换淘宝源，解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm start
```

启动完成后会自动打开浏览器访问 [http://localhost:3000](http://localhost:3000)， 你看到下面的页面就代表操作成功了。


# 部署

注：项目数据不是mock的，需要后端支持，请求API地址在src/utils/request.js中进行配置baseURL

```shell
# 安装依赖
npm install

# 打包项目
npm run build

# 拉去Nginx镜像
docker pull nginx

# 运行Nginx容器 确保80端口没有被占用
docker compose up -d

# 访问页面
浏览器访问
http://127.0.0.1/patrol-robot-admin/index.html
```