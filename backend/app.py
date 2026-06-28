from flask import Flask, request, jsonify
from flask_cors import CORS
from agents.reader_agent import read_and_find_bugs
from agents.fixer_agent import fix_code
from agents.tester_agent import test_and_validate
import os

app = Flask(__name__)
CORS(app)

@app.route("/debug", methods=["POST"])
def debug_code():
    data = request.json
    if not data or "code" not in data:
        return jsonify({"error": "No code provided"}), 400

    code = data["code"]
    max_attempts = 3
    audit_trail = []

    current_code = code

    for attempt in range(1, max_attempts + 1):
        print(f"\n--- Attempt {attempt} ---")

        # Agent 1 — Read and find bugs
        print("Agent 1: Reading code...")
        bug_report = read_and_find_bugs(current_code)
        audit_trail.append({
            "attempt": attempt,
            "agent": "Reader Agent",
            "action": "Analyzed code and found bugs",
            "output": bug_report
        })

        # Agent 2 — Fix the bugs
        print("Agent 2: Fixing bugs...")
        fixed_code = fix_code(current_code, bug_report)
        audit_trail.append({
            "attempt": attempt,
            "agent": "Fixer Agent",
            "action": "Applied fixes to the code",
            "output": fixed_code
        })

        # Agent 3 — Test the fix
        print("Agent 3: Testing fix...")
        test_result = test_and_validate(current_code, fixed_code, bug_report)
        audit_trail.append({
            "attempt": attempt,
            "agent": "Tester Agent",
            "action": "Ran and validated the fixed code",
            "output": test_result["verdict"]
        })

        verdict = test_result["verdict"]
        run_result = test_result["run_result"]

        # If passed — return success
        if "VERDICT: PASS" in verdict or "NEEDS_RETRY: NO" in verdict:
            return jsonify({
                "status": "success",
                "attempts": attempt,
                "original_code": code,
                "fixed_code": fixed_code,
                "bug_report": bug_report,
                "test_verdict": verdict,
                "run_output": run_result["output"],
                "audit_trail": audit_trail
            })

        # If failed — retry with fixed code as input
        print(f"Attempt {attempt} failed — retrying...")
        current_code = fixed_code

    # All attempts exhausted
    return jsonify({
        "status": "partial",
        "attempts": max_attempts,
        "original_code": code,
        "fixed_code": fixed_code,
        "bug_report": bug_report,
        "test_verdict": verdict,
        "run_output": run_result.get("output", ""),
        "audit_trail": audit_trail
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "AutoDebug running"})

if __name__ == "__main__":
    app.run(debug=True, port=5002)