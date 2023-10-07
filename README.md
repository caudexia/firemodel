# Firemodel

A simple and efficient Object-Relational Mapping (ORM) for Firestore, designed to work seamlessly in both web and server environments. Requires Zod for data validation and Firebase SDKs for database interactions.

## Features

- 📦 Simple API for CRUD operations.
- 🔥 Real-time data subscriptions.
- 🛡️ Built-in data validation using Zod.
- 🌍 Supports both web and server (Node.js) environments.

## Installation

Install the package and its required dependencies:

```bash
npm install firemodel firebase zod
```

For server-side usage, you'll also need:

```bash
npm install firebase-admin
```

## Usage

Before using the models, initialize the package with your Firebase credentials.

### Server Initialization

Install the Firebase Admin SDK if you haven't:

```bash
npm install firebase-admin
```

Initialize Firemodel and Firebase Admin SDK:

```typescript
import { initializeServer } from 'firemodel/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = require('/path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com'
});

// Initialize Firemodel with Firebase Admin SDK
initializeServer(serviceAccount, 'https://YOUR_PROJECT_ID.firebaseio.com');
```

### Web Initialization

Install the Firebase Web SDK if you haven't:

```bash
npm install firebase
```

Initialize Firemodel and Firebase Web SDK:

```typescript
import { initializeWeb } from 'firemodel/client';
import { initializeApp } from 'firebase/app';

// Initialize Firebase Web SDK
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

initializeApp(firebaseConfig);

// Initialize Firemodel with Firebase Web SDK
initializeWeb(firebaseConfig);
```

#### Define a Model (Web Example)

Define your model and its schema:

```typescript
import { z } from 'zod';
import { createWebModel } from 'firemodel/client';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
  isAdmin: z.boolean()
});

const UserModel = createWebModel('users', userSchema);
```

#### Do Stuff (Server Example)

```typescript
import { z } from 'zod';
import { createServerModel } from 'firemodel/server';

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
