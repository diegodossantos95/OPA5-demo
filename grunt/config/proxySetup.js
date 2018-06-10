module.exports = function () {
	if(process.env.HTTP_PROXY || process.env.http_proxy) {
		return 'setupProxies:sapProxy';
	} else {
		return 'setupProxies:noProxy';
	}
};
