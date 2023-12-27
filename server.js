const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
app.use(express.urlencoded({ extended: false }));


const users = []

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.name == username);
    if (user && await bcrypt.compare(password, user.password)) {
        res.redirect('/shop');
    } else {
        // Check if the username is not registered
        const isUsernameRegistered = users.some(u => u.name == username);

        if (!isUsernameRegistered) {
            res.render('home', { error: 'Username not registered' });
        } else {
            // Incorrect password
            res.render('home', { error: 'Wrong password' });
        }
    }
});

app.get('/shop', (req, res) => {
    res.render('shop')
})
app.get('/nproduct', (req, res) => {
    res.render('nproduct')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    try {
        const hashedpwd = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.username,
            email: req.body.email,
            password: hashedpwd
        });
        console.log(users);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});


app.get('*', (req, res) => {
    res.status(404).send('error 404 page not found ')
})

app.listen(5000)