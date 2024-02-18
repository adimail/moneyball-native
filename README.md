# Moneyball

Cross paltform app to manage financial history via cloud using firebase as a backend. The primary motivation for developing this app instead of relying on Excel was was simple, I needed an abstraction layer in the way I tracked my history. The aim was to streamline the logging process without having to concern with Excel column references, categorization, or monthly segmentation. This way I could just focus on important things leaving the complexities on the backend

### Screenshots (web & android)

<img src="assets/ss/1.png" alt="Android View" style="max-width: 90%; margin: 15px 50px;">
<img src="assets/ss/2.png" alt="Web View" style="max-width: 90%; margin: 15px 50px;">
<img src="assets/ss/3.png" alt="Application" style="max-width: 90%; margin: 15px 50px;">

## Features

**Application**
- Dark/Light mode
- Cloud storage
- User Authentication

**Services**
- Quick Add frequent expenses
- Track expenses and incomes easily
- Automic monthly categorization
- Create/delete categories
- Create/delete quick add templates

## Quick Add

Shortcuts for expenses that you do on regular basis

For instance, if you frequently use an auto-rickshaw/Metro, with varying fares such as 25₹, 10₹, or 50₹, this feature enables you to swiftly add these expenses with just a single click. This simplifies the tracking of both small and large expenses, providing you with an easy overview of your spending habits.

**"Using spreadsheet will take you only so far" -Moneyball**

## Database modelling

The first step in optimizing performance is to understand expected and actual query patterns.

Few principles I try to abide while structuring my noSQL databases:

- Big collection and small documents for efficient queries
- Embed related objects in documents when possible.
  - This will avoid the performance overhead of repeated requests for data stored in separate collections, which can be much slower than embedded fields.
- Atomic operations for data consistensy and integrity
- Having aggegration document for tracking complex and read-intensive operations
- minimise document reads by using memo

```json
{
  "users": {
    "id": "string",
    "fullname": "string",
    "avtar": "string",
    "quickadd": "quickadd"
  },
  "tokens": {
    "id": "string",
    "token": "string"
  },
  "transations": {
    "Expenses": "array",
    "Income": "array"
  },
  "summary": {
    "Expenses": "array",
    "Income": "array"
  }
}
```

```json
{
  "quickadd": {
    "title": "string",
    "amounts": {
      "amount1": "integer",
      "amount2": "integer",
      "amount3": "integer"
    },
    "category": "string"
  }
}
```

```json
{
  "log": {
    "title": "string",
    "category": "string",
    "type": "string",
    "amount": "integer",
    "date": "Date"
  }
}
```


## EAS build

EAS Build is a hosted service for building app binaries for your Expo and React Native projects.

eas.json

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "preview4": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Build bundles

```shell
eas build -p [android/web/ios] --profile preview
```

Use expo on android or ios to preview the application without the need for installing an imulator on the working machine

## Firebase config

Setup the firebase config at *src/config.js*

Things to include in config.js:

```javascript
const defaultAvatar =
  'https://www.hollywoodreporter.com/wp-content/uploads/2011/12/pittdesk_a.jpg'
// Default profile picture of the user. In my case it is the brad pit from the movie moneyball

const firebaseKey = {
  // apiKey
  // authDomain
  // projectId
  // storageBucket
  // messagingSenderId
  // appId
  // measurementId
}

const expoProjectId // from expo.dev 

export { defaultAvatar, firebaseKey, expoProjectId }
```

## Dependencies

- expo: ~50.0.6
- firebase: 9.6.10
- react: 18.2.0
- react-dom: 18.2.0
- react-native: 0.73.4