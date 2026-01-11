#  Campus Track - Smart Lost and Found System

A modern, intelligent lost and found management system for educational institutions with automatic item matching, real-time notifications, and secure image storage.

##  Overview

Campus Track is a full-stack web application that helps students and staff report lost/found items, automatically matches them using smart algorithms, and notifies users of potential matches. Built with Java Spring Boot and React, it provides a secure and efficient platform for managing campus lost and found items.

##  Key Features

###  Authentication & Security
- **User Registration**: Role-based signup (Student/Staff/Admin)
- **Secure Login**: JWT token-based authentication
- **Password Management**: Forgot password with email reset
- **BCrypt Hashing**: Secure password storage
- **Protected Routes**: Role-based access control

###  Item Management
- **Report Lost Items**: Submit detailed lost item reports with optional images
- **Report Found Items**: Upload found items with mandatory image proof
- **Category System**: Organize items (Electronics, Books, Bags, Accessories, etc.)
- **Image Upload**: Cloudinary-powered secure image storage and optimization
- **Edit & Delete**: Manage your own submitted items

###  Smart Matching System
- **Automatic Matching**: AI-powered algorithm compares lost and found items
- **Multi-Criteria Matching**: Category, description, location, and date analysis
- **Match Notifications**: Real-time alerts for potential matches
- **Match Score**: Confidence percentage for each match
- **Manual Review**: Accept or reject suggested matches

###  User Dashboard
- **My Lost Items**: View and manage all reported lost items
- **My Found Items**: Track items you've found and submitted
- **Matches**: See potential matches with confidence scores
- **Notifications**: Real-time alerts for matches and updates
- **Profile Management**: Update personal information and password

###  Admin Dashboard
- **User Management**: View, activate/deactivate, and delete users
- **Item Oversight**: Monitor all lost and found item submissions
- **Match Management**: Create manual matches and resolve disputes
- **Statistics**: Dashboard with key metrics and trends
- **System Controls**: Configure categories and system settings

###  Notification System
- Match notifications when items are matched
- Status update notifications
- Message notifications from other users
- In-app notification badge
- Email notifications (optional)

###  Modern UI/UX
- **Dark Theme**: Eye-friendly interface with orange accents
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Polished user experience
- **Real-time Updates**: Live data refresh
- **Toast Notifications**: Clear feedback for user actions

##  Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **Vite 7.1.2** - Build tool
- **Tailwind CSS 4.1.13** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2.0** - Application framework
- **Spring Data MongoDB** - Database integration
- **Spring Security 6.x** - Authentication & authorization
- **JWT** - Token-based auth
- **BCrypt** - Password hashing
- **Maven** - Dependency management

### Database & Storage
- **MongoDB Atlas** - Cloud NoSQL database
- **Cloudinary** - Image storage and CDN

##  Getting Started

### Prerequisites
- Node.js v18+
- Java 17+
- MongoDB Atlas account
- Cloudinary account

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/Manishraj-07/CampusTrack.git
cd "Campus Track"
```

#### 2. Configure Backend

**Navigate to Backend:**
```bash
cd Backend
```

**Create `.env` file in Backend directory:**
```env
# MongoDB Configuration (Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-track?retryWrites=true&w=majority

# Cloudinary Configuration (Get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Configuration (Generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_min_256_bits

# Email Configuration (Optional - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=5000
```

**Build and Run Backend:**
```bash
# Windows
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw clean install
./mvnw spring-boot:run
```

Backend runs on `http://localhost:5000`

#### 3. Configure Frontend

**Navigate to Frontend:**
```bash
cd ../Frontend
```

**Install Dependencies:**
```bash
npm install
```

**Create `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Run Frontend:**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Setup MongoDB Atlas

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user with read/write permissions
4. Whitelist your IP (or allow access from anywhere for development)
5. Get connection string and update `application.properties`

### Setup Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from dashboard
3. Update credentials in `application.properties`

##  Project Structure

```
Campus Track/
 Backend/                          # Java Spring Boot Backend
    src/main/java/com/campustrack/
       controller/              # REST API endpoints
       service/                 # Business logic
       model/                   # MongoDB entities
       repository/              # Data access layer
       security/                # JWT & authentication
       config/                  # Configuration classes
    src/main/resources/
       application.properties   # Backend configuration
    pom.xml                      # Maven dependencies

 Frontend/                         # React Frontend
     src/
        components/              # React components
           common/              # Shared components
           landing-page/        # Landing page sections
           signin/              # Login components
           signup/              # Registration components
           user-dashboard/      # User dashboard
           admin-dashboard/     # Admin dashboard
        pages/                   # Page components
        api/                     # API service layer
        assets/                  # Images and icons
     package.json                 # npm dependencies
     vite.config.js               # Vite configuration
