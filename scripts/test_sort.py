import os, sys
sys.path.append('.')
from scripts.content_loader import load_data, process_projects
import json

data = load_data('content')
data = process_projects(data)
bio = data['projects_context']['categories']['Biomedical & Signal Processing']
for p in bio:
    print(f"Title: {p['title']}, Order: {p.get('order')}, Type: {type(p.get('order'))}")
