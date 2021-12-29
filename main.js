let gematria_output = document.querySelectorAll(".gematria-output")[0];
let gematria_input = document.querySelectorAll(".gematria-input")[0];
let gematria_clear_button = document.querySelectorAll(".gematria-clear-button")[
  0];
let sentenceOut = document.querySelectorAll(".sentence")[0];

// A table dome node
let resultTable = document.createElement('table')
gematria_output.appendChild(resultTable);

// A dictionary to hold table items
let tableDict = {};

// set up the table dome using table dictionary
for (let item in english_ciphers) {
  tableDict[item] = {};
  tableDict[item]["tr"] = document.createElement("tr");
  tableDict[item]["cipherTd"] = document.createElement("td");
  tableDict[item]["cipherTd"].setAttribute("id", item.replace(/\s/g, "-"));
  tableDict[item]["cipherTd"].setAttribute("class", "cipher-name");
  tableDict[item]["cipherTd"].innerHTML = item;
  tableDict[item]["tr"].appendChild(tableDict[item]["cipherTd"]);
  tableDict[item]["gematriaTd"] = document.createElement("td");
  tableDict[item]["gematriaTd"].setAttribute("class", "gematria");
  tableDict[item]["tr"].appendChild(tableDict[item]["gematriaTd"]);
  tableDict[item]["primeTd"] = document.createElement("td");
  tableDict[item]["primeTd"].setAttribute("class", "prime")
  tableDict[item]["tr"].appendChild(tableDict[item]["primeTd"]);
  resultTable.appendChild(tableDict[item]["tr"]);
}

// ASCII cipher added
tableDict["ASCII"] = {};
tableDict["ASCII"]["tr"] = document.createElement("tr");
tableDict["ASCII"]["cipherTd"] = document.createElement("td");
tableDict["ASCII"]["cipherTd"].setAttribute("id", "ASCII");
tableDict["ASCII"]["cipherTd"].setAttribute("class", "cipher-name");
tableDict["ASCII"]["cipherTd"].innerHTML = "ASCII";
tableDict["ASCII"]["tr"].appendChild(tableDict["ASCII"]["cipherTd"]);
tableDict["ASCII"]["gematriaTd"] = document.createElement("td");
// tableDict["ASCII"]["gematriaTd"].setAttribute("class", "gematria");
tableDict["ASCII"]["tr"].appendChild(tableDict["ASCII"]["gematriaTd"]);
tableDict["ASCII"]["primeTd"] = document.createElement("td");
tableDict["ASCII"]["primeTd"].setAttribute("class", "prime")
tableDict["ASCII"]["tr"].appendChild(tableDict["ASCII"]["primeTd"]);
resultTable.appendChild(tableDict["ASCII"]["tr"]);

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
  // sentence = sentence.trim();
  if ((/\d/).test(sentence[0]) && sentence.search(/\D/) === -1) {
    sentence = arabic_to_roman(sentence);
  }
  return sentence;
};

const display_result = (sentence, gematria_obj) => {
  // displays the result
  sentenceOut.innerHTML = `${sentence}`;
  for (let gematria_system in gematria_obj) {
    tableDict[gematria_system]["gematriaTd"].innerHTML = gematria_obj[gematria_system]["gematria"];
    if (gematria_obj[gematria_system]["is_prime"]) {
      tableDict[gematria_system]["primeTd"].innerHTML = gematria_obj[gematria_system]["which_prime"];
      tableDict[gematria_system]["gematriaTd"].setAttribute("class", "is-prime");
    } else {
      tableDict[gematria_system]["primeTd"].innerHTML = "";
      tableDict[gematria_system]["gematriaTd"].setAttribute("class", "not-prime");
    }
  }
};

gematria_input.addEventListener("input", (event) => {
  let sentence = get_input(event.target);
  let gematria_obj = calculate_english_gematria(sentence);
  display_result(sentence, gematria_obj);
});

gematria_clear_button.addEventListener("click", (event) => {
  gematria_input.value = "";
  gematria_input.focus();
});

window.onload = () => {
  let gematria_obj = calculate_english_gematria("English");
  display_result("English", gematria_obj, gematria_output);
};
