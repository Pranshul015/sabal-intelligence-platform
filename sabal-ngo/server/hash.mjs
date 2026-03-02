import bcrypt from './node_modules/bcryptjs/dist/bcrypt.js';
const hash = await bcrypt.hash('ngo@sabal2024', 12);
console.log(hash);
