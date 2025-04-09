# Bazar Bookstore

A distributed online bookstore system built with Node.js and Docker as part of the **Distributed and Operating Systems** course, Spring 2025.

##  Authors
- Layan Othman  
- Nagham Hanini

---



##  Getting Started

### 1. Clone the Repository
```bash
git clone <repo-url>
cd DOS_Project_Part1
```

### 2. Build and Run Services
```bash
docker-compose up --build
```

### 3. Open the CLI Tool
```bash
docker exec -it <client-container-name> node index.mjs
```

### 4. CLI Commands
- `s` or `search-book-title`: Search for books by topic
- `i` or `info-book-item-number`: View details of a specific book
- `p` or `purchase-book-by-item-number`: Buy a book by ID

---

##  Services Breakdown

###  Catalog Service
- `GET /search/:topic`
- `GET /info/:itemNumber`
- `POST /order`

###  Order Service
- `POST /purch`

###  Client Service
Built with Commander & Inquirer. Interacts with other services using Axios.

---

##  Example Use Cases
- **Search**:
  - Input: `distributed systems`
  - Output: Two books matching the topic

- **Info Before & After Purchase**:
  - Book ID 2
  - Quantity Before: 5 → Quantity After: 4

- **Purchase**:
  - ID: 2, Cost: 50
  - Message: "You bought book: RPCs for Noobs"



---

##  References
- Node.js Docs
- Docker & Compose Docs
- Axios / Commander / Inquirer GitHub

---

> This project was a hands-on learning experience that helped us understand service orchestration, REST APIs, containerization, and distributed system design.

