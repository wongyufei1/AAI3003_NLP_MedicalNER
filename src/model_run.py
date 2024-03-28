import gc
import os
import sys
import warnings

import spacy
import torch
from ipymarkup import show_span_ascii_markup
from spacy import displacy
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from transformers.utils import logging
from pprint import pprint

from modules.mrb_ner_config import MODEL_PATHS, DEVICE, OUT_DIR

warnings.filterwarnings("ignore")
logging.set_verbosity_error()

model_details = {
    "name": "biobert",
    "path": "dmis-lab/biobert-v1.1",
}


def convert_out_to_dict(out):
    entities_by_type = {}
    for entity in out:
        entity_group = entity['entity_group']
        if entity_group not in entities_by_type:
            entities_by_type[entity_group] = []
        entities_by_type[entity_group].append(entity)
    return entities_by_type


def run(text):
    # load input text file

    nlp = spacy.blank("en")
    docs = []

    # inference input text with all 5 models

    doc = nlp.make_doc(text)

    print(model_details)

    # load model and tokenizer
    # tokenizer = AutoTokenizer.from_pretrained(
    #     os.path.join(OUT_DIR, f"{model_details['name']}/save_model"))
    # model = AutoModelForTokenClassification.from_pretrained(
    #     os.path.join(OUT_DIR, f"{model_details['name']}/save_model"))

    tokenizer = AutoTokenizer.from_pretrained("d4data/biomedical-ner-all")
    model = AutoModelForTokenClassification.from_pretrained(
        "d4data/biomedical-ner-all")

    # predict
    pipe = pipeline("ner", model=model, tokenizer=tokenizer,
                    device=DEVICE, aggregation_strategy="max")
    out = pipe(text)

    # Convert out to dictionar
    out_converted = [{k: int(v) if isinstance(
        v, float) else v for k, v in entity.items()} for entity in out]

    # clear gpu cache for OOM problem
    del tokenizer, model
    gc.collect()
    torch.cuda.empty_cache()

    return out_converted


if __name__ == "__main__":
    run()
