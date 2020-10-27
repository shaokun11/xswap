export const sleep = function(number: number) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), 1000 * number);
	});
};
