from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def read_and_find_bugs(code):
    prompt = f"""You are an expert code reviewer and debugger.
Analyze this code carefully and find ALL bugs, errors, and issues.

CODE:
{code}

Respond in this exact format:
BUGS FOUND: (number of bugs)
BUG 1:
  LINE: (line number)
  TYPE: (syntax error / logic error / runtime error / etc)
  DESCRIPTION: (what is wrong)

SUMMARY: (overall assessment in 2 lines)"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000
    )
    return response.choices[0].message.content
