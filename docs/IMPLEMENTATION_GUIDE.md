# AND Offer - Complete Implementation Guide

## 🎯 Overview

AND Offer is the product portal for **A.N.D. GROUP OF COMPANIES LLC**, connecting buyers with verified Chinese suppliers for transport materials, mobile devices, and high-volume equipment.

## ✅ What's Been Implemented

### 1. **Authentication System** ✨

- **NextAuth.js v5** with credentials-based authentication
- User roles: `SUPER_ADMIN`, `ADMIN`, `STAFF`, `BUYER`
- Protected admin dashboard routes with middleware
- Sign-in and sign-up pages with email integration
- Welcome emails via EKDSend API

**Test Credentials:**

- Email: `admin@andgroupco.com`
- Password: `admin123456`
- Role: `SUPER_ADMIN`

### 2. **Enhanced Product Management** 🛍️

- **Featured products** toggle for homepage highlighting
- **WhatsApp integration** fields:
  - Direct WhatsApp contact number
  - WhatsApp group link for product discussions
- Complete CRUD operations (Create, Read, Update, Delete)
- Product fields:
  - Name, SKU, Slug
  - Price with currency (USD, EUR, CNY)
  - Status (DRAFT, ACTIVE, ARCHIVED)
  - Summary & Description
  - Category & Supplier associations
  - Source country tracking

### 3. **Role-Based Access Control** 🔐

- **SUPER_ADMIN**: Full system access, can manage everything
- **ADMIN**: Dashboard access, can manage products/categories/suppliers
- **STAFF**: Dashboard access with limited permissions
- **BUYER**: Regular users, can browse and submit inquiries

### 4. **Email System** 📧

- Integration with **EKDSend API** for transactional emails
- Welcome emails on user registration
- Email configuration already in `.env`
- Ready for inquiry notifications and order confirmations

### 5. **Modern UI/UX** 🎨

- Clean marketing pages with proper navigation
- Admin dashboard for SUPER_ADMIN/ADMIN/STAFF
- Responsive design with Tailwind CSS
- Product image gallery in hero section
- Footer with company information

## 📁 Project Structure

```
andoffer/
├── src/
│   ├── app/
│   │   ├── (marketing)/       # Public-facing pages
│   │   │   ├── page.tsx        # Homepage with hero
│   │   │   └── contact/        # Contact page
│   │   ├── (dashboard)/        # Admin dashboard (protected)
│   │   │   ├── products/       # Product management
│   │   │   ├── categories/     # Category management
│   │   │   ├── suppliers/      # Supplier management
│   │   │   ├── inquiries/      # Inquiry management
│   │   │   └── settings/       # Site settings
│   │   ├── auth/               # Authentication pages (UI)
│   │   │   ├── signin/         # Sign-in page
│   │   │   └── signup/         # Sign-up page
│   │   └── api/                # API routes (backend)
│   │       ├── auth/           # Auth API endpoints
│   │       ├── products/       # Product CRUD API
│   │       ├── categories/     # Category CRUD API
│   │       ├── suppliers/      # Supplier CRUD API
│   │       └── inquiries/      # Inquiry CRUD API
│   ├── components/
│   │   ├── marketing/          # Public components
│   │   └── dashboard/          # Admin components
│   ├── lib/
│   │   ├── auth/               # NextAuth configuration
│   │   ├── api/                # API clients (EKDSend)
│   │   ├── validation/         # Zod schemas
│   │   └── db.ts               # Prisma client
│   └── middleware.ts           # Route protection
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding
└── .env                        # Environment variables
```

## 🔧 Key Configuration Files

### Authentication Structure (✅ Correct)

- `/app/auth/signin` → User-facing sign-in page (UI)
- `/app/auth/signup` → User-facing sign-up page (UI)
- `/app/api/auth/[...nextauth]` → NextAuth API route (backend)
- `/app/api/auth/signup` → Registration API (backend)

This is the **standard Next.js pattern**:

- `/app/*` = Page routes (what users see)
- `/app/api/*` = API routes (backend logic)

### Database Schema Highlights

