const bcrypt = require('./node_modules/bcryptjs');
bcrypt.hash('sabal2024', 10, function (err, hash) {
    if (err) { console.error(err); process.exit(1); }
    console.log(hash);
});
