var fs = require('fs');
var packageJSON = JSON.parse(fs.readFileSync('./package.json'));
const fsbx = require("fuse-box");

/*
Create a new fusebox instance
*/
function createFuseBoxInstance({outFile}) {
	return new fsbx.FuseBox({
	    homeDir: "src/app",
	    sourceMap: {
	        bundleReference: "sourcemaps.js.map",
	        outFile: "./server/sourcemaps.js.map",
	    },
	    cache: true,
	    outFile: outFile,

	    plugins: [
	        fsbx.BabelPlugin({
	            config: {
	                sourceMaps: true,
	                presets: ["env"]
	            }
	        })
	    ]
	});
}


function bundleClient({outFile}) {
	const externalDependencies = Object.keys(packageJSON.dependencies).map(dep => '-'+dep).join(' ');
	const fuseBox = createFuseBoxInstance({outFile});
	return fuseBox.bundle(`>index.js ${externalDependencies}`);
}

function bundleVendor({outFile}) {
	const externalDependencies = Object.keys(packageJSON.dependencies).map(dep => '+'+dep).join(' ');
	const fuseBox = createFuseBoxInstance({outFile});
	return fuseBox.bundle(`${externalDependencies}`);
}

module.exports = ({isVendor=false}) => {
	return () => {
		return isVendor
			? bundleVendor({outFile: './server/vendor.js'})
			: bundleClient({outFile: './server/client.js'});
	}
};