```prisma
enum Role {
  SUPER_ADMIN  // Full system access
  ADMIN        // Dashboard access
  STAFF        // Limited dashboard access
  BUYER        // Regular users
}

model Product {
  // ... basic fields
  featured         Boolean  @default(false)
  whatsappContact  String?  // Direct WhatsApp number
  whatsappGroup    String?  // WhatsApp group link
  // ... relations
}
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

All keys are already in `.env`:

- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Auth secret (generated)
- `ANDOFFER_MAIL_API_KEY` - EKDSend API key
- `ANDOFFER_DEFAULT_FROM` - Default email sender

### 3. Setup Database

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:gen

# Seed with SUPER_ADMIN and sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 5. Sign In as Admin

- Email: `admin@andgroupco.com`
- Password: `admin123456`
- You'll see the "Dashboard" link in the header

## 📝 How to Use

### For SUPER_ADMIN/ADMIN

1. **Sign in** at `/auth/signin`
2. Click **Dashboard** in the header
3. **Manage Products:**
   - Click "New Product"
   - Fill in product details
   - Toggle "Featured" to show on homepage
   - Add WhatsApp contact or group link
   - Select category and supplier
   - Set status (DRAFT/ACTIVE/ARCHIVED)

### WhatsApp Integration Flow

When creating a product, you can add:

- **Direct WhatsApp Number**: e.g., `+1234567890`
- **WhatsApp Group Link**: e.g., `https://chat.whatsapp.com/...`

**Buyer Flow:**

1. User browses products
2. Clicks "Contact via WhatsApp" button
3. Opens WhatsApp with pre-filled message
4. Can also join product-specific group

## 🎨 Customization

### Update Company Information

Edit [src/lib/brand/theme.ts](src/lib/brand/theme.ts):

```typescript
export const APP_INFO = {
  name: "AND Offer",
  fullName: "A.N.D. GROUP OF COMPANIES LLC",
  contact: {
    email: "support@offer.andgroupco.com",
    phone: "+1 (000) 000-0000",
    address: "Your address here", // Update this!
  },
};
```

### Update Footer

Edit [src/components/marketing/site-footer.tsx](src/components/marketing/site-footer.tsx) to add the real company address.

### Add More Categories/Suppliers

Use the admin dashboard at `/categories` and `/suppliers`.

## 📊 Database Commands

```bash
# View database in browser
npm run db:studio

# Push schema changes
npm run db:push

# Regenerate Prisma client after schema changes
npm run db:gen

# Re-seed database
npm run db:seed
```

## 🔐 Creating More Admin Users

Sign up at `/auth/signup`, then update the role manually:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = 'newadmin@example.com';
```

Or use Prisma Studio: `npm run db:studio`

## 📧 Email Templates

Located in:

- Welcome email: [src/app/api/auth/signup/route.ts](src/app/api/auth/signup/route.ts)
- Add inquiry notifications, order confirmations, etc.

All emails use EKDSend API - the key is already configured in `.env`.

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT sessions with secure secrets
- ✅ Route protection middleware
- ✅ Role-based access control
- ✅ CSRF protection (NextAuth built-in)
- ✅ SQL injection protection (Prisma)

## 🚧 Next Steps (TODO)

1. [ ] Add company address to footer
2. [ ] Create inquiry notification emails
3. [ ] Add product image upload (Assets API integration exists)
4. [ ] Build public product catalog page
5. [ ] Add search and filtering
6. [ ] Create WhatsApp contact buttons on product pages
7. [ ] Add analytics dashboard
8. [ ] Set up Vercel deployment

## 📱 WhatsApp Integration Details

The system supports two types of WhatsApp contacts per product:

1. **Direct Contact**: Opens a direct chat with the business

   ```
   https://wa.me/1234567890?text=I'm interested in [Product Name]
   ```

2. **Group Link**: Allows buyers to join a product discussion group
   ```
   https://chat.whatsapp.com/YOUR_GROUP_INVITE_CODE
   ```

These links should be added when creating/editing products in the dashboard.

## 🎯 Key Features Summary

| Feature              | Status | Description                      |
| -------------------- | ------ | -------------------------------- |
| Authentication       | ✅     | Full auth system with roles      |
| Product CRUD         | ✅     | Complete product management      |
| Featured Products    | ✅     | Toggle to feature on homepage    |
| WhatsApp Integration | ✅     | Direct contact & group links     |
| Email System         | ✅     | EKDSend API integration          |
| Role-Based Access    | ✅     | SUPER_ADMIN, ADMIN, STAFF, BUYER |
| Protected Routes     | ✅     | Middleware guards admin pages    |
| Responsive UI        | ✅     | Mobile-friendly design           |
| Database Seeding     | ✅     | One command setup                |

## 💡 Tips

- **Always regenerate Prisma client** after schema changes: `npm run db:gen`
- **Use Prisma Studio** for quick database edits: `npm run db:studio`
- **Test email integration** by signing up a new user
- **Check middleware** if routes aren't protecting correctly
- **Featured products** automatically appear on the homepage

## 📞 Support

For issues or questions about AND Offer:

- Email: support@offer.andgroupco.com
- WhatsApp: [Add group link here]

---

**Built with:** Next.js 16, NextAuth.js 5, Prisma 7, PostgreSQL, Tailwind CSS 4, TypeScript 5
