# Fox2Net

A simple and free proxy app for accessing blocked content worldwide. Fox2Net provides free Telegram proxy servers and V2Ray configurations to help you bypass internet restrictions and browse securely. No registration required - just download, copy, and connect to enjoy unrestricted internet access.

## Features

- Cross-platform support (iOS, Android and Web)
- Network proxy configuration
- Application update checker
- Modern and intuitive user interface
- Expo Router navigation
- TypeScript support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (optional - only needed for Android emulator/virtual device)
- Xcode (optional - only needed for iOS simulator, macOS only)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/code3-dev/Fox2Net.git
cd Fox2Net
```

2. Install dependencies:
```bash
npm install
```

3. Download Expo Go app on your iOS or Android device from the App Store or Google Play Store.

## Development

### Running the App

#### For Expo Go Preview:
```bash
npx expo start
```
Scan the QR code with Expo Go app to preview on your device.

#### For Android Studio Preview (Virtual Device):
```bash
npm run android
```
Make sure you have Android Studio installed and an Android Virtual Device (AVD) configured.

#### For iOS Simulator:
```bash
npm run ios
```
Requires Xcode and iOS Simulator (macOS only).

#### For Web Preview:
```bash
npm run web
```
Run the app in your web browser for development and testing.

## API Configuration

Replace the following API endpoints in your app configuration:

- **Proxy Data**: `https://raw.githubusercontent.com/code3-dev/v-data/refs/heads/main/proxy.txt`
- **V2Ray Configuration**: `https://raw.githubusercontent.com/code3-dev/v-data/refs/heads/main/v2ray.json`
- **Update Information**: `https://raw.githubusercontent.com/code3-dev/v-data/refs/heads/main/update.json`

## Building for Production

### Prerequisites for Building

Before building the app, you need to:

1. **Install EAS CLI globally**:
```bash
npm install -g @expo/eas-cli
```

2. **Initialize EAS for your project**:
```bash
eas init --id <projectid>
```
Replace `<projectid>` with your actual Expo project ID.

3. **Edit app.json** - Configure your app settings for production builds.

### Build Commands

#### Android APK Build (Preview):
```bash
eas build -p android --profile preview
```

#### Android Build for Google Play:
```bash
eas build -p android --profile production
```

#### iOS Build:
```bash
eas build --platform ios
```

#### Web PWA Build:
```bash
npx expo export -p web
```

## Web Deployment

### Web Server Configuration

For proper SPA (Single Page Application) routing, configure your web server to redirect all routes to `index.html`. This project can work on subfolders like `example.com/app`.

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

# For subfolder deployment (e.g., example.com/app)
# location /app {
#     try_files $uri $uri/ /app/index.html;
# }
```

#### Node.js/Express
```javascript
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
```

#### Vercel (vercel.json)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Netlify (_redirects file)
```
/*    /index.html   200
```

### Deployment Notes

- Upload the `dist` folder contents to your web server
- Can be deployed on domain root or subfolders
- Ensure your web server is configured for SPA routing
- For subfolder deployments, update the base path in your web server configuration

## Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - Navigation
- **React Navigation** - Navigation library
- **EAS Build** - Build service

## Requirements

- **Node.js**: v18 or higher
- **Eas CLI**: Latest version

## Permissions

### Android
- `INTERNET` - Network access
- `ACCESS_NETWORK_STATE` - Network state monitoring

## Developer

**Hossein Pira**
- Telegram: [@h3dev](https://t.me/h3dev)
- Email: h3dev.pira@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the developer via Telegram or email.