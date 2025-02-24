import requests
from config import Config
import json
import base64
from typing import Dict, Any, List

class JudgeError(Exception):
    """Custom exception for Judge0 API errors"""
    def __init__(self, message: str, status_code: int = None, details: Dict = None):
        super().__init__(message)
        self.status_code = status_code
        self.details = details

class JudgeService:
    def __init__(self):
        self.host = Config.JUDGE0_HOST
        self.headers = {
            "X-RapidAPI-Key": Config.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json"
        }

    def _encode_base64(self, text: str) -> str:
        """Encode text to base64"""
        return base64.b64encode(text.encode()).decode()

    def _decode_base64(self, text: str) -> str:
        """Decode base64 to text"""
        try:
            return base64.b64decode(text.encode()).decode() if text else ""
        except:
            return ""

    def _handle_judge0_response(self, response: requests.Response) -> Dict[str, Any]:
        """Handle Judge0 API response and errors"""
        try:
            response.raise_for_status()
            result = response.json()
            
            # Decode base64 outputs
            result["stdout"] = self._decode_base64(result.get("stdout", ""))
            result["stderr"] = self._decode_base64(result.get("stderr", ""))
            result["compile_output"] = self._decode_base64(result.get("compile_output", ""))
            
            # Check for Judge0 specific error statuses
            status = result.get("status", {})
            status_id = status.get("id")
            
            # Status IDs that indicate errors
            error_statuses = {
                6: "Compilation Error",
                7: "Runtime Error (SIGSEGV)",
                8: "Runtime Error (SIGXFSZ)",
                9: "Runtime Error (SIGFPE)",
                10: "Runtime Error (SIGABRT)",
                11: "Runtime Error (NZEC)",
                12: "Runtime Error (Other)",
                13: "Internal Error",
                14: "Exec Format Error"
            }

            # Instead of raising an error, just include the error info in the response
            if status_id in error_statuses:
                result["error_message"] = error_statuses[status_id]

            return result

        except requests.RequestException as e:
            # Only raise errors for actual API failures
            raise JudgeError(f"Judge0 API error: {str(e)}", status_code=500)
        except ValueError as e:
            raise JudgeError(f"Invalid response from Judge0: {str(e)}", status_code=500)

    async def submit_code(self, language: str, source_code: str, test_input: str = "") -> Dict[str, Any]:
        """Submit code to Judge0 API"""
        language_id = Config.LANGUAGE_IDS.get(language)
        if not language_id:
            raise JudgeError(f"Unsupported language: {language}", status_code=400)

        try:
            # Create submission with base64 encoded parameters
            submission_url = f"{self.host}/submissions?wait=true&base64_encoded=true"
            payload = {
                "language_id": language_id,
                "source_code": self._encode_base64(source_code),
                "stdin": self._encode_base64(test_input)
            }

            response = requests.post(submission_url, json=payload, headers=self.headers)
            result = self._handle_judge0_response(response)

            return {
                "status": {
                    "id": result.get("status", {}).get("id"),
                    "description": result.get("status", {}).get("description"),
                },
                "stdout": result.get("stdout"),
                "stderr": result.get("stderr"),
                "compile_output": result.get("compile_output"),
                "time": result.get("time"),
                "memory": result.get("memory"),
            }

        except JudgeError:
            raise
        except Exception as e:
            raise JudgeError(f"Unexpected error: {str(e)}", status_code=500)

    async def test_solution(self, language: str, source_code: str, test_cases: List[Dict]) -> List[Dict]:
        """Test solution against multiple test cases"""
        if not test_cases:
            raise JudgeError("No test cases provided", status_code=400)

        results = []
        for index, test_case in enumerate(test_cases):
            try:
                result = await self.submit_code(
                    language=language,
                    source_code=source_code,
                    test_input=json.dumps(test_case["input"])
                )
                
                # Compare output with expected
                passed = self._compare_output(result["stdout"], test_case["expected"])
                results.append({
                    "passed": passed,
                    "input": test_case["input"],
                    "expected": test_case["expected"],
                    "output": result["stdout"],
                    "error": result["stderr"] or result["compile_output"],
                    "execution_time": result["time"],
                    "memory_used": result["memory"]
                })

            except JudgeError as e:
                results.append({
                    "passed": False,
                    "input": test_case["input"],
                    "expected": test_case["expected"],
                    "output": None,
                    "error": str(e),
                    "execution_time": None,
                    "memory_used": None
                })

        return results

    def _compare_output(self, actual: str, expected: Any) -> bool:
        """Compare actual output with expected output"""
        try:
            actual = actual.strip() if actual else ""
            expected = str(expected).strip()
            return actual == expected
        except Exception as e:
            raise JudgeError(f"Error comparing outputs: {str(e)}", status_code=500) 