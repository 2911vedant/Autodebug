from groq import Groq
import os
import sys
from dotenv import load_dotenv
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from runner import run_code

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def test_and_validate(original_code, fixed_code, bug_report):
    run_result = run_code(fixed_code)

    prompt = f"""You are a senior QA engineer.
ORIGINAL CODE: {original_code}
BUG REPORT: {bug_report}
FIXED CODE: {fixed_code}
EXECUTION SUCCESS: {run_result['success']}
OUTPUT: {run_result['output']}
ERROR: {run_result['error']}

Respond in this exact format:
VERDICT: (PASS or FAIL)
CONFIDENCE: (high / medium / low)
BUGS REMAINING: (number)
EXPLANATION: (2-3 lines)
NEEDS_RETRY: (YES or NO)"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500
    )
    return {
        "verdict": response.choices[0].message.content,
        "run_result": run_result
    }
