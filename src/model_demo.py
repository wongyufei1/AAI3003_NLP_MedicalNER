import gc
import os
import sys
import warnings

import torch
from ipymarkup import show_span_ascii_markup
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

    for m in MODEL_PATHS:
        print(f"\n---------------------- Running Model for Inference (Model:{m['name']}) ----------------------")
        tokenizer = AutoTokenizer.from_pretrained(os.path.join(OUT_DIR, f"{m['name']}/save_model"))
        model = AutoModelForTokenClassification.from_pretrained(os.path.join(OUT_DIR, f"{m['name']}/save_model"))

        pipe = pipeline("ner", model=model, tokenizer=tokenizer, device=DEVICE, aggregation_strategy="max")
        out = pipe(text)

        spans = []
        for prediction in out:
            spans.append((prediction["start"], prediction["end"], prediction["entity_group"]))

        # clear gpu cache for OOM problem
        del tokenizer, model
        gc.collect()
        torch.cuda.empty_cache()

        show_span_ascii_markup(text, spans)


if __name__ == "__main__":
    run()


