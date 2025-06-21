
# SmartBin - Intelligent Waste Management System

A modern, responsive web application for monitoring and managing smart waste bins equipped with IoT sensors and machine learning capabilities.

## 🚀 Features

- **Real-time Dashboard**: Live monitoring of bin fill levels, camera snapshots, and ML predictions
- **AI Classification**: Display waste categorization results (Recyclable, Organic, Non-Recyclable)
- **Image History**: Gallery view of captured images with filtering and search capabilities  
- **Analytics Dashboard**: Comprehensive charts and insights using Recharts
- **Admin Panel**: System management, logs, and configuration tools
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)

## 📱 Pages Overview

### Home Page (/)
- Project overview and key features
- Call-to-action buttons to dashboard and analytics
- Modern hero section with gradient backgrounds

### Live Dashboard (/dashboard)
- Real-time bin fill level with color-coded status
- Latest camera capture with timestamp
- ML prediction results with confidence scores
- Auto-refresh functionality (5-second intervals)
- System status indicators

### History (/history)
- Paginated gallery of classified images
- Filter by waste category and date range
- Responsive table/card layout
- CSV export functionality

### Analytics (/analytics)
- Daily/weekly waste classification charts
- Pie chart for waste distribution
- Bin usage timeline graphs
- Key performance metrics
- AI-generated insights

### Admin Panel (/admin)
- System logs and monitoring
- Bin level reset functionality
- ML model retraining triggers
- Admin notes and comments
- System configuration display

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartbin-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Demo Credentials

For the admin panel demo:
- **Email**: admin@smartbin.com
- **Password**: smartbin123

## 📊 Sample Data Structure

The application uses mock data that simulates real IoT sensor inputs:

```json
{
  "bin_id": "SB01",
  "fill_level_percent": 67,
  "last_updated": "2025-06-21T15:30:00Z",
  "latest_image": "https://example.com/image.jpg",
  "prediction": {
    "label": "Recyclable",
    "confidence": 0.91
  }
}
```

## 🌟 Key Design Features

- **Modern UI**: Clean, card-based layout with subtle animations
- **Color-coded Status**: Green (empty), Orange (half full), Red (full)
- **Responsive Design**: Mobile-first approach with breakpoint optimizations
- **Accessibility**: ARIA labels, keyboard navigation, and color contrast compliance
- **Performance**: Optimized images, lazy loading, and efficient re-renders

## 🔮 Future Enhancements

- Firebase/Firestore integration for real data
- Real-time WebSocket connections
- Push notifications for bin status alerts
- Multi-bin management dashboard
- Advanced ML model configuration
- Historical data export and reporting

## 📝 Environment Variables

Create a `.env` file for production deployment:

```env
VITE_API_BASE_URL=https://your-api-endpoint.com
VITE_FIREBASE_CONFIG=your-firebase-config
VITE_MQTT_BROKER_URL=your-mqtt-broker
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Hardware Integration

This frontend is designed to work with:
- **Sensors**: HC-SR04 Ultrasonic sensor for fill level detection
- **Camera**: Raspberry Pi Camera Module for image capture
- **MCU**: Raspberry Pi 4 or similar for processing
- **Connectivity**: WiFi/Ethernet for data transmission
- **Protocols**: MQTT, HTTP REST APIs, WebSocket for real-time updates

Built with ❤️ for sustainable waste management and smart city initiatives.
