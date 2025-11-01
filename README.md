# 📊 IPO Dashboard Bot Manager

This is a **Next.js 16** web application designed to be the management interface for an automated system that analyzes and applies for Initial Public Offerings (IPOs). It connects directly to a MongoDB Atlas database populated by a separate analysis bot, allowing manual overrides of recommendations and setting critical application parameters for automated trading.

## ✨ Features

* **Dual Tab View:** Separate interface into **Live IPOs** (currently open for subscription) and **History** (subscription closed), dynamically filtered by the IPO end date.
* **Real-time Modification:** Users can easily change the **Recommendation** status (e.g., Apply, Avoid, Applied) and toggle the **Listing Gain** application preference directly within the table.
* **Disabled History Controls:** The modification controls are automatically disabled in the History tab to prevent changing closed IPO records.
* **Efficient Search:** A global search bar queries across `IPOAnalysisTitle`, `LiveIPOName`, and `SummarySnippet`.
* **API-Level Pagination:** Built with performance in mind, the backend API routes handle pagination and filtering.
* **Modern UI:** A responsive, aesthetically pleasing interface built using **Tailwind CSS** and **shadcn/ui**.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router) | Full-stack React Framework |
| **Styling** | Tailwind CSS, shadcn/ui | Utility-first CSS and component library |
| **Data Fetching** | SWR | Hooks for caching, revalidation, and state management |
| **Database** | MongoDB Atlas | NoSQL database hosting IPO data |
| **Driver** | `mongodb` | Official Node.js MongoDB driver |

## ⚙️ Setup and Installation

### Prerequisites

1.  Node.js (v18+)
2.  A MongoDB Atlas cluster and connection string.

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd ipo-dashboard-bot-manager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the project root and add your MongoDB connection details.

    ```ini
    # .env
    MONGODB_URI="your_mongodb_atlas_connection_string"
    MONGODB_DB_NAME="your_database_name"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.

## 🌐 Deployment (Vercel)

This application is optimized for deployment on Vercel, leveraging the platform's seamless support for Next.js and API Routes.

### Vercel Environment Configuration

For successful deployment, ensure the following environment variables are set within your Vercel project settings:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `MONGODB_URI` | Your full MongoDB Atlas connection string. | Must include credentials. |
| `MONGODB_DB_NAME` | The name of the database where the IPO data resides. | e.g., `ipo_data` |

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/new-analysis-field`).
3.  Commit your changes (`git commit -m 'feat: Added XYZ feature'`).
4.  Push to the branch.
5.  Open a Pull Request.
