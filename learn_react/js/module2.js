var _ = require('lodash');
var $ = require('jquery');

var people = [{
  "id": 1,
  "gender": "Male",
  "first_name": "Eric",
  "last_name": "Matthews",
  "email": "ematthews0@tripod.com",
  "ip_address": "191.61.192.41"
}, {
  "id": 2,
  "gender": "Female",
  "first_name": "Karen",
  "last_name": "Knight",
  "email": "kknight1@mysql.com",
  "ip_address": "93.235.162.153"
}, {
  "id": 3,
  "gender": "Female",
  "first_name": "Karen",
  "last_name": "Ortiz",
  "email": "kortiz2@apache.org",
  "ip_address": "181.42.240.5"
}, {
  "id": 4,
  "gender": "Male",
  "first_name": "Dennis",
  "last_name": "Richardson",
  "email": "drichardson3@zdnet.com",
  "ip_address": "24.39.138.242"
}, {
  "id": 5,
  "gender": "Female",
  "first_name": "Mary",
  "last_name": "West",
  "email": "mwest4@godaddy.com",
  "ip_address": "161.4.31.23"
}, {
  "id": 6,
  "gender": "Female",
  "first_name": "Barbara",
  "last_name": "Hunter",
  "email": "bhunter5@sun.com",
  "ip_address": "25.159.101.189"
}, {
  "id": 7,
  "gender": "Female",
  "first_name": "Theresa",
  "last_name": "Thompson",
  "email": "tthompson6@constantcontact.com",
  "ip_address": "246.43.161.87"
}, {
  "id": 8,
  "gender": "Male",
  "first_name": "Alan",
  "last_name": "Ferguson",
  "email": "aferguson7@qq.com",
  "ip_address": "121.246.102.174"
}, {
  "id": 9,
  "gender": "Female",
  "first_name": "Martha",
  "last_name": "Ramos",
  "email": "mramos8@yandex.ru",
  "ip_address": "242.100.140.123"
}, {
  "id": 10,
  "gender": "Female",
  "first_name": "Beverly",
  "last_name": "Allen",
  "email": "ballen9@naver.com",
  "ip_address": "11.241.155.245"
}, {
  "id": 11,
  "gender": "Male",
  "first_name": "Benjamin",
  "last_name": "Torres",
  "email": "btorresa@ca.gov",
  "ip_address": "43.113.226.245"
}, {
  "id": 12,
  "gender": "Female",
  "first_name": "Evelyn",
  "last_name": "George",
  "email": "egeorgeb@timesonline.co.uk",
  "ip_address": "121.154.101.167"
}, {
  "id": 13,
  "gender": "Female",
  "first_name": "Nicole",
  "last_name": "Dean",
  "email": "ndeanc@wired.com",
  "ip_address": "57.231.118.4"
}, {
  "id": 14,
  "gender": "Male",
  "first_name": "Howard",
  "last_name": "Austin",
  "email": "haustind@army.mil",
  "ip_address": "154.197.7.100"
}, {
  "id": 15,
  "gender": "Male",
  "first_name": "Aaron",
  "last_name": "Freeman",
  "email": "afreemane@instagram.com",
  "ip_address": "251.247.252.107"
}, {
  "id": 16,
  "gender": "Male",
  "first_name": "Peter",
  "last_name": "Wallace",
  "email": "pwallacef@answers.com",
  "ip_address": "48.63.8.113"
}, {
  "id": 17,
  "gender": "Male",
  "first_name": "George",
  "last_name": "Howell",
  "email": "ghowellg@columbia.edu",
  "ip_address": "79.84.137.213"
}, {
  "id": 18,
  "gender": "Female",
  "first_name": "Sarah",
  "last_name": "Bryant",
  "email": "sbryanth@parallels.com",
  "ip_address": "14.249.3.41"
}, {
  "id": 19,
  "gender": "Male",
  "first_name": "Harry",
  "last_name": "Turner",
  "email": "hturneri@amazonaws.com",
  "ip_address": "129.29.211.169"
}, {
  "id": 20,
  "gender": "Male",
  "first_name": "Steve",
  "last_name": "Medina",
  "email": "smedinaj@hibu.com",
  "ip_address": "177.120.212.65"
}];

var Male = _.filter(people, {'gender': 'Male'});

console.log(Male)