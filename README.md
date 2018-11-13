# Rate Limit By IP

## 環境

* **Redis** `4.0` up
* **Node.js** `8.0` up
* **yarn** `1.0` up

## How to Install

1. 準備一台 redis DB (default: 127.0.0.1:6379)

2. git clone or fork from [https://github.com/jimliu7434/rate-limit](https://github.com/jimliu7434/rate-limit)

3. 切換到工作目錄 & install modules

    ```bash
    # install dependencies
    yarn
    ```

## How to Use

1. set **ENV** to configurate the application or use the **Default** values

    | ENV | default | description |
    |:-:|-:|:-|
    |REDISHOST| '127.0.0.1' | Redis Host |
    |REDISPORT| 6379 | Redis Port |
    |WEBPORT| 80 | koa web Server 監聽 port |
    |RESETSEC | 60 | rate limit 每多久重置 (單位：秒) |
    |RATE| 60 | rate limit 每單位時間每個 IP 可接受的最大數量 |

2. start application
    ```bash
    yarn start
    ```

## How to Test

1. determine where your application is *(default '127.0.0.1:80' if you are running it locally and  WEBPORT is not changed)*
2. call test script
    ```bash
    # if application is using default ip & port (127.0.0.1:80)
    yarn test

    # or if WEBPORT is changed or IP is changed
    # ex: node ./test/index.js 192.168.1.2:8080
    node ./test/index.js [your.ip.here]:[port]
    ```

## Why using Redis

1. Performance : Redis 相較一般 DB，有速度效能優勢
2. Easy Programing: application 所有 stateful data 在 Redis 中都有適合的 Data Structure 可以存放
3. Functional Fit: 使用 Redis 提供的 `Expire` 功能無須在 application 層使用任何 timer；使用 Redis 的 `Incr` 也無須考慮高併發時 get then set Value 的時間差
4. Easy Scale-Out: Redis 提供完整的 Master-Slave + Sentinel 架構，可讀寫分離；在處理一般大量 requests 時，無須擔心資料庫的擴充問題