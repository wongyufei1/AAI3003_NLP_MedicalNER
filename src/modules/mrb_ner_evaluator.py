import numpy as np

from datasets import load_metric


class MRBNEREvaluator:
    def __init__(self, metric, id2label):
        self.metric = load_metric(metric, trust_remote_code=True)
        self.id2label = id2label

    def compute_metrics(self, p):
        predictions, labels = p
        predictions = np.argmax(predictions, axis=2)

        # Remove ignored index (special tokens)
        true_predictions = [
            [self.id2label[p] for (p, l) in zip(prediction, label) if l != 0]
            for prediction, label in zip(predictions, labels)
        ]
        true_labels = [
            [self.id2label[l] for (p, l) in zip(prediction, label) if l != 0]
            for prediction, label in zip(predictions, labels)
        ]

        results = self.metric.compute(predictions=true_predictions, references=true_labels)
        agg_results = {
            "overall_precision": results["overall_precision"],
            "overall_recall": results["overall_recall"],
            "overall_f1": results["overall_f1"],
            "overall_accuracy": results["overall_accuracy"],
        }

        # for k in results.keys():
        #   if(k not in flattened_results.keys()):
        #     flattened_results[k+"_f1"]=results[k]["f1"]

        return agg_results
