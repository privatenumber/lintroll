'some-directive';
import { readFile, writeFile, stat, access } from 'fs';
import path from 'path'
import stream from 'stream'
import os from 'os'
import util from 'util'
import net from 'net'
import dns from 'dns'
import cluster from 'cluster'
import url from 'url'
import querystring from 'querystring'
import crypto from 'crypto'
import http from 'http'
import './some-file'
import events from 'events'
import http2 from 'http2'
import zlib from 'zlib'

console.log ("hello world")
// comment without newline above
console.log(new Buffer(5));

// iife
(function () {

}());

const objectMulti = { a: 1, b: 2 };
const range = [1, 2];

isNaN(1121);
isFinite(1121);

if (true) console.log(1);

/[0-9]+/.test('1111');

process.exit();

const ternary = true ? 1 : 2;

const ternary2 = true ?
	1 :
	2;

const regex = /[0-9]\.[a-zA-Z0-9_]\-[^0-9]/i;

// Extending native prototypes - no-extend-native
String.prototype.shortHash = function() {};

// Using non-native prototypes - no-use-extend-native
'50bda47b09923e045759db8e8dd01a0bacd97370'.shortHash();