// http://country.io/names.json
const countries = {
    "BD": "Bangladesh",
    "BE": "Belgium",
    "BF": "Burkina Faso",
    "BG": "Bulgaria",
    "BA": "Bosnia and Herzegovina",
    "BB": "Barbados",
    "WF": "Wallis and Futuna",
    "BL": "Saint Barthelemy",
    "BM": "Bermuda",
    "BN": "Brunei",
    "BO": "Bolivia",
    "BH": "Bahrain",
    "BI": "Burundi",
    "BJ": "Benin",
    "BT": "Bhutan",
    "JM": "Jamaica",
    "BV": "Bouvet Island",
    "BW": "Botswana",
    "WS": "Samoa",
    "BQ": "Bonaire, Saint Eustatius and Saba ",
    "BR": "Brazil",
    "BS": "Bahamas",
    "JE": "Jersey",
    "BY": "Belarus",
    "BZ": "Belize",
    "RU": "Russia",
    "RW": "Rwanda",
    "RS": "Serbia",
    "TL": "East Timor",
    "RE": "Reunion",
    "TM": "Turkmenistan",
    "TJ": "Tajikistan",
    "RO": "Romania",
    "TK": "Tokelau",
    "GW": "Guinea-Bissau",
    "GU": "Guam",
    "GT": "Guatemala",
    "GS": "South Georgia and the South Sandwich Islands",
    "GR": "Greece",
    "GQ": "Equatorial Guinea",
    "GP": "Guadeloupe",
    "JP": "Japan",
    "GY": "Guyana",
    "GG": "Guernsey",
    "GF": "French Guiana",
    "GE": "Georgia",
    "GD": "Grenada",
    "GB": "United Kingdom",
    "GA": "Gabon",
    "SV": "El Salvador",
    "GN": "Guinea",
    "GM": "Gambia",
    "GL": "Greenland",
    "GI": "Gibraltar",
    "GH": "Ghana",
    "OM": "Oman",
    "TN": "Tunisia",
    "JO": "Jordan",
    "HR": "Croatia",
    "HT": "Haiti",
    "HU": "Hungary",
    "HK": "Hong Kong",
    "HN": "Honduras",
    "HM": "Heard Island and McDonald Islands",
    "VE": "Venezuela",
    "PR": "Puerto Rico",
    "PS": "Palestinian Territory",
    "PW": "Palau",
    "PT": "Portugal",
    "SJ": "Svalbard and Jan Mayen",
    "PY": "Paraguay",
    "IQ": "Iraq",
    "PA": "Panama",
    "PF": "French Polynesia",
    "PG": "Papua New Guinea",
    "PE": "Peru",
    "PK": "Pakistan",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PM": "Saint Pierre and Miquelon",
    "ZM": "Zambia",
    "EH": "Western Sahara",
    "EE": "Estonia",
    "EG": "Egypt",
    "ZA": "South Africa",
    "EC": "Ecuador",
    "IT": "Italy",
    "VN": "Vietnam",
    "SB": "Solomon Islands",
    "ET": "Ethiopia",
    "SO": "Somalia",
    "ZW": "Zimbabwe",
    "SA": "Saudi Arabia",
    "ES": "Spain",
    "ER": "Eritrea",
    "ME": "Montenegro",
    "MD": "Moldova",
    "MG": "Madagascar",
    "MF": "Saint Martin",
    "MA": "Morocco",
    "MC": "Monaco",
    "UZ": "Uzbekistan",
    "MM": "Myanmar",
    "ML": "Mali",
    "MO": "Macao",
    "MN": "Mongolia",
    "MH": "Marshall Islands",
    "MK": "Macedonia",
    "MU": "Mauritius",
    "MT": "Malta",
    "MW": "Malawi",
    "MV": "Maldives",
    "MQ": "Martinique",
    "MP": "Northern Mariana Islands",
    "MS": "Montserrat",
    "MR": "Mauritania",
    "IM": "Isle of Man",
    "UG": "Uganda",
    "TZ": "Tanzania",
    "MY": "Malaysia",
    "MX": "Mexico",
    "IL": "Israel",
    "FR": "France",
    "IO": "British Indian Ocean Territory",
    "SH": "Saint Helena",
    "FI": "Finland",
    "FJ": "Fiji",
    "FK": "Falkland Islands",
    "FM": "Micronesia",
    "FO": "Faroe Islands",
    "NI": "Nicaragua",
    "NL": "Netherlands",
    "NO": "Norway",
    "NA": "Namibia",
    "VU": "Vanuatu",
    "NC": "New Caledonia",
    "NE": "Niger",
    "NF": "Norfolk Island",
    "NG": "Nigeria",
    "NZ": "New Zealand",
    "NP": "Nepal",
    "NR": "Nauru",
    "NU": "Niue",
    "CK": "Cook Islands",
    "XK": "Kosovo",
    "CI": "Ivory Coast",
    "CH": "Switzerland",
    "CO": "Colombia",
    "CN": "China",
    "CM": "Cameroon",
    "CL": "Chile",
    "CC": "Cocos Islands",
    "CA": "Canada",
    "CG": "Republic of the Congo",
    "CF": "Central African Republic",
    "CD": "Democratic Republic of the Congo",
    "CZ": "Czech Republic",
    "CY": "Cyprus",
    "CX": "Christmas Island",
    "CR": "Costa Rica",
    "CW": "Curacao",
    "CV": "Cape Verde",
    "CU": "Cuba",
    "SZ": "Swaziland",
    "SY": "Syria",
    "SX": "Sint Maarten",
    "KG": "Kyrgyzstan",
    "KE": "Kenya",
    "SS": "South Sudan",
    "SR": "Suriname",
    "KI": "Kiribati",
    "KH": "Cambodia",
    "KN": "Saint Kitts and Nevis",
    "KM": "Comoros",
    "ST": "Sao Tome and Principe",
    "SK": "Slovakia",
    "KR": "South Korea",
    "SI": "Slovenia",
    "KP": "North Korea",
    "KW": "Kuwait",
    "SN": "Senegal",
    "SM": "San Marino",
    "SL": "Sierra Leone",
    "SC": "Seychelles",
    "KZ": "Kazakhstan",
    "KY": "Cayman Islands",
    "SG": "Singapore",
    "SE": "Sweden",
    "SD": "Sudan",
    "DO": "Dominican Republic",
    "DM": "Dominica",
    "DJ": "Djibouti",
    "DK": "Denmark",
    "VG": "British Virgin Islands",
    "DE": "Germany",
    "YE": "Yemen",
    "DZ": "Algeria",
    "US": "United States",
    "UY": "Uruguay",
    "YT": "Mayotte",
    "UM": "United States Minor Outlying Islands",
    "LB": "Lebanon",
    "LC": "Saint Lucia",
    "LA": "Laos",
    "TV": "Tuvalu",
    "TW": "Taiwan",
    "TT": "Trinidad and Tobago",
    "TR": "Turkey",
    "LK": "Sri Lanka",
    "LI": "Liechtenstein",
    "LV": "Latvia",
    "TO": "Tonga",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "LR": "Liberia",
    "LS": "Lesotho",
    "TH": "Thailand",
    "TF": "French Southern Territories",
    "TG": "Togo",
    "TD": "Chad",
    "TC": "Turks and Caicos Islands",
    "LY": "Libya",
    "VA": "Vatican",
    "VC": "Saint Vincent and the Grenadines",
    "AE": "United Arab Emirates",
    "AD": "Andorra",
    "AG": "Antigua and Barbuda",
    "AF": "Afghanistan",
    "AI": "Anguilla",
    "VI": "U.S. Virgin Islands",
    "IS": "Iceland",
    "IR": "Iran",
    "AM": "Armenia",
    "AL": "Albania",
    "AO": "Angola",
    "AQ": "Antarctica",
    "AS": "American Samoa",
    "AR": "Argentina",
    "AU": "Australia",
    "AT": "Austria",
    "AW": "Aruba",
    "IN": "India",
    "AX": "Aland Islands",
    "AZ": "Azerbaijan",
    "IE": "Ireland",
    "ID": "Indonesia",
    "UA": "Ukraine",
    "QA": "Qatar",
    "MZ": "Mozambique"
}

