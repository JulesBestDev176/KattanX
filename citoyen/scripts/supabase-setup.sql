-- Script SQL pour créer les tables et données de test dans Supabase
-- À exécuter dans le SQL Editor de Supabase

-- ============================================
-- 1. CRÉATION DES TABLES
-- ============================================

-- Table des dossiers (documents)
CREATE TABLE IF NOT EXISTS dossiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  numero TEXT NOT NULL,
  date_emission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des propriétés


-- Table des dénonciations
CREATE TABLE IF NOT EXISTS denonciations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  localisation TEXT NOT NULL,
  preuve_type TEXT NOT NULL,
  status TEXT DEFAULT 'En attente' CHECK (status IN ('En attente', 'Vérifiée', 'Rejetée')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des plaintes
CREATE TABLE IF NOT EXISTS plaintes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reçue', 'déposée')),
  objet TEXT NOT NULL,
  description TEXT NOT NULL,
  commissariat TEXT,
  amende INTEGER,
  status TEXT DEFAULT 'En cours',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gain', 'retrait')),
  method TEXT CHECK (method IN ('mobile_money', 'bank')),
  account_number TEXT,
  status TEXT DEFAULT 'Complété',
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des revenus (solde par utilisateur)
CREATE TABLE IF NOT EXISTS revenus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. POLITIQUES DE SÉCURITÉ (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;

ALTER TABLE denonciations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaintes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenus ENABLE ROW LEVEL SECURITY;

-- Politiques pour dossiers
CREATE POLICY "Users can view their own dossiers" ON dossiers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dossiers" ON dossiers
  FOR INSERT WITH CHECK (auth.uid() = user_id);



-- Politiques pour denonciations
CREATE POLICY "Users can view their own denonciations" ON denonciations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own denonciations" ON denonciations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour plaintes
CREATE POLICY "Users can view their own plaintes" ON plaintes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plaintes" ON plaintes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour revenus
CREATE POLICY "Users can view their own revenus" ON revenus
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own revenus" ON revenus
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own revenus" ON revenus
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. INSERTION DES DONNÉES DE TEST
-- ============================================

-- Note: Les utilisateurs doivent être créés via Supabase Auth
-- Utilisez le Dashboard Supabase > Authentication > Users > Add User
-- 
-- Créez ces utilisateurs :
-- 1. Email: user1@test.com, Password: password123
--    Metadata: {"name": "Amadou Diallo", "cni": "1234567890123", "tel": "+221 77 123 45 67"}
--
-- 2. Email: user2@test.com, Password: password123
--    Metadata: {"name": "Fatou Sall", "cni": "9876543210987", "tel": "+221 76 987 65 43"}

-- Après avoir créé les utilisateurs, récupérez leurs UUID et remplacez 'USER_1_UUID' et 'USER_2_UUID'

-- Dossiers pour user1
INSERT INTO dossiers (user_id, type, numero, date_emission) VALUES
  ('USER_1_UUID', 'Titre Foncier', 'TF-2024-001', '15/01/2024'),
  ('USER_1_UUID', 'Carte Grise', 'CG-2024-002', '20/02/2024'),
  ('USER_1_UUID', 'Permis de Construire', 'PC-2024-003', '10/03/2024');

-- Propriétés pour user1


-- Dénonciations pour user1
INSERT INTO denonciations (user_id, type, description, localisation, preuve_type, status, created_at) VALUES
  ('USER_1_UUID', 'Accident de la route', 'Collision entre deux véhicules sur l''avenue Bourguiba. Plusieurs blessés légers.', 'Avenue Bourguiba, Dakar', 'image', 'En attente', '2024-03-15 10:30:00'),
  ('USER_1_UUID', 'Incendie', 'Début d''incendie dans un immeuble résidentiel. Les pompiers sont intervenus rapidement.', 'Médina, Rue 10', 'video', 'Vérifiée', '2024-03-10 14:20:00'),
  ('USER_1_UUID', 'Vol à la tire', 'Tentative de vol dans le transport en commun.', 'Bus Tata, ligne 7', 'audio', 'En attente', '2024-03-18 08:15:00');

-- Plaintes pour user1
INSERT INTO plaintes (user_id, type, objet, description, commissariat, amende, status, created_at) VALUES
  ('USER_1_UUID', 'déposée', 'Vol de téléphone', 'Mon téléphone a été volé dans le bus ce matin. Samsung Galaxy S21.', 'Commissariat du Plateau', NULL, 'En cours', '2024-03-12 09:00:00'),
  ('USER_1_UUID', 'reçue', 'Stationnement interdit', 'Véhicule stationné devant une entrée privée.', 'Commissariat de Médina', 50000, 'En attente de paiement', '2024-03-08 16:45:00'),
  ('USER_1_UUID', 'déposée', 'Agression', 'Agression verbale et tentative d''intimidation.', 'Commissariat Central', NULL, 'En cours d''investigation', '2024-03-05 11:30:00');

-- Revenus pour user1
INSERT INTO revenus (user_id, total) VALUES
  ('USER_1_UUID', 125000);

-- Transactions pour user1
INSERT INTO transactions (user_id, amount, type, method, account_number, status, date) VALUES
  ('USER_1_UUID', 25000, 'gain', NULL, NULL, 'Complété', '2024-03-15 12:00:00'),
  ('USER_1_UUID', 50000, 'retrait', 'mobile_money', '+221 77 123 45 67', 'Complété', '2024-03-10 15:30:00'),
  ('USER_1_UUID', 75000, 'gain', NULL, NULL, 'Complété', '2024-03-05 10:00:00'),
  ('USER_1_UUID', 30000, 'retrait', 'bank', 'SN12345678901234567890', 'Complété', '2024-02-28 14:20:00'),
  ('USER_1_UUID', 45000, 'gain', NULL, NULL, 'Complété', '2024-02-20 09:45:00');

-- Données similaires pour user2
INSERT INTO dossiers (user_id, type, numero, date_emission) VALUES
  ('USER_2_UUID', 'Carte d''Identité', 'CNI-2024-004', '01/02/2024');



INSERT INTO denonciations (user_id, type, description, localisation, preuve_type, status, created_at) VALUES
  ('USER_2_UUID', 'Fuite d''eau', 'Fuite importante sur la voie publique.', 'Rue de la République', 'image', 'Vérifiée', '2024-03-14 13:00:00');

INSERT INTO plaintes (user_id, type, objet, description, commissariat, status, created_at) VALUES
  ('USER_2_UUID', 'déposée', 'Escroquerie', 'Tentative d''escroquerie par téléphone.', 'Commissariat du Plateau', 'En cours', '2024-03-11 10:30:00');

INSERT INTO revenus (user_id, total) VALUES
  ('USER_2_UUID', 75000);

INSERT INTO transactions (user_id, amount, type, status, date) VALUES
  ('USER_2_UUID', 50000, 'gain', 'Complété', '2024-03-12 11:00:00'),
  ('USER_2_UUID', 25000, 'gain', 'Complété', '2024-03-08 14:30:00');

-- ============================================
-- 4. FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour calculer le solde automatiquement
CREATE OR REPLACE FUNCTION calculate_balance(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_total INTEGER;
BEGIN
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'gain' THEN amount ELSE -amount END), 0)
  INTO v_total
  FROM transactions
  WHERE user_id = p_user_id;
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le solde automatiquement
CREATE OR REPLACE FUNCTION update_revenus_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO revenus (user_id, total)
  VALUES (NEW.user_id, calculate_balance(NEW.user_id))
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total = calculate_balance(NEW.user_id),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_update_revenus
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_revenus_on_transaction();

-- ============================================
-- TERMINÉ !
-- ============================================

-- Pour vérifier que tout fonctionne :
-- SELECT * FROM dossiers;

-- SELECT * FROM denonciations;
-- SELECT * FROM plaintes;
-- SELECT * FROM transactions;
-- SELECT * FROM revenus;



