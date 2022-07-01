const fs = require('fs');
const fetch = require('node-fetch');
const args = require('yargs').argv;

async function biliDownload(url) {
  if (url === '' || url === 'undefined' || url === null) throw new Error('url is required');
  const regExBL = /^https?:\/\/www\.bilibili\.com\/video\/[\S]{12}$/;
  if (!url.match(regExBL)) throw new Error('Not a valid bilibili link.');

  const video = {
    url: url,
    title: '',
    thumbnail: '',
    views: '',
    duration: '',
    uploaded_at: '',
    channel: '',
  }

  await new Promise(async (resolve, reject) => {
    let json = (
      await (
        await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${url.substring(31,43)}`).catch(reject)
      ).json()
    ).data;
    const cid = json.cid;
    video.title = json.title;
    video.thumbnail = json.pic;
    video.views = json.stat.view;
    const time = json.pages[0].duration;
    const timeMinute = Math.floor(time / 60);
    const timeSecond = String(Math.floor(time % 60)).padStart(2, '0');
    video.duration = `${timeMinute}:${timeSecond}`;
    video.uploaded_at = new Date(json.pubdate * 1000);
    video.channel = json.owner.name;

    //Step 2: Get video download url
    json = (
      await (
        await fetch(`https://api.bilibili.com/x/player/playurl?bvid=${url.substring(31,43)}&qn=16&cid=${cid}`).catch(reject)
      ).json()
    ).data;

    //Step 3: Write file to local storage
    const mp4File = fs.createWriteStream(`./${video.title}.mp4`, { emitClose: true });
    const res = await fetch(json.durl[0].url).catch(reject);
    res.body.pipe(mp4File);
    mp4File.on('finish', resolve);
    console.log(video);
  });
  return video;
}

// ----- Test -----
biliDownload(/*'https://www.bilibili.com/video/BV1dK4y1r7Wc'*/ `${args.url}`)
.then(() => { console.log('Done!!'); process.exit(0); })
.catch(console.log);
process.stdin.on('data', () => { });