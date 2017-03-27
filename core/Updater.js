/**
 * Created by Armaldio on 24/03/2017.
 */

	//TODO need to handle that on the main process not renderer, need also a laucnher

const request = require("request");
const semver  = require('semver');
const tmp     = require('tmp');

let VersionManager = x.require('core.VersionManager', true);

function download (fileUrl, apiPath, callback) {
	let url     = require('url'),
		http    = require('http'),
		p       = url.parse(fileUrl),
		timeout = 10000;

	let file = fs.createWriteStream(apiPath);

	let timeout_wrapper = function (req) {
		return function () {
			console.log('abort');
			req.abort();
			callback("File transfer timeout!");
		};
	};

	console.log('before');

	let request = http.get(fileUrl).on('response', function (res) {
		console.log('in cb');
		let len        = parseInt(response.headers['content-length'], 10);
		let downloaded = 0;

		res.on('data', function (chunk) {
			file.write(chunk);
			downloaded += chunk.length;
			process.stdout.write("Downloading " + (100.0 * downloaded / len).toFixed(2) + "% " + downloaded + " bytes" + isWin ? "\033[0G" : "\r");
			// reset timeout
			clearTimeout(timeoutId);
			timeoutId = setTimeout(fn, timeout);
		}).on('end', function () {
			// clear timeout
			clearTimeout(timeoutId);
			file.end();
			console.log(file_name + ' downloaded to: ' + apiPath);
			callback(null);
		}).on('error', function (err) {
			// clear timeout
			clearTimeout(timeoutId);
			callback(err.message);
		});
	});

	// generate timeout handler
	let fn = timeout_wrapper(request);

	// set initial timeout
	let timeoutId = setTimeout(fn, timeout);
}

/**
 * Handle program auto-update
 * @type {Updater}
 */
module.exports = class Updater {
	constructor () {
		this.url    = "http://xtructversion.armaldio.xyz/version.json";
		this.body   = {};
		this.branch = "stable";
	}

	/**
	 * Check if updates are available
	 */
	checkForUpdates () {
		return new Promise((resolve, reject) => {
			let options = {
				method: 'GET',
				url   : this.url
			};

			request(options, (error, response, body) => {
				if (error) reject(new Error(error));

				this.body = JSON.parse(body);

				let current = VersionManager.getSemVer();
				let online  = this.body[this.branch];

				console.log(`Current ${current} vs Online ${online}`);

				if (semver.valid(current) !== null &&
					semver.valid(online) !== null) {
					if (semver.gt(online, current)) {
						console.log("There is an update");
						this.downloadUpdate();
					}
					else {
						console.log("No updates, go on");
					}
				}
				else {
					throw new Error("Invalid version");
				}
				resolve(true);
			});
		});
	}

	/**
	 * Download update
	 */
	downloadUpdate () {
		tmp.dir({}, (err, path, cleanupCallback) => {
			if (err) throw err;

			console.log('Dir: ', path);

			//download(this.body[this.branch + "-url"], path, () => {
			// console.log("Done");
			// );

			// Manual cleanup
			cleanupCallback();
		});
	}

	/**
	 * Replace files by the downloaded ones
	 */
	installUpdate () {

	}
};