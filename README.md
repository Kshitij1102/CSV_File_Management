Next.js CSV Processing with Background Jobs

📌 Project Overview

This Next.js application enables users to upload CSV files containing user data, which are then processed asynchronously in the background. It leverages Redis and Bull for job queuing and executes API requests to process the parsed CSV data. The project focuses on efficient file handling, background processing, and API communication in a Node.js + Next.js environment.

🚀 Key Features

✔ Upload CSV files through the Next.js frontend.
✔ Parse and validate CSV content before processing.
✔ Implement Bull and Redis for background job management.
✔ Automate API requests to add user data from the CSV.
✔ Track upload progress and display results.
✔ Robust validation and error handling.

🛠️ Prerequisites

Ensure you have the following installed:

Node.js (Recommended: v14 or later)
npm or yarn
Redis (Required for job processing)
⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/your-repo/nextjs-csv-processing.git
cd nextjs-csv-processing
2️⃣ Install Dependencies
npm install multer csv-parser bull axios redis next-connect@0.10.2  
# OR  
yarn install
3️⃣ Install and Start Redis
MacOS (Using Homebrew)

brew install redis  
brew services start redis  
Ubuntu/Debian

sudo apt update  
sudo apt install redis-server  
sudo systemctl enable redis  
sudo systemctl start redis  
Windows

Download Redis from Redis Windows and start the server:

redis-server
To verify Redis is running:

redis-cli ping  
# Expected response: PONG  
4️⃣ Start the Next.js Development Server
npm run dev  # OR yarn dev  
5️⃣ Start the Background Worker
Run the worker process in a separate terminal:

node worker.js  
📤 How It Works

1️⃣ Upload a CSV file via the UI.
2️⃣ The backend parses and validates the file.
3️⃣ Valid records are added to a Redis queue for processing.
4️⃣ A background worker processes each job and sends API requests.
5️⃣ You can check Redis for job status:

redis-cli  
KEYS *  # List all Redis keys  
LRANGE queueName 0 -1  # View queued jobs  
6️⃣ Processing logs will be visible in the terminal.

🔗 Resources

📖 Next.js Documentation
📦 Multer (File Upload)
🔄 Bull (Job Queue)
🛠️ Redis Documentation
