import os
from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from CsvFunctions import *

ALLOWED_EXTENSIONS = set(["csv"])
app = Flask(__name__)
CORS(app)

# extra step to allow graphviz to be found
os.environ["PATH"] += os.pathsep + "C:/graphviz/bin"


@app.route("/csvtosvg", methods=['POST'])
def getCsvToSvg():
    csvFile = request.files["file"]
    svgString = csvToSvg(csvFile)
    return jsonify({"status": "OK", "result": str(svgString.decode("utf-8"))})


@app.route("/csvinfo", methods=['POST'])
def getCsvInfo():
    csvFile = request.files["file"]
    csvTimeEachActivity, csvQuantityEachActivity = csvToInfo(csvFile)
    return jsonify({"status": "OK", "activities": str(csvTimeEachActivity), "quantityActivities": str(csvQuantityEachActivity)})


if __name__ == '__main__':
    app.run(debug=True)
