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

2. Open mrb_ner_config.py and set your batch size to suit your hardware resources
```
BATCH_SIZE = 4
```

3. Navigate back to src folder in terminal
```
cd ..
```

4. Run model_training.py in terminal and wait for the output folder to be generated
```
python3 model_training.py
```

5. Run model_visualisation.py in terminal and wait for the csv and graphs to be generated in the output folder
```
python3 model_visualisation.py
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
