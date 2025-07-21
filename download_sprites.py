#!/usr/bin/env python3
"""
Sprite Downloader for Bomberman Game
Downloads all sprite images from imgur URLs and saves them locally with proper names.
"""

import requests
import os
from urllib.parse import urlparse
import time

# Create sprites directory if it doesn't exist
SPRITES_DIR = "sprites"
if not os.path.exists(SPRITES_DIR):
    os.makedirs(SPRITES_DIR)
    print(f"📁 Created directory: {SPRITES_DIR}")

# Sprite mappings extracted from game.js
SPRITE_URLS = {
    'wall-steel': 'https://i.imgur.com/EkleLlt.png',
    'brick-red': 'https://i.imgur.com/C46n8aY.png', 
    'door': 'https://i.imgur.com/Ou9w4gH.png',
    'kaboom': 'https://i.imgur.com/o9WizfI.png',
    'bg': 'https://i.imgur.com/qIXIczt.png',
    'wall-gold': 'https://i.imgur.com/VtTXsgH.png',
    'brick-wood': 'https://i.imgur.com/U751RRV.png',
    'bomb': 'https://i.imgur.com/etY46bP.png',
    'explosion': 'https://i.imgur.com/baBxoqs.png',
    'powerup-bomb': 'https://i.imgur.com/C46n8aY.png',
    'powerup-fire': 'https://i.imgur.com/U751RRV.png', 
    'powerup-speed': 'https://i.imgur.com/VtTXsgH.png',
}

def download_image(name, url):
    """Download an image from URL and save it with the given name."""
    try:
        print(f"🖼️  Downloading {name}...")
        
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Get file extension from URL
        parsed_url = urlparse(url)
        file_extension = os.path.splitext(parsed_url.path)[1] or '.png'
        
        # Create filename
        filename = f"{name}{file_extension}"
        filepath = os.path.join(SPRITES_DIR, filename)
        
        # Write image data to file
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Downloaded: {filename} ({len(response.content)} bytes)")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to download {name}: {e}")
        return False
    except Exception as e:
        print(f"❌ Error downloading {name}: {e}")
        return False

def main():
    """Main function to download all sprites."""
    print("🚀 Starting sprite download...")
    print(f"📁 Saving to directory: {SPRITES_DIR}")
    print(f"🎯 Total sprites to download: {len(SPRITE_URLS)}")
    print("-" * 50)
    
    successful_downloads = 0
    failed_downloads = 0
    
    for name, url in SPRITE_URLS.items():
        if download_image(name, url):
            successful_downloads += 1
        else:
            failed_downloads += 1
        
        # Small delay to be respectful to the server
        time.sleep(0.5)
    
    print("-" * 50)
    print(f"🎉 Download complete!")
    print(f"✅ Successful: {successful_downloads}")
    print(f"❌ Failed: {failed_downloads}")
    print(f"📁 Images saved in: {os.path.abspath(SPRITES_DIR)}")
    
    if successful_downloads > 0:
        print("\n📝 To use these images in your game, update the loadSprite calls:")
        print("   Example: loadSprite('wall-steel', './sprites/wall-steel.png');")

if __name__ == "__main__":
    main() 