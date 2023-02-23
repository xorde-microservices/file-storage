export const j = (o: any) => JSON.stringify(o);

/* Convert all local IP addresses to localhost */
export const toLocalhost = (url: string) => {
	// https://regex101.com/r/vIE8X1/1
	const re = /:\/\/(\[::1]|127\.[012]?[0-9]{0,2}\.[012]?[0-9]{0,2}\.[012]?[0-9]{0,2})/gi;
	return url.replace(re, '://localhost');
};
