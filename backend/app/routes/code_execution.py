from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.judge_service import JudgeService, JudgeError

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

        if not language or not code:
            return jsonify({'error': 'Language and code are required'}), 400

        result = await judge_service.submit_code(language, code, test_input)
        return jsonify(result)

    except JudgeError as e:
        return jsonify({
            'error': str(e),
            'details': e.details
        }), e.status_code
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500 