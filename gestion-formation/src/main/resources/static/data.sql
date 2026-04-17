TRUNCATE TABLE formation_participants CASCADE;
TRUNCATE TABLE formations CASCADE;
TRUNCATE TABLE participants CASCADE;
TRUNCATE TABLE formateurs CASCADE;
TRUNCATE TABLE employeurs CASCADE;
TRUNCATE TABLE domaines CASCADE;
TRUNCATE TABLE structures CASCADE;
TRUNCATE TABLE profils CASCADE;
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE roles CASCADE;

INSERT INTO roles (id, name) VALUES
                                 (1, 'ROLE_ADMIN'),
                                 (2, 'ROLE_USER'),
                                 (3, 'ROLE_RESPONSABLE');

INSERT INTO users (id, email, password) VALUES
                                            (1, 'admin@formation.tn', '$2a$10$7QJ8z1Zv3Kx5Lm2Np4Rq.eW6yH0dF8gI3jK1lM9nO5pQ7rS2tU4v'),
                                            (2, 'user@formation.tn',  '$2a$10$3Ab5Cd7Ef9Gh1Ij3Kl5Mn7Op9Qr1St3Uv5Wx7Yz9A1Bc3De5Fg7Hi'),
                                            (3, 'resp@formation.tn',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyM.mQBde');

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1), (2, 2), (3, 3);

INSERT INTO domaines (id, libelle) VALUES
                                       (1, 'Informatique'),
                                       (2, 'Management'),
                                       (3, 'Finance'),
                                       (4, 'Ressources Humaines'),
                                       (5, 'Langues'),
                                       (6, 'Sécurité & HSE');

INSERT INTO structures (id, libelle) VALUES
                                         (1, 'Direction Générale'),
                                         (2, 'Direction Informatique'),
                                         (3, 'Direction Financière'),
                                         (4, 'Direction RH'),
                                         (5, 'Direction Commerciale'),
                                         (6, 'Direction Technique');

INSERT INTO profils (id, libelle) VALUES
                                      (1, 'Cadre Supérieur'),
                                      (2, 'Cadre Moyen'),
                                      (3, 'Technicien'),
                                      (4, 'Agent de Maîtrise');

INSERT INTO employeurs (id, nom_employeur) VALUES
                                               (1, 'Cabinet Alpha Consulting'),
                                               (2, 'Institut Beta Formation'),
                                               (3, 'Sigma Training Center');

INSERT INTO formateurs (id, nom, prenom, email, tel, type, employeur_id) VALUES
                                                                             (1, 'Ben Ali',  'Karim',  'k.benali@interne.tn',  '71 000 001', 'interne', NULL),
                                                                             (2, 'Mansouri', 'Sonia',  's.mansouri@interne.tn', '71 000 002', 'interne', NULL),
                                                                             (3, 'Trabelsi', 'Hedi',   'h.trabelsi@interne.tn', '71 000 003', 'interne', NULL),
                                                                             (4, 'Dupont',   'Jean',   'j.dupont@alpha.com',    '71 000 004', 'externe', 1),
                                                                             (5, 'Cherif',   'Mounir', 'm.cherif@beta.com',     '71 000 005', 'externe', 2),
                                                                             (6, 'Hamdi',    'Leila',  'l.hamdi@sigma.com',     '71 000 006', 'externe', 3);

