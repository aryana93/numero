let gematria_output = document.querySelectorAll(".gematria-output")[0];
let gematria_input = document.querySelectorAll(".gematria-input")[0];
let gematria_clear_button = document.querySelectorAll(".gematria-clear-button")[
  0];
let date_numerology_input = document.querySelectorAll(".datenumerology-input")[
  0];
let date_numerology_output =
  document.querySelectorAll(".datenumerology-output")[0];
let date_numerology_clear_button =
  document.querySelectorAll(".datenumerology-clear-button")[0];

const arabic_to_roman = (num) => {
  // converts arabic numeral to roman numeral
  if (num > 100000 || num < 1) {
    return "Too large!";
  }
  const lookup = {
    "M": 1000,
    "CM": 900,
    "D": 500,
    "CD": 400,
    "C": 100,
    "XC": 90,
    "L": 50,
    "XL": 40,
    "X": 10,
    "IX": 9,
    "V": 5,
    "IV": 4,
    "I": 1
  };
  let roman = "";
  for (let i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
};

const test_prime = (number) => {
  // test for prime
  let is_prime = true;
  let which_prime = 0;
  if (primes.includes(number)) {
    which_prime = primes.indexOf(number) + 1;
  } else {
    for (let i = 2; i <= Math.sqrt(number) && is_prime === true; i++) {
      if (number % i === 0) {
        is_prime = false;
      }
    }
  }
  return [is_prime, which_prime];
};

const calculate_english_gematria = (sentence) => {
  // calculate english gematria
  let gematria_obj = {};
  for (let gematria_system in english_ciphers) {
    gematria_obj[gematria_system] = {};
    gematria_obj[gematria_system]["gematria"] = 0;
    gematria_obj[gematria_system]["is_prime"] = false;
    gematria_obj[gematria_system]["which_prime"] = 0;
  }
  for (let letter of sentence) {
    for (let gematria_system in english_ciphers) {
      if (english_alphabet.includes(letter)) {
        gematria_obj[gematria_system]["gematria"] += english_ciphers[
          gematria_system][english_alphabet.indexOf(letter)];
      }
    }
  }
  gematria_obj["ASCII"] = {};
  gematria_obj["ASCII"]["gematria"] = 0;
  gematria_obj["ASCII"]["is_prime"] = false;
  gematria_obj["ASCII"]["which_prime"] = 0;
  for (let index in sentence) {
    gematria_obj["ASCII"]["gematria"] +=
      sentence.charCodeAt(index);
  }
  for (let gematria_system in gematria_obj) {
    let [is_prime, which_prime] =
      test_prime(gematria_obj[gematria_system]["gematria"]);
    gematria_obj[gematria_system]["is_prime"] = is_prime;
    gematria_obj[gematria_system]["which_prime"] = which_prime;
  }
  return gematria_obj;
};

const get_input = (input) => {
  // gets input and returns appropriate function and sentence
  let sentence = input.value;
  let input_array = [];
  sentence = sentence.trim();
  if (sentence === "") {
    sentence = "English";
  }
  if ((/\d/).test(sentence[0]) && sentence.search(/\D/) === -1) {
    sentence = arabic_to_roman(sentence);
  }
  input_array = [sentence, calculate_english_gematria];
  return input_array;
};

const display_result = (sentence, gematria_obj, output_field) => {
  // displays the result
  text_string = `<div class="sentence">${sentence}</div>`;
  text_string += `<table>`;
  for (let gematria_system in gematria_obj) {
    if (gematria_obj[gematria_system]["is_prime"] === true) {
      text_string +=
        `<tr><td>${gematria_system}</td>
            <td class="prime">
            ${gematria_obj[gematria_system]["gematria"]}
            </td><td class="which-prime">${gematria_obj[gematria_system]["which_prime"]}</td></tr>`;
    } else {
      text_string +=
        `<tr><td>${gematria_system}</td>
            <td class="not-prime">
            ${gematria_obj[gematria_system]["gematria"]}
            </td><td></td></tr>`;
    }
  }
  text_string += `</table>`;
  output_field.innerHTML = text_string;
};

gematria_input.addEventListener("input", (event) => {
  let [sentence, calculateGematria] = get_input(event.target);
  let gematria_obj = calculateGematria(sentence);
  display_result(sentence, gematria_obj, gematria_output);
});

gematria_clear_button.addEventListener("click", (event) => {
  gematria_input.value = "";
  gematria_input.focus();
});

window.onload = () => {
  let gematria_obj = calculate_english_gematria("English");
  display_result("English", gematria_obj, gematria_output);
};
