
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import axios from "axios"


  const program = new Command();
  program.name('CLI').description('CLI for DOS Project').version('1.0.0');
  let questionSearch = [
    {
      type: 'input',
      name: 'bookTitle',
      message: 'please enter book topic to get details about it: ',
    },
  ];

  let questionInfo=[{
    type: 'number',
    name: 'itemNumber',
    message: 'please enter items number to get info about it: ',
  },]

  let questionPurchase = [{
    type: 'number',
    name: 'itemNumber',
    message: 'please enter book item number to purchase it: ',
  },
  {
    type: 'number',
    name: 'money',
    message: 'Enter amount of money to pay:  ',
  },
]
  
  program
    .command('search-book-title')
    .alias('search')
    .description('search about specific book using book topic')
    .action(() => {
      inquirer
        .prompt(questionSearch)
        .then(async (answers) => {
          try {
            let res = {
              id: 1,
              topic: 'Distributed System',
                 quantity: 20,
                 price: 3000,
              title: 'How to get a good grade in DOS in 40 minutes a day'
               };
               let res2= {
                id: 2,
              topic: 'Distributed System',
                 quantity: 9,
                 price:   1500,
              title: 'RPCs for Noobs.'
               };
            // const result = await axios.get(`http://localhost:8083/catalog-server/search/${answers.bookTitle}`);
             console.log("Response Data",res, ",",res2
           
              );
          } catch (error) {
            console.error('Error during request:', error.message);
          }

        })
        .catch((error) => {
          if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
          } else {
            // Something else went wrong
          }
        });
    });
  
    program
    .command('info-book-item-number')
    .alias('info')
    .description('info about specific book using item number')
    .action(() => {
      inquirer
        .prompt(questionInfo)
        .then(async (answers) => {
          try {
            const result = await axios.get(`http://localhost:8083/catalog-server/info/${answers.itemNumber}`);
            console.log('Response Data:', result.data);
          } catch (error) {
            console.error('Error during request:', error.message);
          }
        })
        .catch((error) => {
          if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
          } else {
            // Something else went wrong
          }
        });
    });
    
    program
    .command('purchase-book-by-item-number')
    .alias('order')
    .description('purchase specific book using item number')
    .action(() => {
      inquirer
        .prompt(questionPurchase)
        .then(async (answers) => {
          // console.log(answers)
          // console.log(answers.purchase)
            try {
              const result = await axios.post(`http://localhost:8083/order-server/purch`,{id:answers.itemNumber,orderCost:answers.money})
              console.log('Response Data:', result.data);
            } catch (error) {
              console.error('Error during request:', error.message);
            }
        })
        .catch((error) => {
          if (error.isTtyError) {
           
          } else {
            // Something else went wrong
          }
        });
    });
  
  program.parse();