from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.judge_service import JudgeService, JudgeError
from app.extensions import cache
import hashlib

code_execution_bp = Blueprint('code_execution', __name__)
judge_service = JudgeService()

@code_execution_bp.route('/run', methods=['POST'])
@jwt_required()
async def run_code():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        language = data.get('language')
        code = data.get('code')
        test_input = data.get('input', '')
        user_id = get_jwt_identity()

        if not language or not code:
            return jsonify({'error': 'Language and code are required'}), 400

        # Create a hash of the code and input for caching
        code_hash = hashlib.md5((code + test_input).encode()).hexdigest()
        cache_key = f"code_run:{user_id}:{language}:{code_hash}"
        
        # Check if result is in cache
        cached_result = cache.get(cache_key)
        if cached_result:
            return jsonify(cached_result)

        # If not in cache, run the code
        result = await judge_service.submit_code(language, code, test_input)
        
        # Cache the result for 5 minutes
        cache.set(cache_key, result, timeout=300)
        
        return jsonify(result)

    except JudgeError as e:
        return jsonify({
            'error': str(e),
            'details': e.details
        }), e.status_code
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500 