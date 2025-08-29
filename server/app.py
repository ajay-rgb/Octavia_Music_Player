from flask import Flask, jsonify, request, Response, send_file
from flask_cors import CORS, cross_origin
from ytmusicapi import YTMusic
import yt_dlp
import requests
import io
import os
import subprocess

app = Flask(__name__)
CORS(app, origins="*")


@app.route('/')
@cross_origin()
def home():
    return "Hello from the Flask backend!"


@app.route('/api/tracks', methods=['GET'])
@cross_origin()
def get_tracks():
    tracks = []
    return jsonify(tracks)


@app.route('/api/search', methods=['GET'])
@cross_origin()
def search_music():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "No search query provided."}), 400

    try:
        ytmusic = YTMusic()
        search_results = ytmusic.search(query, filter="songs")
        return jsonify(search_results)

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "Failed to search for music."}), 500


@app.route('/stream', methods=['GET'])
@cross_origin()
def stream():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({"error": "No video ID provided"}), 400

    try:
      
        cookies_str = os.environ.get('YTDLP_COOKIES')
        if not cookies_str:
            return jsonify({"error": "Cookies not provided"}), 500
        
        
        with open('cookies.txt', 'w') as f:
            f.write(cookies_str)
        
        url = f"https://www.youtube.com/watch?v={video_id}"

        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3'
            }],
            'quiet': True,
            'nocheckcertificate': True,
            'cookiefile': 'cookies.txt'
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            audio_url = info['url']

        def generate():
            with requests.get(audio_url, stream=True) as r:
                for chunk in r.iter_content(chunk_size=4096):
                    if chunk:
                        yield chunk

        return Response(generate(), content_type="audio/mp3")
    
    except Exception as e:
        print(f"Error in /stream: {e}")
        return jsonify({"error": "Failed to stream audio"}), 500


@app.route('/api/thumbnail-proxy', methods=['GET'])
@cross_origin()
def thumbnail_proxy():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "URL not provided."}), 400
    
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  
        content_type = response.headers.get('Content-Type')
        image_data = io.BytesIO(response.content)
        return send_file(image_data, mimetype=content_type)
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching thumbnail: {e}")
        return jsonify({"error": "Failed to fetch thumbnail."}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)