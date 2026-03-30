#!/usr/bin/env python3
"""
Script to start the Teacher Quiz Server
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements_teacher_quiz.txt'])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False
    return True

def start_server():
    """Start the teacher quiz server"""
    try:
        print("🚀 Starting Teacher Quiz Server...")
        print("📁 Quizzes will be stored in: teacher_quizzes/")
        print("🌐 Server will run on: http://0.0.0.0:5001")
        print("📚 Available subjects: mathematics, science, english, physics, chemistry, biology, history, geography")
        print("\n" + "="*50)
        
        # Start the server
        subprocess.run([sys.executable, 'teacher_quiz_server.py'])
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

if __name__ == "__main__":
    print("🎓 Teacher Quiz Server Setup")
    print("="*50)
    
    # Install requirements
    if install_requirements():
        # Start server
        start_server()
    else:
        print("❌ Setup failed. Please check the requirements file.")
        sys.exit(1)
