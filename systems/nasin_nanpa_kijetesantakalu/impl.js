systems["nasin_nanpa_kijetesantakalu"] = {
	"to": function(numstr, base) {
		let num = numstring_to_bigint(numstr, base);
		if (num < 0) return {"result": "unrepresentable", "reason": "Input cannot be negative"};
		if (!is_numstring_int(numstr)) return {"result": "unrepresentable", "reason": "Input must be an integer"};
		let outstr = to_base(num, 6);

		return {"result": "success", "output": Array(outstr.length).fill("kijetesantakalu").join(" ")};
	},

	"from": function(string, base) {
		const words = split_words(string);
		const validWords = new Set(["kijetesantakalu", "kijetesantakaLU", "kijetesantaKAlu", "kijetesanTAkalu", "kijeteSANtakalu", "kijeTEsantakalu", "kiJEtesantakalu"]);
		if (!words.every((word) => validWords.has(word))) {
			return {"result": "bad input", "reason": "Input contains unknown words"};
		}
		if (words.includes("kijetesantakalu")) {
			return {"result": "multiple valid", "reason": "Cannot resolve digits without stress denoted"};
		}

		words.forEach((word, i) => {
			if (word == "kijetesantakaLU") words[i] = "0";
			if (word == "kijetesantaKAlu") words[i] = "1";
			if (word == "kijetesanTAkalu") words[i] = "2";
			if (word == "kijeteSANtakalu") words[i] = "3";
			if (word == "kijeTEsantakalu") words[i] = "4";
			if (word == "kiJEtesantakalu") words[i] = "5";
		});

		return {"result": "success", "output": numstring_to_bigint(words.join(""), 6)};
	}
}
