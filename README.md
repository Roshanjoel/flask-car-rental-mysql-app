# Car Rental System

A full-stack car rental web application built with Next.js 15, TypeScript, and Turso (LibSQL) database. This application allows customers to browse, rent, and return vehicles, while administrators can manage the fleet and view customer information.

## 🚀 Features

### For Customers
- **User Registration & Authentication** - Secure account creation with email/password
- **Browse Available Cars** - View all available vehicles with filtering by category and search
- **Real-time Availability** - See which cars are currently available for rent
- **Easy Booking** - Select rental dates and get instant price calculations
- **Rental Management** - View active rentals and return vehicles
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### For Administrators
- **Car Management** - Add, edit, and delete vehicles from the fleet
- **Customer Overview** - View all registered customers and their details
- **Real-time Updates** - Track car availability and rental status
- **Comprehensive Dashboard** - Manage entire fleet from one interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn/UI components
- **Database**: Turso (LibSQL) - SQLite-compatible database
- **ORM**: Drizzle ORM
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Custom implementation with bcrypt password hashing
- **State Management**: React hooks and local storage

## 📋 Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

## 🔧 Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Environment Variables**
   
   The `.env` file has already been configured with Turso database credentials.

3. **Database Setup**
   
   The database is already set up with:
   - ✅ Schema created (customers, cars, rentals tables)
   - ✅ Seeded with sample data (10 cars, 4 customers including admin)

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 Demo Accounts

### Admin Account
- **Email**: `admin@carrental.com`
- **Password**: `admin123`
- **Access**: Full admin dashboard, car management, customer viewing

### Customer Account
- **Email**: `john.smith@email.com`
- **Password**: `password123`
- **Access**: Browse cars, create rentals, manage bookings

You can also register new customer accounts through the registration page.

## 📱 Application Pages

### Public Pages
- **Home** (`/`) - Landing page with services overview
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New customer registration

### Customer Pages (Authentication Required)
- **Available Cars** (`/available-cars`) - Browse and filter available vehicles
- **Rent Car** (`/rent-car?carId=X`) - Book a specific vehicle
- **My Rentals** (`/my-rentals`) - View and manage active/past rentals

### Admin Pages (Admin Authentication Required)
- **Admin Dashboard** (`/admin`) - Manage cars and view customers
  - **Manage Cars Tab** - Add, edit, delete vehicles
  - **View Customers Tab** - See all registered customers

## 🗄️ Database Schema

### Customers Table
- `id` - Auto-incrementing primary key
- `name` - Customer full name
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `phone` - Contact number (optional)
- `isAdmin` - Admin flag (boolean)
- `createdAt` - Registration timestamp

### Cars Table
- `id` - Auto-incrementing primary key
- `model` - Car model name
- `brand` - Car manufacturer
- `year` - Manufacturing year
- `pricePerDay` - Daily rental rate (decimal)
- `imageUrl` - Car image URL
- `available` - Availability status (boolean)
- `category` - Vehicle category (Sedan, SUV, Sports, Electric)
- `createdAt` - Record creation timestamp

### Rentals Table
- `id` - Auto-incrementing primary key
- `customerId` - Foreign key to customers
- `carId` - Foreign key to cars
- `rentalDate` - Rental start date
- `returnDate` - Actual return date (null if active)
- `expectedReturnDate` - Expected return date
- `totalPrice` - Total rental cost (auto-calculated)
- `status` - Rental status (active, completed, cancelled)
- `createdAt` - Booking timestamp

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login user

### Cars
- `GET /api/cars` - List all cars (supports filtering)
- `GET /api/cars?id=[id]` - Get single car
- `POST /api/cars` - Create car (admin only)
- `PUT /api/cars?id=[id]` - Update car (admin only)
- `DELETE /api/cars?id=[id]` - Delete car (admin only)

### Rentals
- `GET /api/rentals` - List rentals (filtered by customer or admin)
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/return?id=[id]` - Return rented car

### Customers
- `GET /api/customers` - List all customers (admin only)

## 🎨 Design Features

- **Modern UI/UX** - Clean, professional interface with gradient accents
- **Responsive Design** - Mobile-first approach with breakpoints for all devices
- **Loading States** - Skeleton loaders and spinners for better UX
- **Error Handling** - User-friendly error messages and validation
- **Form Validation** - Real-time validation with Zod schemas
- **Smooth Animations** - Transitions and hover effects
- **Accessibility** - Semantic HTML and ARIA labels

## 🚦 Usage Guide

### For Customers

1. **Register an account** at `/register`
2. **Login** at `/login`
3. **Browse available cars** at `/available-cars`
   - Use search to filter by brand/model
   - Filter by category (Sedan, SUV, Sports, Electric)
4. **Rent a car**
   - Click "Rent Now" on any available car
   - Select rental and return dates
   - View automatic price calculation
   - Confirm booking
5. **Manage rentals** at `/my-rentals`
   - View active and past rentals
   - Return cars when finished

### For Administrators

1. **Login with admin credentials** at `/login`
2. **Access admin dashboard** at `/admin`
3. **Manage Cars Tab**
   - View all vehicles in a table
   - Add new cars with the "Add New Car" button
   - Edit existing cars with the pencil icon
   - Delete cars with the trash icon
4. **View Customers Tab**
   - See all registered customers
   - View customer details and registration dates

## 🔒 Security Features

- **Password Hashing** - Bcrypt with salt rounds for secure password storage
- **Form Validation** - Client and server-side validation
- **Protected Routes** - Authentication checks on sensitive pages
- **SQL Injection Protection** - Parameterized queries with Drizzle ORM
- **XSS Prevention** - React's built-in escaping

## 📦 Project Structure

```
car-rental-system/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── cars/         # Car management endpoints
│   │   │   ├── rentals/      # Rental management endpoints
│   │   │   └── customers/    # Customer endpoints
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── available-cars/   # Car browsing page
│   │   ├── rent-car/         # Rental booking page
│   │   ├── my-rentals/       # Customer rentals page
│   │   ├── admin/            # Admin dashboard
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # Shadcn/UI components
│   │   └── Navbar.tsx        # Navigation component
│   ├── db/
│   │   ├── schema.ts         # Database schema
│   │   ├── index.ts          # Database connection
│   │   └── seeds/            # Seed data scripts
│   ├── lib/
│   │   ├── auth.ts           # Authentication utilities
│   │   └── utils.ts          # Utility functions
│   └── hooks/                # Custom React hooks
├── public/                   # Static assets
├── .env                      # Environment variables
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## 🧪 Testing the Application

1. **Test Customer Flow**
   - Register a new account
   - Browse available cars
   - Rent a car (select dates)
   - View in "My Rentals"
   - Return the car
   - Verify car becomes available again

2. **Test Admin Flow**
   - Login with admin credentials
   - Add a new car to the fleet
   - Edit car details (price, availability)
   - View customer list
   - Delete a car (optional)

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `.env` file exists with correct credentials
- Check network connectivity

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

### Authentication Issues
- Clear browser local storage
- Try logging out and back in

## 🚀 Deployment

This application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Any Node.js hosting platform**

Make sure to set environment variables in your hosting platform's dashboard.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**