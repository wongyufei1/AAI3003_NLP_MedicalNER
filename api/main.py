from flask import Flask, jsonify, request
import requests
import base64
from flask_cors import CORS
from dotenv import load_dotenv
from src.model_run import run
import json

app = Flask(__name__)
CORS(app)

load_dotenv()


@app.route('/')
def index():
    return {'status': 'API is running'}


@app.route('/ner', methods=['POST'])
def ner():
    data = request.get_json()
    print(data)
    text = data['patient_notes']

    # run the model
    out = run(text)

    for key in out:
        key['score'] = float(key['score'])

    output = {}

    for entity in out:
        entity_group = entity['entity_group']
        output[entity_group.lower()] = entity['word']

    return jsonify({
        'supabase_data': output,
        'firebase_data': out,
        'status': 'success'

    })


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=8001)
