import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const imageUrl = req.file ? req.file.filename : null;

            const user = { name, email, password, imageUrl };
            await this.userRepository.signUp(user);
            res.status(201).redirect('/');
        } catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    }

    async signIn(req, res, next) {
        try {
            const user = await this.userRepository.findByEmail(req.body.email);
            if (!user) {
                return res.status(400).send('Incorrect Credentials');
            } else {
                const token = jwt.sign(
                    { userID: user._id, email: user.email },
                    '123456',
                    { expiresIn: '1h' }
                );
                res.status(200).json({ user });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send("Something went wrong");
        }
    }
}
