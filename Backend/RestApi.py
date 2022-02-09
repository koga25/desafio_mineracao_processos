import os
from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from CsvFunctions import parseCsv

ALLOWED_EXTENSIONS = set(["csv"])
app = Flask(__name__)
CORS(app)

# extra step to allow graphviz to be found
os.environ["PATH"] += os.pathsep + "C:/graphviz/bin"


@app.route("/csvtosvg", methods=['POST'])
def receiveCsv():
    csvFile = request.files["file"]
    svgString = parseCsv(csvFile)
    return jsonify({"status": "OK", "result": str(svgString.decode("utf-8"))})


if __name__ == '__main__':
    app.run(debug=True)
