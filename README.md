# Next.js CSV Processing with Background Jobs

## 📌 Project Overview
This project is a Next.js application that allows users to upload CSV files containing user data. The backend processes these files asynchronously using a background job queue powered by Redis and Bull. It then makes API requests to add users based on the parsed CSV data. This project introduces file handling, background job processing, and API interactions in a Node.js environment using Next.js.

## 🚀 Features
- Upload CSV files via a Next.js frontend.
- Parse and validate CSV data before processing.
- Use **Bull** and **Redis** to handle background job processing.
- Send user data to an external API for further processing.
- Display upload status and processing results.
- Implement robust error handling and validation.

---



## 🛠️ Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (>= 14.x recommended)
- **npm** or **yarn**
- **Redis** (for background job processing)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/nextjs-csv-processing.git
cd nextjs-csv-processing
```

### 2️⃣ Install Dependencies
```bash
npm install multer csv-parser bull axios redis next-connect@0.10.2 # or yarn install
```

### 3️⃣ Install and Run Redis
Redis is required to process jobs in the background. Install it using the following steps:

#### **On macOS (Homebrew)**
```bash
brew install redis
brew services start redis
```

#### **On Ubuntu/Debian**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis
sudo systemctl start redis
```

#### **On Windows**
Download and install Redis from [Redis Windows](https://github.com/microsoftarchive/redis/releases) and run:
```powershell
redis-server
```

To check if Redis is running, use:
```bash
redis-cli ping
# Response should be: PONG
```



### 4️⃣ Start the Next.js Development Server
```bash
npm run dev  # or yarn dev
```

### 5️⃣ Start the Background Worker
Run the worker process in a separate terminal window:
```bash
node worker.js
```

---

## 📤 How to Use
1️⃣ **Upload a CSV file** on the UI.

2️⃣ The backend will parse and validate the file.

3️⃣ Valid data will be added to the Redis queue for background processing.

4️⃣ The worker will process each job and send API requests to add users.

5️⃣ **Check Redis Queue** to monitor job processing:

```bash
redis-cli
KEYS *  # List all Redis keys
LRANGE queueName 0 -1  # Check queued jobs
```
6️⃣ Once completed, you should see logs in the terminal.



## 🔗 Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Multer (File Upload)](https://github.com/expressjs/multer)
- [Bull (Job Queue)](https://github.com/OptimalBits/bull)
- [Redis Documentation](https://redis.io/docs/)


