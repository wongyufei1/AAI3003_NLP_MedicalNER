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

from modules.mrb_ner_config import MODEL_PATHS, DEVICE, OUT_DIR

warnings.filterwarnings("ignore")
logging.set_verbosity_error()


def run():
    fpath = sys.argv[1]

    with open(fpath, "r+") as f:
        text = "".join(f.readlines())

    print("Input text:")
    print(text)

    nlp = spacy.blank("en")
    docs = []

    for m in MODEL_PATHS:
        print(f"\n---------------------- Running Model for Inference (Model:{m['name']}) ----------------------")

        doc = nlp.make_doc(text)

        tokenizer = AutoTokenizer.from_pretrained(os.path.join(OUT_DIR, f"{m['name']}/save_model"))
        model = AutoModelForTokenClassification.from_pretrained(os.path.join(OUT_DIR, f"{m['name']}/save_model"))

        pipe = pipeline("ner", model=model, tokenizer=tokenizer, device=DEVICE, aggregation_strategy="max")
        out = pipe(text)

        spans = []
        ents = []

        for prediction in out:
            span = [prediction["start"], prediction["end"], prediction["entity_group"]]
            ent = doc.char_span(span[0], span[1], span[2])

            if ent is None:
                continue

            spans.append(span)
            ents.append(ent)

        doc.ents = ents
        docs.append(doc)
        show_span_ascii_markup(text, spans)

        # clear gpu cache for OOM problem
        del tokenizer, model
        gc.collect()
        torch.cuda.empty_cache()

    displacy.serve(docs, style="ent", host="127.0.0.1", port=5000)


if __name__ == "__main__":
    run()


