export function isValidRegex(s) {
	try {
		const m = s.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/);
		return m ? !!new RegExp(m[2], m[3]) : false;
	} catch (e) {
		return false;
	}
}

export function stringToRegex(s) {
	const m = s.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/);
	return m ? new RegExp(m[2], m[3]) : new RegExp(s);
}
