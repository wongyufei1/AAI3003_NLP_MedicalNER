import torch.cuda

DATA_PATH = "singh-aditya/MACCROBAT_biomedical_ner"
OUT_DIR = "../output"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
BATCH_SIZE = 4
EPOCHS = 10
MODEL_PATHS = [
    {
        "name": "distilbert-base-uncased",
        "path": "distilbert/distilbert-base-uncased",
    },
    {
        "name": "bert-base-uncased",
        "path": "google-bert/bert-base-uncased",
    },
    {
        "name": "biobert",
        "path": "dmis-lab/biobert-v1.1",
    },
    {
        "name": "bioclinicalbert",
        "path": "emilyalsentzer/Bio_ClinicalBERT",
    },
    {
        "name": "medbert",
        "path": "Charangan/MedBERT",
    }
]
LRATES = [5e-5, 4e-5, 3e-5, 2e-5]
WDECAY = 0.01
