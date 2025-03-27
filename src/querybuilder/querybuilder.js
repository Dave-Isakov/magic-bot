export const convertTypes = (types) => {
	let query_string = "";
	for (const type of types) {
		query_string = query_string + `+type${encodeURIComponent(`:${type.toLowerCase()}`)}`;
	}
	return query_string;
};

export const convertColors = (colors, colorID) => {
	let color_string = "";
    if (colorID) {
        for (const color of colors) {
            color_string = color_string + `+id${encodeURIComponent(`:${color.toLowerCase()}`)}`;
        }
    } else {
        for (const color of colors) {
            color_string = color_string + `+c${encodeURIComponent(`:${color.toLowerCase()}`)}`;
        }
    }
	return color_string;
};

export const convertText = (text) => {
	if (!text) {
		return "";
	}
	const open = encodeURIComponent("(");
	const close = encodeURIComponent(")");
	return `${open}${text
		.split(" ")
		.map((word) => `o${encodeURIComponent(`:${word}`)}`)
		.join("+")}${close}`;
};
