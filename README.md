# AAI3003_NLP_MedicalNER
## Setup for Project
1. Navigate to src folder in terminal
```
cd src
```

2. Ensure python3 is installed and install dependencies
```
pip3 install requirements.txt
```

## How to Train Model and Visualise Model Results
1. Navigate to modules folder in terminal
```
cd modules
```

2. Open mrb_ner_config.py and set your training configurations
```
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
```

3. Navigate back to src folder in terminal
```
cd ..
```

4. Run model_training.py in terminal and wait for the output folder to be generated
```
python3 model_training.py
```

## How to Run Model Demo
```
Ensure that models in the output folder have been generated from training
```

1. Run model_demo.py in terminal
```
python3 model_demo.py demo_cases/case_{1/2/3/4/5}.txt
```

You should now be able to view ASCII representation of prediction on the terminal as well as 
access a graphical representation at http://127.0.0.1:5000.

## How to Run Web UI
1. Navigate to web-ui folder in terminal

```
cd web-ui
```

```
Ensure you have node 18 and above installed
```

2. Intall dependencies
```
npm install
```

3. Start the web app
```
npm run dev
```

You should now be able to access the application at http://localhost:3000.
