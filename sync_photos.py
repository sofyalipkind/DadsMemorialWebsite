#!/usr/bin/env python3
import os
import re
import json
import requests
from pathlib import Path
from urllib.parse import unquote

def get_folder_id(url):
    """Extract folder ID from Google Drive URL"""
    match = re.search(r'/folders/([a-zA-Z0-9-_]+)', url)
    return match.group(1) if match else None

def list_drive_files(folder_id):
    """List all files in a public Google Drive folder"""
    api_key = os.environ.get('GOOGLE_API_KEY', '')
    
    if api_key:
        # Use API if key is available
        url = f"https://www.googleapis.com/drive/v3/files"
        params = {
            'q': f"'{folder_id}' in parents and (mimeType contains 'image/' or mimeType contains 'video/')",
            'key': api_key,
            'fields': 'files(id,name,mimeType,modifiedTime)'
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json().get('files', [])
    
    # Fallback: scrape public folder (limited functionality)
    print("Note: Running without API key. For better reliability, set GOOGLE_API_KEY environment variable.")
    return []

def download_file(file_id, file_name, output_path):
    """Download a file from Google Drive"""
    download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    
    response = requests.get(download_url, stream=True)
    if response.status_code == 200:
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Downloaded: {file_name}")
        return True
    return False

def update_gallery_js(image_files):
    """Update the galleryMedia array in app.js"""
    js_path = Path('js/app.js')
    
    # Read current JS file
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create new gallery array
    gallery_array = "const galleryMedia = [\n"
    for file in sorted(image_files):
        gallery_array += f"    '{file}',\n"
    gallery_array = gallery_array.rstrip(',\n') + "\n];"
    
    # Replace the gallery array in the file
    pattern = r'const galleryMedia = \[[\s\S]*?\];'
    new_content = re.sub(pattern, gallery_array, content)
    
    # Write back
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated app.js with {len(image_files)} media files")

def main():
    # Configuration
    DRIVE_URL = "https://drive.google.com/drive/folders/13v7zBrxmPOL2T8j85LHucbySuGyK7DNf"
    IMAGES_DIR = Path('images')
    
    # Extract folder ID
    folder_id = get_folder_id(DRIVE_URL)
    if not folder_id:
        print("Error: Could not extract folder ID from URL")
        return
    
    print(f"Syncing from Google Drive folder: {folder_id}")
    
    # Get list of files from Drive
    drive_files = list_drive_files(folder_id)
    
    if not drive_files and not os.environ.get('GOOGLE_API_KEY'):
        print("\nTo enable automatic syncing, you need to:")
        print("1. Get a Google API key from https://console.cloud.google.com/")
        print("2. Enable the Google Drive API")
        print("3. Set it as GOOGLE_API_KEY environment variable")
        return
    
    # Ensure images directory exists
    IMAGES_DIR.mkdir(exist_ok=True)
    
    # Download new or updated files
    downloaded_files = []
    for file in drive_files:
        file_name = file['name']
        file_id = file['id']
        file_path = IMAGES_DIR / file_name
        
        # Download if file doesn't exist locally
        if not file_path.exists():
            if download_file(file_id, file_name, file_path):
                downloaded_files.append(file_name)
    
    # Get all image files in the directory
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi'}
    all_images = [
        f.name for f in IMAGES_DIR.iterdir() 
        if f.is_file() and f.suffix.lower() in image_extensions
    ]
    
    # Update app.js
    if all_images:
        update_gallery_js(all_images)
    
    print(f"\nSync complete!")
    print(f"Total images: {len(all_images)}")
    print(f"New downloads: {len(downloaded_files)}")

if __name__ == "__main__":
    main()
