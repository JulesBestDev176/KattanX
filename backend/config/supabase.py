"""
Configuration Supabase pour intégration directe (optionnel)
"""
import os
from django.conf import settings

# Supabase configuration
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://vtsxyghzmqscmvzxqdiz.supabase.co')
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY', '')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')

# Project info
SUPABASE_PROJECT_ID = 'vtsxyghzmqscmvzxqdiz'
SUPABASE_PROJECT_NAME = 'kattanX'

