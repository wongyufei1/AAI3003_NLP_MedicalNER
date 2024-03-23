from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
from ipymarkup import show_span_ascii_markup, show_span_box_markup


def main():
    # fpath = "data/CaseReportCorpus.pickle"
    #
    # with open(fpath, "rb") as f:
    #     collection = pickle.load(f)

    text = """The patient reported no recurrence of palpitations at follow-up 6 months after the ablation."""

    tokenizer = AutoTokenizer.from_pretrained("d4data/biomedical-ner-all")
    model = AutoModelForTokenClassification.from_pretrained("d4data/biomedical-ner-all")

    pipe = pipeline("ner", model=model, tokenizer=tokenizer, device=0,
                    aggregation_strategy="max")  # pass device=0 if using gpu
    out = pipe(text)

    spans = []

    for row in out:
        spans.append((row["start"], row["end"], row["entity_group"]))

    show_span_ascii_markup(text, spans)
    show_span_box_markup(text, spans)


if __name__ == "__main__":
    main()
