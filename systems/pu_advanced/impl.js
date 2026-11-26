/*
to() input:
	numstr -- the original string input number, function call not reached if unparseable
	base

to() output:
{
	result -- One of these values:
		"success" (Success type)
		"unrepresentable" (Error type, For inputs outside the set the system describes)
		"output too large" (Error type, For outputs that are too large. Try not to output anything with more than 2000 characters.)
	reason -- if result is an error type, a reason for the fail can optionally be left here
	output -- the output as a string, only included if result is a success type
}

from() input: string -- Won't be more than 2000 characters

from() output:
{
	result -- One of these values:
		"success" (Success type)
		"success_nonstandard" (Success type, for inputs that are parsable but go against convention or specification)
		"bad input" (Error type, For inputs outside the set the system describes)
		"multiple valid" (Error type, For inputs that can refer to more than one number)
		"output too large" (Error type, For outputs that are too large. Try not to output anything with more than 2000 characters.)
	reason -- if result is an error type, a reason for the fail can optionally be left here
	output -- the output as a string, only included if result is a success type
}
*/

systems["pu_advanced"] = {
	"to": function(numstr, base) {
		let num = numstring_to_bigint(numstr, base);
		if (num <= 0n) return {"result": "unrepresentable", "reason": "Input must be positive"};
		if (!is_numstring_int(numstr)) return {"result": "unrepresentable", "reason": "Input must be an integer"};
		if (num > 50_000n) return {"result": "output too large"};
		let output_list = [];
		function num_word(word, size) {
			output_list.push(...Array(Number(num/size)).fill(word));
			num %= size;
		}
		num_word("ale", 100n);
		num_word("mute", 20n);
		num_word("luka", 5n);
		num_word("tu", 2n);
		num_word("wan", 1n);
		return {"result": "success", "output": output_list.join(" ")};
	},

	"from": function(string, base) {
		const words = split_words(string);
		const validWords = new Set(["ale", "ali", "mute", "luka", "tu", "wan"]);
		if (!words.every((word) => validWords.has(word))) {
			return {"result": "bad input", "reason": "Input contains unknown words"};
		}
		let output = 0n;
		for (const word of words) {
			if (word === "ale" || word === "ali") output += 100n;
			if (word === "mute") output += 20n;
			if (word === "luka") output += 5n;
			if (word === "tu") output += 2n;
			if (word === "wan") output += 1n;
		}
		return {"result": "success", "output": to_base(output, base)};
	}
}


