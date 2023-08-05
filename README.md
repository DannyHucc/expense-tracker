# My Expense Tracker

A simple expense tracker website built with Node.js and Express

You can go to this link to test, <https://my-expense-tracker.fly.dev/>

Test account:

>- name: user1
>- email: <user1@example.com>
>- password: 12345678

>- name: user2
>- email: <user2@example.com>
>- password: 12345678

![overall](/public/images/overall.png)
![reset_password](/public/images/reset_password.png)
![alert](/public/images/alert.png)

## Features

- Login to see user's own expense tracker
- Register via email, Facebook account, Google account, or Github account
- Remember account if user like
- Reset password if user forgot
- Display user's balance, income and expense
- Sort expense by ascending and descending order
- Sort expense by date, category, name and amount
- Filter expense by income, housing, transportation, entertainment, food and other
- Clear sort and filter function
- Create a new expense, come with a confirmation alert if not save
- Edit the details of a expense, come with a confirmation alert if not save
- Delete a expense, come with a confirmation alert

## Getting Start

1. Please make sure it is installed [Node.js](https://nodejs.org/en/download/) (skip if already install)

2. Open Terminal and Clone the project

```
git clone https://github.com/DannyHucc/expense-tracker.git
```

3. Go to the folder where this project is stored

```
cd expense-tracker
```

4. Install the required dependencies

```
npm install
```

5. Install nodemon (skip if already install)

```
npm i -g nodemon
```

6. Set environment variables in .env file according to .env.exp

```
mkdir .env
```

7. Set `PORT`(number) to start the server

```
PORT=<your port>
```

8. MONGODB_URI: Go to [MongoDB](https://account.mongodb.com/account/login) to create an account and set [MongoDB Atlas](https://account.mongodb.com/account/login) to get `MONGODB_URI` and modify the following parameters `username`、`password`、`database`

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ngwexuq.mongodb.net/<database>?retryWrites=true&w=majority
```

9. Studio 3T: Install [studio 3T](https://studio3t.com/download/) to view and modify document data, build comprehensive queries, import and export data, among many other tasks etc...

10. Redis: You need to install [Redis](https://redis.io/docs/getting-started/) depends on your operating system, and set the `Redis Host` and `Redis Password` then substitute it into `REDIS_HOST` and `REDIS_PASSWORD` respectively

```
REDIS_HOST=<Redis Host>
REDIS_PASSWORD=<Redis Password>
```

11. Another Redis Desktop Manager: Install [Another Redis Desktop Manager](https://github.com/qishibo/AnotherRedisDesktopManager/releases) to Export\Import keys support, Slow log support, Search support in Stream etc...

12. Session secret: Set your `SESSION_SECRET`

```
SESSION_SECRET=<Your Secret>
```

13. Facebook Login: You need to create an application on [Meta for Developers](https://developers.facebook.com), and substitute the `Application ID` and `Application Secret` into `FACEBOOK_ID` and `FACEBOOK_SECRET` respectively

```
FACEBOOK_ID=<Application ID>
FACEBOOK_SECRET=<Application Secret>
```

14. Facebook Login: set `Domain Name` to use callback

```
FACEBOOK_CALLBACK=http://<Domain Name>/auth/facebook/callback
```

15. Google Login: You need to create an application on [Google for Developers](https://console.developers.google.com), and substitute the `Client ID` and `Client key` into `GOOGLE_ID` and `GOOGLE_SECRET` respectively

```
GOOGLE_ID=<Client ID>
GOOGLE_SECRET=<Client key>
```

16. Google Login: set `Domain Name` to use callback

```
GOOGLE_CALLBACK=http://<Domain Name>/auth/google/callback
```

17. Github Login: You need to create an application on [Developer Settings](https://github.com/settings/applications/new), and substitute the `Client ID` and `Client secrets` into `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` respectively

```
GITHUB_CLIENT_ID=SKIP
GITHUB_CLIENT_SECRET=SKIP
```

18. Github Login: set `Domain Name` to use callback

```
GITHUB_CALLBACK=http://<Domain Name>/auth/github/callback
```


19. JSON Web Token secret: Set your `JWT_SECRET`

```
JWT_SECRET=<Your Secret>
```

20. LOCAL URL: Set your `LOCAL_URL`, exp:<http://localhost:3000>

```
LOCAL_URL=<Your Local URL>
```

20. Google smtp: You need to create an `Google Application Password` on [Google Security](https://myaccount.google.com/security), and substitute the `Gmail` and `Application Password` into `GOOGLE_SMTP_MAIL` and `GOOGLE_SMTP_PASSWORD` respectively

```
GOOGLE_SMTP_MAIL=<Your Gmail>
GOOGLE_SMTP_PASSWORD=<Your Google SMTP Application Password>
```

21. Seed your database 

```
npm run seed
```

22. Execute successfully if seeing following message

```
mongodb connected!
mongodb connected!
category created.
mongodb connected!
All users and records are created.
```

23. Start the server

```
npm run dev
```

24. Execute successfully if seeing following message

```
Express is listening on localhost:3000
Connect to redis successfully
mongodb connected!
```

25. Now you can browse the website on <http://localhost:3000>

26. Test account

>- name: user1
>- email: <user1@example.com>
>- password: 12345678

>- name: user2
>- email: <user2@example.com>
>- password: 12345678

27. Leave server

```
ctrl + c
```

## Built With

- Runtime: node @ v18.16.1
-  Framework: express @ 4.17.1
- Database: mongoose @ 5.11.15
- Database: ioredis @ 5.3.2
-  View Engine: express-handlebars @ 5.3.2
-  Check package.json for other dependencies

## Author
DannyHucc 胡晉嘉