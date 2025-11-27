import { createClient } from '@supabase/supabase-js';

/**
 * Configuration Supabase
 * 
 * Projet: kattanx
 * Project ID: sufmgjdutkglfsliecaz
 * 
 * Note: La fonction WhatsApp (send-whatsapp) est déployée sur ce projet
 */

// Identifiants du projet Supabase
export const projectId = 'sufmgjdutkglfsliecaz'; // Projet kattanx
export const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Zm1namR1dGtnbGZzbGllY2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MzM2ODIsImV4cCI6MjA3ODIwOTY4Mn0.GjgAkS6njbJU06mkurYlg_GERSVKoSOLLvy2PdQP4l4';
export const supabaseUrl = `https://${projectId}.supabase.co`;

// URL de base pour les Edge Functions (utilisée par d'autres écrans)
export const API_BASE_URL = `${supabaseUrl}/functions/v1/make-server-7f5fa16e`;

/**
 * Client Supabase
 * 
 * Configuration:
 * - autoRefreshToken: true - Rafraîchit automatiquement le token
 * - persistSession: true - Sauvegarde la session localement
 * - detectSessionInUrl: false - Ne détecte pas la session dans l'URL (mobile)
 */
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