```

##  API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |

### Lost Items
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/lost-items` | Get all lost items | No |
| GET | `/api/lost-items/{id}` | Get specific lost item | No |
| POST | `/api/lost-items` | Report lost item | Yes |
| PUT | `/api/lost-items/{id}` | Update lost item | Yes |
| DELETE | `/api/lost-items/{id}` | Delete lost item | Yes |

### Found Items
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/found-items` | Get all found items | No |
| GET | `/api/found-items/{id}` | Get specific found item | No |
| POST | `/api/found-items` | Report found item | Yes |
| PUT | `/api/found-items/{id}` | Update found item | Yes |
| DELETE | `/api/found-items/{id}` | Delete found item | Yes |

### Matches
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/matches` | Get all matches | Yes |
| POST | `/api/matches` | Create manual match | Admin |
| PUT | `/api/matches/{id}/status` | Update match status | Yes |
| DELETE | `/api/matches/{id}` | Delete match | Admin |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/stats` | Get system statistics | Admin |
| PUT | `/api/admin/users/{id}/status` | Update user status | Admin |
| DELETE | `/api/admin/users/{id}` | Delete user | Admin |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get user notifications | Yes |
| PUT | `/api/notifications/{id}/read` | Mark as read | Yes |
| DELETE | `/api/notifications/{id}` | Delete notification | Yes |

### Contact
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Send contact message | No |

##  How It Works

### Reporting Lost Items
1. User logs in to their account
2. Navigates to "Report Lost Item"
3. Fills in item details (name, category, description, location, date)
4. Optionally uploads an image
5. Submits the form
6. Item is stored in database and appears in user's dashboard
7. System automatically checks for matches with found items

### Reporting Found Items
1. User finds an item on campus
2. Takes a photo of the item (mandatory)
3. Logs in and goes to "Report Found Item"
4. Uploads the image and fills in details
5. Submits the form
6. Item is stored with image URL from Cloudinary
7. System checks for matches with lost items

### Automatic Matching
1. When a new item is reported, the system analyzes it
2. Compares category, description keywords, location, and dates
3. Generates match scores based on similarity
4. Creates match records for high-confidence matches
5. Sends notifications to both parties
6. Users can review matches and contact each other

### Admin Management
1. Admin logs in to admin dashboard
2. Views system statistics and recent activities
3. Manages users (activate/deactivate accounts)
4. Monitors all lost and found items
5. Reviews and moderates matches
6. Handles disputes and creates manual matches

##  Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt with salt for password storage
- **CORS Protection**: Configured CORS policies
- **Input Validation**: Server-side validation for all inputs
- **Secure File Upload**: Validated and sanitized image uploads
- **Role-Based Access**: Protected routes based on user roles
- **MongoDB Injection Prevention**: Parameterized queries

##  User Roles

| Role | Permissions |
|------|------------|
| **Student** | Report lost/found items, view matches, manage own items |
| **Staff** | Same as student with additional privileges |
| **Admin** | Full system access, user management, statistics, manual matching |

##  Use Cases

- **Lost Wallet**: Student reports lost wallet with description  Another student finds it and reports with photo  System matches and notifies both  Owner claims wallet
- **Found Keys**: Staff member finds keys and uploads photo  System matches with lost item report  Email notification sent  Keys returned
- **Admin Oversight**: Admin monitors unclaimed items, creates manual matches, and manages user accounts

##  Responsive Design

The application is fully responsive and optimized for:
-  Desktop (1920x1080 and above)
-  Laptop (1366x768 and above)
-  Tablet (768x1024)
-  Mobile (375x667 and above)

##  Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Verify MongoDB Atlas cluster is running
- Check network access whitelist
- Ensure connection string is correct with URL-encoded password

**Cloudinary Upload Failed**
- Verify cloud name, API key, and secret are correct
- Check Cloudinary account is active
- Ensure file size is within limits

**Port 5000 Already in Use**
- Change `server.port` in `application.properties`
- Update frontend `.env` with new port

### Frontend Issues

**Cannot Connect to Backend**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `.env` file
- Ensure CORS is properly configured

**npm install fails**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

##  Contributing

This is an academic project. Contributions, issues, and feature requests are welcome for educational purposes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is created for academic purposes.

##  Author

**Manish Raj**
- GitHub: [@Manishraj-07](https://github.com/Manishraj-07)
- Email: manishraj5411@gmail.com

##  Acknowledgments

- Built as part of an academic project for college
- Inspired by the need for efficient campus lost and found systems
- Uses modern web technologies and industry best practices
- Thanks to all open-source libraries and frameworks used

---

** If you find this project helpful, please give it a star!**

**Built with  using Java Spring Boot & React**
