from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def fix_code(code, bug_report):
    prompt = f"""You are an expert software engineer.
Fix ALL bugs in this code.

ORIGINAL BUGGY CODE:
{code}

BUG REPORT:
{bug_report}

Return ONLY the fixed code. No explanations, no backticks, no markdown."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000
    )
    fixed = response.choices[0].message.content.strip()
    if fixed.startswith("```"):
        lines = fixed.split("\n")
        fixed = "\n".join(lines[1:-1])
    return fixed
