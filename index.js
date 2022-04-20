'use strict'

const fetch = require('node-fetch');
const AbortController = require('abort-controller');

const bilidl = async (url, cid = '') => {
	const regExBL = /^https?:\/\/www\.bilibili\.com\/video\/[\S]{12}$/;
	if (!url.match(regExBL)) {
		throw new Error("Not a valid bilibili link.");
	} else {
		/*const regex = /<script>window\.__playinfo__=([^]+?)<\/script><script>window\.__INITIAL_STATE__=([^]+?);\(function\(\){var s;\(s=document\.currentScript\|\|document.scripts\[document\.scripts\.length-1]\)\.parentNode\.removeChild\(s\);}\(\)\);<\/script>/;
		//This is needed or else 403 (Forbidden)
		const headers = {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.95 Safari/537.36'
		}
		const fetched = await(await fetch(`https://www.bilibili.com/video/${url.match(/https?:\/\/www\.bilibili\.com\/video\/([a-zA-Z0-9]{12})/)[1]}`, { headers })).text();
		const data = fetched.match(regex);
		const videoInfo = JSON.parse(data[1]);
		return videoInfo.data.dash.audio[0].baseUrl;*/
		//const pageInfo = JSON.parse(data[2]);

		return await new Promise(async (resolve, reject) => {
			//Step 1: Get video cid, needed for step 2
			let json = (
				await (
					await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${url.match(/https?:\/\/www\.bilibili\.com\/video\/([a-zA-Z0-9]{12})/)[1]}`/*, { headers }*/).catch(reject)
				).json()
			).data;
			
			if (cid == '') {
				cid = json.cid;
			}
			
			//Step 2: Get video download url
			json = (
				await (
					await fetch(`https://api.bilibili.com/x/player/playurl?bvid=${url.match(/https?:\/\/www\.bilibili\.com\/video\/([a-zA-Z0-9]{12})/)[1]}&qn=16&cid=${cid}`/*, { headers }*/).catch(reject)
				).json()
			).data;

			//Step 3: Return video as readable stream
			const res = await fetch(json.durl[0].url).catch(reject);
			resolve(res.body);
		});
	}
}

async function biliInfo(url) {
	const controller = new AbortController();
	const timeout = setTimeout(() => {
		controller.abort();
	}, 5000);
	
	const regExBL = /^https?:\/\/www\.bilibili\.com\/video\/[\S]{12}$/;
	if (!url.match(regExBL)) {
		throw new Error("Not a valid bilibili link.");
	} else {
		try {
			const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${url.match(/https?:\/\/www\.bilibili\.com\/video\/([a-zA-Z0-9]{12})/)[1]}`, {
				/*headers: headers,*/
				signal: controller.signal
			});
			const json = await response.json();
			return json.data;
		} catch (err) {
			if (err) {
				console.error(err);
			}
		} finally {
			clearTimeout(timeout);
		}
		
	}
}

module.exports = bilidl;
bilidl.getInfo = biliInfo;