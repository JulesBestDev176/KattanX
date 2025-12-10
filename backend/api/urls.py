from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views
from . import views_biometrie
from . import views_biometrie_upload
from . import views_images
from . import views_auth
from . import views_citoyen_services
from . import views_alerte_urgence

router = DefaultRouter()
router.register(r'citoyens', views.CitoyenViewSet, basename='citoyen')

urlpatterns = [
    # Authentification JWT (legacy, gardé pour compatibilité)
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ========== ENDPOINTS MOBILES DÉSACTIVÉS ==========
    # Les endpoints suivants sont temporairement désactivés pour les applications mobiles
    # Pour réactiver, décommenter les lignes ci-dessous
    
    # Inscription - Citoyen (Mobile uniquement)
    # path('auth/register/citoyen/etape1', views_auth.InscriptionCitoyenEtape1View.as_view(), name='inscription_citoyen_etape1'),
    # path('auth/register/citoyen/etape2', views_auth.InscriptionEtape2View.as_view(), name='inscription_citoyen_etape2'),
    # path('auth/register/citoyen/etape3', views_auth.InscriptionEtape3View.as_view(), name='inscription_citoyen_etape3'),
    
    # Inscription - Agent (Mobile uniquement)
    # path('auth/register/agent/etape1', views_auth.InscriptionAgentEtape1View.as_view(), name='inscription_agent_etape1'),
    # path('auth/register/agent/etape2', views_auth.InscriptionEtape2View.as_view(), name='inscription_agent_etape2'),
    # path('auth/register/agent/etape3', views_auth.InscriptionEtape3View.as_view(), name='inscription_agent_etape3'),
    
    # OTP WhatsApp (Mobile uniquement)
    # path('auth/send-otp', views_auth.EnvoyerOTPView.as_view(), name='send_otp'),
    # path('auth/verify-otp', views_auth.VerifierOTPView.as_view(), name='verify_otp'),
    
    # Endpoints biométrie (Mobile uniquement)
    # path('biometrie/verifier-empreinte/', views_biometrie.VerifierEmpreinteView.as_view(), name='verifier_empreinte'),
    # path('biometrie/identifier-personne/', views_biometrie.IdentifierPersonneView.as_view(), name='identifier_personne'),
    # path('biometrie/verifier-faciale/', views_biometrie.VerifierReconnaissanceFacialeView.as_view(), name='verifier_faciale'),
    # path('biometrie/upload-empreinte/', views_biometrie_upload.UploadEmpreinteView.as_view(), name='upload_empreinte'),
    # path('verification/valider-cni/', views_biometrie.ValiderFormatCNIView.as_view(), name='valider_cni'),
    # path('verification/valider-matricule/', views_biometrie.ValiderMatriculeView.as_view(), name='valider_matricule'),
    
    # Endpoints images (Mobile uniquement)
    # path('images/upload-photo/', views_images.UploadPhotoIdentiteView.as_view(), name='upload_photo'),
    # path('images/upload-signature/', views_images.UploadSignatureView.as_view(), name='upload_signature'),
    # path('images/validate/', views_images.ValidateImageView.as_view(), name='validate_image'),
    
    # Services citoyens - Documents (Mobile uniquement)
    # path('citoyens/documents/', views_citoyen_services.DocumentListView.as_view(), name='documents_list'),
    
    # Services citoyens - Dénonciations (Mobile uniquement)
    # path('denonciations/', views_citoyen_services.DenonciationListView.as_view(), name='denonciations_list'),
    # path('denonciations/create/', views_citoyen_services.DenonciationCreateView.as_view(), name='denonciations_create'),
    # path('denonciations/<uuid:denonciation_id>/', views_citoyen_services.DenonciationDetailView.as_view(), name='denonciations_detail'),
    
    # Services citoyens - Plaintes (Mobile uniquement)
    # path('plaintes/', views_citoyen_services.PlainteListView.as_view(), name='plaintes_list'),
    # path('plaintes/create/', views_citoyen_services.PlainteCreateView.as_view(), name='plaintes_create'),
    # path('plaintes/<uuid:plainte_id>/', views_citoyen_services.PlainteDetailView.as_view(), name='plaintes_detail'),
    
    # Services citoyens - Revenus (Mobile uniquement)
    # path('revenus/', views_citoyen_services.RevenuView.as_view(), name='revenus'),
    # path('transfer/', views_citoyen_services.TransferView.as_view(), name='transfer'),
    
    # Services citoyens - Alertes d'urgence (Mobile uniquement)
    # path('alertes-urgence/', views_alerte_urgence.AlerteUrgenceListView.as_view(), name='alertes_urgence_list'),
    # path('alertes-urgence/create/', views_alerte_urgence.AlerteUrgenceCreateView.as_view(), name='alertes_urgence_create'),
    # path('alertes-urgence/<uuid:alerte_id>/', views_alerte_urgence.AlerteUrgenceDetailView.as_view(), name='alertes_urgence_detail'),
    
    # ========== ENDPOINTS ACTIFS (Portail Web) ==========
    
    # Authentification (utilisé par le portail web)
    path('auth/login', views_auth.LoginView.as_view(), name='login'),
    
    # Prestations
    path('prestations/', views.PrestationView.as_view(), name='prestations'),
    
    # Gemini AI
    path('gemini/chat/', views.GeminiChatView.as_view(), name='gemini_chat'),
    path('gemini/analyze-prestation/', views.GeminiAnalyzePrestationView.as_view(), name='gemini_analyze_prestation'),
    
    # ViewSet citoyens (pour le portail de contrôle)
    path('', include(router.urls)),
]

