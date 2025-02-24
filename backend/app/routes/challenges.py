from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.judge_service import JudgeService

challenges_bp = Blueprint('challenges', __name__)
judge_service = JudgeService()

# Challenge test cases
CHALLENGE_TEST_CASES = {
    "1": [  # Two Sum
        {
            "input": {"nums": [2,7,11,15], "target": 9},
            "expected": [0,1]
        },
        {
            "input": {"nums": [3,2,4], "target": 6},
            "expected": [1,2]
        }
    ],
    # Add more challenges with their test cases
}

@challenges_bp.route('/api/challenges/<challenge_id>/submit', methods=['POST'])
@jwt_required()
async def submit_solution(challenge_id):
    data = request.get_json()
    language = data.get('language')
    code = data.get('code')

    test_cases = CHALLENGE_TEST_CASES.get(challenge_id, [])
    if not test_cases:
        return jsonify({'error': 'Challenge not found'}), 404

    try:
        results = await judge_service.test_solution(language, code, test_cases)
        all_passed = all(result["passed"] for result in results)
        
        return jsonify({
            "success": all_passed,
            "results": results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400 