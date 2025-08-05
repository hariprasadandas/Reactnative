# Cricket Heroes App - Firebase Backend Integration

## Overview
This React Native app uses Firebase as the backend for user authentication, team management, match scheduling, and player verification. The app is designed for Expo Go compatibility.

## Firebase Setup

### 1. Firebase Configuration
The app is configured to use the following Firebase project:
- **Project ID**: `cricc-e899c`
- **Project Number**: `644288507783`
- **Storage Bucket**: `cricc-e899c.appspot.com`

### 2. Collections Structure

#### Users Collection (`/users/{userId}`)
```javascript
{
  email: string,
  verified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Teams Collection (`/teams/{teamId}`)
```javascript
{
  name: string,
  players: [
    {
      id: string,
      name: string,
      verified: boolean,
      addedAt: timestamp
    }
  ],
  verified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Matches Collection (`/matches/{matchId}`)
```javascript
{
  name: string,
  ground: string,
  date: string,
  team1: string,
  team2: string,
  status: string, // 'scheduled', 'ongoing', 'completed'
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Grounds Collection (`/grounds/{groundId}`)
```javascript
{
  name: string,
  location: string,
  capacity: number,
  available: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Tournaments Collection (`/tournaments/{tournamentId}`)
```javascript
{
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  teams: string[],
  status: string, // 'upcoming', 'ongoing', 'completed'
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Security Rules

### Firestore Security Rules
The app uses comprehensive security rules that:
- Allow users to read/write their own data
- Allow admins (`admin@gmail.com`) to manage all data
- Allow verified users to read teams, matches, grounds, and tournaments
- Deny all other access by default

### Authentication
- Email/Password authentication
- Admin role for `admin@gmail.com`
- User verification system

## Admin Features

### 1. User Management (`Admin.js`)
- View all registered users
- Verify/unverify players
- Manage user permissions

### 2. Team Management (`ManageTeams.js`)
- Create new teams
- Add/remove players from teams
- Edit team information
- Delete teams

### 3. Match Management (`Matches.js`)
- Schedule new matches
- Assign teams to matches
- Set match venues and dates
- Update match status
- Delete matches

### 4. Team Overview (`AllTeams.js`)
- View all teams
- Quick access to team management
- Delete teams

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Configuration
The Firebase configuration is already set up in `firebase.js` for Expo Go compatibility.

### 3. Deploy Firestore Rules
1. Go to Firebase Console > Firestore Database > Rules
2. Copy the contents of `firestore.rules`
3. Paste and publish the rules

### 4. Enable Authentication
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable "Email/Password" provider

### 5. Run the App
```bash
npx expo start
```

## Key Features

### Real-time Data Sync
- All data is stored in Firebase Firestore
- Real-time updates across devices
- Offline support with automatic sync

### User Authentication
- Secure login/logout functionality
- Session management
- Role-based access control

### Admin Panel
- Comprehensive admin dashboard
- User verification system
- Team and match management
- Real-time data updates

### Data Validation
- Input validation on all forms
- Duplicate prevention
- Error handling and user feedback

## Error Handling

The app includes comprehensive error handling:
- Network connectivity issues
- Firebase operation failures
- User input validation
- Authentication errors

## Performance Optimizations

- Efficient data fetching with Firestore queries
- Local state management for UI responsiveness
- Optimistic updates for better UX
- Proper cleanup of listeners and subscriptions

## Security Considerations

- All sensitive operations require authentication
- Role-based access control
- Input sanitization
- Secure data transmission

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Check internet connectivity
   - Verify Firebase project configuration
   - Ensure Firestore rules are properly deployed

2. **Authentication Issues**
   - Verify email/password combination
   - Check if user exists in Firebase Auth
   - Ensure Email/Password provider is enabled

3. **Data Not Loading**
   - Check Firestore security rules
   - Verify user authentication status
   - Check console for error messages

### Debug Mode
Enable debug logging by checking the console for detailed error messages and operation logs.

## Support

For technical support or questions about the Firebase integration, please refer to the Firebase documentation or contact the development team. 