# 🌤️ SkyMap AI

An **AI-powered Weather Intelligence Platform** built with React that combines real-time weather data from OpenWeather API with an intelligent decision-making engine to provide smart, actionable weather insights. Features a modern sidebar navigation, multiple views, AI chat assistant, and exceptional mobile responsiveness.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)
![Responsive](https://img.shields.io/badge/Mobile-Optimized-success)

---

## ✨ Features

### 🔍 Enhanced Search
- **Instant city search** with a dedicated search button
- Search from sidebar or main navigation
- Recent searches history
- Popular cities quick access
- Smart search input with clear functionality

### 🌡️ Real-Time Weather
- Search **any city worldwide** instantly
- Current temperature, humidity, wind speed, pressure, visibility
- Sunrise & sunset times with timezone support
- 7-day forecast with daily highs/lows and rain probability
- Beautiful weather icons and animations

### 🤖 AI-Powered Insights
| Insight | What it tells you |
|---|---|
| **Comfort Score** | Overall outdoor comfort rated 0–100 |
| **Go Outside?** | Whether conditions are safe and pleasant |
| **Umbrella?** | Rain probability analysis and gear advice |
| **Travel Ready?** | Checks wind, visibility, precipitation for travel safety |
| **Outfit Planner** | Recommends clothing based on temp, rain, wind, UV |
| **UV Protection** | Sun exposure advice when data is available |

### 🗺️ Multiple Views
- **Weather View** – Comprehensive weather dashboard with AI insights
- **Cities View** – Manage and compare multiple cities
- **Map View** – Interactive weather map visualization
- **Trends View** – Weather trends analysis and statistics
- **Settings View** – Customize your experience

### 💬 AI Assistant Chat
- Interactive chat interface for weather queries
- Context-aware responses based on current conditions
- Smart recommendations and insights
- Conversational weather analysis

### 🎨 Modern UI/UX
- Sleek sidebar navigation with quick access
- Dark theme optimized for readability
- Smooth animations and transitions
- Gradient accents and glass-morphism effects
- Intuitive card-based layouts

### 📁 Full Project Architecture

```
skymap-ai/
│
├── 📄 README.md                      # Project documentation
├── 📄 AI_ASSISTANT_GUIDE.md          # AI assistant integration guide
├── 📄 NEXT_STEPS.md                  # Development roadmap and next steps
├── 📄 package.json                   # Dependencies and scripts
├── 📄 .env                           # Environment variables (API keys)
├── 📄 .gitignore                     # Git ignore rules
│
├── 📁 public/                        # Static assets
│   ├── index.html                    # HTML template
│   ├── manifest.json                 # PWA manifest
│   ├── favicon.ico                   # App icon
│   └── robots.txt                    # SEO crawler instructions
│
├── 📁 build/                         # Production build output
│   ├── index.html                    # Built HTML
│   ├── asset-manifest.json           # Asset mapping
│   └── static/                       # Compiled CSS/JS
│       ├── css/
│       │   └── main.56e354a1.css    # Compiled styles
│       └── js/
│           ├── main.046ac835.js      # Compiled JavaScript bundle
│           └── main.046ac835.js.LICENSE.txt
│
├── 📁 src/                           # Source code
│   │
│   ├── 📄 index.js                   # Application entry point
│   ├── 📄 App.jsx                    # Root component with sidebar layout
│   │
│   ├── 📁 components/                # React UI Components
│   │   ├── Sidebar.jsx               # Navigation sidebar with search
│   │   ├── SearchBar.jsx             # Enhanced search with button
│   │   ├── CurrentWeather.jsx        # Current conditions display
│   │   ├── ForecastCard.jsx          # 7-day forecast cards
│   │   ├── AiInsights.jsx            # AI recommendations panel
│   │   ├── AiAssistantChat.jsx       # Interactive chat interface
│   │   ├── OutfitRecommendation.jsx  # Clothing suggestions
│   │   ├── WeatherTrends.jsx         # Trends visualization
│   │   ├── CitiesView.jsx            # Multi-city management
│   │   ├── MapView.jsx               # Weather map interface
│   │   ├── TrendsView.jsx            # Detailed trends analysis
│   │   └── SettingsView.jsx          # User preferences panel
│   │
│   ├── 📁 services/                  # Business Logic & API Layer
│   │   ├── weatherApi.js             # OpenWeather API integration
│   │   ├── aiEngine.js               # Rule-based AI decision engine
│   │   ├── aiAssistant.js            # Chat assistant service
│   │   ├── mlAdapter.js              # ML model adapter layer
│   │   └── trendAnalyzer.js          # Weather trends analysis
│   │
│   ├── 📁 hooks/                     # Custom React Hooks
│   │   └── useWeather.js             # Weather data fetching + AI logic
│   │
│   ├── 📁 utils/                     # Helper Functions
│   │   └── helpers.js                # Date/time/wind utilities
│   │
│   └── 📁 styles/                    # Styling
│       └── App.css                   # Full responsive stylesheet (2800+ lines)
│                                      # Includes: variables, layouts, components,
│                                      # responsive breakpoints, animations
│
└── 📁 ml-model/                      # Machine Learning Backend (Optional)
    ├── 📄 README.md                  # ML model documentation
    ├── 📄 INTEGRATION_GUIDE.md       # Integration instructions
    ├── 📄 requirements.txt           # Python dependencies
    ├── 📄 setup.py                   # Package setup
    │
    ├── 📄 api_server.py              # FastAPI server for ML predictions
    ├── 📄 train_model.py             # Model training script
    ├── 📄 test_model.py              # Model testing utilities
    ├── 📄 generate_training_data.py  # Training data generator
    ├── 📄 weather_training_data.csv  # Sample training dataset
    │
    └── 📁 models/                    # Trained model storage
        └── (saved models .pkl/.h5)
```

### 🏗️ Architecture Layers

#### **1. Presentation Layer** (`src/components/`)
- **12 React components** for UI rendering
- Modular, reusable component design
- Props-based data flow
- Responsive layouts with CSS

#### **2. Business Logic Layer** (`src/services/`)
- **5 service modules** for core functionality
- API communication with OpenWeather
- AI decision-making engine
- ML model integration adapter
- Weather trends analysis

#### **3. Data Layer** (`src/hooks/`)
- **Custom hooks** for state management
- API data fetching and caching
- AI insights generation
- Component-service integration

#### **4. Utility Layer** (`src/utils/`)
- Helper functions for common tasks
- Date/time formatting
- Wind speed conversions
- Temperature calculations

#### **5. Styling Layer** (`src/styles/`)
- **2800+ lines** of modular CSS
- CSS variables for theming
- 4 responsive breakpoints
- Component-specific styles
- Animations and transitions

#### **6. ML Backend Layer** (`ml-model/`) *(Optional)*
- Python-based ML model training
- FastAPI server for predictions
- Model persistence and loading
- Training data generation

### 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  (App.jsx → Sidebar + Views + Components)                      │
└──────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Custom Hook Layer                            │
│  useWeather.js - Manages state, triggers API calls             │
└──────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Service Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ weatherApi.js│  │  aiEngine.js │  │trendAnalyzer │         │
│  │   (Fetch)    │→ │  (Process)   │→ │   (Analyze)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         ↓                 ↓                   ↓                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │aiAssistant.js│  │ mlAdapter.js │  │  helpers.js  │         │
│  │   (Chat)     │  │     (ML)     │  │  (Utils)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└──────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External APIs                                │
│  • OpenWeather API (Real-time data)                            │
│  • ML Model Server (Optional predictions)                      │
└─────────────────────────────────────────────────────────────────┘
```

### 🔗 Component Interaction Flow

```
App.jsx (Main Controller)
│
├─→ Sidebar.jsx
│   ├─→ Search Input + Button
│   ├─→ Navigation Items (5 views)
│   ├─→ Recent Searches List
│   └─→ Popular Cities Grid
│
├─→ Weather View (Default)
│   ├─→ CurrentWeather.jsx
│   │   └─→ Weather details, icons, metrics
│   ├─→ ForecastCard.jsx
│   │   └─→ 7-day forecast items
│   ├─→ AiInsights.jsx
│   │   └─→ AI suggestion cards
│   ├─→ WeatherTrends.jsx
│   │   └─→ Trends visualization
│   ├─→ OutfitRecommendation.jsx
│   │   └─→ Clothing suggestions
│   └─→ AiAssistantChat.jsx
│       └─→ Chat interface with AI
│
├─→ CitiesView.jsx
│   └─→ City cards grid with weather previews
│
├─→ MapView.jsx
│   └─→ Interactive map with weather layers
│
├─→ TrendsView.jsx
│   ├─→ Statistics cards
│   ├─→ Temperature charts
│   └─→ Forecast table
│
└─→ SettingsView.jsx
    └─→ User preferences and configuration
```

### 🎯 Key Design Patterns

#### **1. Container/Presentation Pattern**
- `App.jsx` manages state and logic
- Child components receive data via props
- Pure functional components for UI

#### **2. Service Layer Pattern**
- All API calls isolated in service modules
- Business logic separated from UI
- Easy to test and mock

#### **3. Custom Hooks Pattern**
- `useWeather` encapsulates data fetching
- Reusable across components
- Clean separation of concerns

#### **4. Component Composition**
- Small, focused components
- Reusable UI elements
- Clear prop interfaces

#### **5. Responsive Design Pattern**
- Mobile-first approach
- Progressive enhancement
- 4 breakpoint strategy (480px, 640px, 900px, 1100px)

### 📊 Project Statistics

| Category | Count | Details |
|----------|-------|---------|
| **React Components** | 12 | Sidebar, CurrentWeather, ForecastCard, AiInsights, AiAssistantChat, OutfitRecommendation, WeatherTrends, CitiesView, MapView, TrendsView, SettingsView, SearchBar |
| **Service Modules** | 5 | weatherApi, aiEngine, aiAssistant, mlAdapter, trendAnalyzer |
| **Custom Hooks** | 1 | useWeather (with AI integration) |
| **Utility Modules** | 1 | helpers (date, time, conversions) |
| **Views** | 5 | Weather, Cities, Map, Trends, Settings |
| **CSS Lines** | 2,873 | Fully responsive with 4 breakpoints |
| **Responsive Breakpoints** | 4 | 1100px, 900px, 640px, 480px |
| **API Integrations** | 1+ | OpenWeather (+ optional ML backend) |
| **ML Model Files** | 5 | Training, testing, API server scripts |

### 📦 Dependencies Overview

#### **Production Dependencies**
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-icons": "^4.x"
}
```

#### **Development Dependencies**
- `react-scripts` - Build tooling
- `@testing-library/react` - Component testing
- Modern JavaScript (ES6+) features

#### **Optional ML Dependencies** (Python)
```
fastapi
uvicorn
pandas
numpy
scikit-learn
tensorflow (optional)
```

### 📝 File Naming Conventions & Standards

#### **React Components** (`*.jsx`)
- **PascalCase** for component files
- One component per file
- Examples: `CurrentWeather.jsx`, `AiAssistantChat.jsx`
- Functional components with hooks

#### **Services & Utilities** (`*.js`)
- **camelCase** for service files
- Pure JavaScript modules
- Examples: `weatherApi.js`, `aiEngine.js`, `helpers.js`
- Export named functions

#### **Styles** (`*.css`)
- **kebab-case** for class names
- BEM-inspired naming: `.component-element-modifier`
- Examples: `.sidebar-search-btn`, `.chat-message-user`
- CSS variables for theming

#### **General Conventions**
```
✅ DO:
- Use descriptive, meaningful names
- Keep files focused on single responsibility
- Comment complex logic
- Use consistent formatting

❌ DON'T:
- Mix naming conventions
- Create monolithic files
- Use abbreviations excessively
- Skip documentation
```

### 🔧 Code Organization Best Practices

1. **Component Structure**
   ```jsx
   // Imports
   import React, { useState } from "react";
   
   // Component definition
   export default function ComponentName({ props }) {
     // State
     const [state, setState] = useState();
     
     // Event handlers
     const handleEvent = () => { };
     
     // Render
     return ( );
   }
   ```

2. **Service Module Structure**
   ```javascript
   // Constants
   const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
   
   // Helper functions
   const helperFunction = () => { };
   
   // Main exported functions
   export const mainFunction = async () => { };
   ```

3. **CSS Organization**
   ```css
   /* Variables */
   :root { }
   
   /* Layout styles */
   .layout-class { }
   
   /* Component styles */
   .component-class { }
   
   /* Responsive styles */
   @media (max-width: 640px) { }
   ```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 16
- **npm** or **yarn**
- A free **OpenWeather API key** → [Get one here](https://openweathermap.org/api)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/skymap-ai.git
cd skymap-ai

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then edit .env and paste your API key

# 4. Start the development server
npm start
```

The app will open at **http://localhost:3000**.

---

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern UI library with hooks
- **React Icons** - Beautiful weather and UI icons
- **CSS3** - Custom responsive styling with CSS variables
- **JavaScript (ES6+)** - Modern JavaScript features

### APIs & Services
- **OpenWeather API** - Real-time weather data
- **Geolocation API** - Location detection (planned)

### Development Tools
- **Create React App** - Project scaffolding
- **npm** - Package management
- **Git** - Version control

### Architecture Patterns
- **Custom Hooks** - Reusable logic with `useWeather`
- **Service Layer** - Separated API and AI logic
- **Component-Based** - Modular React components
- **Responsive Design** - Mobile-first approach

---

## 🔑 API Key Setup

1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Generate a free API key (the **Current Weather** and **5-day Forecast** APIs are free)
3. Create a `.env` file in the project root:
   ```
   REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
   ```

> **Note:** The app automatically falls back to the free 5-day/3-hour forecast if the One Call 3.0 endpoint is not available on your plan.

---

## 🧠 How the AI Engine Works

The AI engine in `src/services/aiEngine.js` is a **rule-based decision system** designed to be easily upgraded to a machine-learning model.

### Scoring Pipeline
1. **Temperature** → scored against an ideal 18–26 °C band
2. **Humidity** → scored against a 35–65 % comfort range
3. **Wind Speed** → scored against a calm 0–5 m/s zone
4. **Visibility** → linearly scored up to 10 km
5. **Rain Probability** → derived from forecast or estimated from description

These scores are combined into a **weighted Comfort Score** (0–100) which drives all downstream suggestions.

### Extending with ML
Replace the `analyseWeather()` function with a call to:
- A **TensorFlow.js** model loaded in the browser
- A **FastAPI** backend running a scikit-learn / PyTorch model
- An **LLM API** (GPT, Claude) for natural-language advice

The component interface stays the same — only the service layer changes.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run in development mode at http://localhost:3000 |
| `npm run build` | Create optimized production build in `/build` folder |
| `npm test` | Run test suite with Jest and React Testing Library |
| `npm run eject` | Eject from Create React App (one-way operation) |

### 📦 Build Process

When you run `npm run build`, the following happens:

1. **Code Compilation**
   - JavaScript/JSX transpiled via Babel
   - CSS processed and minified
   - Assets optimized and hashed

2. **Bundle Generation**
   - `build/static/js/main.[hash].js` - Application code
   - `build/static/css/main.[hash].css` - Styles
   - `build/static/media/` - Images and fonts

3. **Optimizations Applied**
   - Code splitting
   - Tree shaking (removes unused code)
   - Minification
   - Source maps generation
   - Asset compression

4. **Output Structure**
   ```
   build/
   ├── index.html
   ├── asset-manifest.json
   ├── manifest.json
   ├── robots.txt
   └── static/
       ├── css/main.[hash].css
       ├── js/main.[hash].js
       └── media/[assets]
   ```

### 🚀 Deployment Options

#### **1. Static Hosting (Netlify, Vercel, GitHub Pages)**
```bash
npm run build
# Deploy the /build folder
```
- ✅ Free tier available
- ✅ CDN included
- ✅ Automatic SSL

#### **2. Docker Container**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]
```

#### **3. Traditional Server (Apache/Nginx)**
- Build the app: `npm run build`
- Copy `/build` contents to server root
- Configure server for SPA routing

#### **4. Environment Variables**
Required for production:
```env
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

---

## 📱 Responsive Design

The UI is **fully responsive** with multiple breakpoints for optimal viewing on any device:

### Desktop (>1100px)
- **Sidebar navigation** with full labels and icons
- Side-by-side layout with weather panel + AI chat
- Multi-column grid layouts for forecast and insights
- Spacious cards with detailed information

### Tablet (640px-1100px)
- **Collapsible sidebar** with icon-only view (640-900px)
- Single column layout for chat panel
- Adaptive grid reflow for content
- Optimized touch targets

### Mobile (480px-640px)
- **Horizontal sidebar** with bottom border
- Full-width navigation with scrollable items
- Single-column stacked layout
- Enhanced search with dedicated button
- Compact forecast cards (100px)
- Popular cities in flexible grid
- Responsive chat panel (400px height)
- Touch-optimized controls

### Extra Small (<480px)
- **Ultra-compact design** for portrait phones
- Reduced font sizes and spacing
- Smaller icons (18-24px)
- Compact cards with 16px padding
- Forecast cards (85px width)
- Reduced chat height (350px)
- Optimized for one-handed use
- Minimal but functional interface

### Key Mobile Features
✅ **Touch-friendly** buttons (minimum 44px tap targets)  
✅ **Smooth scrolling** for horizontal content  
✅ **No horizontal overflow** on any screen size  
✅ **Readable fonts** at all sizes  
✅ **Fast loading** with optimized assets  
✅ **Native feel** with smooth animations  

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Enhanced search with dedicated button
- [x] Sidebar navigation with multiple views
- [x] AI Assistant Chat integration
- [x] Cities view for multi-city comparison
- [x] Map view interface
- [x] Trends analysis view
- [x] Settings panel
- [x] Full mobile responsiveness (4 breakpoints)
- [x] Weather trends visualization
- [x] Recent searches history
- [x] Popular cities quick access

### 🚧 In Progress
- [ ] ML model integration (TensorFlow.js or FastAPI backend)
- [ ] Interactive weather map with layers

### 📋 Planned Features
- [ ] Hourly forecast chart (Chart.js / Recharts)
- [ ] Geolocation – detect user's city automatically
- [ ] Dark / Light theme toggle
- [ ] PWA support (offline caching & notifications)
- [ ] Multi-language support (i18n)
- [ ] Weather alerts and warnings
- [ ] Historical weather data comparison
- [ ] Export weather reports (PDF/CSV)
- [ ] Social sharing features
- [ ] Weather widgets customization

---

## 🎯 Recent Updates (v2.0)

### Enhanced Search Experience
- ✨ **New search button** with hover effects and animations
- 🎨 Accent color styling with glow effects
- ♿ Disabled state for better UX
- 📱 Responsive button sizing across all devices

### Mobile-First Optimization
- 📱 **4 breakpoints** for perfect scaling (1100px, 900px, 640px, 480px)
- 🎯 Touch-optimized with 44px+ tap targets
- 📐 Improved spacing and padding for small screens
- 🔤 Responsive typography hierarchy
- 🎨 Compact layouts without sacrificing functionality

### UI/UX Improvements
- 🎭 Smooth transitions and micro-interactions
- 💫 Glass-morphism effects and modern gradients
- 🎪 Enhanced card designs with hover states
- 🌈 Consistent color palette throughout
- ⚡ Performance optimizations for smooth scrolling

---

## 📄 License

This project is licensed under the **MIT License** – use it freely.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests
- 📖 Improve documentation

---

## 📸 Screenshots

### Desktop View
Beautiful sidebar navigation with comprehensive weather dashboard and AI chat panel.

### Mobile View
Fully responsive design with horizontal navigation and touch-optimized controls.

---

> Built with ❤️ using **React**, **OpenWeather API**, **AI Engine**, and **Modern UI/UX Design**.
>
> 🌟 Star this repo if you find it useful!
