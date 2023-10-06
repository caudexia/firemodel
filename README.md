# Firemodel

A simple and efficient Object-Relational Mapping (ORM) for Firestore, designed to work seamlessly in both web and server environments.

## Features

- 📦 Simple API for CRUD operations.
- 🔥 Real-time data subscriptions.
- 🛡️ Built-in data validation using Zod.
- 🌍 Supports both web and server (Node.js) environments.

## Installation

```bash
npm install firemodel
```

## Usage

Before using the models, initialize the package with your Firebase credentials.

### Server Initialization

```bash
npm install firebase-admin
```

```typescript
import { initializeApp, credential } from 'firebase-admin';
import { initialize, createServerModel } from 'firemodel';

// Initialize Firebase Admin SDK
const serviceAccount = require('/path/to/serviceAccountKey.json');
initializeApp({
  credential: credential.cert(serviceAccount),
  databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com'
});

// Initialize firemodel with Firebase Admin SDK
initialize(admin);
```

### Web Initialization

```bash
npm install firebase
```

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initialize, createWebModel } from 'firemodel';

// Initialize Firebase Web SDK
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize firemodel with Firebase Web SDK
initialize(db);
```

#### Define a Model

Define your model and its schema:

```typescript
import { z } from 'zod';
import { createWebModel } from 'firemodel';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
  isAdmin: z.boolean()
});

const UserModel = createWebModel('users', userSchema);
```

#### Do Stuff

```typescript
// Define a User model
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
  isAdmin: z.boolean()
});

const UserModel = createServerModel('users', userSchema);

// Use the UserModel for CRUD operations
async function performOperations() {
  // Create
  const userId = await UserModel.add({ name: 'Alice', email: 'alice@example.com', isAdmin: false });

  // Read
  const user = await UserModel.get(userId);
  console.log(user);

  // Update
  await UserModel.update(userId, { name: 'Alicia' });

  // Delete
  await UserModel.delete(userId);
}

performOperations();
```

### CRUD Operations

```typescript
// Create
const userId = await UserModel.add({ id: '123', name: 'Alice', email: 'alice@example.com', isAdmin: false });

// Read
const user = await UserModel.get('123');

// Update
await UserModel.update('123', { name: 'Alicia' });

// Delete
await UserModel.delete('123');
```

### Real-time Subscriptions (Web)

```typescript
const unsubscribe = UserModel.subscribeToRealtimeUpdates((users) => {
    console.log(users);
});

// To stop listening to updates
unsubscribe();
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