INSERT INTO participants (id, nom, prenom, email, tel, structure_id, profil_id) VALUES
                                                                                    (1,  'Ayari',     'Mohamed', 'mayari@dg.tn',      '20 100 001', 1, 1),
                                                                                    (2,  'Belhaj',    'Fatma',   'fbelhaj@dg.tn',     '20 100 002', 1, 1),
                                                                                    (3,  'Chaabane',  'Slim',    'schaabane@dg.tn',   '20 100 003', 1, 2),
                                                                                    (4,  'Dridi',     'Amine',   'adridi@dit.tn',     '20 100 004', 2, 2),
                                                                                    (5,  'Elouze',    'Rania',   'relouze@dit.tn',    '20 100 005', 2, 2),
                                                                                    (6,  'Ferchichi', 'Youssef', 'yferchichi@dit.tn', '20 100 006', 2, 3),
                                                                                    (7,  'Gharbi',    'Nesrine', 'ngharbi@dit.tn',    '20 100 007', 2, 3),
                                                                                    (8,  'Hmidi',     'Tarek',   'thmidi@dit.tn',     '20 100 008', 2, 3),
                                                                                    (9,  'Jlidi',     'Imen',    'ijlidi@df.tn',      '20 100 009', 3, 2),
                                                                                    (10, 'Karoui',    'Sami',    'skaroui@df.tn',     '20 100 010', 3, 2),
                                                                                    (11, 'Laabidi',   'Houda',   'hlaabidi@df.tn',    '20 100 011', 3, 4),
                                                                                    (12, 'Meddeb',    'Salma',   'smeddeb@drh.tn',    '20 100 012', 4, 2),
                                                                                    (13, 'Nasr',      'Khaled',  'knasr@drh.tn',      '20 100 013', 4, 2),
                                                                                    (14, 'Oueslati',  'Meriem',  'moueslati@drh.tn',  '20 100 014', 4, 4),
                                                                                    (15, 'Ezzine',    'Bilel',   'bezzine@drh.tn',    '20 100 015', 4, 4),
                                                                                    (16, 'Rekik',     'Anis',    'arekik@dc.tn',      '20 100 016', 5, 2),
                                                                                    (17, 'Saafi',     'Dorra',   'dsaafi@dc.tn',      '20 100 017', 5, 3),
                                                                                    (18, 'Tlili',     'Wissem',  'wtlili@dc.tn',      '20 100 018', 5, 3),
                                                                                    (19, 'Abidi',     'Nour',    'nabidi@dc.tn',      '20 100 019', 5, 4),
                                                                                    (20, 'Ben Sassi', 'Riadh',   'rbensassi@dt.tn',   '20 100 020', 6, 3),
                                                                                    (21, 'Cherif',    'Olfa',    'ocherif@dt.tn',     '20 100 021', 6, 3),
                                                                                    (22, 'Dahmen',    'Skander', 'sdahmen@dt.tn',     '20 100 022', 6, 3),
                                                                                    (23, 'Elghali',   'Asma',    'aelghali@dt.tn',    '20 100 023', 6, 4),
                                                                                    (24, 'Fraj',      'Hatem',   'hfraj@dt.tn',       '20 100 024', 6, 4),
                                                                                    (25, 'Guezmir',   'Ines',    'iguezmir@dt.tn',    '20 100 025', 6, 4);

