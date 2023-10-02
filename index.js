const contacts = require('./contacts');
const { Command } = require('commander');
const program = new Command();

program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  try {
    switch (action) {
      case 'list':
        const allContacts = await contacts.listContacts();
        console.table(allContacts);
        break;

      case 'get':
        const contactById = await contacts.getContactById(id);
        console.log(contactById);
        break;

      case 'add':
        if (!name || !email || !phone) {
          console.log('Please provide name, email, and phone for the contact.');
          return;
        }

        const addedContact = await contacts.addContact(name, email, phone);
        console.log(addedContact);
        break;

      case 'remove':
        const deletedContact = await contacts.getContactById(id);
        await contacts.removeContact(id);
        console.log('Contact removed:', deletedContact);
        break;

      default:
        console.warn('\x1B[31mUnknown action type!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}


invokeAction(argv);
