exports.isInstalled = function isInstalled(specifier) {
	try {
		require.resolve(specifier);
		return true;
	} catch {}

	return false;
}