// http://country.io/currency.json
const currencies = {
    "BD": "BDT",
    "BE": "EUR",
    "BF": "XOF",
    "BG": "BGN",
    "BA": "BAM",
    "BB": "BBD",
    "WF": "XPF",
    "BL": "EUR",
    "BM": "BMD",
    "BN": "BND",
    "BO": "BOB",
    "BH": "BHD",
    "BI": "BIF",
    "BJ": "XOF",
    "BT": "BTN",
    "JM": "JMD",
    "BV": "NOK",
    "BW": "BWP",
    "WS": "WST",
    "BQ": "USD",
    "BR": "BRL",
    "BS": "BSD",
    "JE": "GBP",
    "BY": "BYR",
    "BZ": "BZD",
    "RU": "RUB",
    "RW": "RWF",
    "RS": "RSD",
    "TL": "USD",
    "RE": "EUR",
    "TM": "TMT",
    "TJ": "TJS",
    "RO": "RON",
    "TK": "NZD",
    "GW": "XOF",
    "GU": "USD",
    "GT": "GTQ",
    "GS": "GBP",
    "GR": "EUR",
    "GQ": "XAF",
    "GP": "EUR",
    "JP": "JPY",
    "GY": "GYD",
    "GG": "GBP",
    "GF": "EUR",
    "GE": "GEL",
    "GD": "XCD",
    "GB": "GBP",
    "GA": "XAF",
    "SV": "USD",
    "GN": "GNF",
    "GM": "GMD",
    "GL": "DKK",
    "GI": "GIP",
    "GH": "GHS",
    "OM": "OMR",
    "TN": "TND",
    "JO": "JOD",
    "HR": "HRK",
    "HT": "HTG",
    "HU": "HUF",
    "HK": "HKD",
    "HN": "HNL",
    "HM": "AUD",
    "VE": "VEF",
    "PR": "USD",
    "PS": "ILS",
    "PW": "USD",
    "PT": "EUR",
    "SJ": "NOK",
    "PY": "PYG",
    "IQ": "IQD",
    "PA": "PAB",
    "PF": "XPF",
    "PG": "PGK",
    "PE": "PEN",
    "PK": "PKR",
    "PH": "PHP",
    "PN": "NZD",
    "PL": "PLN",
    "PM": "EUR",
    "ZM": "ZMK",
    "EH": "MAD",
    "EE": "EUR",
    "EG": "EGP",
    "ZA": "ZAR",
    "EC": "USD",
    "IT": "EUR",
    "VN": "VND",
    "SB": "SBD",
    "ET": "ETB",
    "SO": "SOS",
    "ZW": "ZWL",
    "SA": "SAR",
    "ES": "EUR",
    "ER": "ERN",
    "ME": "EUR",
    "MD": "MDL",
    "MG": "MGA",
    "MF": "EUR",
    "MA": "MAD",
    "MC": "EUR",
    "UZ": "UZS",
    "MM": "MMK",
    "ML": "XOF",
    "MO": "MOP",
    "MN": "MNT",
    "MH": "USD",
    "MK": "MKD",
    "MU": "MUR",
    "MT": "EUR",
    "MW": "MWK",
    "MV": "MVR",
    "MQ": "EUR",
    "MP": "USD",
    "MS": "XCD",
    "MR": "MRO",
    "IM": "GBP",
    "UG": "UGX",
    "TZ": "TZS",
    "MY": "MYR",
    "MX": "MXN",
    "IL": "ILS",
    "FR": "EUR",
    "IO": "USD",
    "SH": "SHP",
    "FI": "EUR",
    "FJ": "FJD",
    "FK": "FKP",
    "FM": "USD",
    "FO": "DKK",
    "NI": "NIO",
    "NL": "EUR",
    "NO": "NOK",
    "NA": "NAD",
    "VU": "VUV",
    "NC": "XPF",
    "NE": "XOF",
    "NF": "AUD",
    "NG": "NGN",
    "NZ": "NZD",
    "NP": "NPR",
    "NR": "AUD",
    "NU": "NZD",
    "CK": "NZD",
    "XK": "EUR",
    "CI": "XOF",
    "CH": "CHF",
    "CO": "COP",
    "CN": "CNY",
    "CM": "XAF",
    "CL": "CLP",
    "CC": "AUD",
    "CA": "CAD",
    "CG": "XAF",
    "CF": "XAF",
    "CD": "CDF",
    "CZ": "CZK",
    "CY": "EUR",
    "CX": "AUD",
    "CR": "CRC",
    "CW": "ANG",
    "CV": "CVE",
    "CU": "CUP",
    "SZ": "SZL",
    "SY": "SYP",
    "SX": "ANG",
    "KG": "KGS",
    "KE": "KES",
    "SS": "SSP",
    "SR": "SRD",
    "KI": "AUD",
    "KH": "KHR",
    "KN": "XCD",
    "KM": "KMF",
    "ST": "STD",
    "SK": "EUR",
    "KR": "KRW",
    "SI": "EUR",
    "KP": "KPW",
    "KW": "KWD",
    "SN": "XOF",
    "SM": "EUR",
    "SL": "SLL",
    "SC": "SCR",
    "KZ": "KZT",
    "KY": "KYD",
    "SG": "SGD",
    "SE": "SEK",
    "SD": "SDG",
    "DO": "DOP",
    "DM": "XCD",
    "DJ": "DJF",
    "DK": "DKK",
    "VG": "USD",
    "DE": "EUR",
    "YE": "YER",
    "DZ": "DZD",
    "US": "USD",
    "UY": "UYU",
    "YT": "EUR",
    "UM": "USD",
    "LB": "LBP",
    "LC": "XCD",
    "LA": "LAK",
    "TV": "AUD",
    "TW": "TWD",
    "TT": "TTD",
    "TR": "TRY",
    "LK": "LKR",
    "LI": "CHF",
    "LV": "EUR",
    "TO": "TOP",
    "LT": "LTL",
    "LU": "EUR",
    "LR": "LRD",
    "LS": "LSL",
    "TH": "THB",
    "TF": "EUR",
    "TG": "XOF",
    "TD": "XAF",
    "TC": "USD",
    "LY": "LYD",
    "VA": "EUR",
    "VC": "XCD",
    "AE": "AED",
    "AD": "EUR",
    "AG": "XCD",
    "AF": "AFN",
    "AI": "XCD",
    "VI": "USD",
    "IS": "ISK",
    "IR": "IRR",
    "AM": "AMD",
    "AL": "ALL",
    "AO": "AOA",
    "AQ": "USD",
    "AS": "USD",
    "AR": "ARS",
    "AU": "AUD",
    "AT": "EUR",
    "AW": "AWG",
    "IN": "INR",
    "AX": "EUR",
    "AZ": "AZN",
    "IE": "EUR",
    "ID": "IDR",
    "UA": "UAH",
    "QA": "QAR",
    "MZ": "MZN"
}

