#BiliDL
A ytdl clone for bilibili. Yes. Time to play bilibili videos through Discord bots.

#Sample
Playing bilibili video in Discord.
```js
const bilidl = require('bilidl');

const connection = await message.member.voice.channel.join();
const dispatcher = connection.play(await bilidl(url));
```

Getting bilibili video info. Returns the video info in JSON format.
```js
const bilidl = require('bilidl');

const info = await bilidl.getInfo(url);
```

#Video Info JSON
Fields：

| Field   | Type                          				 | Content  			| Note                                           |
| ------- | ----------------------------- 				 | -------- 			| ---------------------------------------------- |
| code    | num                           				 | Return Code   		| 0：Success <br />-400：Request error<br />-404：Video not found |
| message | str                           				 | Error Message 		| Default 0                                      |
| ttl     | num                           				 | 1        			| Not clear                                   	 |
| data    | When successful：obj<br />When it fails：null| The Video Data Itself|                                                |

`data` fields：

| Field              | Type   | Content                  | Note                                     |
| ------------------ | ------ | ------------------------ | ---------------------------------------- |
| from               | str    | local                    | **Unclear Usage**                         |
| result             | str    | suee                     | **Unclear Usage**                         |
| message            | str    | Empty                       | **Unclear Usage**                         |
| quality            | num    | Code for Video Quality           | **值含义见上表**                         |
| format             | str    | Video Format                 |                                          |
| timelength         | num    | Video Length                 | Milisecond Unit<br />Different Quality May Have Slight Difference |
| accept_format      | str    | Supported Format  |                                          |
| accept_description | array | Supported Quality List     |                                          |
| accept_quality     | array | Supported Quality Code | **值含义见上表**                         |
| video_codecid      | num    | ???                   | **Unclear Usage**                         |
| seek_param         | str    | start                    | **Unclear Usage**                         |
| seek_type          | str    | offset                   | **Unclear Usage**                         |
| durl               | array | Video Arrays                 |                                          |

`data`中的`accept_description`数组：

| 项   | 类型 | 内容            | 备注 |
| ---- | ---- | --------------- | ---- |
| 0    | str  | 分辨率名称1     |      |
| n    | str  | 分辨率名称(n+1) |      |
| ……   | str  | ……              | ……   |

`data`中的`accept_quality`数组：

| 项   | 类型 | 内容            | 备注 |
| ---- | ---- | --------------- | ---- |
| 0    | str  | 分辨率代码1     |      |
| n    | str  | 分辨率代码(n+1) |      |
| ……   | str  | ……              | ……   |

`data`中的`durl`数组：

| 项   | 类型 | 内容              | 备注 |
| ---- | ---- | ----------------- | ---- |
| 0    | obj  | 视频分段1信息     |      |
| n    | obj  | 视频分段(n+1)信息 |      |
| ……   | obj  | ……                |      |

`durl`数组中的对象：

| 字段       | 类型   | 内容         | 备注                               |
| ---------- | ------ | ------------ | ---------------------------------- |
| order      | num    | 视频分段序号 | 某些视频会分为多个片段             |
| length     | num    | 视频长度     | 单位为毫秒                         |
| size       | num    | 视频大小     | 单位为Byte                         |
| ahead      | str    | 空           | 作用尚不明确                       |
| vhead      | str    | 空           | 作用尚不明确                       |
| url        | str    | 视频流url    | **重要**<br />链接有效时间为120min |
| backup_url | array | 备用视频流   |                                    |

`durl`数组中的对象中的`backup_url`数组：

| 项   | 类型 | 内容          | 备注             |
| ---- | ---- | ------------- | ---------------- |
| 0    | str  | 备用视频流url | 有效时间为120min |
