/**
 * seed.js — Populates the database with dummy owners, students,
 * properties, and bookings so the full app works end-to-end.
 *
 * Run:  node seed.js
 *
 * Default password for every user:  password123
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Property = require("./models/Property");
const Booking = require("./models/Booking");

// ───────────────── IMAGE POOLS ─────────────────
const roomImages = [
  [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&h=400&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&h=400&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&h=400&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&h=400&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&h=400&fit=crop",
  ],
];

// ───────────────── OWNER DATA ─────────────────
const owners = [
  { name: "Rajesh Kumar",    email: "rajesh@staybuddy.com",  phone: "9876543210" },
  { name: "Priya Sharma",    email: "priya@staybuddy.com",   phone: "9876543211" },
  { name: "Amit Patel",      email: "amit@staybuddy.com",    phone: "9876543212" },
];

// ───────────────── STUDENT DATA ─────────────────
const students = [
  { name: "Ananya Singh",    email: "ananya@student.com",  phone: "9123456780" },
  { name: "Rohan Mehta",     email: "rohan@student.com",   phone: "9123456781" },
  { name: "Sneha Das",       email: "sneha@student.com",   phone: "9123456782" },
  { name: "Karan Gupta",     email: "karan@student.com",   phone: "9123456783" },
];

// ───────────────── PROPERTY DATA ─────────────────
const propertyTemplates = [
  {
    title: "Cozy Studio Near VIT Campus",
    location: "Vellore, Tamil Nadu",
    price: 5500,
    capacity: "Single",
    description:
      "Bright, fully furnished studio just a 5-minute walk from the VIT main gate. Includes AC, attached bathroom, and a study desk. Perfect for focused students.",
    amenities: ["WiFi", "AC", "Furnished", "Attached Bathroom"],
    views: 142,
    contactClicks: 18,
  },
  {
    title: "2-Sharing Apartment in Banali",
    location: "Banali, Vellore",
    price: 4000,
    capacity: "2 Sharing",
    description:
      "Affordable 2-sharing apartment in the heart of Banali. Comes with a common kitchen, geyer, and 24/7 water supply. Ideal for budget-conscious students.",
    amenities: ["WiFi", "Geyser", "Kitchen", "Water Supply"],
    views: 89,
    contactClicks: 11,
  },
  {
    title: "Premium 1BHK – Katpadi",
    location: "Katpadi, Vellore",
    price: 8500,
    capacity: "Single",
    description:
      "Spacious 1BHK with a private balcony, modular kitchen, and power backup. Located in a gated community near Katpadi railway station.",
    amenities: ["AC", "Balcony", "Power Backup", "Security"],
    views: 210,
    contactClicks: 34,
  },
  {
    title: "3-Sharing PG – Girls Only",
    location: "Thiruvalam Road, Vellore",
    price: 3500,
    capacity: "3 Sharing",
    description:
      "Safe and secure PG exclusively for female students. Includes meals, laundry, and CCTV-monitored entry. Walking distance to campus.",
    amenities: ["Meals", "Laundry", "CCTV", "WiFi"],
    views: 175,
    contactClicks: 22,
  },
  {
    title: "Luxury Flat with City View",
    location: "CMC Area, Vellore",
    price: 12000,
    capacity: "Single",
    description:
      "Top-floor luxury flat with panoramic city views, marble flooring, smart home features, and a rooftop garden. Best for post-grad students or working professionals.",
    amenities: ["AC", "Smart Lock", "Gym", "Rooftop Garden", "Parking"],
    views: 305,
    contactClicks: 47,
  },
  {
    title: "Budget Room Near Toll Gate",
    location: "Toll Gate, Vellore",
    price: 3000,
    capacity: "2 Sharing",
    description:
      "No-frills budget accommodation with clean rooms and reliable WiFi. Best for students who spend most of their time on campus.",
    amenities: ["WiFi", "Fan", "Water Supply"],
    views: 64,
    contactClicks: 7,
  },
  {
    title: "Modern Hostel – Co-Living Space",
    location: "Sathuvachari, Vellore",
    price: 6000,
    capacity: "2 Sharing",
    description:
      "Co-living concept hostel with gaming zone, co-working desks, community kitchen, and weekly events. Meet like-minded students!",
    amenities: ["WiFi", "Gaming Zone", "Co-Working", "Events", "Laundry"],
    views: 198,
    contactClicks: 29,
  },
  {
    title: "Independent House – Ground Floor",
    location: "Gandhi Nagar, Vellore",
    price: 9500,
    capacity: "Single",
    description:
      "Entire ground floor of an independent house with two rooms, a hall, and a private kitchen. Ideal for small groups or couples.",
    amenities: ["Kitchen", "Parking", "Furnished", "Power Backup"],
    views: 123,
    contactClicks: 15,
  },
  {
    title: "AC PG with Daily Meals",
    location: "Bagayam, Vellore",
    price: 7000,
    capacity: "3 Sharing",
    description:
      "Comfortable AC PG with home-style breakfast and dinner. Laundry and housekeeping included. Only 10 minutes from campus by bus.",
    amenities: ["AC", "Meals", "Laundry", "Housekeeping", "WiFi"],
    views: 156,
    contactClicks: 21,
  },
  {
    title: "Studio with Terrace – Near SRM",
    location: "Kattankulathur, Chennai",
    price: 6500,
    capacity: "Single",
    description:
      "Charming studio with a private terrace and garden view. Fully furnished with a mini-fridge, microwave, and study nook. 3 min from SRM gate.",
    amenities: ["WiFi", "Terrace", "Furnished", "Mini Fridge", "Microwave"],
    views: 87,
    contactClicks: 12,
  },
];

// ───────────────── SEED FUNCTION ─────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB");

    // ---- Clear existing data ----
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    console.log("🗑️   Cleared existing data");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // ---- Create Owners ----
    const createdOwners = await User.insertMany(
      owners.map((o) => ({
        ...o,
        password: hashedPassword,
        role: "owner",
      }))
    );
    console.log(`👤  Created ${createdOwners.length} owners`);

    // ---- Create Students ----
    const createdStudents = await User.insertMany(
      students.map((s) => ({
        ...s,
        password: hashedPassword,
        role: "student",
      }))
    );
    console.log(`🎓  Created ${createdStudents.length} students`);

    // ---- Create Properties ----
    const propertyDocs = propertyTemplates.map((pt, idx) => ({
      ...pt,
      images: roomImages[idx] || roomImages[0],
      owner: createdOwners[idx % createdOwners.length]._id,
      available: true,
    }));

    const createdProperties = await Property.insertMany(propertyDocs);
    console.log(`🏠  Created ${createdProperties.length} properties`);

    // ---- Add some properties to student wishlists & recently viewed ----
    for (const student of createdStudents) {
      const shuffled = [...createdProperties].sort(() => Math.random() - 0.5);
      student.wishlist = shuffled.slice(0, 3).map((p) => p._id);
      student.recentlyViewed = shuffled.slice(0, 5).map((p) => p._id);
      await student.save();
    }
    console.log("❤️   Updated student wishlists & recently viewed");

    // ---- Create Bookings ----
    const bookings = [
      {
        property: createdProperties[0]._id,
        tenant: createdStudents[0]._id,
        owner: createdProperties[0].owner,
        checkIn: new Date("2026-05-01"),
        checkOut: new Date("2026-07-31"),
        amount: createdProperties[0].price,
        status: "confirmed",
        message: "I will be joining VIT this semester. Please confirm!",
      },
      {
        property: createdProperties[1]._id,
        tenant: createdStudents[1]._id,
        owner: createdProperties[1].owner,
        checkIn: new Date("2026-06-01"),
        checkOut: new Date("2026-11-30"),
        amount: createdProperties[1].price,
        status: "pending",
        message: "Looking for 2-sharing. Is the room still available?",
      },
      {
        property: createdProperties[4]._id,
        tenant: createdStudents[2]._id,
        owner: createdProperties[4].owner,
        checkIn: new Date("2026-05-15"),
        checkOut: new Date("2026-08-15"),
        amount: createdProperties[4].price,
        status: "confirmed",
        message: "Excited to move into the luxury flat!",
      },
      {
        property: createdProperties[3]._id,
        tenant: createdStudents[3]._id,
        owner: createdProperties[3].owner,
        checkIn: new Date("2026-07-01"),
        checkOut: new Date("2026-12-31"),
        amount: createdProperties[3].price,
        status: "pending",
        message: "Is there a spot available in the girls PG?",
      },
      {
        property: createdProperties[6]._id,
        tenant: createdStudents[0]._id,
        owner: createdProperties[6].owner,
        checkIn: new Date("2026-04-01"),
        checkOut: new Date("2026-04-20"),
        amount: createdProperties[6].price,
        status: "completed",
        message: "Stayed here for a short course. Great experience!",
      },
      {
        property: createdProperties[2]._id,
        tenant: createdStudents[1]._id,
        owner: createdProperties[2].owner,
        checkIn: new Date("2026-08-01"),
        checkOut: new Date("2026-12-31"),
        amount: createdProperties[2].price,
        status: "cancelled",
        message: "Sorry, plans changed. Need to cancel.",
      },
    ];

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`📅  Created ${createdBookings.length} bookings`);

    // ---- Summary ----
    console.log("\n══════════════════════════════════════");
    console.log("  🌱  SEED COMPLETE  🌱");
    console.log("══════════════════════════════════════");
    console.log("\n  LOGIN CREDENTIALS (password: password123)");
    console.log("  ─────────────────────────────────────");
    console.log("  OWNERS:");
    createdOwners.forEach((o) =>
      console.log(`    • ${o.name}  →  ${o.email}`)
    );
    console.log("  STUDENTS:");
    createdStudents.forEach((s) =>
      console.log(`    • ${s.name}  →  ${s.email}`)
    );
    console.log("\n  PROPERTIES: ", createdProperties.length);
    console.log("  BOOKINGS:   ", createdBookings.length);
    console.log("══════════════════════════════════════\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  }
}

seed();
