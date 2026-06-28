# 🤖 AutoDebug — Autonomous Multi-Agent Code Repair System

An AI-powered multi-agent system that autonomously identifies, fixes, and validates bugs in Python code using a pipeline of specialized AI agents.

## 🎯 What it does

Paste broken Python code → 3 AI agents work together to:
1. **Read** the code and identify all bugs
2. **Fix** every bug automatically
3. **Run** the fixed code and validate it works
4. If validation fails → **loop retries automatically** up to 3 times

## 🧠 How it works

```
User pastes buggy code
        ↓
Agent 1 — Reader Agent
Reads code → identifies bugs → generates structured bug report

        ↓
Agent 2 — Fixer Agent
Takes bug report → rewrites fixed code → returns clean solution

        ↓
Agent 3 — Tester Agent
Runs fixed code → checks output → gives PASS/FAIL verdict

        ↓
If FAIL → loop retries with fixed code as new input (max 3 attempts)
If PASS → returns fixed code + audit trail to user
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Python + Flask |
| AI Agents | Groq API (Llama 3.3 70B) |
| Code Runner | Python subprocess + tempfile |
| Agent Framework | Custom multi-agent pipeline |
| Styling | Dark GitHub-inspired design |

## 🚀 Features

- 🔍 **Reader Agent** — finds bugs with line numbers, types, and descriptions
- 🔧 **Fixer Agent** — rewrites clean fixed code automatically
- 🧪 **Tester Agent** — executes fixed code and validates output
- 🔄 **Auto retry loop** — retries up to 3 times if fix fails
- 📋 **Audit trail** — shows every agent decision and action
- ⚡ **Fast** — powered by Groq (fastest LLM inference available)
- 💻 **Live execution** — actually runs the fixed code and shows output

## 📁 Project Structure

```
autodebug/
├── backend/
│   ├── app.py                  # Flask server - orchestrates all 3 agents
│   ├── runner.py               # Safe Python code execution with timeout
│   └── agents/
│       ├── __init__.py
│       ├── reader_agent.py     # Bug detection agent
│       ├── fixer_agent.py      # Code repair agent
│       └── tester_agent.py     # Validation agent
└── frontend/
    └── src/
        └── App.js              # React UI with code editor + agent output
```

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- Groq API key (free at console.groq.com)

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors groq python-dotenv
```

Create `.env` file:
```
GROQ_API_KEY=your_groq_api_key_here
```

Start backend:
```bash
python3 app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`

## 🧪 Sample Results

**Input — Buggy code:**
```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)
    return averege  # bug: typo

nums = [10, 20, 30, 40, 50]
result = calculate_average(nums)
print("Average is: " + result)  # bug: type error
```

**Output — Fixed code:**
```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)
    return average  # fixed: typo corrected

nums = [10, 20, 30, 40, 50]
result = calculate_average(nums)
print("Average is: " + str(result))  # fixed: type conversion added
```

**Execution output:**
```
Average is: 30.0
```

## 🎓 Why this project matters

- **Multi-agent AI architecture** — active research area at top universities
- **Self-healing code** — explores the boundary between software engineering and AI autonomy
- **Autonomous decision making** — agents decide whether to retry without human input
- Demonstrates understanding of **LLM chaining, prompt engineering, and agent design**
- Real-world application in **CI/CD pipelines and automated code review**

## 👨‍💻 Author

**Vedant Chavan**  
B.Tech Information Technology  
Pillai College of Engineering, New Panvel