INSERT INTO formations (id, titre, annee, duree, budget, date_debut, date_fin, domaine_id, formateur_id) VALUES
                                                                                                             (1,  'Excel Avancé & Tableaux de Bord',      2023, 3,  2800.000, '2023-02-13', '2023-02-15', 1, 2),
                                                                                                             (2,  'Leadership & Management d''équipe',    2023, 5,  5500.000, '2023-03-06', '2023-03-10', 2, 4),
                                                                                                             (3,  'Analyse Financière',                   2023, 4,  4200.000, '2023-05-08', '2023-05-11', 3, 1),
                                                                                                             (4,  'Anglais Professionnel - Niveau B2',    2023, 10, 8000.000, '2023-06-05', '2023-06-16', 5, 5),
                                                                                                             (5,  'Sécurité Informatique & RGPD',         2023, 3,  3500.000, '2023-09-18', '2023-09-20', 6, 3),
                                                                                                             (6,  'Développement Web - React & Spring',   2024, 5,  6000.000, '2024-01-22', '2024-01-26', 1, 3),
                                                                                                             (7,  'Gestion de Projet Agile / Scrum',      2024, 3,  4500.000, '2024-03-11', '2024-03-13', 2, 4),
                                                                                                             (8,  'Comptabilité Générale',                2024, 5,  4800.000, '2024-04-15', '2024-04-19', 3, 1),
                                                                                                             (9,  'Recrutement & Entretien Structuré',    2024, 2,  3000.000, '2024-05-06', '2024-05-07', 4, 2),
                                                                                                             (10, 'Prévention des Risques Professionnels',2024, 4,  5200.000, '2024-07-08', '2024-07-11', 6, 6),
                                                                                                             (11, 'Communication & Prise de Parole',      2024, 3,  3800.000, '2024-09-09', '2024-09-11', 2, 5),
                                                                                                             (12, 'Python pour la Data Analyse',          2024, 4,  5500.000, '2024-11-04', '2024-11-07', 1, 3),
                                                                                                             (13, 'Intelligence Artificielle & LLM',      2025, 3,  7000.000, '2025-01-20', '2025-01-22', 1, 3),
                                                                                                             (14, 'Management Stratégique',               2025, 5,  6500.000, '2025-02-10', '2025-02-14', 2, 4),
                                                                                                             (15, 'Fiscalité d''Entreprise',              2025, 3,  4000.000, '2025-03-03', '2025-03-05', 3, 1),
                                                                                                             (16, 'Gestion des Talents & GPEC',           2025, 4,  5000.000, '2025-04-07', '2025-04-10', 4, 2),
                                                                                                             (17, 'Cybersécurité Avancée',                2025, 5,  8500.000, '2025-05-05', '2025-05-09', 6, 6),
                                                                                                             (18, 'Français Professionnel',               2025, 8,  6000.000, '2025-06-02', '2025-06-11', 5, 5),
                                                                                                             (19, 'DevOps & CI/CD',                       2025, 5,  7500.000, '2025-09-08', '2025-09-12', 1, 3),
                                                                                                             (20, 'Négociation Commerciale',              2025, 3,  4200.000, '2025-10-06', '2025-10-08', 2, 4);

INSERT INTO formation_participants VALUES
                                       (1,9),(1,10),(1,11),(1,12),(1,16),(1,17),
                                       (2,1),(2,2),(2,3),(2,4),(2,9),(2,12),(2,13),(2,16),
                                       (3,9),(3,10),(3,11),(3,1),(3,2),
                                       (4,1),(4,4),(4,5),(4,9),(4,12),(4,16),(4,17),(4,20),(4,21),(4,22),
                                       (5,4),(5,5),(5,6),(5,7),(5,8),(5,20),(5,22),
                                       (6,4),(6,5),(6,6),(6,7),(6,8),(6,20),(6,21),(6,22),(6,23),
                                       (7,1),(7,3),(7,4),(7,9),(7,12),(7,16),(7,17),(7,18),
                                       (8,9),(8,10),(8,11),(8,3),(8,14),(8,19),
                                       (9,12),(9,13),(9,14),(9,15),(9,2),
                                       (10,20),(10,21),(10,22),(10,23),(10,24),(10,25),(10,6),(10,7),(10,8),(10,18),
                                       (11,1),(11,2),(11,3),(11,12),(11,13),(11,16),(11,17),
                                       (12,4),(12,5),(12,6),(12,7),(12,20),(12,21),(12,22),(12,23),
                                       (13,4),(13,5),(13,6),(13,7),(13,8),(13,20),(13,21),(13,22),(13,23),(13,24),
                                       (14,1),(14,2),(14,3),(14,9),(14,12),(14,13),(14,16),(14,17),(14,10),
                                       (15,9),(15,10),(15,11),(15,1),(15,3),(15,19),
                                       (16,12),(16,13),(16,14),(16,15),(16,2),(16,3),(16,1),
                                       (17,4),(17,5),(17,6),(17,7),(17,8),(17,20),(17,21),(17,22),(17,23),(17,24),(17,25),
                                       (18,1),(18,2),(18,9),(18,12),(18,16),(18,17),(18,18),(18,19),
                                       (19,4),(19,5),(19,6),(19,7),(19,8),(19,20),(19,21),(19,22),(19,23),
                                       (20,16),(20,17),(20,18),(20,19),(20,1),(20,2),(20,3);