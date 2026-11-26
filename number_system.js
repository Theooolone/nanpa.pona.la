let systems = [];

class Fraction {
	constructor(n, d = 1n) {
		const g = abs_bigint(gcd(n, d));
		this.n = n / g;
		this.d = d / g;
	}

	add(f) {
		const n = this.n * f.d + f.n * this.d;
		const d = this.d * f.d;
		return new Fraction(n, d);
	}

	multiply(f) {
		const n = this.n * f.n;
		const d = this.d * f.d;
		return new Fraction(n, d);
	}
}

function split_words(string) {
	return string.split(/\s+/).filter((word) => word !== "");
}

function numstring_fractional_part(numstr) {
	return numstr.split(".")[1] ?? "";
}

// Truncates value (rounds towards zero)
function numstring_to_bigint(numstr, base = 10) {
	const simple_str = numstr.split(".")[0].replace(/[, ]/g, "");
	if (base === 10) return BigInt(simple_str);
	return from_base(simple_str, base);
}

function is_numstring_int(numstr) {
	return !/[^0]/.test(numstring_fractional_part(numstr).replace(/[r, ]/g, ""));
}

// Introduces precision errors.
function numstr_to_number(numstr) {
	return Number(numstr);
}

function numstr_to_fraction(numstr, base = 10) {
	let negative = false;
	if (numstr[0] === "-" || numstr[0] === "+") {
		negative = numstr[0] === "-";
		numstr = numstr.slice(1);
	}

	let int_part = numstring_to_bigint(numstr);
	const frac_part = fractional_part_to_fraction(numstr.split(".")[1] ?? "0");
	if (negative) {
		frac_part.n = -frac_part.n;
		int_part = -int_part;
	};
	return new Fraction(int_part).add(frac_part);

}

function abs_bigint(n) {
	return n > 0 ? n : -n;
}

const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function digits_to_bigint(s, base = 10) {
	if (!Number.isInteger(base) || base < 2 || base > 36) {
		throw new RangeError("Base must be an int from 2 to 36");
	}

	const b = BigInt(base);
	let result = 0n;

	for (const ch of s) {
		const digit = DIGITS.indexOf(ch);
		if (digit === -1 || digit >= base) {
			throw new SyntaxError(`Invalid digit "${ch}" for base ${base}`);
		}
		result = result * b + BigInt(digit);
	}

	return result;
}

function from_base(intstr, base = 10) {
	let s = intstr;
	let negative = false;

	if (s[0] === "-" || s[0] === "+") {
		negative = s[0] === "-";
		s = s.slice(1);
	}
	if (s === "") {
		throw new SyntaxError("Cannot convert empty string to BigInt");
	}

	const result = digits_to_bigint(s, base);
	return negative ? -result : result;
}

function to_base(bigint, base = 10) {
	if (base == 10) {
		return String(bigint);
	}
	if (!Number.isInteger(base) || base < 2 || base > DIGITS.length) {
		throw new RangeError("Base must be an int from 2 to 36");
	}
	bigint = BigInt(bigint);
	if (bigint == 0n) {
		return "0";
	}
	const negative = bigint < 0n;
	if (negative) {
		bigint = -bigint;
	}
	const b = BigInt(base);
	const out = [];
	while (bigint > 0n) {
		out.push(DIGITS[Number(bigint % b)]);
		bigint /= b;
	}
	if (negative) {
		out.push("-");
	}
	return out.reverse().join("");
}

// Converts "5" to 1/2 and "125" to 1/8 and stuff
function fractional_part_to_fraction(str, base = 10) {
	const [a = "", r = ""] = str.split("r");
	const b = BigInt(base);
	const n = BigInt(a.length);
	const m = BigInt(r.length);
	const A = digits_to_bigint(a, base);
	const B = digits_to_bigint(r, base);

	let num, den;
	if (r.length === 0) {
		num = A;
		den = b ** n;
	} else {
		const rep = b ** m - 1n;
		num = A * rep + B;
		den = b ** n * rep;
	}

	return new Fraction(num, den);
}

function gcd(x, y) {
	while (y) [x, y] = [y, x % y];
	return x;
}

addEventListener("DOMContentLoaded", (event) => {
	let to_input = document.querySelector('#to_input')
	let to_output = document.querySelector('#to_output')
	to_input.addEventListener("input", (_) => {
		let result = Object.values(systems)[0].to(to_input.value, 10);
		if (result.result === "success") {
			to_output.innerHTML = result.output;
			return;
		}
		to_output.innerHTML = "ERROR: " + (result.reason ?? result.result);
	})

	let from_input = document.querySelector('#from_input')
	let from_output = document.querySelector('#from_output')
	from_input.addEventListener("input", (_) => {
		let result = Object.values(systems)[0].from(from_input.value, 10);
		if (result.result === "success") {
			from_output.innerHTML = result.output;
			return;
		}
		from_output.innerHTML = "ERROR: " + (result.reason ?? result.result);
	})
})
