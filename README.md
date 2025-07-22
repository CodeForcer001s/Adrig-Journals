Sure! Here's **everything wrapped in Markdown file code block**, ready for direct copy-paste into your `README.md`:

<details>
<summary>Click to expand Markdown code</summary>

````markdown
# 📔 Adrig-Journals ✨

## 🌟 Overview
**Adrig-Journals** is a beautiful, modern journaling application that allows users to create, manage, and reflect on their personal journal entries. With a sleek dark-themed UI and seamless Google authentication, this application provides a secure and elegant space for your thoughts.

---

## ✨ Features

- 🔐 **Secure Authentication**: Sign in easily with Google OAuth  
- 📝 **Rich Journal Entries**: Create entries with titles, content, dates, and tags  
- 🖼️ **Media Support**: Add images to your journal entries  
- 📊 **Dashboard**: View statistics and recent entries at a glance  
- 👤 **User Profiles**: Customize your profile information  
- 🌙 **Dark Mode**: Beautiful dark-themed UI for comfortable writing  
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices  

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)  
- npm or yarn  
- Supabase account for database and authentication  

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/adrig-journals.git
   cd adrig-journals
````

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

---

## 🏗️ Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── journal/        # Journal pages
│   │   ├── profile/        # User profile pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home/dashboard page
│   ├── components/         # React components
│   │   ├── Forms/          # Form components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── journal/        # Journal components
│   │   ├── profile/        # Profile components
│   │   └── sidebar.tsx     # Sidebar component
│   ├── middleware.ts       # Next.js middleware
│   └── utils/              # Utility functions
│       ├── auth/           # Authentication utilities
│       ├── context/        # React context providers
│       ├── supabase/       # Supabase client utilities
│       └── uploadImage.tsx # Image upload utility
├── .env.local              # Environment variables (create this)
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## 💾 Database Schema

### Tables

#### `profiles`

* `id`: UUID (primary key, linked to `auth.users`)
* `username`: String
* `email`: String
* `created_at`: Timestamp
* Additional profile fields: `phone`, `dob`, `location`, `bio`

#### `journal_entries`

* `id`: UUID (primary key)
* `user_id`: UUID (foreign key to `profiles.id`)
* `title`: String
* `content`: Text
* `date`: Date
* `tags`: Array of strings
* `media_base64`: Text (for storing image data)

---

## 🔧 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

---

## 🔒 Authentication Flow

Adrig-Journals uses **Supabase Authentication** with **Google OAuth** for a secure and seamless login experience:

1. User clicks "Continue with Google" button
2. Supabase handles OAuth redirect and callback
3. On successful authentication, user is redirected to the dashboard
4. User profile is automatically created if it doesn't exist

---

## 📝 Journal Entry Creation

1. Navigate to the **Journal** page
2. Click "**+ New Journal Entry**"
3. Fill in the title, content, date, and optional tags
4. Optionally add an image
5. Click "**Save Entry**"

---

## 🛠️ Technologies Used

* **Frontend**: React, Next.js, TailwindCSS
* **Backend**: Next.js API Routes
* **Database**: Supabase (PostgreSQL)
* **Authentication**: Supabase Auth with Google OAuth
* **Styling**: TailwindCSS, CSS Modules
* **Deployment**: Vercel (recommended)

---

## 🌐 Deployment

This application is optimized for deployment on **Vercel**:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch

   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes

   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch

   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

* [Next.js](https://nextjs.org/) – The React Framework
* [Supabase](https://supabase.com/) – Open source Firebase alternative
* [TailwindCSS](https://tailwindcss.com/) – A utility-first CSS framework
* [Lucide React](https://lucide.dev/) – Beautiful & consistent icons

```

</details>

Let me know if you want this saved as a downloadable `.md` file too.
```