const countryCodes = Object.keys(countries)
const countryNames = Object.values(countries)

const divisions = {
    "AS": "A Somethings",
    "BP": "B Products",
    "CS": "C Stuff",
    "DT": "D Thingies",
    "EM": "E Maze",
    "FO": "F Objects",
    "GR": "G Robots",
    "HI": "H Instruments",
}

const months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
}


// Create sales data in JSON format for n countries in all divisions and months
const createData = n => {
    const data = new Array();
    const randInts = generateRandomArr(n, countryCodes.length)
    
    randInts.forEach(i => {
        let countryCode = countryCodes[i]

        Object.keys(divisions).forEach(division => {
            Object.keys(months).forEach(month => {
                data.push({
                    country: {
                        key: countryCode,
                        text: countries[countryCode],
                    },
                    division: {
                        key: division,
                        text: divisions[division],
                    },
                    month: {
                        key: month,
                        text: months[month],
                    },
                    qty: {
                        value: (Math.floor(Math.random() * 100000)),
                    },
                    sales: {
                        value: (Math.random() * 1000000).toFixed(2),
                        unit: currencies[countryCode] ? currencies[countryCode] : "USD"
                    }
                })
                
            })
        })
    })

    console.log(data[0])

    return data;
}

// Create an array of 20 random unique numbers to use to select random countries
const generateRandomArr = (length, maxValue) => {
    let arr = [];
    while (arr.length < 20) {
        let n = Math.floor(Math.random() * countryCodes.length);
        if (arr.indexOf(n) === -1) arr.push(n);
    }

    return arr;
}

module.exports = createData;