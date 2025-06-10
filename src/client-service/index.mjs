import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import axios from "axios";

const counterFilePath1 = './counter1.txt';
const counterFilePath2 = './counter2.txt';
const counterFilePath3 = './counter3.txt';

function readCounter(filePath) {
  try {
    return parseInt(fs.readFileSync(filePath, 'utf8')) || 1;
  } catch (error) {
    return 1;
  }
}
function writeCounter(filePath, value) {
  fs.writeFileSync(filePath, value.toString(), 'utf8');
}

let counter1 = readCounter(counterFilePath1);
let counter2 = readCounter(counterFilePath2);
let counter3 = readCounter(counterFilePath3);

const BASE_URL = 'http://127.0.0.1:8083'; // ✅ this matches your NGINX port

const program = new Command();
program.name('CLI').description('CLI for DOS Project').version('1.0.0');

const questionSearch = [{
  type: 'input',
  name: 'bookTitle',
  message: 'Please enter book topic to get details about it:',
}];

const questionInfo = [{
  type: 'number',
  name: 'itemNumber',
  message: 'Please enter item number to get info about it:',
}];

const questionPurchase = [{
  type: 'number',
  name: 'itemNumber',
  message: 'Please enter book item number to purchase:',
}, {
  type: 'number',
  name: 'money',
  message: 'Enter amount of money to pay:',
}];

program
  .command('search')
  .alias('s')
  .description('Search book by topic')
  .action(() => {
    inquirer.prompt(questionSearch).then(async (answers) => {
      try {
        const isReplica = counter1 % 2 === 0;
        const url = isReplica
          ? `${BASE_URL}/catalog-server-replica/search/${answers.bookTitle}`
          : `${BASE_URL}/catalog-server/search/${answers.bookTitle}`;

        const result = await axios.get(url);
        console.log('Response Data:', result.data);
        console.log(`From ${isReplica ? 'Replica' : 'Original'}`);

        counter1++;
        writeCounter(counterFilePath1, counter1);
      } catch (error) {
        console.error('Error during request:', error.message);
      }
    });
  });

program
  .command('info')
  .alias('i')
  .description('Get book info by item number')
  .action(() => {
    inquirer.prompt(questionInfo).then(async (answers) => {
      try {
        const isReplica = counter2 % 2 === 0;
        const url = isReplica
          ? `${BASE_URL}/catalog-server-replica/info/${answers.itemNumber}`
          : `${BASE_URL}/catalog-server/info/${answers.itemNumber}`;

        const result = await axios.get(url);
        console.log('Response Data:', result.data);
        console.log(`From ${isReplica ? 'Replica' : 'Original'}`);

        counter2++;
        writeCounter(counterFilePath2, counter2);
      } catch (error) {
        console.error('Error during request:', error.message);
      }
    });
  });

program
  .command('purchase')
  .alias('p')
  .description('Purchase a book by item number')
  .action(() => {
    inquirer.prompt(questionPurchase).then(async (answers) => {
      try {
        const isReplica = counter3 % 2 === 0;
        const url = isReplica
          ? `${BASE_URL}/order-server-replica/purch`
          : `${BASE_URL}/order-server/purch`;

        const result = await axios.post(url, {
          id: answers.itemNumber,
          orderCost: answers.money,
        });

        console.log('Response Data:', result.data);
        console.log(`From ${isReplica ? 'Replica' : 'Original'}`);

        counter3++;
        writeCounter(counterFilePath3, counter3);
      } catch (error) {
        console.error('Error during request:', error.message);
      }
    });
  });

program.parse();
