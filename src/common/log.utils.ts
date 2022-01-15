export const j = (o: any) => JSON.stringify(o);

/* Transform object into key=value[, keyN=valueN] string
 * @param {any} 		obj object to transform
 * @param {number=}	max optional max amount of keys to show; _...more[N]_ will be added to replace exceeding key elements */
export const v = (obj, max: number = null) =>
	Object.keys(obj ? obj : {})
		.map((m, i) => {
			if ((max && i < max) || !max)
				return typeof obj[m] == "object"
					? m + `=(${v(obj[m], max)})`
					: m + "=" + obj[m];
			else if (max && i == max + 1)
				return `...more[${Object.keys(obj).length - max}]`;
		})
		.filter((f) => f != null)
		.join(", ") || "";

export function getMethodName(suffix?: string) {
	const err = new Error();
	return /at \w+\.(\w+)/.exec(err.stack.split("\n")[2])[1] + suffix; // we want the 2nd method in the call stack
}

/* Convert all local IP addresses to localhost */
export const toLocalhost = (url: string) => {
	// https://regex101.com/r/vIE8X1/1
	const re =
		/:\/\/(\[::1]|127\.[012]?[0-9]{0,2}\.[012]?[0-9]{0,2}\.[012]?[0-9]{0,2})/gi;
	return url.replace(re, "://localhost");
};
