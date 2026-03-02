import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('ngo@sabal2024', 12);
console.log(hash);
