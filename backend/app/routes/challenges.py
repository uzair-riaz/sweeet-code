from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.judge_service import JudgeService
from app.extensions import cache

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

@challenges_bp.route('/api/challenges', methods=['GET'])
@cache.cached(timeout=300)  # Cache for 5 minutes
def get_all_challenges():
    """Get all available challenges"""
    challenges = [
        {
            "id": "1",
            "title": "Two Sum",
            "difficulty": "Easy",
            "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
        },
        # Add more challenges
    ]
    return jsonify(challenges)

@challenges_bp.route('/api/challenges/<challenge_id>', methods=['GET'])
@cache.cached(timeout=300, query_string=True)  # Cache for 5 minutes
def get_challenge(challenge_id):
    """Get a specific challenge by ID"""
    # In a real app, you would fetch this from a database
    challenge = {
        "id": challenge_id,
        "title": "Two Sum" if challenge_id == "1" else f"Challenge {challenge_id}",
        "difficulty": "Easy",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
    }
    return jsonify(challenge)

@challenges_bp.route('/api/challenges/<challenge_id>/submit', methods=['POST'])
@jwt_required()
async def submit_solution(challenge_id):
    data = request.get_json()
    language = data.get('language')
    code = data.get('code')
    user_id = get_jwt_identity()

    test_cases = CHALLENGE_TEST_CASES.get(challenge_id, [])
    if not test_cases:
        return jsonify({'error': 'Challenge not found'}), 404

    # Create a cache key based on user, challenge, and code
    cache_key = f"submission:{user_id}:{challenge_id}:{hash(code)}"
    cached_result = cache.get(cache_key)
    
    if cached_result:
        return jsonify(cached_result)

    try:
        results = await judge_service.test_solution(language, code, test_cases)
        all_passed = all(result["passed"] for result in results)
        
        response_data = {
            "success": all_passed,
            "results": results
        }
        
        # Cache the result for 10 minutes
        cache.set(cache_key, response_data, timeout=600)
        
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400 