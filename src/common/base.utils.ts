export function shallowEqual(object1, object2) {
	if (!object1 || !object2) return false;

	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);

	if (keys1.length !== keys2.length) {
		return false;
	}
	for (const key of keys1) {
		if (object1[key] !== object2[key]) {
			return false;
		}
	}
	return true;
}

export function arrIdentical(a1, a2) {
	let i = a1.length;
	if (i !== a2.length) return false;
	while (i--) {
		if (!shallowEqual(a1[i], a2[i])) return false;
	}
	return true;
}

export function elapsedSeconds(start) {
	return Math.round((new Date().getTime() - start.getTime()) / 1000);
}

export function removeFromObject(obj: any, remove: string[]): any {
	for (const key of remove) {
		delete obj[key];
	}
	return obj;
}

export function roundDown(value: number, decimals: number) {
	return Math.floor(value * 10 ** decimals) / 10 ** decimals;
}
