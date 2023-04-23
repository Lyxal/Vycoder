import { encode } from "./coder.js";
import { weighted_positions } from "./predictions.js";
import { vyxal_to_int, int_to_vyxal } from "./codepage.js";

window.compress = function (program) {
    let code = vyxal_to_int(program);
    let weights = weighted_positions((d => 0.5 ** d), 32, 128)
    let encoded = encode(code, weights);
    return encoded.join("")
}