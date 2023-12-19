'use strict';

var process = require('node:process');
var fsPromises = require('node:fs/promises');
var node_url = require('node:url');
var fs = require('node:fs');
var path = require('node:path');

const toPath = urlOrPath => urlOrPath instanceof URL ? node_url.fileURLToPath(urlOrPath) : urlOrPath;

async function findUp(name, {
	cwd = process.cwd(),
	type = 'file',
	stopAt,
} = {}) {
	let directory = path.resolve(toPath(cwd) ?? '');
	const {root} = path.parse(directory);
	stopAt = path.resolve(directory, toPath(stopAt ?? root));

	while (directory && directory !== stopAt && directory !== root) {
		const filePath = path.isAbsolute(name) ? name : path.join(directory, name);

		try {
			const stats = await fsPromises.stat(filePath); // eslint-disable-line no-await-in-loop
			if ((type === 'file' && stats.isFile()) || (type === 'directory' && stats.isDirectory())) {
				return filePath;
			}
		} catch {}

		directory = path.dirname(directory);
	}
}

function findUpSync(name, {
	cwd = process.cwd(),
	type = 'file',
	stopAt,
} = {}) {
	let directory = path.resolve(toPath(cwd) ?? '');
	const {root} = path.parse(directory);
	stopAt = path.resolve(directory, toPath(stopAt) ?? root);

	while (directory && directory !== stopAt && directory !== root) {
		const filePath = path.isAbsolute(name) ? name : path.join(directory, name);

		try {
			const stats = fs.statSync(filePath, {throwIfNoEntry: false});
			if ((type === 'file' && stats?.isFile()) || (type === 'directory' && stats?.isDirectory())) {
				return filePath;
			}
		} catch {}

		directory = path.dirname(directory);
	}
}

exports.findUp = findUp;
exports.findUpSync = findUpSync;
