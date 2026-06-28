import subprocess
import tempfile
import os

def run_code(code, language="python"):
    try:
        with tempfile.NamedTemporaryFile(
            mode='w',
            suffix='.py' if language == "python" else '.js',
            delete=False
        ) as f:
            f.write(code)
            temp_path = f.name

        result = subprocess.run(
            ["python3", temp_path],
            capture_output=True,
            text=True,
            timeout=10
        )

        os.unlink(temp_path)

        if result.returncode == 0:
            return {
                "success": True,
                "output": result.stdout,
                "error": None
            }
        else:
            return {
                "success": False,
                "output": result.stdout,
                "error": result.stderr
            }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "output": "",
            "error": "Code took too long to run (timeout 10s)"
        }
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": str(e)
        }